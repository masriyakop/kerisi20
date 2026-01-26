import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    // Fetch fund types where fty_basis is not 'ALLOCATION BASIS'
    const fundTypes = await prisma.fund_type.findMany({
      where: {
        NOT: {
          fty_basis: 'ALLOCATION BASIS',
        },
      },
      orderBy: {
        fty_fund_type: 'asc',
      },
    });

    // Format the response for dropdown options
    const formattedData = fundTypes.map((item) => ({
      label: `${item.fty_fund_type} - ${item.fty_fund_desc || ''}`,
      value: item.fty_fund_type,
    }));

    return {
      statusCode: 200,
      message: "Fund types fetched successfully",
      data: formattedData,
    };
  } catch (error) {
    console.error("Error fetching fund types:", error);
    return {
      statusCode: 500,
      message: "An error occurred while fetching fund types",
      error: error.message,
    };
  }
});

