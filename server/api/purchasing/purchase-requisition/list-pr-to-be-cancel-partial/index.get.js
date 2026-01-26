import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    let whereClause = {
      rqm_status: { not: 'CANCEL' },
    };

    if (query.search) {
      const searchTerm = query.search.trim();
      whereClause.OR = [
        { rqm_requisition_no: { contains: searchTerm } },
        { rqm_requisition_title: { contains: searchTerm } },
        { rqm_request_by: { contains: searchTerm } },
      ];
    }

    const requisitions = await prisma.requisition_master.findMany({
      where: whereClause,
      orderBy: {
        rqm_requisition_id: 'desc',
      },
    });

    const data = requisitions.map((req) => {
      return {
        rqm_requisition_id: req.rqm_requisition_id,
        rqm_requisition_no: req.rqm_requisition_no || '',
        rqm_request_by: req.rqm_request_by || '',
        fty_fund_type: req.fty_fund_type || '',
        ccr_costcentre: req.ccr_costcentre || '',
        at_activity_code: req.at_activity_code || '',
        rqm_requisition_title: req.rqm_requisition_title || '',
        urlEdit: `/purchasing/purchase-requisition/edit/${req.rqm_requisition_id}`,
      };
    });

    return {
      statusCode: 200,
      message: "PR to be cancel partial list fetched successfully",
      data: data,
    };
  } catch (error) {
    console.error("Error fetching PR to be cancel partial list:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch PR to be cancel partial list",
      error: error.message,
    };
  }
});
