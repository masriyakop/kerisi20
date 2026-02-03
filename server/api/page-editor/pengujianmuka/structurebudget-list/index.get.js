import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);

    // Build where clause from query parameters
    const where = {};
    
    
    
    // Add search filter if provided
    if (query.search && query.search.trim() !== "") {
      where.OR = [
        { sbg_budget_id: { contains: query.search } },
        { fty_fund_type: { contains: query.search } },
        { oun_code: { contains: query.search } },
        { ccr_costcentre: { contains: query.search } },
        { at_activity_code: { contains: query.search } }
      ];
    }

    // Add top filter conditions (accept both aliases and original field names)
    // Note: Using contains without mode for cross-database compatibility
    if (query.ID || query.ID || query.sbg_budget_id) {
      const filterValue = query.ID || query.ID || query.sbg_budget_id;
      where.sbg_budget_id = { contains: filterValue };
    }
    if (query.FUND || query.FUND || query.fty_fund_type) {
      const filterValue = query.FUND || query.FUND || query.fty_fund_type;
      where.fty_fund_type = { contains: filterValue };
    }
    if (query.OUN || query.OUN || query.oun_code) {
      const filterValue = query.OUN || query.OUN || query.oun_code;
      where.oun_code = { contains: filterValue };
    }
    if (query.CCR || query.CCR || query.ccr_costcentre) {
      const filterValue = query.CCR || query.CCR || query.ccr_costcentre;
      where.ccr_costcentre = { contains: filterValue };
    }
    if (query.ACTIVITY || query.ACTIVITY || query.at_activity_code) {
      const filterValue = query.ACTIVITY || query.ACTIVITY || query.at_activity_code;
      where.at_activity_code = { contains: filterValue };
    }
    if (query.BUDGETCODE || query.BUDGETCODE || query.lbc_budget_code) {
      const filterValue = query.BUDGETCODE || query.BUDGETCODE || query.lbc_budget_code;
      where.lbc_budget_code = { contains: filterValue };
    }
    if (query.Year || query.Year || query.sby_year) {
      const filterValue = query.Year || query.Year || query.sby_year;
      where.sby_year = { contains: filterValue };
    }
    if (query.Fund || query.Fund || query.fty_fund_type) {
      const filterValue = query.Fund || query.Fund || query.fty_fund_type;
      where.fty_fund_type = { contains: filterValue };
    }
    if (query.PTJ || query.PTJ || query.oun_code) {
      const filterValue = query.PTJ || query.PTJ || query.oun_code;
      where.oun_code = { contains: filterValue };
    }
    if (query["Cost Centre"] || query.Cost_Centre || query.ccr_costcentre) {
      const filterValue = query["Cost Centre"] || query.Cost_Centre || query.ccr_costcentre;
      where.ccr_costcentre = { contains: filterValue };
    }
    if (query.Activity || query.Activity || query.at_activity_code) {
      const filterValue = query.Activity || query.Activity || query.at_activity_code;
      where.at_activity_code = { contains: filterValue };
    }
    if (query["Budget Code"] || query.Budget_Code || query.lbc_budget_code) {
      const filterValue = query["Budget Code"] || query.Budget_Code || query.lbc_budget_code;
      where.lbc_budget_code = { contains: filterValue };
    }
    
    // Add Top Filter component field conditions (tf_xxx fields)
    if (query.Year) {
      where.sby_year = query.Year;
    }
    if (query.Fund) {
      where.fty_fund_type = query.Fund;
    }
    if (query.PTJ) {
      where.oun_code = query.PTJ;
    }
    if (query.CostCentre) {
      where.ccr_costcentre = query.CostCentre;
    }
    if (query.Activity) {
      where.at_activity_code = query.Activity;
    }

    // Get data with related tables - no pagination, rs-table handles it client-side
    const data = await prisma.structure_budget.findMany({
      where,
      orderBy: { sbg_budget_id: 'desc' },
      include: {
        activity_type: {
          select: {
            at_activity_description_bm: true,
          },
        },
        lkp_budget_code: {
          select: {
            lbc_description: true,
          },
        }
      },
    });

    // Map fields to aliases for frontend and ensure primary key is included
    const mappedData = data.map((item) => {
      const mapped = { ...item };
      mapped.ID = item.sbg_budget_id;
      mapped.id = item.sbg_budget_id;
      mapped.FUND = item.fty_fund_type;
      mapped.fund = item.fty_fund_type;
      mapped.Fund = item.fty_fund_type;
      mapped.OUN = item.oun_code;
      mapped.oun = item.oun_code;
      mapped.PTJ = item.oun_code;
      mapped.CCR = item.ccr_costcentre;
      mapped.ccr = item.ccr_costcentre;
      mapped["Cost Centre"] = item.ccr_costcentre;
      mapped.ACTIVITY = item.at_activity_code;
      mapped.activity = item.at_activity_code;
      mapped.Activity = item.at_activity_code;
      mapped.BUDGETCODE = item.lbc_budget_code;
      mapped.budgetcode = item.lbc_budget_code;
      mapped["Budget Code"] = item.lbc_budget_code;
      mapped.Year = item.sby_year;
      mapped.year = item.sby_year;
      mapped.Fund = item.fty_fund_type;
      mapped.fund = item.fty_fund_type;
      mapped.PTJ = item.oun_code;
      mapped.ptj = item.oun_code;
      mapped["Cost Centre"] = item.ccr_costcentre;
      mapped.Cost_Centre = item.ccr_costcentre;
      mapped.cost_centre = item.ccr_costcentre;
      mapped.Activity = item.at_activity_code;
      mapped.activity = item.at_activity_code;
      mapped["Budget Code"] = item.lbc_budget_code;
      mapped.Budget_Code = item.lbc_budget_code;
      mapped.budget_code = item.lbc_budget_code;
      // activity_desc from related activity_type
      mapped.activity_desc = item.activity_type?.at_activity_description_bm || '';
      mapped["Activity Description"] = item.activity_type?.at_activity_description_bm || '';
      // lbc_description from related lkp_budget_code
      mapped.lbc_description = item.lkp_budget_code?.lbc_description || '';
      mapped["Budget Code Description"] = item.lkp_budget_code?.lbc_description || '';
      // DEFISIT - IF(acm_defisit = 'N', 'NO', 'YES')
      mapped.DEFISIT = item.acm_defisit === 'N' ? 'NO' : 'YES';
      mapped.defisit = item.acm_defisit === 'N' ? 'NO' : 'YES';
      mapped["Deficit Budget"] = item.acm_defisit === 'N' ? 'NO' : 'YES';
      // STAT - IF(sbg_status = '1', 'ACTIVE', 'INACTIVE')
      mapped.STAT = item.sbg_status === '1' ? 'ACTIVE' : 'INACTIVE';
      mapped.stat = item.sbg_status === '1' ? 'ACTIVE' : 'INACTIVE';
      mapped.Status = item.sbg_status === '1' ? 'ACTIVE' : 'INACTIVE';
      mapped.CostCentre = item.ccr_costcentre;
      mapped.BudgetCode = item.lbc_budget_code;
      mapped.deficit_budget = item.acm_defisit;
      // Ensure primary key is available (even if not in SELECT)
      if (!mapped.sbg_budget_id && item.sbg_budget_id) {
        mapped.sbg_budget_id = item.sbg_budget_id;
      }
      // Add id field for CRUD operations (use primary key value)
      mapped.id = item.sbg_budget_id;
      return mapped;
    });

    return {
      statusCode: 200,
      message: "Data fetched successfully",
      data: mappedData,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    
    // Handle Prisma-specific errors
    if (error.code === 'P2001') {
      return {
        statusCode: 404,
        message: "No records found",
      };
    }
    
    return {
      statusCode: 500,
      message: "Failed to fetch data",
      error: "development" === 'development' ? error.message : "An error occurred while fetching data",
    };
  }
});
