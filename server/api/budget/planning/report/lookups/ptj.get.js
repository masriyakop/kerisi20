import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const organizationUnits = await prisma.organization_unit.findMany({
      where: {
        oun_level: 3,
      },
      orderBy: {
        oun_code: 'asc',
      },
    });

    const formattedData = organizationUnits.map((item) => ({
      label: `${item.oun_code} - ${item.oun_desc || ''}`,
      value: item.oun_code,
    }));

    return {
      statusCode: 200,
      message: "PTJ options fetched successfully",
      data: formattedData,
    };
  } catch (error) {
    console.error("Error fetching PTJ options:", error);
    return {
      statusCode: 500,
      message: "An error occurred while fetching PTJ options",
      error: error.message,
    };
  }
});

