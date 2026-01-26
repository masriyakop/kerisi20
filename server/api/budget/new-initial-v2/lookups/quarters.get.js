import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const year = query.year;

    const where = {
      qbu_status: 1,
    };

    if (year) {
      where.qbu_year = year;
    }

    const quarters = await prisma.quarter_budget.findMany({
      where,
      select: {
        qbu_quarter_id: true,
        qbu_year: true,
        qbu_description: true,
      },
      orderBy: {
        qbu_quarter_id: 'asc',
      },
    });

    const formattedQuarters = quarters.map((item) => ({
      id: item.qbu_quarter_id,
      text: `${item.qbu_year} - ${item.qbu_description}`,
    }));

    return {
      statusCode: 200,
      data: formattedQuarters,
    };
  } catch (error) {
    console.error("Error fetching quarters:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch quarters",
      error: error.message,
    };
  }
});

