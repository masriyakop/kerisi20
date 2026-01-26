import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const bam_id = parseInt(query.bam_id);
    const page = parseInt(query.page) || 1;
    const pageSize = parseInt(query.pageSize) || 5;
    const search = query.search || "";

    if (!bam_id) {
      return {
        statusCode: 400,
        message: "bam_id is required",
      };
    }

    // Build where clause
    const where = {
      bmm_budget_movement_id: bam_id,
      budget_movement_master: {
        bmm_trans_type: "INITIAL",
      },
    };

    // Get total count
    const total = await prisma.budget_movement_detl.count({
      where,
    });

    // Get details with pagination
    const details = await prisma.budget_movement_detl.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
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
      },
      orderBy: {
        bmd_bgt_movement_detl_id: 'asc',
      },
    });

    // Format data according to datatable requirements
    const formattedData = details.map((detail) => {
      const sb = detail.structure_budget_budget_movement_detl_sbg_budget_id_toTostructure_budget;
      return {
        ID: detail.bmd_bgt_movement_detl_id,
        BUDGET_ID: detail.sbg_budget_id_to,
        FUND: sb?.fund_type ? `${sb.fty_fund_type} - ${sb.fund_type.fty_fund_desc}` : "",
        ACTIVITY: sb?.activity_type ? `${sb.at_activity_code} - ${sb.activity_type.at_activity_description_bm}` : "",
        PTJ: sb?.organization_unit ? `${sb.oun_code} - ${sb.organization_unit.oun_desc}` : "",
        CCR: sb?.costcentre ? `${sb.ccr_costcentre} - ${sb.costcentre.ccr_costcentre_desc}` : "",
        BUDGET_CODE: sb?.lkp_budget_code ? `${sb.lbc_budget_code} - ${sb.lkp_budget_code.lbc_description}` : "",
        AMT: detail.bmd_mvt_amt ? parseFloat(detail.bmd_mvt_amt).toFixed(2) : "0.00",
        initial_amt: parseFloat(detail.bmd_mvt_amt) || 0,
        STAT: detail.bmd_mvt_status || "DRAFT",
      };
    });

    return {
      statusCode: 200,
      data: formattedData,
      meta: {
        total,
        page,
        pageSize,
      },
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

