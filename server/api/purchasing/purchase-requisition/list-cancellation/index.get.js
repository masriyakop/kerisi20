import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    let whereClause = {
      rqm_status: { contains: 'CANCEL' },
    };

    if (query.search) {
      const searchTerm = query.search.trim();
      whereClause.OR = [
        { rqm_requisition_no: { contains: searchTerm } },
        { rqm_requisition_title: { contains: searchTerm } },
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
        rqm_requisition_title: req.rqm_requisition_title || '',
        rqm_amount: req.rqm_amount ? parseFloat(req.rqm_amount.toString()) : 0,
        oun_code: req.oun_code || '',
        fty_fund_type: req.fty_fund_type || '',
        ccr_costcentre: req.ccr_costcentre || '',
        urlEdit: `/purchasing/purchase-requisition/edit/${req.rqm_requisition_id}`,
      };
    });

    return {
      statusCode: 200,
      message: "Purchase requisition cancellations fetched successfully",
      data: data,
    };
  } catch (error) {
    console.error("Error fetching purchase requisition cancellations:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch purchase requisition cancellations",
      error: error.message,
    };
  }
});
