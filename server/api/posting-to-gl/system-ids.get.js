import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    // Get distinct system IDs from posting_master
    const systemIds = await prisma.posting_master.findMany({
      where: {
        pmt_system_id: {
          not: null,
        },
      },
      select: {
        pmt_system_id: true,
      },
      distinct: ['pmt_system_id'],
      orderBy: {
        pmt_system_id: 'asc',
      },
    });

    // Format as options for dropdown
    const options = systemIds
      .filter(item => item.pmt_system_id)
      .map(item => ({
        label: item.pmt_system_id,
        value: item.pmt_system_id,
      }));

    return {
      statusCode: 200,
      message: "System IDs fetched successfully",
      data: options,
    };
  } catch (error) {
    console.error("Error fetching system IDs:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    };
  }
});
