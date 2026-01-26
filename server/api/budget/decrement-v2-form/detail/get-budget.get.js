import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const bdg_budget_id = parseInt(query.bdg_budget_id);

    if (!bdg_budget_id) {
      return {
        statusCode: 400,
        message: "bdg_budget_id is required",
      };
    }

    const budget = await prisma.budget.findUnique({
      where: {
        bdg_budget_id: bdg_budget_id,
      },
      include: {
        structure_budget: {
          include: {
            fund_type: true,
            activity_type: true,
            organization_unit: true,
            lkp_budget_code: true,
          },
        },
        quarter_budget: true,
      },
    });

    if (!budget) {
      return {
        statusCode: 404,
        message: "Budget not found",
      };
    }

    const sb = budget.structure_budget;

    const formattedData = {
      bdg_budget_id: budget.bdg_budget_id,
      sbg_budget_id: budget.sbg_budget_id,
      qbu_quarter_id: budget.quarter_budget ? `${budget.quarter_budget.qbu_year} - ${budget.quarter_budget.qbu_description}` : "",
      fty_fund_type: sb?.fund_type ? `${sb.fty_fund_type} - ${sb.fund_type.fty_fund_desc}` : "",
      at_activity_code: sb?.activity_type ? `${sb.at_activity_code} - ${sb.activity_type.at_activity_description_bm}` : "",
      oun_code: sb?.organization_unit ? `${sb.oun_code} - ${sb.organization_unit.oun_desc}` : "",
      ccr_costcentre: sb?.ccr_costcentre || "",
      sbg_budget_code: sb?.lkp_budget_code ? `${sb.lbc_budget_code} - ${sb.lkp_budget_code.lbc_description}` : "",
      bdg_balance_amt: budget.bdg_balance_amt?.toString() || "0.00",
    };

    return {
      statusCode: 200,
      data: formattedData,
    };
  } catch (error) {
    console.error("Error fetching budget:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch budget",
      error: error.message,
    };
  }
});

