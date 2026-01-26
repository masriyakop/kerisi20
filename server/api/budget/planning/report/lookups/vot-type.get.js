import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const lookupDetails = await prisma.lookup_details.findMany({
      where: {
        lma_code_name: 'VOTTYPE',
        lde_status: 1,
      },
      orderBy: {
        lde_value: 'asc',
      },
    });

    const formattedData = lookupDetails.map((item) => ({
      label: `${item.lde_value} - ${item.lde_description || ''}`,
      value: item.lde_value,
    }));

    return {
      statusCode: 200,
      message: "VOT Type options fetched successfully",
      data: formattedData,
    };
  } catch (error) {
    console.error("Error fetching VOT Type options:", error);
    return {
      statusCode: 500,
      message: "An error occurred while fetching VOT Type options",
      error: error.message,
    };
  }
});

