import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    // Fetch distinct groups from lookup_details where lma_code_name = 'ITEM_CATEGORY'
    const groups = await prisma.lookup_details.findMany({
      where: {
        lma_code_name: 'ITEM_CATEGORY',
      },
      select: {
        lde_group: true,
      },
      distinct: ['lde_group'],
      orderBy: {
        lde_group: 'asc',
      },
    });
    
    // Format as options for dropdown
    const options = groups
      .filter(item => item.lde_group)
      .map(item => ({
        label: item.lde_group,
        value: item.lde_group,
      }));
    
    return {
      statusCode: 200,
      message: "Group lookup options fetched successfully",
      data: options,
    };
  } catch (error) {
    console.error("Error fetching group lookup options:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch group lookup options",
      error: error.message,
    };
  }
});
