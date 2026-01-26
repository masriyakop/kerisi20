import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const page = parseInt(query.page) || 1;
    const pageSize = parseInt(query.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    const where = {};

    if (query.year && query.year !== 'null') {
      // Would need to join with budget
    }
    if (query.Fund && query.Fund !== 'null') {
      // Would need to join with structure_budget
    }
    if (query.date_from && query.date_from !== 'null') {
      // Would need to join with budget_transaction
    }
    if (query.date_to && query.date_to !== 'null') {
      // Would need to join with budget_transaction
    }
    if (query.tf_activity_group && query.tf_activity_group !== 'null') {
      // Would need to join with activity_type
    }
    if (query.tf_activity_subgroup && query.tf_activity_subgroup !== 'null') {
      // Would need to join with activity_type
    }

    // Placeholder - using structure_budget as base
    const total = await prisma.structure_budget.count({ where });

    const data = await prisma.structure_budget.findMany({
      where,
      skip,
      take: pageSize,
      include: {
        lkp_budget_code: true,
        activity_type: true,
      },
      orderBy: { sbg_budget_id: 'asc' },
    });

    const transformedData = data.map((item, index) => ({
      index: skip + index + 1,
      at_activity_code: item.at_activity_code || '',
      at_activity_description_bm: item.activity_type?.at_activity_description_bm || '',
      lbc_budget_code: item.lbc_budget_code || '',
      lbc_description: item.lkp_budget_code?.lbc_description || '',
      peruntukan: 0,
      lck: 0,
      request: 0,
      commitment: 0,
      Belanja: 0,
      Jumlah_Perbelanjaan: 0,
      Baki_Peruntukan: 0,
    }));

    return {
      statusCode: 200,
      data: transformedData,
      meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
    };
  } catch (error) {
    console.error("Error fetching Allocation, Expenditure & Balance of Allocation by Budget Code:", error);
    return { statusCode: 500, message: "Failed to fetch report", error: error.message };
  }
});

