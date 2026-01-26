import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    // Build where clause for filtering
    const where = {};
    
    // Build where clause for budget table
    const budgetWhere = {};
    
    // Top filters (Monitoring Filter)
    if (query.year && query.year !== 'null' && query.year.trim() !== '') {
      budgetWhere.bdg_year = query.year.trim();
    }
    
    // Default to APPROVED status if not specified
    if (query.sm_bdg_status && query.sm_bdg_status.trim() !== '') {
      budgetWhere.bdg_status = query.sm_bdg_status.trim();
    } else {
      budgetWhere.bdg_status = 'APPROVED';
    }
    
    // Build structure_budget where clause for joins
    const structureBudgetWhere = {};
    
    if (query.fundType && query.fundType !== 'null' && query.fundType.trim() !== '') {
      structureBudgetWhere.fty_fund_type = query.fundType.trim();
    }
    if (query.oun_code && query.oun_code !== 'null' && query.oun_code.trim() !== '') {
      structureBudgetWhere.oun_code = query.oun_code.trim();
    }
    if (query.ccr_costcentre_top && query.ccr_costcentre_top !== 'null' && query.ccr_costcentre_top.trim() !== '') {
      structureBudgetWhere.ccr_costcentre = query.ccr_costcentre_top.trim();
    }
    if (query.at_activity_code_top && query.at_activity_code_top !== 'null' && query.at_activity_code_top.trim() !== '') {
      structureBudgetWhere.at_activity_code = query.at_activity_code_top.trim();
    }
    
    // Smart filters
    if (query.sm_acm_acct_code && query.sm_acm_acct_code.trim() !== '') {
      structureBudgetWhere.lbc_budget_code = query.sm_acm_acct_code.trim();
    }
    if (query.sm_kod_so && query.sm_kod_so.trim() !== '') {
      structureBudgetWhere.kod_so = query.sm_kod_so.trim();
    }
    if (query.sm_budgetcode && query.sm_budgetcode.trim() !== '') {
      structureBudgetWhere.lbc_budget_code = { contains: query.sm_budgetcode.trim() };
    }

    // Fetch all budget records from database (no pagination, frontend handles it)
    // Include structure_budget with related data
    const records = await prisma.budget.findMany({
      where: Object.keys(budgetWhere).length > 0 ? budgetWhere : {},
      include: {
        structure_budget: {
          where: Object.keys(structureBudgetWhere).length > 0 ? structureBudgetWhere : undefined,
          include: {
            fund_type: {
              select: {
                fty_fund_desc: true,
              },
            },
            activity_type: {
              select: {
                at_activity_description_bm: true,
              },
            },
            organization_unit: {
              select: {
                oun_desc: true,
              },
            },
            lkp_budget_code: {
              select: {
                lbc_description: true,
              },
            },
          },
        },
      },
      orderBy: {
        bdg_budget_id: 'asc',
      },
    });
    
    // Filter out records that don't match structure_budget filters
    let filteredRecords = records;
    if (Object.keys(structureBudgetWhere).length > 0) {
      filteredRecords = records.filter(r => r.structure_budget !== null);
    }

    // Format the response - map to dt_key fields
    const formattedData = filteredRecords.map((item, index) => {
      const sb = item.structure_budget || {};
      const budgetId = sb.fty_fund_type && sb.at_activity_code && sb.oun_code && sb.ccr_costcentre && sb.lbc_budget_code
        ? `${sb.fty_fund_type}-${sb.at_activity_code}-${sb.oun_code}-${sb.ccr_costcentre}-${sb.lbc_budget_code}`
        : '';
      
      return {
        budgetid: budgetId,
        bdg_budget_id: item.bdg_budget_id, // Primary key for edit/view operations
        bdg_status: item.bdg_status || '',
        bdg_year: item.bdg_year || '',
        bdg_lock_amt: item.bdg_lock_amt ? parseFloat(item.bdg_lock_amt.toString()) : 0,
        bdg_bal_carryforward: item.bdg_bal_carryforward ? parseFloat(item.bdg_bal_carryforward.toString()) : 0,
        bdg_topup_amt: item.bdg_topup_amt ? parseFloat(item.bdg_topup_amt.toString()) : 0,
        bdg_initial_amt: item.bdg_initial_amt ? parseFloat(item.bdg_initial_amt.toString()) : 0,
        bdg_additional_amt: item.bdg_additional_amt ? parseFloat(item.bdg_additional_amt.toString()) : 0,
        bdg_virement_amt: item.bdg_virement_amt ? parseFloat(item.bdg_virement_amt.toString()) : 0,
        bdg_allocated_amt: item.bdg_allocated_amt ? parseFloat(item.bdg_allocated_amt.toString()) : 0,
        bdg_pre_request_amt: item.bdg_pre_request_amt ? parseFloat(item.bdg_pre_request_amt.toString()) : 0,
        bdg_request_amt: item.bdg_request_amt ? parseFloat(item.bdg_request_amt.toString()) : 0,
        bdg_commit_amt: item.bdg_commit_amt ? parseFloat(item.bdg_commit_amt.toString()) : 0,
        bdg_expenses_amt: item.bdg_expenses_amt ? parseFloat(item.bdg_expenses_amt.toString()) : 0,
        bdg_balance_amt: item.bdg_balance_amt ? parseFloat(item.bdg_balance_amt.toString()) : 0,
        fty_fund_type: sb.fty_fund_type || '',
        fty_fund_desc: sb.fund_type?.fty_fund_desc || '',
        at_activity_code: sb.at_activity_code || '',
        at_activity_description_bm: sb.activity_type?.at_activity_description_bm || '',
        oun_code: sb.oun_code || '',
        oun_desc: sb.organization_unit?.oun_desc || '',
        ccr_costcentre: sb.ccr_costcentre || '',
        ccr_costcentre_desc: '', // Would need to join with costcentre table if needed
        lbc_budget_code: sb.lbc_budget_code || '',
        acm_acct_desc: sb.lkp_budget_code?.lbc_description || '',
        bdg_closing: item.bdg_closing || '',
        bdg_closing_by: item.bdg_closing_by || '',
        urlViewBudget: `/budget/monitoring/view/${item.bdg_budget_id}`,
      };
    });
    
    // Apply search filter if provided (searches across multiple fields)
    let finalData = formattedData;
    if (query.search && query.search.trim() !== '') {
      const searchTerm = query.search.trim().toLowerCase();
      finalData = formattedData.filter(item => {
        const searchableText = [
          item.budgetid,
          item.bdg_year,
          item.bdg_status,
          item.fty_fund_type,
          item.fty_fund_desc,
          item.at_activity_code,
          item.at_activity_description_bm,
          item.oun_code,
          item.oun_desc,
          item.ccr_costcentre,
          item.lbc_budget_code,
          item.acm_acct_desc,
        ].filter(Boolean).join(' ').toLowerCase();
        
        return searchableText.includes(searchTerm);
      });
    }
    
    // Apply smart filter for budget ID (concatenated string)
    if (query.sm_budgetid && query.sm_budgetid.trim() !== '') {
      const budgetIdFilter = query.sm_budgetid.trim().toLowerCase();
      finalData = finalData.filter(item => 
        item.budgetid.toLowerCase().includes(budgetIdFilter)
      );
    }

    return {
      statusCode: 200,
      message: "Budget monitoring records fetched successfully",
      data: finalData,
    };
  } catch (error) {
    console.error("Error fetching budget monitoring records:", error);
    return {
      statusCode: 500,
      message: "An error occurred while fetching budget monitoring records",
      error: error.message,
    };
  }
});

