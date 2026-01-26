import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(getRouterParam(event, 'id'));
    
    if (!id || isNaN(id)) {
      return {
        statusCode: 400,
        message: "Invalid purchase order ID",
        data: [],
      };
    }
    
    // Get distinct requisition numbers from purchase_order_details
    const poDetails = await prisma.purchase_order_details.findMany({
      where: {
        pom_order_id: id,
      },
      select: {
        rqm_requisition_no: true,
      },
      distinct: ['rqm_requisition_no'],
    });
    
    const requisitionNos = poDetails
      .map(d => d.rqm_requisition_no)
      .filter(Boolean);
    
    if (requisitionNos.length === 0) {
      return {
        statusCode: 200,
        message: "PR List fetched successfully",
        data: [],
      };
    }
    
    // Fetch requisition masters
    const requisitions = await prisma.requisition_master.findMany({
      where: {
        rqm_requisition_no: { in: requisitionNos },
      },
      select: {
        rqm_requisition_id: true,
        rqm_requisition_no: true,
        rqm_requisition_title: true,
        rqm_amount: true,
        rqm_status: true,
        rqm_request_date: true,
        oun_code: true,
      },
      orderBy: {
        rqm_requisition_no: 'asc',
      },
    });
    
    // Format the response
    const formattedData = requisitions.map((req, index) => ({
      no: index + 1,
      rqm_requisition_id: req.rqm_requisition_id,
      "Requisition No": req.rqm_requisition_no || '',
      Title: req.rqm_requisition_title || '',
      Amount: req.rqm_amount ? parseFloat(req.rqm_amount.toString()) : 0,
      Status: req.rqm_status || '',
      "Request Date": req.rqm_request_date ? req.rqm_request_date.toISOString().split('T')[0] : '',
      "PTJ Code": req.oun_code || '',
    }));
    
    return {
      statusCode: 200,
      message: "PR List fetched successfully",
      data: formattedData,
    };
  } catch (error) {
    console.error("Error fetching PR list:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch PR list",
      error: error.message,
    };
  }
});
