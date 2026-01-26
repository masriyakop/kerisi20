import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);

    const page = parseInt(query.page) || 1;
    const pageSize = parseInt(query.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    // Build where clause for filtering
    const where = {
      bpm_status: {
        notIn: ['CANCEL', 'REJECT'],
      },
      bpm_type: {
        not: '02',
      },
    };

    // Top filters
    if (query.tf_planningno && query.tf_planningno !== 'null') {
      where.bpm_planning_no = query.tf_planningno;
    }
    if (query.tf_year && query.tf_year !== 'null') {
      where.bpm_year = query.tf_year;
    }
    if (query.tf_status && query.tf_status !== 'null') {
      where.bpm_status = query.tf_status;
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

    // Search keyword
    if (query.search) {
      where.OR = [
        { bpm_planning_no: { contains: query.search, mode: 'insensitive' } },
        { bpm_type: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    // Get total count
    const total = await prisma.budget_planning_master.count({ where });

    // Fetch data with pagination
    const data = await prisma.budget_planning_master.findMany({
      where,
      skip,
      take: pageSize,
      include: {
        budget_planning_details: {
          select: {
            bpd_amt: true,
          },
        },
      },
      orderBy: query.sortBy ? { [query.sortBy]: query.sortOrder || 'asc' } : { bpm_id: 'asc' },
    });

    // Transform data to match expected format
    const transformedData = data.map((item, index) => ({
      index: skip + index + 1,
      bpm_planning_no: item.bpm_planning_no,
      bpm_id: item.bpm_id,
      bpm_type: item.bpm_type,
      bpd_amt: item.budget_planning_details?.reduce((sum, detail) => sum + (parseFloat(detail.bpd_amt) || 0), 0) || 0,
      url_view: `/budget/planning/view/${item.bpm_id}`,
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
    console.error("Error fetching ABM 5 records:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch ABM 5 records",
      error: error.message,
    };
  }
});

