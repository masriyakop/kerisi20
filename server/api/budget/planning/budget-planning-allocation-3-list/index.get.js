import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    const where = {
      bpm_type: 'ALLOCATION 3',
    };
    
    if (query.search) {
      where.OR = [
        { bpm_planning_no: { contains: query.search } },
        { bpm_year: { contains: query.search } },
        { bpm_remark: { contains: query.search } },
      ];
    }

    const page = parseInt(query.page) || 1;
    const pageSize = parseInt(query.pageSize) || 5;
    const skip = (page - 1) * pageSize;

    const [plannings, total] = await Promise.all([
      prisma.budget_planning_master.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: {
          bpm_id: 'desc',
        },
      }),
      prisma.budget_planning_master.count({ where }),
    ]);

    const formattedData = plannings.map((item, index) => ({
      bpm_id: item.bpm_id.toString(),
      bpm_planning_no: item.bpm_planning_no || '',
      bpm_year: item.bpm_year,
      bpm_oun_code: item.bpm_oun_code || '',
      bpm_ccr_costcentre: item.bpm_ccr_costcentre || '',
      ccr_costcentre_desc: '',
      bpm_remark: item.bpm_remark || '',
      bpm_total_amt: item.bpm_total_amt?.toString() || '0',
      bpm_status: item.bpm_status,
      bdg_year: item.bdg_year || '',
      duplicate_count: item.duplicate_count || 0,
      no: skip + index + 1,
    }));

    return {
      statusCode: 200,
      message: "Budget planning allocation 3 list fetched successfully",
      data: formattedData,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    console.error("Error fetching budget planning allocation 3:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    };
  }
});

