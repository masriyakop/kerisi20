import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { 
      bmd_bgt_movement_detl_id, 
      type,
      fty_fund_type, 
      oun_code, 
      sbg_budget_code, 
      bdg_budget_id, 
      bmd_mvt_amt,
      cym_currency_code,
      cyd_unit,
      cyd_conversation_rate,
      amt_currency,
    } = body;

    if (!bmd_bgt_movement_detl_id || !type || !fty_fund_type || !oun_code || !sbg_budget_code || !bmd_mvt_amt) {
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

    // Update detail record - use sbg_budget_id_from for "From" and sbg_budget_id_to for "To"
    const updateData = {
      qbu_quarter_id: budget.qbu_quarter_id,
      bmd_mvt_amt: parseFloat(bmd_mvt_amt.toString().replace(/,/g, "")),
      cym_currency_code: cym_currency_code || null,
      cyd_unit: cyd_unit || null,
      cyd_conversation_rate: cyd_conversation_rate ? parseFloat(cyd_conversation_rate) : null,
      bmd_currency_amt: amt_currency ? parseFloat(amt_currency.toString().replace(/,/g, "")) : null,
      updatedby: "system", // TODO: Get from auth
      updateddate: new Date(),
    };

    if (type === "From") {
      updateData.sbg_budget_id_from = parseInt(sbg_budget_code);
      updateData.sbg_budget_id_to = null;
    } else {
      updateData.sbg_budget_id_to = parseInt(sbg_budget_code);
      updateData.sbg_budget_id_from = null;
    }

    const detail = await prisma.budget_movement_detl.update({
      where: {
        bmd_bgt_movement_detl_id: parseInt(bmd_bgt_movement_detl_id),
      },
      data: updateData,
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

