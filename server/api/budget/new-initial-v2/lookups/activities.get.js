import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const activities = await prisma.activity_type.findMany({
      where: {
        at_status: 1,
      },
      orderBy: {
        at_activity_code: 'asc',
      },
    });

    return {
      statusCode: 200,
      data: activities,
    };
  } catch (error) {
    console.error("Error fetching activities:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch activities",
      error: error.message,
    };
  }
});

