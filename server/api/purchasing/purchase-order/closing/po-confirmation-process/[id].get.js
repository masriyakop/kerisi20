import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    
    if (!id) {
      return {
        statusCode: 400,
        message: "PO ID is required",
      };
    }

    // Try to fetch from po_process_closing table
    let poData = null;
    try {
      poData = await prisma.po_process_closing.findUnique({
        where: { ppc_id: parseInt(id) },
      });
    } catch (tableError) {
      console.log("po_process_closing table may not exist:", tableError.message);
      return {
        statusCode: 404,
        message: "PO not found",
      };
    }

    if (!poData) {
      return {
        statusCode: 404,
        message: "PO not found",
      };
    }

    return {
      statusCode: 200,
      message: "PO details fetched successfully",
      data: {
        ppc_id: poData.ppc_id,
        ppc_year: poData.ppc_year,
        pom_order_no: poData.pom_order_no,
        pod_order_detl_id: poData.pod_order_detl_id,
        pod_line_no: poData.pod_line_no,
        at_activity_code: poData.at_activity_code,
        ccr_costcentre: poData.ccr_costcentre,
        am_account_code: poData.am_account_code,
        cpa_project_no: poData.cpa_project_no,
        ppc_balance_amount: poData.ppc_balance_amount ? parseFloat(poData.ppc_balance_amount.toString()) : 0,
        pod_ccr_costcentre_budget: poData.pod_ccr_costcentre_budget,
        pod_at_activity_code_budget: poData.pod_at_activity_code_budget,
        sbg_budget_id: poData.sbg_budget_id,
        pod_at_activity_code_budget_NEW: poData.pod_at_activity_code_budget_NEW,
        pod_ccr_costcentre_budget_NEW: poData.pod_ccr_costcentre_budget_NEW,
        sbg_budget_id_NEW: poData.sbg_budget_id_NEW,
        fty_fund_type: poData.fty_fund_type,
        oun_code: poData.oun_code,
      },
    };
  } catch (error) {
    console.error("Error fetching PO details:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch PO details",
      error: error.message,
    };
  }
});
