import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const ptjs = await prisma.organization_unit.findMany({
      where: {
        oun_status: 1,
      },
      orderBy: {
        oun_code: 'asc',
      },
    });

    return {
      statusCode: 200,
      data: ptjs,
    };
  } catch (error) {
    console.error("Error fetching PTJs:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch PTJs",
      error: error.message,
    };
  }
});

