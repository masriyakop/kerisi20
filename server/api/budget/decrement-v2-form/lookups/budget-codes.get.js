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
      },
      include: {
        lkp_budget_code: {
          where: {
            lbc_status: 1,
          },
        },
      },
    });

    // Get approved budgets for these structure budgets
    const sbgIds = structureBudgets.map((sb) => sb.sbg_budget_id);
    
    const budgets = await prisma.budget.findMany({
      where: {
        sbg_budget_id: {
          in: sbgIds,
        },
        bdg_status: "APPROVED",
      },
      include: {
        structure_budget: {
          include: {
            lkp_budget_code: true,
          },
        },
        quarter_budget: true,
      },
      orderBy: {
        bdg_budget_id: 'desc',
      },
    });

    // Format and return unique budget codes
    const budgetCodeMap = new Map();
    budgets.forEach((budget) => {
      const sb = budget.structure_budget;
      const key = `${sb.sbg_budget_id}`;
      if (!budgetCodeMap.has(key) && sb.lkp_budget_code) {
        budgetCodeMap.set(key, {
          sbg_budget_id: sb.sbg_budget_id,
          lbc_budget_code: sb.lbc_budget_code,
          lbc_description: sb.lkp_budget_code.lbc_description,
          bdg_budget_id: budget.bdg_budget_id,
          qbu_quarter_id: budget.quarter_budget
            ? `${budget.quarter_budget.qbu_year} - ${budget.quarter_budget.qbu_description}`
            : "",
          bdg_balance_amt: budget.bdg_balance_amt?.toString() || "0.00",
        });
      }
    });

    return {
      statusCode: 200,
      data: Array.from(budgetCodeMap.values()),
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

