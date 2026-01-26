import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const fundTypes = await prisma.fund_type.findMany({
      where: {
        fty_status: 1,
      },
      orderBy: {
        fty_fund_type: 'asc',
      },
    });

    return {
      statusCode: 200,
      data: fundTypes,
    };
  } catch (error) {
    console.error("Error fetching fund types:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch fund types",
      error: error.message,
    };
  }
});

