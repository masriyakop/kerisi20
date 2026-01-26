import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const fundTypes = await prisma.fund_type.findMany({
      orderBy: {
        fty_fund_type: 'asc',
      },
    });

    const formattedData = fundTypes.map((item) => ({
      label: `${item.fty_fund_type} - ${item.fty_fund_desc || ''}`,
      value: item.fty_fund_type,
    }));

    return {
      statusCode: 200,
      message: "Fund Type options fetched successfully",
      data: formattedData,
    };
  } catch (error) {
    console.error("Error fetching Fund Type options:", error);
    return {
      statusCode: 500,
      message: "An error occurred while fetching Fund Type options",
      error: error.message,
    };
  }
});

