import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(getRouterParam(event, 'id'));
    
    if (!id || isNaN(id)) {
      return {
        statusCode: 400,
        message: "Invalid purchase requisition ID",
        data: [],
      };
    }
    
    // Get purchase requisition to find requisition number and workflow type
    const requisition = await prisma.requisition_master.findUnique({
      where: {
        rqm_requisition_id: id,
      },
      select: {
        rqm_requisition_no: true,
        rqm_wflow_type: true,
      },
    });
    
    if (!requisition || !requisition.rqm_requisition_no) {
      return {
        statusCode: 200,
        message: "Process flow fetched successfully",
        data: [],
      };
    }
    
    // Use workflow type from requisition, or default to 'PR' as per the SQL query
    const workflowCode = requisition.rqm_wflow_type || 'PR';
    
    // Fetch all processes for the workflow with status '1', ordered by sequence
    // This matches: WHERE wfp_status = '1' AND wfp.wfp_workflow_code = 'PR' ORDER BY wfp_sequence
    const processes = await prisma.wf_process.findMany({
      where: {
        wfp_workflow_code: workflowCode,
        wfp_status: '1',
      },
      select: {
        wfp_process_id: true,
        wfp_process_name: true,
        wfp_sequence: true,
      },
      orderBy: {
        wfp_sequence: 'asc',
      },
    });
    
    if (processes.length === 0) {
      return {
        statusCode: 200,
        message: "Process flow fetched successfully",
        data: [],
      };
    }
    
    // For each process, fetch application status if it exists for this requisition
    // This matches: LEFT JOIN wf_application_status was ON (wfp.wfp_process_id = was.was_process_id AND was_application_id = requisition_no)
    const processIds = processes.map(p => p.wfp_process_id);
    const applicationStatuses = await prisma.wf_application_status.findMany({
      where: {
        was_process_id: { in: processIds },
        was_application_id: requisition.rqm_requisition_no,
      },
      select: {
        was_process_id: true,
        was_notes: true,
        createddate: true,
        createdby: true,
        was_extended_field: true,
      },
    });
    
    // Create a map of process_id to application_status
    const statusMap = new Map(
      applicationStatuses.map(status => [status.was_process_id, status])
    );
    
    // Get unique createdby usernames from application statuses
    const usernames = applicationStatuses
      .map(s => s.createdby)
      .filter(Boolean);
    
    // Fetch staff data for those usernames
    // This matches: LEFT JOIN staff stf ON (was.createdby = stf.stf_ad_username)
    const staffList = usernames.length > 0 ? await prisma.staff.findMany({
      where: {
        stf_ad_username: { in: usernames },
      },
      select: {
        stf_ad_username: true,
        stf_staff_id: true,
        stf_email_addr: true,
        stf_telno_work: true,
      },
    }) : [];
    
    // Create staff map by username
    const staffMap = new Map(
      staffList.map(staff => [staff.stf_ad_username, staff])
    );
    
    // Get unique staff IDs
    const staffIds = staffList.map(s => s.stf_staff_id);
    
    // Fetch staff_service data for those staff IDs with sts_job_flag = '1'
    // This matches: LEFT JOIN staff_service ss ON (ss.stf_staff_id = stf.stf_staff_id and sts_job_flag = 1)
    const staffServices = staffIds.length > 0 ? await prisma.staff_service.findMany({
      where: {
        stf_staff_id: { in: staffIds },
        sts_job_flag: '1',
      },
      select: {
        stf_staff_id: true,
        sts_oun_code: true,
        sts_extended_field: true,
      },
    }) : [];
    
    // Create staff_service map by staff_id (taking the first one if multiple)
    const staffServiceMap = new Map();
    staffServices.forEach(ss => {
      if (!staffServiceMap.has(ss.stf_staff_id)) {
        staffServiceMap.set(ss.stf_staff_id, ss);
      }
    });
    
    // Format the response according to the SQL query
    const formattedData = processes.map((process, index) => {
      const status = statusMap.get(process.wfp_process_id);
      const staff = status?.createdby ? staffMap.get(status.createdby) : null;
      const staffService = staff?.stf_staff_id ? staffServiceMap.get(staff.stf_staff_id) : null;
      
      // Extract from extended_field JSON
      const wasExtendedField = status?.was_extended_field || {};
      const stsExtendedField = staffService?.sts_extended_field || {};
      
      // Build PTJ description: CONCAT_WS('-', ss.sts_oun_code, ss.sts_extended_field ->> '$.sts_oun_desc')
      const ptjDesc = staffService
        ? [staffService.sts_oun_code, stsExtendedField.sts_oun_desc].filter(Boolean).join('-')
        : '';
      
      return {
        no: index + 1,
        Process: process.wfp_process_name || '',
        By: wasExtendedField.createdby_name || status?.createdby || '',
        PTJ: ptjDesc,
        Email: staff?.stf_email_addr || '',
        "No Telefon": staff?.stf_telno_work || '',
        Status: wasExtendedField.was_status_desc 
          ? wasExtendedField.was_status_desc.toUpperCase() 
          : (status?.was_status || ''),
        Comment: status?.was_notes || '',
        Date: status?.createddate 
          ? new Date(status.createddate).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            }).replace(/\//g, '/') // Format: DD/MM/YYYY (matches DATE_FORMAT(was.createddate, '%d/%m/%Y'))
          : '',
      };
    });
    
    // Sort by wfp_sequence and was.createddate (processes are already sorted by sequence)
    // For processes with the same sequence, sort by createddate
    formattedData.sort((a, b) => {
      const processA = processes.find(p => p.wfp_process_name === a.Process);
      const processB = processes.find(p => p.wfp_process_name === b.Process);
      
      if (processA && processB) {
        if (processA.wfp_sequence !== processB.wfp_sequence) {
          return processA.wfp_sequence - processB.wfp_sequence;
        }
        
        // If same sequence, sort by createddate
        const dateA = a.Date ? new Date(a.Date.split('/').reverse().join('-')).getTime() : 0;
        const dateB = b.Date ? new Date(b.Date.split('/').reverse().join('-')).getTime() : 0;
        return dateA - dateB;
      }
      return 0;
    });
    
    return {
      statusCode: 200,
      message: "Process flow fetched successfully",
      data: formattedData,
    };
  } catch (error) {
    console.error("Error fetching process flow:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch process flow",
      error: error.message,
    };
  }
});
