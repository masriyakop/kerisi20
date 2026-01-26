import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    // This is a report page
    const where = {};
    
    if (query.tf_year) {
      where.sby_year = query.tf_year;
    }
    if (query.tf_fund) {
      where.fty_fund_type = query.tf_fund;
    }
    if (query.tf_account) {
      // Would need to join with account_main
    }

    const page = parseInt(query.page) || 1;
    const pageSize = parseInt(query.pageSize) || 5;
    const skip = (page - 1) * pageSize;

    // For report, we'll use structure_budget as base
    const [structures, total] = await Promise.all([
      prisma.structure_budget.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: {
          sbg_budget_id: 'desc',
        },
      }),
      prisma.structure_budget.count({ where }),
    ]);

    // Format report data
    const formattedData = structures.map((item, index) => ({
      fund: item.fty_fund_type,
      activity: item.at_activity_code || '',
      costcentre: item.ccr_costcentre || '',
      account_siries: '',
      account: item.lbc_budget_code,
      glacct_code: '',
      opening: '0',
      initial: '0',
      additional: '0',
      virement: '0',
      topup: '0',
      allocated: '0',
      locked: '0',
      pre_request: '0',
      request: '0',
      commit: '0',
      expenses: '0',
      balance: '0',
      expenses_percentage: '0',
      no: skip + index + 1,
    }));

    return {
      statusCode: 200,
      message: "Laporan Belanjawan data fetched successfully",
      data: formattedData,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    console.error("Error fetching laporan belanjawan:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    };
  }
});

