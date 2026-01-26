import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    // Build where clause for filtering
    const where = {
      bmm_trans_type: 'VIREMENT',
    };
    
    // Smart filters
    if (query.sm_bmm_year && query.sm_bmm_year.trim() !== '') {
      where.bmm_year = query.sm_bmm_year.trim();
    }
    if (query.sm_bmm_status && query.sm_bmm_status.trim() !== '') {
      where.bmm_status = query.sm_bmm_status.trim();
    }
    if (query.sm_bmm_movement_type && query.sm_bmm_movement_type.trim() !== '') {
      where.bmm_movement_type = { contains: query.sm_bmm_movement_type.trim() };
    }
    
    // Search filter (searches across multiple fields)
    if (query.search && query.search.trim() !== '') {
      const searchTerm = query.search.trim();
      const searchNum = parseInt(searchTerm);
      where.OR = [
        ...(isNaN(searchNum) ? [] : [{ bmm_budget_movement_id: searchNum }]),
        { bmm_year: { contains: searchTerm } },
        { bmm_budget_movement_no: { contains: searchTerm } },
        { bmm_endorse_doc: { contains: searchTerm } },
        { bmm_description: { contains: searchTerm } },
        { bmm_status: { contains: searchTerm } },
        { bmm_movement_type: { contains: searchTerm } },
        { createdby: { contains: searchTerm } },
      ];
    }

    // Fetch all budget virement records from database (no pagination, frontend handles it)
    const records = await prisma.budget_movement_master.findMany({
      where: Object.keys(where).length > 0 ? where : {},
      orderBy: {
        bmm_budget_movement_id: 'desc',
      },
    });

    // Fetch related structure_budget for PTJ
    const detlRecords = records.length > 0
      ? await prisma.budget_movement_detl.findMany({
          where: {
            bmm_budget_movement_id: { in: records.map(r => r.bmm_budget_movement_id) },
            sbg_budget_id_from: { not: null },
          },
        })
      : [];
    
    const sbgIds = detlRecords.map(d => d.sbg_budget_id_from).filter(Boolean);
    const structureBudgets = sbgIds.length > 0
      ? await prisma.structure_budget.findMany({
          where: { sbg_budget_id: { in: sbgIds } },
        })
      : [];
    
    const sbMap = new Map(structureBudgets.map(sb => [sb.sbg_budget_id, sb]));
    const detlMap = new Map(detlRecords.map(d => [d.bmm_budget_movement_id, d]));

    // Format the response - map to dt_key fields
    const formattedData = records.map((item, index) => {
      const date = item.updateddate || item.createddate;
      const dateStr = date ? new Date(date).toLocaleDateString('en-GB') : '';
      const createdDateStr = item.createddate ? new Date(item.createddate).toLocaleDateString('en-GB') : '';
      
      const detl = detlMap.get(item.bmm_budget_movement_id);
      const sb = detl ? sbMap.get(detl.sbg_budget_id_from) : null;
      
      // Calculate duration (simplified - would need workflow status in real implementation)
      const duration = '';
      
      return {
        bmm_year: item.bmm_year || '',
        createdby: item.createdby || '',
        createddate: createdDateStr,
        bmm_budget_movement_no: item.bmm_budget_movement_no || '',
        oun_code: sb?.oun_code || '',
        bmm_endorse_doc: item.bmm_endorse_doc || '',
        bmm_movement_type: item.bmm_movement_type || '',
        bmm_total_amt: item.bmm_total_amt ? parseFloat(item.bmm_total_amt.toString()) : 0,
        bmm_status: item.bmm_status || '',
        updatedby: item.updatedby || '',
        date: dateStr || 'not approve yet',
        duration: duration,
        bmm_budget_movement_id: item.bmm_budget_movement_id,
        // Note: urlView and urlEdit are handled in frontend via sessionStorage, not URL parameters
      };
    });

    return {
      statusCode: 200,
      message: "Budget virement records fetched successfully",
      data: formattedData,
    };
  } catch (error) {
    console.error("Error fetching budget virement records:", error);
    return {
      statusCode: 500,
      message: "An error occurred while fetching budget virement records",
      error: error.message,
    };
  }
});

