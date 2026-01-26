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
    if (query.tf_oun_code && query.tf_oun_code !== 'null') {
      where.bpm_oun_code = query.tf_oun_code;
    }
    if (query.tf_year && query.tf_year !== 'null') {
      where.bpm_year = query.tf_year;
    }
    if (query.tf_status && query.tf_status !== 'null') {
      where.bpm_status = query.tf_status;
    }

    // Smart filters
    if (query.sm_bpm_type && query.sm_bpm_type !== 'null') {
      where.bpm_type = query.sm_bpm_type;
    }

    // Search keyword
    if (query.search) {
      where.OR = [
        { bpm_type: { contains: query.search, mode: 'insensitive' } },
        { bpm_remark: { contains: query.search, mode: 'insensitive' } },
        { bpm_oun_code: { contains: query.search, mode: 'insensitive' } },
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
        budget_planning_details: true,
      },
      orderBy: query.sortBy ? { [query.sortBy]: query.sortOrder || 'asc' } : { bpm_id: 'asc' },
    });

    // Transform data to match expected format
    const transformedData = data.map((item, index) => ({
      index: skip + index + 1,
      bpm_id: item.bpm_id,
      bpm_type: item.bpm_type,
      lde_description: '', // Will be populated from lookup_details if needed
      oun_code_parent: item.bpm_oun_code,
      bpm_remark: item.bpm_remark,
      bpm_total_amtsemasa: item.budget_planning_details?.reduce((sum, detail) => sum + (parseFloat(detail.bpd_amt) || 0), 0) || 0,
      Perjawatansemasa: 0, // Placeholder
      A: 0, // Placeholder for Year-1 Amount
      B: 0, // Placeholder for Year-1 Perjawatan
      C: 0, // Placeholder for Year-2 Amount
      D: 0, // Placeholder for Year-2 Perjawatan
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
    console.error("Error fetching ABM 4 records:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch ABM 4 records",
      error: error.message,
    };
  }
});

