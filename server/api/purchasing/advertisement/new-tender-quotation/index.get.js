import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    let whereClause = {};

    if (query.search) {
      const searchTerm = query.search.trim();
      whereClause.OR = [
        { jsc_jobscope_code: { contains: searchTerm } },
        { jsc_category: { contains: searchTerm } },
        { jsc_logic: { contains: searchTerm } },
      ];
    }

    const jobscopes = await prisma.jobscope.findMany({
      where: whereClause,
      orderBy: {
        jsc_jobscope_id: 'desc',
      },
    });

    const data = jobscopes.map((jobscope) => {
      return {
        jsc_jobscope_id: jobscope.jsc_jobscope_id,
        jsc_jobscope_code: jobscope.jsc_jobscope_code || '',
        jsc_category: jobscope.jsc_category || '',
        jsc_logic: jobscope.jsc_logic || '',
        urlEdit: `/purchasing/advertisement/new-tender-quotation/edit/${jobscope.jsc_jobscope_id}`,
      };
    });

    return {
      statusCode: 200,
      message: "Jobscope list fetched successfully",
      data: data,
    };
  } catch (error) {
    console.error("Error fetching jobscope list:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch jobscope list",
      error: error.message,
    };
  }
});
