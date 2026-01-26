import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const {
      bad_detl_id,
      fty_fund_type,
      at_activity_code,
      oun_code,
      ccr_costcentre,
      budget_code,
      sbg_budget_id,
      initial_amt,
    } = body;

    if (!bad_detl_id || !fty_fund_type || !at_activity_code || !oun_code || !ccr_costcentre || !budget_code || !initial_amt) {
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

    // Update detail record
    const updatedDetail = await prisma.budget_movement_detl.update({
      where: {
        bmd_bgt_movement_detl_id: bad_detl_id,
      },
      data: {
        sbg_budget_id_to: structureBudgetId,
        bmd_mvt_amt: parseFloat(initial_amt),
        updatedby: "system", // TODO: Get from auth
      },
    });

    // Update master total amount
    const master = await prisma.budget_movement_master.findUnique({
      where: { bmm_budget_movement_id: updatedDetail.bmm_budget_movement_id },
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
        where: { bmm_budget_movement_id: updatedDetail.bmm_budget_movement_id },
        data: { bmm_total_amt: totalAmt },
      });
    }

    return {
      statusCode: 200,
      message: "Detail updated successfully",
      data: {
        bmd_bgt_movement_detl_id: updatedDetail.bmd_bgt_movement_detl_id,
      },
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

