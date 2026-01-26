import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const { fty_fund_type, oun_code, at_activity_code, ccr_costcentre } = query;

    if (!fty_fund_type || !oun_code) {
      return {
        statusCode: 400,
        message: "Fund type and PTJ are required",
      };
    }

    const where = {
      fty_fund_type,
      oun_code,
      sbg_status: "ACTIVE",
    };

    if (at_activity_code) {
      where.at_activity_code = at_activity_code;
    }

    if (ccr_costcentre) {
      where.ccr_costcentre = ccr_costcentre;
    }

    const structureBudgets = await prisma.structure_budget.findMany({
      where,
      include: {
        lkp_budget_code: {
          where: {
            lbc_status: 1,
          },
        },
      },
    });

    const formattedData = structureBudgets
      .filter((sb) => sb.lkp_budget_code)
      .map((sb) => ({
        sbg_budget_id: sb.sbg_budget_id,
        lbc_budget_code: sb.lbc_budget_code,
        lbc_description: sb.lkp_budget_code?.lbc_description || "",
      }));

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

