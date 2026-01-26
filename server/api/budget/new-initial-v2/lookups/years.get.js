import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const years = await prisma.quarter_budget.findMany({
      select: {
        qbu_year: true,
      },
      distinct: ['qbu_year'],
      orderBy: {
        qbu_year: 'asc',
      },
    });

    const formattedYears = years.map((item) => ({
      FLC_ID: item.qbu_year,
      FLC_NAME: item.qbu_year,
    }));

    return {
      statusCode: 200,
      data: formattedYears,
    };
  } catch (error) {
    console.error("Error fetching years:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch years",
      error: error.message,
    };
  }
});

