import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const page = parseInt(query.page) || 1;
    const pageSize = parseInt(query.pageSize) || 5;
    const skip = (page - 1) * pageSize;

    // Simplified query - would need complex joins in production
    const where = {};

    if (query.year && query.year !== 'null') {
      // Would need to join with budget
    }
    if (query.fundType && query.fundType !== 'null') {
      // Would need to join with structure_budget
    }
    if (query.ptj && query.ptj !== 'null') {
      // Would need to join with structure_budget
    }

    // Placeholder - using structure_budget as base
    const total = await prisma.structure_budget.count({ where });

    const data = await prisma.structure_budget.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { sbg_budget_id: 'asc' },
    });

    const transformedData = data.map((item, index) => ({
      index: skip + index + 1,
      fty_fund_type: item.fty_fund_type || '',
      oun_code: item.oun_code || '',
      ccr_costcentre: item.ccr_costcentre || '',
      at_activity_code: item.at_activity_code || '',
      at_activity_description_bm: '', // Placeholder
      lbc_budget_code: item.lbc_budget_code || '',
      lbc_description: '', // Placeholder
      opening: 0,
      initial: 0,
      virement: 0,
      additional: 0,
      topup: 0,
      allocated: 0,
      pre_request: 0,
      request: 0,
      commit: 0,
      locked: 0,
      expenses: 0,
      balance: 0,
      expenses_percentage: 0,
    }));

    return {
      statusCode: 200,
      data: transformedData,
      meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
    };
  } catch (error) {
    console.error("Error fetching Variation Report:", error);
    return { statusCode: 500, message: "Failed to fetch Variation Report", error: error.message };
  }
});

