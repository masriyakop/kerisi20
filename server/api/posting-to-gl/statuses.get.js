import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    // Get distinct statuses from posting_master
    const statuses = await prisma.posting_master.findMany({
      where: {
        pmt_status: {
          not: null,
        },
      },
      select: {
        pmt_status: true,
      },
      distinct: ['pmt_status'],
      orderBy: {
        pmt_status: 'asc',
      },
    });

    // Format as options for dropdown
    const options = statuses
      .filter(item => item.pmt_status)
      .map(item => ({
        label: item.pmt_status,
        value: item.pmt_status,
      }));

    return {
      statusCode: 200,
      message: "Statuses fetched successfully",
      data: options,
    };
  } catch (error) {
    console.error("Error fetching statuses:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    };
  }
});
