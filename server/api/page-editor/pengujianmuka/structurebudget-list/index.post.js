import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // Map aliased fields back to original field names
    const createData = {};
    if (body.ID !== undefined) createData.sbg_budget_id = body.ID;
    if (body.id !== undefined && createData.sbg_budget_id === undefined) createData.sbg_budget_id = body.id;
    if (body.FUND !== undefined) createData.fty_fund_type = body.FUND;
    if (body.fund !== undefined && createData.fty_fund_type === undefined) createData.fty_fund_type = body.fund;
    if (body.OUN !== undefined) createData.oun_code = body.OUN;
    if (body.oun !== undefined && createData.oun_code === undefined) createData.oun_code = body.oun;
    if (body.CCR !== undefined) createData.ccr_costcentre = body.CCR;
    if (body.ccr !== undefined && createData.ccr_costcentre === undefined) createData.ccr_costcentre = body.ccr;
    if (body.ACTIVITY !== undefined) createData.at_activity_code = body.ACTIVITY;
    if (body.activity !== undefined && createData.at_activity_code === undefined) createData.at_activity_code = body.activity;
    if (body.BUDGETCODE !== undefined) createData.lbc_budget_code = body.BUDGETCODE;
    if (body.budgetcode !== undefined && createData.lbc_budget_code === undefined) createData.lbc_budget_code = body.budgetcode;
    if (body.Year !== undefined) createData.sby_year = body.Year;
    if (body.year !== undefined && createData.sby_year === undefined) createData.sby_year = body.year;
    if (body.Fund !== undefined) createData.fty_fund_type = body.Fund;
    if (body.fund !== undefined && createData.fty_fund_type === undefined) createData.fty_fund_type = body.fund;
    if (body.PTJ !== undefined) createData.oun_code = body.PTJ;
    if (body.ptj !== undefined && createData.oun_code === undefined) createData.oun_code = body.ptj;
    if (body["Cost Centre"] !== undefined) createData.ccr_costcentre = body["Cost Centre"];
    if (body.Cost_Centre !== undefined && createData.ccr_costcentre === undefined) createData.ccr_costcentre = body.Cost_Centre;
    if (body.cost_centre !== undefined && createData.ccr_costcentre === undefined) createData.ccr_costcentre = body.cost_centre;
    if (body.Activity !== undefined) createData.at_activity_code = body.Activity;
    if (body.activity !== undefined && createData.at_activity_code === undefined) createData.at_activity_code = body.activity;
    if (body["Budget Code"] !== undefined) createData.lbc_budget_code = body["Budget Code"];
    if (body.Budget_Code !== undefined && createData.lbc_budget_code === undefined) createData.lbc_budget_code = body.Budget_Code;
    if (body.budget_code !== undefined && createData.lbc_budget_code === undefined) createData.lbc_budget_code = body.budget_code;
    if (body.Status !== undefined) createData.sbg_status = body.Status;
    if (body.status !== undefined && createData.sbg_status === undefined) createData.sbg_status = body.status;
    if (body.CostCentre !== undefined) createData.ccr_costcentre = body.CostCentre;
    if (body.costcentre !== undefined && createData.ccr_costcentre === undefined) createData.ccr_costcentre = body.costcentre;
    if (body.BudgetCode !== undefined) createData.lbc_budget_code = body.BudgetCode;
    if (body.budgetcode !== undefined && createData.lbc_budget_code === undefined) createData.lbc_budget_code = body.budgetcode;
    if (body.deficit_budget !== undefined) createData.acm_defisit = body.deficit_budget;
    // Copy any fields that match original field names
    Object.keys(body).forEach(key => {
      if (key.startsWith('sbg_budget_') && key !== 'sbg_budget_id') {
        if (!createData.hasOwnProperty(key)) {
          createData[key] = body[key];
        }
      }
    });
    

    // Auto-generate primary key if not provided (for non-auto-increment Int primary keys)
    if (!createData.sbg_budget_id || createData.sbg_budget_id === 0) {
      const maxRecord = await prisma.structure_budget.findFirst({
        orderBy: { sbg_budget_id: 'desc' },
        select: { sbg_budget_id: true },
      });
      createData.sbg_budget_id = maxRecord ? maxRecord.sbg_budget_id + 1 : 1;
    }

    // Validate required fields (check createData after mapping and WHERE conditions are applied)
    // No required fields validation needed

    // Convert year fields to string if they are numbers (database may expect String for year fields)
    Object.keys(createData).forEach(key => {
      if ((key.toLowerCase().includes('year') || key.toLowerCase().includes('_year')) && typeof createData[key] === 'number') {
        createData[key] = String(createData[key]);
      }
    });

    // Create record
    const data = await prisma.structure_budget.create({
      data: createData,
    });

    return {
      statusCode: 200,
      message: "Record created successfully",
      data,
    };
  } catch (error) {
    console.error("Error creating record:", error);
    
    // Handle Prisma-specific errors
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0] || 'field';
      return {
        statusCode: 409,
        message: `Record with this ${field} already exists`,
        error: "Unique constraint violation",
      };
    }
    
    if (error.code === 'P2003') {
      return {
        statusCode: 400,
        message: "Foreign key constraint violation. Please check related records.",
        error: "Foreign key constraint violation",
      };
    }
    
    return {
      statusCode: 500,
      message: "Failed to create record",
      error: "development" === 'development' ? error.message : "An error occurred while creating the record",
    };
  }
});
