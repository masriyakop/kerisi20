import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const costCentres = await prisma.costcentre.findMany({
      orderBy: {
        ccr_costcentre: 'asc',
      },
    });

    return {
      statusCode: 200,
      data: costCentres,
    };
  } catch (error) {
    console.error("Error fetching cost centres:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch cost centres",
      error: error.message,
    };
  }
});

