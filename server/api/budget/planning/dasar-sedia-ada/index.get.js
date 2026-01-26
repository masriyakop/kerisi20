import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    const where = {};
    
    if (query.bpm_planning_no) {
      where.bpm_planning_no = { contains: query.bpm_planning_no };
    }
    if (query.bpm_year) {
      where.bpm_year = query.bpm_year;
    }
    if (query.bpm_oun_code) {
      where.bpm_oun_code = query.bpm_oun_code;
    }
    if (query.bpm_ccr_costcentre) {
      where.bpm_ccr_costcentre = query.bpm_ccr_costcentre;
    }
    if (query.bpm_status) {
      where.bpm_status = query.bpm_status;
    }
    if (query.search) {
      where.OR = [
        { bpm_planning_no: { contains: query.search } },
        { bpm_year: { contains: query.search } },
        { bpm_oun_code: { contains: query.search } },
        { bpm_remark: { contains: query.search } },
      ];
    }
    
    // Filter by type YEARLY or '02'
    where.bpm_type = { in: ['YEARLY', '02'] };

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
      message: "Budget plannings fetched successfully",
      data: formattedData,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    console.error("Error fetching budget plannings:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    };
  }
});

