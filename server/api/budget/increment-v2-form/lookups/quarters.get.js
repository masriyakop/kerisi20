import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const quarters = await prisma.quarter_budget.findMany({
      orderBy: [
        { qbu_year: 'desc' },
        { qbu_quarter_id: 'asc' },
      ],
    });

    return {
      statusCode: 200,
      data: quarters,
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

