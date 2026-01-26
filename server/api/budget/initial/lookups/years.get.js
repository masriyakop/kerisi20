import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const years = await prisma.quarter_budget.findMany({
      where: {
        qbu_year: {
          not: null,
        },
      },
      select: {
        qbu_year: true,
      },
      distinct: ['qbu_year'],
      orderBy: {
        qbu_year: 'desc',
      },
    });

    return {
      statusCode: 200,
      message: "Years fetched successfully",
      data: years,
    };
  } catch (error) {
    console.error("Error fetching years:", error);
    return {
      statusCode: 500,
      message: "An error occurred while fetching years",
      error: error.message,
    };
  }
});
