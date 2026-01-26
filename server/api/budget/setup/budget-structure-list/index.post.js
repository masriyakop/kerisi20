import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    
    // Validation
    if (!body.FUND || !body.ACTIVITY || !body.OUN || !body.CCR || !body.BUDGETCODE || !body.YEAR || !body.STAT || !body.DEFISIT) {
      return {
        statusCode: 400,
        message: "All required fields must be filled",
      };
    }
    
    // Get the next available ID
    const maxId = await prisma.structure_budget.findFirst({
      orderBy: {
        sbg_budget_id: 'desc',
      },
      select: {
        sbg_budget_id: true,
      },
    });
    
    const nextId = maxId ? maxId.sbg_budget_id + 1 : 1;
    
    // Create new budget structure
    const structure = await prisma.structure_budget.create({
      data: {
        sbg_budget_id: nextId,
        fty_fund_type: body.FUND,
        oun_code: body.OUN,
        ccr_costcentre: body.CCR,
        at_activity_code: body.ACTIVITY,
        lbc_budget_code: body.BUDGETCODE,
        cpa_project_no: body.PROJNO || null,
        sby_year: body.YEAR,
        sbg_status: body.STAT,
        acm_defisit: body.DEFISIT,
        createddate: new Date(),
      },
    });
    
    return {
      statusCode: 201,
      message: "Budget structure created successfully",
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
    console.error("Error creating budget structure:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    };
  }
});

