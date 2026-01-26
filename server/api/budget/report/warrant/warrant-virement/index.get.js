import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const page = parseInt(query.page) || 1;
    const pageSize = parseInt(query.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    const where = {};

    if (query.Reference && query.Reference !== 'null') {
      where.bmm_budget_movement_no = query.Reference;
    }
    if (query.Year && query.Year !== 'null') {
      where.bmm_year = query.Year;
    }
    if (query.PTJ && query.PTJ !== 'null') {
      // Would need to join with structure_budget
    }

    const total = await prisma.budget_movement_master.count({ where });

    const data = await prisma.budget_movement_master.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { bmm_budget_movement_id: 'asc' },
    });

    const transformedData = data.map((item, index) => ({
      index: skip + index + 1,
      bmm_budget_movement_id: item.bmm_budget_movement_id,
      bmm_year: item.bmm_year,
      bmm_budget_movement_no: item.bmm_budget_movement_no,
      oun_code: '',
      bmm_endorse_doc: item.bmm_endorse_doc || '',
      bmm_reason: item.bmm_reason || '',
      bmm_total_amt: parseFloat(item.bmm_total_amt) || 0,
      bmm_status: item.bmm_status || '',
    }));

    return {
      statusCode: 200,
      data: transformedData,
      meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
    };
  } catch (error) {
    console.error("Error fetching Warrant Virement records:", error);
    return { statusCode: 500, message: "Failed to fetch Warrant Virement records", error: error.message };
  }
});

