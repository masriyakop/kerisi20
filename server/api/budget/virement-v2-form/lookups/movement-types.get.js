import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const lookupDetails = await prisma.lookup_details.findMany({
      where: {
        lma_code_name: 'VIREMENT_TYPE',
        lde_status: 1,
      },
      orderBy: {
        lde_value: 'asc',
      },
    });

    return {
      statusCode: 200,
      data: lookupDetails,
    };
  } catch (error) {
    console.error("Error fetching movement types:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch movement types",
      error: error.message,
    };
  }
});

