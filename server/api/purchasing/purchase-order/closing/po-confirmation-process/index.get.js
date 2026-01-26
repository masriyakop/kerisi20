import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const fund = query.fund;
    const search = query.search;

    // Build where clause
    let whereClause = {
      opening_status: null,
    };

    // Apply fund filter
    if (fund === 'E01') {
      whereClause.fty_fund_type = 'E01';
    } else if (fund === 'other') {
      whereClause.fty_fund_type = { not: 'E01' };
    }

    // Apply search filter
    if (search) {
      const searchTerm = search.trim();
      whereClause.OR = [
        { ppc_id: { contains: searchTerm } },
        { ppc_year: { contains: searchTerm } },
        { pom_order_no: { contains: searchTerm } },
        { pod_order_detl_id: { contains: searchTerm } },
        { pod_line_no: { contains: searchTerm } },
        { fty_fund_type: { contains: searchTerm } },
        { oun_code: { contains: searchTerm } },
        { at_activity_code: { contains: searchTerm } },
        { ccr_costcentre: { contains: searchTerm } },
        { am_account_code: { contains: searchTerm } },
        { cpa_project_no: { contains: searchTerm } },
        { remark: { contains: searchTerm } },
      ];
    }

    // Try to fetch from po_process_closing table
    // If table doesn't exist, return empty array
    let poList = [];
    try {
      poList = await prisma.po_process_closing.findMany({
        where: whereClause,
        orderBy: {
          ppc_id: 'desc',
        },
        take: 1000, // Limit results
      });
    } catch (tableError) {
      console.log("po_process_closing table may not exist:", tableError.message);
      return {
        statusCode: 200,
        message: "PO Confirmation Process data fetched successfully",
        data: [],
        recordsFiltered: 0,
        checkboxMonitoring: [],
      };
    }

    // Get structure budget details for old and new
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

    // Get activity type descriptions
    const activityCodes = [...new Set(poList.map(po => po.at_activity_code).filter(Boolean))];
    const activityTypes = activityCodes.length > 0 ? await prisma.activity_type.findMany({
      where: { at_activity_code: { in: activityCodes } },
      select: {
        at_activity_code: true,
        at_activity_description_bm: true,
      },
    }) : [];

    const activityMap = new Map(activityTypes.map(at => [at.at_activity_code, at]));

    // Get organization unit descriptions
    const ounCodes = [...new Set(poList.map(po => po.oun_code).filter(Boolean))];
    const orgUnits = ounCodes.length > 0 ? await prisma.organization_unit.findMany({
      where: { oun_code: { in: ounCodes } },
      select: {
        oun_code: true,
        oun_desc: true,
      },
    }) : [];

    const orgUnitMap = new Map(orgUnits.map(ou => [ou.oun_code, ou]));

    // Get cost centre descriptions
    const costCentreCodes = [...new Set(poList.map(po => po.ccr_costcentre).filter(Boolean))];
    const costCentres = costCentreCodes.length > 0 ? await prisma.costcentre.findMany({
      where: { ccr_costcentre: { in: costCentreCodes } },
      select: {
        ccr_costcentre: true,
        ccr_costcentre_desc: true,
      },
    }) : [];

    const costCentreMap = new Map(costCentres.map(cc => [cc.ccr_costcentre, cc]));

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
        ID: `${po.pom_order_no}_${po.ppc_id}`,
        ppc_id: po.ppc_id,
        Year: po.ppc_year || '',
        "Pod Order No": po.pom_order_no || '',
        "Pod Order ID": po.pod_order_detl_id || '',
        "Pod Line No": po.pod_line_no || '',
        "PO Detail Account": poDetailAccount,
        "Fund Type": po.fty_fund_type || '',
        "Activity Code": po.at_activity_code || '',
        PTJ: po.oun_code || '',
        "Cost Centre": po.ccr_costcentre || '',
        "Account Code": po.am_account_code || '',
        "Cpa Project No": po.cpa_project_no || '',
        "Balance Amount": po.ppc_balance_amount ? parseFloat(po.ppc_balance_amount.toString()) : 0,
        "Old Structure Budget": oldStructure,
        "Activity Code Budget": po.pod_at_activity_code_budget || '',
        "Cost Centre Budget": po.pod_ccr_costcentre_budget || '',
        "Sbg Budget ID": po.sbg_budget_id || '',
        "New Activity Code Budget": po.pod_at_activity_code_budget_NEW || '',
        "New Cost Centre Budget": po.pod_ccr_costcentre_budget_NEW || '',
        "New Sbg Budget ID": po.sbg_budget_id_NEW || '',
        "New Structure Budget": newStructure,
        Remark: po.remark || '',
        "Closing Status": po.closing_status === 'Y' ? 'YES' : 'NO',
        "Opening Status": po.opening_status === 'Y' ? 'YES' : 'NO',
        Action: "",
        // Keep original data
        ppc_balance_amount: po.ppc_balance_amount,
        sbg_budget_id_NEW: po.sbg_budget_id_NEW,
      };
    });

    // Get checkbox monitoring data (POs with sbg_budget_id_NEW not null)
    const checkboxMonitoring = poList
      .filter(po => po.sbg_budget_id_NEW !== null)
      .map(po => `${po.pom_order_no}_${po.ppc_id}`);

    return {
      statusCode: 200,
      message: "PO Confirmation Process data fetched successfully",
      data: data,
      recordsFiltered: data.length,
      checkboxMonitoring: checkboxMonitoring,
    };
  } catch (error) {
    console.error("Error fetching PO Confirmation Process:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch PO Confirmation Process data",
      error: error.message,
    };
  }
});
