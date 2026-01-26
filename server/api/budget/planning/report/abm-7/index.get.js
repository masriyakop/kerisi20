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
    };

    // Top filters
    if (query.tf_year && query.tf_year !== 'null') {
      where.bpm_year = query.tf_year;
    }
    if (query.tf_ptj && query.tf_ptj !== 'null') {
      where.bpm_oun_code = query.tf_ptj;
    }
    if (query.tf_dasar && query.tf_dasar !== 'null') {
      where.bpm_type = query.tf_dasar;
    }
    if (query.tf_status && query.tf_status !== 'null') {
      where.bpm_status = query.tf_status;
    }

    // Smart filters
    if (query.sm_oun_region && query.sm_oun_region !== 'null') {
      // This would require joining with organization_unit
    }
    if (query.sm_bpm_type && query.sm_bpm_type !== 'null') {
      where.bpm_type = query.sm_bpm_type;
    }
    if (query.sm_bpm_status && query.sm_bpm_status !== 'null') {
      where.bpm_status = query.sm_bpm_status;
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
            oun_code: true,
          },
        },
      },
      orderBy: query.sortBy ? { [query.sortBy]: query.sortOrder || 'asc' } : { bpm_id: 'asc' },
    });

    // Transform data to match expected format
    const transformedData = data.map((item, index) => ({
      index: skip + index + 1,
      oun_code: item.bpm_oun_code,
      oun: item.bpm_oun_code, // Placeholder - would need to join with organization_unit
      bpm_type: item.bpm_type,
      bpm_total_amt: item.budget_planning_details?.reduce((sum, detail) => sum + (parseFloat(detail.bpd_amt) || 0), 0) || 0,
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
    console.error("Error fetching ABM 7 records:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch ABM 7 records",
      error: error.message,
    };
  }
});

