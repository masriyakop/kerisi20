import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);

    const page = parseInt(query.page) || 1;
    const pageSize = parseInt(query.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    const where = {};

    if (query.Reference && query.Reference !== 'null') {
      // Would need to join with budget_allocation_master
    }
    if (query.Year && query.Year !== 'null') {
      // Would need to join with quarter_budget
    }
    if (query.Quarter && query.Quarter !== 'null') {
      // Would need to join with quarter_budget
    }
    if (query.PTJ && query.PTJ !== 'null') {
      // Would need to join with budget_allocation_detl
    }

    // Using budget_allocation_master as placeholder
    const total = await prisma.budget_allocation_master.count({ where });

    const data = await prisma.budget_allocation_master.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { bam_id: 'asc' },
    });

    const transformedData = data.map((item, index) => ({
      index: skip + index + 1,
      ID: item.bam_id,
      PTJ: '', // Placeholder
      YEARS: '', // Placeholder
      DESCR: '', // Placeholder
      ALLOCATE_NO: item.bam_allocation_no || '',
      ENDORSE: '', // Placeholder
      AMT: parseFloat(item.bam_total_amt) || 0,
      STAT: '', // Placeholder
    }));

    return {
      statusCode: 200,
      data: transformedData,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    console.error("Error fetching Warrant Initial records:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch Warrant Initial records",
      error: error.message,
    };
  }
});

