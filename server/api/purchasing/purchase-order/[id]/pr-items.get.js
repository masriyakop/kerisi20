import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(getRouterParam(event, 'id'));
    const query = getQuery(event);
    
    if (!id || isNaN(id)) {
      return {
        statusCode: 400,
        message: "Invalid purchase order ID",
        data: [],
      };
    }
    
    if (!query.rqm_requisition_no) {
      return {
        statusCode: 400,
        message: "rqm_requisition_no is required",
        data: [],
      };
    }
    
    // Fetch requisition details for the specified requisition number
    const requisition = await prisma.requisition_master.findUnique({
      where: {
        rqm_requisition_no: query.rqm_requisition_no,
      },
      include: {
        requisition_details: {
          orderBy: {
            rqd_line_no: 'asc',
          },
        },
      },
    });
    
    if (!requisition) {
      return {
        statusCode: 404,
        message: "Requisition not found",
        data: [],
      };
    }
    
    // Format the response
    const formattedData = requisition.requisition_details.map((detail, index) => ({
      no: index + 1,
      rqd_requisition_id: detail.rqd_requisition_id,
      rqd_line_no: detail.rqd_line_no ? parseFloat(detail.rqd_line_no.toString()) : 0,
      itm_item_code: detail.itm_item_code || '',
      "Item Description": detail.rqd_spec_desc || '',
      rqd_qty: detail.rqd_qty || '',
      rqd_uom: detail.rqd_uom || '',
      rqd_price: detail.rqd_price ? parseFloat(detail.rqd_price.toString()) : 0,
      rqd_gross_amt: detail.rqd_gross_amt ? parseFloat(detail.rqd_gross_amt.toString()) : 0,
      rqd_total_price: detail.rqd_total_price ? parseFloat(detail.rqd_total_price.toString()) : 0,
      rqd_total_price_rm: detail.rqd_total_price_rm ? parseFloat(detail.rqd_total_price_rm.toString()) : 0,
      rqd_status: detail.rqd_status || '',
      acm_acct_code: detail.acm_acct_code || '',
      ccr_costcentre: detail.ccr_costcentre || '',
      at_activity_code: detail.at_activity_code || '',
      bdg_budget_code: detail.bdg_budget_code || '',
    }));
    
    return {
      statusCode: 200,
      message: "PR Items fetched successfully",
      data: formattedData,
    };
  } catch (error) {
    console.error("Error fetching PR items:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch PR items",
      error: error.message,
    };
  }
});
