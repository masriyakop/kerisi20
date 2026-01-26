import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { modal_ppcid, modal_budget_code } = body;

    if (!modal_ppcid || !modal_budget_code) {
      return {
        statusCode: 400,
        message: "PPC ID and Budget Code are required",
      };
    }

    // Get structure budget details
    let structureBudget = null;
    try {
      structureBudget = await prisma.structure_budget.findUnique({
        where: { sbg_budget_id: parseInt(modal_budget_code) },
        select: {
          at_activity_code: true,
          ccr_costcentre: true,
        },
      });
    } catch (error) {
      console.log("Error fetching structure budget:", error.message);
      return {
        statusCode: 404,
        message: "Budget code not found",
      };
    }

    if (!structureBudget) {
      return {
        statusCode: 404,
        message: "Budget code not found",
      };
    }

    // Update po_process_closing
    try {
      await prisma.po_process_closing.update({
        where: { ppc_id: parseInt(modal_ppcid) },
        data: {
          sbg_budget_id_NEW: parseInt(modal_budget_code),
          pod_at_activity_code_budget_NEW: structureBudget.at_activity_code,
          pod_ccr_costcentre_budget_NEW: structureBudget.ccr_costcentre,
          updateddate: new Date(),
          updatedby: event.context.user?.username || 'system',
        },
      });

      return {
        statusCode: 200,
        message: "Budget updated successfully",
        status: "ok",
      };
    } catch (tableError) {
      console.log("po_process_closing table may not exist:", tableError.message);
      return {
        statusCode: 500,
        message: "Failed to update PO process closing",
        error: tableError.message,
      };
    }
  } catch (error) {
    console.error("Error processing PO:", error);
    return {
      statusCode: 500,
      message: "Failed to process PO",
      error: error.message,
    };
  }
});
