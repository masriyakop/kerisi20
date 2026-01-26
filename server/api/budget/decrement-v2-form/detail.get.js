import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const bmm_budget_movement_id = parseInt(query.bmm_budget_movement_id);

    if (!bmm_budget_movement_id) {
      return {
        statusCode: 400,
        message: "bmm_budget_movement_id is required",
      };
    }

    const details = await prisma.budget_movement_detl.findMany({
      where: {
        bmm_budget_movement_id: bmm_budget_movement_id,
      },
      include: {
        structure_budget_budget_movement_detl_sbg_budget_id_toTostructure_budget: {
          include: {
            fund_type: true,
            activity_type: true,
            organization_unit: true,
            lkp_budget_code: true,
          },
        },
        budget_movement_master: {
          include: {
            quarter_budget: true,
          },
        },
      },
    });

    // Get budget data separately for balance amounts
    const budgetData = await prisma.budget.findMany({
      where: {
        sbg_budget_id: {
          in: details.map((d) => d.sbg_budget_id_to).filter(Boolean),
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

    // Create a map of sbg_budget_id to budget
    const budgetMap = new Map();
    budgetData.forEach((b) => {
      if (b.sbg_budget_id && !budgetMap.has(b.sbg_budget_id)) {
        budgetMap.set(b.sbg_budget_id, b);
      }
    });

    const formattedData = details.map((item) => {
      const sb = item.structure_budget_budget_movement_detl_sbg_budget_id_toTostructure_budget;
      const qb = item.budget_movement_master?.quarter_budget;
      const budget = item.sbg_budget_id_to ? budgetMap.get(item.sbg_budget_id_to) : null;
      
      return {
        bmd_bgt_movement_detl_id: item.bmd_bgt_movement_detl_id,
        bdg_budget_id: budget?.bdg_budget_id || null,
        sbg_budget_id: item.sbg_budget_id_to,
        qbu_quarter_id: budget?.quarter_budget ? `${budget.quarter_budget.qbu_year} - ${budget.quarter_budget.qbu_description}` : (qb ? `${qb.qbu_year} - ${qb.qbu_description}` : ""),
        fty_fund_type: sb?.fund_type ? `${sb.fty_fund_type} - ${sb.fund_type.fty_fund_desc}` : "",
        at_activity_code: sb?.activity_type ? `${sb.at_activity_code} - ${sb.activity_type.at_activity_description_bm}` : "",
        oun_code: sb?.organization_unit ? `${sb.oun_code} - ${sb.organization_unit.oun_desc}` : "",
        ccr_costcentre: sb?.ccr_costcentre || "",
        sbg_budget_code: sb?.lkp_budget_code ? `${sb.lbc_budget_code} - ${sb.lkp_budget_code.lbc_description}` : "",
        bdg_balance_amt: budget?.bdg_balance_amt?.toString() || "0.00",
        bmd_mvt_amt: item.bmd_mvt_amt?.toString() || "0.00",
      };
    });

    return {
      statusCode: 200,
      data: formattedData,
    };
  } catch (error) {
    console.error("Error fetching detail list:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch detail list",
      error: error.message,
    };
  }
});

