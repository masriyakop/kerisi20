import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { bmd_bgt_movement_detl_id, fty_fund_type, oun_code, sbg_budget_code, bdg_budget_id, bmd_mvt_amt } = body;

    if (!bmd_bgt_movement_detl_id || !fty_fund_type || !oun_code || !sbg_budget_code || !bmd_mvt_amt) {
      return {
        statusCode: 400,
        message: "Missing required fields",
      };
    }

    // Get budget info to find quarter
    const budget = await prisma.budget.findFirst({
      where: {
        bdg_budget_id: parseInt(bdg_budget_id),
      },
      include: {
        quarter_budget: true,
      },
    });

    if (!budget) {
      return {
        statusCode: 404,
        message: "Budget not found",
      };
    }

    // Update detail record
    const detail = await prisma.budget_movement_detl.update({
      where: {
        bmd_bgt_movement_detl_id: parseInt(bmd_bgt_movement_detl_id),
      },
      data: {
        sbg_budget_id_to: parseInt(sbg_budget_code),
        qbu_quarter_id: budget.qbu_quarter_id,
        bmd_mvt_amt: parseFloat(bmd_mvt_amt.toString().replace(/,/g, "")),
        updatedby: "system", // TODO: Get from auth
        updateddate: new Date(),
      },
    });

    return {
      statusCode: 200,
      message: "Detail updated successfully",
      data: detail,
    };
  } catch (error) {
    console.error("Error updating detail:", error);
    return {
      statusCode: 500,
      message: "Failed to update detail",
      error: error.message,
    };
  }
});

