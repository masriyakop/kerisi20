import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const statuses = await prisma.budget_planning_master.findMany({
      where: {
        AND: [
          {
            bpm_status: {
              not: null,
            },
          },
          {
            bpm_status: {
              not: 'REJECT',
            },
          },
        ],
      },
      select: {
        bpm_status: true,
      },
      distinct: ['bpm_status'],
      orderBy: {
        bpm_status: 'desc',
      },
    });

    return {
      statusCode: 200,
      data: statuses,
    };
  } catch (error) {
    console.error("Error fetching status options:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch status options",
      error: error.message,
    };
  }
});

