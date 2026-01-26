import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const quarters = await prisma.quarter_budget.findMany({
      where: {
        qbu_year: {
          not: null,
        },
      },
      orderBy: {
        qbu_quarter_id: 'asc',
      },
    });

    return {
      statusCode: 200,
      message: "Quarters fetched successfully",
      data: quarters,
    };
  } catch (error) {
    console.error("Error fetching quarters:", error);
    return {
      statusCode: 500,
      message: "An error occurred while fetching quarters",
      error: error.message,
    };
  }
});
