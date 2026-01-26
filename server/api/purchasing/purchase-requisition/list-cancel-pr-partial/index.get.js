import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    let whereClause = {
      rqm_status: { contains: 'PARTIAL' },
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
      include: {
        requisition_details: {
          select: {
            rqd_total_price_rm: true,
          },
        },
      },
      orderBy: {
        rqm_requisition_id: 'desc',
      },
    });

    const data = requisitions.map((req) => {
      const partialAmount = req.requisition_details.reduce((sum, detail) => {
        return sum + (detail.rqd_total_price_rm ? parseFloat(detail.rqd_total_price_rm.toString()) : 0);
      }, 0);

      return {
        rqm_requisition_id: req.rqm_requisition_id,
        rqm_requisition_no: req.rqm_requisition_no || '',
        rqm_requisition_title: req.rqm_requisition_title || '',
        rqm_amount: req.rqm_amount ? parseFloat(req.rqm_amount.toString()) : 0,
        partial_amount: partialAmount,
        oun_code: req.oun_code || '',
        urlEdit: `/purchasing/purchase-requisition/edit/${req.rqm_requisition_id}`,
      };
    });

    return {
      statusCode: 200,
      message: "Cancel partial PR list fetched successfully",
      data: data,
    };
  } catch (error) {
    console.error("Error fetching cancel partial PR list:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch cancel partial PR list",
      error: error.message,
    };
  }
});
