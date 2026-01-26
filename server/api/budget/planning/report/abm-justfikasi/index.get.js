import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);

    const page = parseInt(query.page) || 1;
    const pageSize = parseInt(query.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    // Build where clause for filtering
    const where = {
      bpm_type: {
        in: ['01', '03'],
      },
    };

    // Top filters
    if (query.tf_planningno && query.tf_planningno !== 'null') {
      where.bpm_planning_no = query.tf_planningno;
    }
    if (query.tf_year && query.tf_year !== 'null') {
      where.bpm_year = query.tf_year;
    }
    if (query.tf_fty_fund_type && query.tf_fty_fund_type !== 'null') {
      where.fty_fund_type = query.tf_fty_fund_type;
    }
    if (query.ft_bpm_oun_code && query.ft_bpm_oun_code !== 'null') {
      where.bpm_oun_code = query.ft_bpm_oun_code;
    }
    if (query.ft_bpm_ccr_costcentre && query.ft_bpm_ccr_costcentre !== 'null') {
      where.bpm_ccr_costcentre = query.ft_bpm_ccr_costcentre;
    }
    if (query.ft_at_activity_code && query.ft_at_activity_code !== 'null') {
      where.at_activity_code = query.ft_at_activity_code;
    }
    if (query.ft_lbc_budget_code && query.ft_lbc_budget_code !== 'null') {
      where.structure_budget = {
        lbc_budget_code: query.ft_lbc_budget_code,
      };
    }

    // Smart filters
    if (query.sm_bpm_planning_no && query.sm_bpm_planning_no !== 'null') {
      where.bpm_planning_no = query.sm_bpm_planning_no;
    }
    if (query.sm_bpm_type && query.sm_bpm_type !== 'null') {
      where.bpm_type = query.sm_bpm_type;
    }
    if (query.sm_bpm_status && query.sm_bpm_status !== 'null') {
      where.bpm_status = query.sm_bpm_status;
    }
    if (query.sm_bpm_oun_code && query.sm_bpm_oun_code !== 'null') {
      where.bpm_oun_code = query.sm_bpm_oun_code;
    }
    if (query.sm_bpm_ccr_costcentre && query.sm_bpm_ccr_costcentre !== 'null') {
      where.bpm_ccr_costcentre = query.sm_bpm_ccr_costcentre;
    }
    if (query.sm_at_activity_code && query.sm_at_activity_code !== 'null') {
      where.at_activity_code = query.sm_at_activity_code;
    }
    if (query.sm_budget_code && query.sm_budget_code !== 'null') {
      where.structure_budget = {
        ...where.structure_budget,
        lbc_budget_code: query.sm_budget_code,
      };
    }

    // Search keyword
    if (query.search) {
      where.OR = [
        { bpm_planning_no: { contains: query.search, mode: 'insensitive' } },
        { bpm_status: { contains: query.search, mode: 'insensitive' } },
        { bpm_oun_code: { contains: query.search, mode: 'insensitive' } },
        { fty_fund_type: { contains: query.search, mode: 'insensitive' } },
        { at_activity_code: { contains: query.search, mode: 'insensitive' } },
        { bpm_ccr_costcentre: { contains: query.search, mode: 'insensitive' } },
        { acm_acct_code: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    // Fetch budget planning masters
    // Note: For distinct bpm_id, we'll fetch more and filter in memory
    const allMasters = await prisma.budget_planning_master.findMany({
      where,
      include: {
        budget_planning_details: true,
        structure_budget: {
          include: {
            lkp_budget_code: true,
          },
        },
      },
      orderBy: {
        bpm_id: 'desc',
      },
    });

    // Get unique by bpm_id
    const uniqueMap = new Map();
    allMasters.forEach((master) => {
      if (!uniqueMap.has(master.bpm_id)) {
        uniqueMap.set(master.bpm_id, master);
      }
    });

    const uniqueMasters = Array.from(uniqueMap.values());
    const masters = uniqueMasters.slice(skip, skip + pageSize);

    // Get total count of unique bpm_id
    const total = uniqueMasters.length;

    // Get lookup details for types
    const typeLookups = await prisma.lookup_details.findMany({
      where: {
        lma_code_name: 'VOTTYPE',
        lde_status: 1,
      },
    });

    const lookupMap = {};
    typeLookups.forEach((lookup) => {
      lookupMap[lookup.lde_value] = lookup.lde_description;
    });

    // Format the response
    const formattedData = masters.map((item, index) => {
      const sumAmt = item.budget_planning_details.reduce((sum, detail) => {
        return sum + (parseFloat(detail.bpd_amt) || 0);
      }, 0);

      const typeDesc = lookupMap[item.bpm_type] 
        ? `${item.bpm_type} - ${lookupMap[item.bpm_type]}`
        : item.bpm_type || '';

      return {
        No: skip + index + 1,
        "Application No": item.bpm_planning_no || '',
        Type: typeDesc,
        PTJ: item.bpm_oun_code || '',
        "Cost Center": item.bpm_ccr_costcentre || '',
        Activity: item.at_activity_code || '',
        "Budget Code": item.structure_budget?.lkp_budget_code?.lbc_budget_code || '',
        Status: item.bpm_status || '',
        "Amount (RM)": sumAmt,
        Action: "",
        // Keep original data for actions
        bpm_id: item.bpm_id,
        url_view: `/budget/planning/report/abm-justfikasi/view/${item.bpm_id}`,
      };
    });

    return {
      statusCode: 200,
      data: formattedData,
      meta: {
        total,
        page,
        pageSize,
        lastPage: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    console.error("Error fetching ABM Justfikasi records:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch ABM Justfikasi records",
      error: error.message,
    };
  }
});

