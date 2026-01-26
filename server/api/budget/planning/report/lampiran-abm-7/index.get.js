import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);

    const page = parseInt(query.page) || 1;
    const pageSize = parseInt(query.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    const where = {
      bpm_status: {
        notIn: ['REJECT', 'CANCEL'],
      },
    };

    if (query.tf_region && query.tf_region !== 'null') {
      // Would need to join with organization_unit
    }
    if (query.tf_ptj && query.tf_ptj !== 'null') {
      where.bpm_oun_code = query.tf_ptj;
    }
    if (query.tf_status && query.tf_status !== 'null') {
      where.bpm_status = query.tf_status;
    }

    if (query.sm_oun_region && query.sm_oun_region !== 'null') {
      // Would need to join with organization_unit
    }
    if (query.sm_bpm_oun_code && query.sm_bpm_oun_code !== 'null') {
      where.bpm_oun_code = query.sm_bpm_oun_code;
    }

    const total = await prisma.budget_planning_master.count({ where });

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
      orderBy: { bpm_id: 'asc' },
    });

    const transformedData = data.map((item, index) => ({
      index: skip + index + 1,
      oun_parent: item.bpm_oun_code,
      oun_region: '', // Placeholder
      ccr_costcentre: '', // Placeholder
      oun: item.bpm_oun_code,
      oun_code: item.bpm_oun_code,
      oun_code_parent: item.bpm_oun_code,
      total_amt: item.budget_planning_details?.reduce((sum, detail) => sum + (parseFloat(detail.bpd_amt) || 0), 0) || 0,
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
    console.error("Error fetching Lampiran ABM 7 records:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch Lampiran ABM 7 records",
      error: error.message,
    };
  }
});

