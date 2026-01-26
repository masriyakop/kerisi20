import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const statuses = await prisma.budget_allocation_master.findMany({
      where: {
        bam_status_cd: {
          not: null,
        },
      },
      select: {
        bam_status_cd: true,
      },
      distinct: ['bam_status_cd'],
      orderBy: {
        bam_status_cd: 'asc',
      },
    });

    return {
      statusCode: 200,
      message: "Statuses fetched successfully",
      data: statuses,
    };
  } catch (error) {
    console.error("Error fetching statuses:", error);
    return {
      statusCode: 500,
      message: "An error occurred while fetching statuses",
      error: error.message,
    };
  }
});
