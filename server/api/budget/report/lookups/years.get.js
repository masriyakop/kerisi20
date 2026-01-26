import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const years = await prisma.budget.findMany({
      select: {
        bdg_year: true,
      },
      distinct: ['bdg_year'],
      orderBy: {
        bdg_year: 'desc',
      },
    });

    return {
      statusCode: 200,
      data: years,
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

