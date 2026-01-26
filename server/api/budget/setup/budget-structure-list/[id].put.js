import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);
    
    if (!id) {
      return {
        statusCode: 400,
        message: "ID is required",
      };
    }
    
    // Update data
    const updateData = {};
    if (body.FUND) updateData.fty_fund_type = body.FUND;
    if (body.ACTIVITY) updateData.at_activity_code = body.ACTIVITY;
    if (body.OUN) updateData.oun_code = body.OUN;
    if (body.CCR) updateData.ccr_costcentre = body.CCR;
    if (body.BUDGETCODE) updateData.lbc_budget_code = body.BUDGETCODE;
    if (body.PROJNO !== undefined) updateData.cpa_project_no = body.PROJNO;
    if (body.YEAR) updateData.sby_year = body.YEAR;
    if (body.STAT) updateData.sbg_status = body.STAT;
    if (body.DEFISIT) updateData.acm_defisit = body.DEFISIT;
    updateData.updateddate = new Date();
    
    // Update budget structure
    const structure = await prisma.structure_budget.update({
      where: {
        sbg_budget_id: parseInt(id),
      },
      data: updateData,
    });
    
    return {
      statusCode: 200,
      message: "Budget structure updated successfully",
      data: {
        ID: structure.sbg_budget_id.toString(),
        FUND: structure.fty_fund_type,
        ACTIVITY: structure.at_activity_code,
        OUN: structure.oun_code,
        CCR: structure.ccr_costcentre,
        PROJNO: structure.cpa_project_no,
        BUDGETCODE: structure.lbc_budget_code,
        STAT: structure.sbg_status,
        YEAR: structure.sby_year,
        DEFISIT: structure.acm_defisit,
      },
    };
  } catch (error) {
    console.error("Error updating budget structure:", error);
    
    if (error.code === 'P2025') {
      return {
        statusCode: 404,
        message: "Budget structure not found",
      };
    }
    
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    };
  }
});

