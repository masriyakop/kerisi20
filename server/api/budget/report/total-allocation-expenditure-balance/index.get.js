import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    // This is a report page, so we'll return summary data
    // In a real implementation, this would join multiple tables
    const where = {};
    
    if (query.bdg_year) {
      where.sby_year = query.bdg_year;
    }
    if (query.Fund) {
      where.fty_fund_type = query.Fund;
    }
    if (query.Activity) {
      where.at_activity_code = query.Activity;
    }
    if (query.oun_code) {
      where.oun_code = query.oun_code;
    }
    if (query.Cost_Center) {
      where.ccr_costcentre = query.Cost_Center;
    }

    const page = parseInt(query.page) || 1;
    const pageSize = parseInt(query.pageSize) || 10;
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
      lbc_budget_code: item.lbc_budget_code,
      lbc_description: '',
      fty_fund_type: item.fty_fund_type,
      oun_code: item.oun_code || '',
      ccr_costcentre: item.ccr_costcentre || '',
      at_activity_code: item.at_activity_code || '',
      opening: '0',
      allocated: '0',
      commits: '0',
      expenses: '0',
      total_expenses: '0',
      balance: '0',
      no: skip + index + 1,
    }));

    return {
      statusCode: 200,
      message: "Report data fetched successfully",
      data: formattedData,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    console.error("Error fetching report data:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    };
  }
});

