import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const bad_detl_id = parseInt(query.bad_detl_id);

    if (!bad_detl_id) {
      return {
        statusCode: 400,
        message: "bad_detl_id is required",
      };
    }

    const detail = await prisma.budget_movement_detl.findUnique({
      where: {
        bmd_bgt_movement_detl_id: bad_detl_id,
      },
      include: {
        structure_budget_budget_movement_detl_sbg_budget_id_toTostructure_budget: {
          include: {
            fund_type: true,
            activity_type: true,
            organization_unit: true,
            costcentre: true,
            lkp_budget_code: true,
          },
        },
        budget_movement_master: true,
      },
    });

    if (!detail) {
      return {
        statusCode: 404,
        message: "Detail not found",
      };
    }

    const sb = detail.structure_budget_budget_movement_detl_sbg_budget_id_toTostructure_budget;

    return {
      statusCode: 200,
      data: {
        BUDGET_ID: detail.sbg_budget_id_to,
        FUND: sb?.fund_type ? `${sb.fty_fund_type} - ${sb.fund_type.fty_fund_desc}` : "",
        ACTIVITY: sb?.activity_type ? `${sb.at_activity_code} - ${sb.activity_type.at_activity_description_bm}` : "",
        PTJ: sb?.organization_unit ? `${sb.oun_code} - ${sb.organization_unit.oun_desc}` : "",
        CCR: sb?.costcentre ? `${sb.ccr_costcentre} - ${sb.costcentre.ccr_costcentre_desc}` : "",
        KODSO: sb?.kod_so || "",
        BUDGETCODE: sb?.lkp_budget_code ? `${sb.lbc_budget_code} - ${sb.lkp_budget_code.lbc_description}` : "",
        AMT: detail.bmd_mvt_amt ? parseFloat(detail.bmd_mvt_amt).toFixed(2) : "0.00",
        initial_amt: parseFloat(detail.bmd_mvt_amt) || 0,
        STAT: detail.budget_movement_master?.bmm_status || "DRAFT",
      },
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

