import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    
    if (!id) {
      return {
        statusCode: 400,
        message: "ID is required",
      };
    }
    
    const structure = await prisma.structure_budget.findUnique({
      where: {
        sbg_budget_id: parseInt(id),
      },
    });
    
    if (!structure) {
      return {
        statusCode: 404,
        message: "Budget structure not found",
      };
    }
    
    return {
      statusCode: 200,
      message: "Budget structure fetched successfully",
      data: {
        ID: structure.sbg_budget_id.toString(),
        FUND: structure.fty_fund_type,
        ACTIVITY: structure.at_activity_code || '',
        OUN: structure.oun_code || '',
        CCR: structure.ccr_costcentre || '',
        PROJNO: structure.cpa_project_no || '',
        BUDGETCODE: structure.lbc_budget_code,
        STAT: structure.sbg_status,
        YEAR: structure.sby_year,
        DEFISIT: structure.acm_defisit,
      },
    };
  } catch (error) {
    console.error("Error fetching budget structure:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    };
  }
});

