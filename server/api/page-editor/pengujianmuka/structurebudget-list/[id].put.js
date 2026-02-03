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

    // Check if record exists before updating
    const existingRecord = await prisma.structure_budget.findUnique({
      where: { sbg_budget_id: parseInt(id) },
    });

    if (!existingRecord) {
      return {
        statusCode: 404,
        message: "Record not found",
      };
    }

    // Map aliased fields back to original field names
    // CRITICAL: Process aliases FIRST (stale values from form load), then original fields LAST (user edits)
    // This ensures user edits take priority over stale alias values
    const updateData = {};
    if (body.ID !== undefined) updateData.sbg_budget_id = body.ID;
    if (body.id !== undefined) updateData.sbg_budget_id = body.id;
    if (body.FUND !== undefined) updateData.fty_fund_type = body.FUND;
    if (body.fund !== undefined) updateData.fty_fund_type = body.fund;
    if (body.OUN !== undefined) updateData.oun_code = body.OUN;
    if (body.oun !== undefined) updateData.oun_code = body.oun;
    if (body.CCR !== undefined) updateData.ccr_costcentre = body.CCR;
    if (body.ccr !== undefined) updateData.ccr_costcentre = body.ccr;
    if (body.ACTIVITY !== undefined) updateData.at_activity_code = body.ACTIVITY;
    if (body.activity !== undefined) updateData.at_activity_code = body.activity;
    if (body.BUDGETCODE !== undefined) updateData.lbc_budget_code = body.BUDGETCODE;
    if (body.budgetcode !== undefined) updateData.lbc_budget_code = body.budgetcode;
    if (body.Year !== undefined) updateData.sby_year = body.Year;
    if (body.year !== undefined) updateData.sby_year = body.year;
    if (body.Fund !== undefined) updateData.fty_fund_type = body.Fund;
    if (body.fund !== undefined) updateData.fty_fund_type = body.fund;
    if (body.PTJ !== undefined) updateData.oun_code = body.PTJ;
    if (body.ptj !== undefined) updateData.oun_code = body.ptj;
    if (body["Cost Centre"] !== undefined) updateData.ccr_costcentre = body["Cost Centre"];
    if (body.Cost_Centre !== undefined) updateData.ccr_costcentre = body.Cost_Centre;
    if (body.cost_centre !== undefined) updateData.ccr_costcentre = body.cost_centre;
    if (body.Activity !== undefined) updateData.at_activity_code = body.Activity;
    if (body.activity !== undefined) updateData.at_activity_code = body.activity;
    if (body["Budget Code"] !== undefined) updateData.lbc_budget_code = body["Budget Code"];
    if (body.Budget_Code !== undefined) updateData.lbc_budget_code = body.Budget_Code;
    if (body.budget_code !== undefined) updateData.lbc_budget_code = body.budget_code;
    if (body.Status !== undefined) updateData.sbg_status = body.Status;
    if (body.status !== undefined) updateData.sbg_status = body.status;
    if (body.CostCentre !== undefined) updateData.ccr_costcentre = body.CostCentre;
    if (body.costcentre !== undefined) updateData.ccr_costcentre = body.costcentre;
    if (body.BudgetCode !== undefined) updateData.lbc_budget_code = body.BudgetCode;
    if (body.budgetcode !== undefined) updateData.lbc_budget_code = body.budgetcode;
    if (body.deficit_budget !== undefined) updateData.acm_defisit = body.deficit_budget;
    // Process original field names LAST so they take priority over stale alias values
    if (body.sbg_budget_id !== undefined) updateData.sbg_budget_id = body.sbg_budget_id;
    if (body.fty_fund_type !== undefined) updateData.fty_fund_type = body.fty_fund_type;
    if (body.oun_code !== undefined) updateData.oun_code = body.oun_code;
    if (body.ccr_costcentre !== undefined) updateData.ccr_costcentre = body.ccr_costcentre;
    if (body.at_activity_code !== undefined) updateData.at_activity_code = body.at_activity_code;
    if (body.lbc_budget_code !== undefined) updateData.lbc_budget_code = body.lbc_budget_code;
    if (body.sby_year !== undefined) updateData.sby_year = body.sby_year;
    if (body.sbg_status !== undefined) updateData.sbg_status = body.sbg_status;
    if (body.acm_defisit !== undefined) updateData.acm_defisit = body.acm_defisit;
    // Copy any other fields that match original field names (excluding id fields)
    Object.keys(body).forEach(key => {
      if (key.startsWith('sbg_budget_') && key !== 'sbg_budget_id' && body[key] !== undefined) {
        if (!updateData.hasOwnProperty(key)) {
          updateData[key] = body[key];
        }
      }
    });

    // Check if there's any data to update
    if (Object.keys(updateData).length === 0) {
      return {
        statusCode: 400,
        message: "No fields to update",
      };
    }

    // Convert year fields to string if they are numbers (database may expect String for year fields)
    Object.keys(updateData).forEach(key => {
      if ((key.toLowerCase().includes('year') || key.toLowerCase().includes('_year')) && typeof updateData[key] === 'number') {
        updateData[key] = String(updateData[key]);
      }
    });

    // Update record
    const data = await prisma.structure_budget.update({
      where: { sbg_budget_id: parseInt(id) },
      data: updateData,
    });

    return {
      statusCode: 200,
      message: "Record updated successfully",
      data,
    };
  } catch (error) {
    console.error("Error updating record:", error);
    
    // Handle Prisma-specific errors
    if (error.code === 'P2025') {
      return {
        statusCode: 404,
        message: "Record not found",
      };
    }
    
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
      message: "Failed to update record",
      error: "development" === 'development' ? error.message : "An error occurred while updating the record",
    };
  }
});
