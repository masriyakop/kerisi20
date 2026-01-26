import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { 
      bmm_budget_movement_id, 
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

    if (!bmm_budget_movement_id || !type || !fty_fund_type || !oun_code || !sbg_budget_code || !bmd_mvt_amt) {
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
        structure_budget: true,
        quarter_budget: true,
      },
    });

    if (!budget) {
      return {
        statusCode: 404,
        message: "Budget not found",
      };
    }

    // Get next sequence for detail
    const maxDetail = await prisma.budget_movement_detl.findFirst({
      orderBy: {
        bmd_bgt_movement_detl_id: 'desc',
      },
    });

    const nextDetailId = (maxDetail?.bmd_bgt_movement_detl_id || 0) + 1;

    // Create detail record - use sbg_budget_id_from for "From" and sbg_budget_id_to for "To"
    const detailData = {
      bmd_bgt_movement_detl_id: nextDetailId,
      bmm_budget_movement_id: parseInt(bmm_budget_movement_id),
      qbu_quarter_id: budget.qbu_quarter_id,
      bmd_mvt_amt: parseFloat(bmd_mvt_amt.toString().replace(/,/g, "")),
      bmd_mvt_status: "DRAFT",
      cym_currency_code: cym_currency_code || null,
      cyd_unit: cyd_unit || null,
      cyd_conversation_rate: cyd_conversation_rate ? parseFloat(cyd_conversation_rate) : null,
      bmd_currency_amt: amt_currency ? parseFloat(amt_currency.toString().replace(/,/g, "")) : null,
      createdby: "system", // TODO: Get from auth
    };

    if (type === "From") {
      detailData.sbg_budget_id_from = parseInt(sbg_budget_code);
    } else {
      detailData.sbg_budget_id_to = parseInt(sbg_budget_code);
    }

    const detail = await prisma.budget_movement_detl.create({
      data: detailData,
    });

    return {
      statusCode: 200,
      message: "Detail created successfully",
      data: detail,
    };
  } catch (error) {
    console.error("Error creating detail:", error);
    return {
      statusCode: 500,
      message: "Failed to create detail",
      error: error.message,
    };
  }
});

