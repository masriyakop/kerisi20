import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const {
      bam_id,
      fty_fund_type,
      at_activity_code,
      oun_code,
      ccr_costcentre,
      budget_code,
      sbg_budget_id,
      initial_amt,
    } = body;

    if (!bam_id || !fty_fund_type || !at_activity_code || !oun_code || !ccr_costcentre || !budget_code || !initial_amt) {
      return {
        statusCode: 400,
        message: "All required fields must be provided",
      };
    }

    // Get the structure budget ID if not provided
    let structureBudgetId = sbg_budget_id;
    if (!structureBudgetId) {
      const structureBudget = await prisma.structure_budget.findFirst({
        where: {
          fty_fund_type,
          at_activity_code,
          oun_code,
          ccr_costcentre,
          lbc_budget_code: budget_code,
        },
      });
      if (!structureBudget) {
        return {
          statusCode: 404,
          message: "Structure budget not found",
        };
      }
      structureBudgetId = structureBudget.sbg_budget_id;
    }

    // Get next sequence for detail
    const maxDetail = await prisma.budget_movement_detl.findFirst({
      orderBy: {
        bmd_bgt_movement_detl_id: 'desc',
      },
    });
    const detailId = (maxDetail?.bmd_bgt_movement_detl_id || 0) + 1;

    // Create detail record
    const newDetail = await prisma.budget_movement_detl.create({
      data: {
        bmd_bgt_movement_detl_id: detailId,
        bmm_budget_movement_id: bam_id,
        sbg_budget_id_to: structureBudgetId,
        bmd_mvt_amt: parseFloat(initial_amt),
        bmd_mvt_status: "DRAFT",
        createdby: "system", // TODO: Get from auth
      },
    });

    // Update master total amount
    const master = await prisma.budget_movement_master.findUnique({
      where: { bmm_budget_movement_id: bam_id },
      include: {
        budget_movement_detl: true,
      },
    });

    if (master) {
      const totalAmt = master.budget_movement_detl.reduce(
        (sum, d) => sum + (parseFloat(d.bmd_mvt_amt) || 0),
        0
      );
      await prisma.budget_movement_master.update({
        where: { bmm_budget_movement_id: bam_id },
        data: { bmm_total_amt: totalAmt },
      });
    }

    return {
      statusCode: 200,
      message: "Detail created successfully",
      data: {
        bmd_bgt_movement_detl_id: newDetail.bmd_bgt_movement_detl_id,
      },
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

