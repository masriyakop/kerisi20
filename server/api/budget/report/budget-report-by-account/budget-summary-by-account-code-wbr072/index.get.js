import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const page = parseInt(query.page) || 1;
    const pageSize = parseInt(query.pageSize) || 5;
    const skip = (page - 1) * pageSize;

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

    // Placeholder - using lkp_budget_code as base
    const total = await prisma.lkp_budget_code.count({ where });

    const data = await prisma.lkp_budget_code.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { lbc_id: 'asc' },
    });

    const transformedData = data.map((item, index) => ({
      index: skip + index + 1,
      acct_code: item.lbc_budget_code || '',
      PTJ: '', // Placeholder
      opening: 0,
      initial: 0,
      virement: 0,
      additional: 0,
      allocated: 0,
      locked: 0,
      request: 0,
      pre_request: 0,
      commit: 0,
      expenses: 0,
      balance: 0,
    }));

    return {
      statusCode: 200,
      data: transformedData,
      meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
    };
  } catch (error) {
    console.error("Error fetching Budget Summary By Account Code:", error);
    return { statusCode: 500, message: "Failed to fetch Budget Summary By Account Code", error: error.message };
  }
});

