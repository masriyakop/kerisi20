import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const bmd_bgt_movement_detl_id = parseInt(query.bmd_bgt_movement_detl_id);

    if (!bmd_bgt_movement_detl_id) {
      return {
        statusCode: 400,
        message: "bmd_bgt_movement_detl_id is required",
      };
    }

    const detail = await prisma.budget_movement_detl.findUnique({
      where: {
        bmd_bgt_movement_detl_id: bmd_bgt_movement_detl_id,
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
        budget: {
          include: {
            quarter_budget: true,
          },
        },
      },
    });

    if (!detail) {
      return {
        statusCode: 404,
        message: "Detail not found",
      };
    }

    const sb = detail.structure_budget_budget_movement_detl_sbg_budget_id_toTostructure_budget;
    const budget = detail.budget;

    const formattedData = {
      bmd_bgt_movement_detl_id: detail.bmd_bgt_movement_detl_id,
      new_fty_fund_type: sb?.fty_fund_type || "",
      new_oun_code2: sb?.oun_code || "",
      new_bdg_budget_id2: budget?.bdg_budget_id || null,
      qbu_quarter_id: budget?.quarter_budget ? `${budget.quarter_budget.qbu_year} - ${budget.quarter_budget.qbu_description}` : "",
      fty_fund_type: sb?.fund_type ? `${sb.fty_fund_type} - ${sb.fund_type.fty_fund_desc}` : "",
      at_activity_code: sb?.activity_type ? `${sb.at_activity_code} - ${sb.activity_type.at_activity_description_bm}` : "",
      oun_code: sb?.organization_unit ? `${sb.oun_code} - ${sb.organization_unit.oun_desc}` : "",
      ccr_costcentre: sb?.ccr_costcentre || "",
      sbg_budget_code: sb?.lkp_budget_code ? `${sb.lbc_budget_code} - ${sb.lkp_budget_code.lbc_description}` : "",
      bdg_balance_amt: budget?.bdg_balance_amt?.toString() || "0.00",
      bmd_mvt_amt: detail.bmd_mvt_amt?.toString() || "0.00",
      sbg_budget_id: detail.sbg_budget_id_to,
      bdg_budget_id: budget?.bdg_budget_id || null,
    };

    return {
      statusCode: 200,
      data: formattedData,
    };
  } catch (error) {
    console.error("Error fetching detail:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch detail",
      error: error.message,
    };
  }
});

