import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const { fty_fund_type, oun_code } = query;

    if (!fty_fund_type || !oun_code) {
      return {
        statusCode: 400,
        message: "fty_fund_type and oun_code are required",
      };
    }

    // Find structure budgets matching fund type and PTJ
    const structureBudgets = await prisma.structure_budget.findMany({
      where: {
        fty_fund_type: fty_fund_type,
        oun_code: oun_code,
        sbg_status: "ACTIVE",
      },
      include: {
        lkp_budget_code: true,
      },
    });

    // Get budget data for these structure budgets
    const sbgIds = structureBudgets.map((sb) => sb.sbg_budget_id);
    const budgets = await prisma.budget.findMany({
      where: {
        sbg_budget_id: {
          in: sbgIds,
        },
        bdg_status: "APPROVED",
      },
      include: {
        quarter_budget: true,
      },
      orderBy: {
        bdg_budget_id: 'desc',
      },
    });

    // Create a map of sbg_budget_id to latest budget
    const budgetMap = new Map();
    budgets.forEach((b) => {
      if (b.sbg_budget_id && !budgetMap.has(b.sbg_budget_id)) {
        budgetMap.set(b.sbg_budget_id, b);
      }
    });

    const formattedData = structureBudgets
      .filter((sb) => budgetMap.has(sb.sbg_budget_id))
      .map((sb) => {
        const budget = budgetMap.get(sb.sbg_budget_id);
        return {
          sbg_budget_id: sb.sbg_budget_id,
          lbc_budget_code: sb.lkp_budget_code?.lbc_budget_code || "",
          lbc_description: sb.lkp_budget_code?.lbc_description || "",
          bdg_budget_id: budget.bdg_budget_id,
          qbu_quarter_id: budget.qbu_quarter_id,
          bdg_balance_amt: budget.bdg_balance_amt?.toString() || "0.00",
        };
      });

    return {
      statusCode: 200,
      data: formattedData,
    };
  } catch (error) {
    console.error("Error fetching budget codes:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch budget codes",
      error: error.message,
    };
  }
});

