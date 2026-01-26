import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const search = query.search;
    const fty_fund_type = query.fty_fund_type;
    const ppc_year = query.ppc_year;

    // Build where clause
    let whereClause = {
      opening_status: { not: null },
    };

    // Apply fund filter
    if (fty_fund_type === 'E01') {
      whereClause.fty_fund_type = 'E01';
    } else if (fty_fund_type === 'other') {
      whereClause.fty_fund_type = { not: 'E01' };
    }

    // Apply year filter
    if (ppc_year) {
      whereClause.ppc_year = ppc_year;
    }

    // Apply search filter
    if (search) {
      const searchTerm = search.trim();
      whereClause.OR = [
        { pom_order_no: { contains: searchTerm } },
        { fty_fund_type: { contains: searchTerm } },
        { at_activity_code: { contains: searchTerm } },
        { ccr_costcentre: { contains: searchTerm } },
        { am_account_code: { contains: searchTerm } },
        { remark: { contains: searchTerm } },
      ];
    }

    // Try to fetch from po_process_closing table
    let poList = [];
    try {
      poList = await prisma.po_process_closing.findMany({
        where: whereClause,
        orderBy: {
          ppc_id: 'desc',
        },
        take: 1000,
      });
    } catch (tableError) {
      console.log("po_process_closing table may not exist:", tableError.message);
      return {
        statusCode: 200,
        message: "PO Confirmation Process List data fetched successfully",
        data: [],
        recordsFiltered: 0,
      };
    }

    // Get structure budget details
    const oldBudgetIds = [...new Set(poList.map(po => po.sbg_budget_id).filter(Boolean))];
    const newBudgetIds = [...new Set(poList.map(po => po.sbg_budget_id_NEW).filter(Boolean))];
    const allBudgetIds = [...new Set([...oldBudgetIds, ...newBudgetIds])];

    const structureBudgets = allBudgetIds.length > 0 ? await prisma.structure_budget.findMany({
      where: { sbg_budget_id: { in: allBudgetIds } },
      select: {
        sbg_budget_id: true,
        fty_fund_type: true,
        at_activity_code: true,
        oun_code: true,
        ccr_costcentre: true,
        lbc_budget_code: true,
      },
    }) : [];

    const budgetMap = new Map(structureBudgets.map(sb => [sb.sbg_budget_id, sb]));

    // Format data
    const data = poList.map((po, index) => {
      const oldBudget = budgetMap.get(po.sbg_budget_id);
      const newBudget = budgetMap.get(po.sbg_budget_id_NEW);
      
      const oldStructure = oldBudget 
        ? `${oldBudget.fty_fund_type}-${oldBudget.at_activity_code}-${oldBudget.oun_code}-${oldBudget.ccr_costcentre}-${oldBudget.lbc_budget_code || ''}`.toUpperCase()
        : '';
      
      const newStructure = newBudget
        ? `${newBudget.fty_fund_type}-${newBudget.at_activity_code}-${newBudget.oun_code}-${newBudget.ccr_costcentre}-${newBudget.lbc_budget_code || ''}`.toUpperCase()
        : '';

      const poDetailAccount = `${po.fty_fund_type || ''}-${po.at_activity_code || ''}-${po.oun_code || ''}-${po.ccr_costcentre || ''}-${po.am_account_code || ''}`.toUpperCase();

      return {
        no: index + 1,
        "PO No": po.pom_order_no || '',
        "PO Detail Account": poDetailAccount,
        "Fund Type": po.fty_fund_type || '',
        Activity: po.at_activity_code || '',
        "Cost Center": po.ccr_costcentre || '',
        "Account Code": po.am_account_code || '',
        "Cpa Project No": po.cpa_project_no || '',
        Balance: po.ppc_balance_amount ? parseFloat(po.ppc_balance_amount.toString()) : 0,
        "Old Structure Budget": oldStructure,
        "Activity Budget": po.pod_at_activity_code_budget || '',
        "Cost Center Budget": po.pod_ccr_costcentre_budget || '',
        "Sbg Budget Id": po.sbg_budget_id || '',
        "Activity Budget New": po.pod_at_activity_code_budget_NEW || '',
        "Cost Center Budget New": po.pod_ccr_costcentre_budget_NEW || '',
        "Sbg Budget Id New": po.sbg_budget_id_NEW || '',
        "New Structure Budget": newStructure,
        Remark: po.remark || '',
      };
    });

    return {
      statusCode: 200,
      message: "PO Confirmation Process List data fetched successfully",
      data: data,
      recordsFiltered: data.length,
    };
  } catch (error) {
    console.error("Error fetching PO Confirmation Process List:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch PO Confirmation Process List data",
      error: error.message,
    };
  }
});
