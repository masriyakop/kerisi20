import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { bmm_budget_movement_id, fty_fund_type, oun_code, sbg_budget_code, bdg_budget_id, bmd_mvt_amt } = body;

    if (!bmm_budget_movement_id || !fty_fund_type || !oun_code || !sbg_budget_code || !bmd_mvt_amt) {
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

    // Create detail record
    const detail = await prisma.budget_movement_detl.create({
      data: {
        bmd_bgt_movement_detl_id: nextDetailId,
        bmm_budget_movement_id: parseInt(bmm_budget_movement_id),
        sbg_budget_id_to: parseInt(sbg_budget_code),
        qbu_quarter_id: budget.qbu_quarter_id,
        bmd_mvt_amt: parseFloat(bmd_mvt_amt.toString().replace(/,/g, "")),
        bmd_mvt_status: "DRAFT",
        createdby: "system", // TODO: Get from auth
      },
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

