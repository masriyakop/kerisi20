import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    // Build where clause for filtering
    const where = {
      lma_code_name: 'ACCOUNT_ACTIVITY', // Account Activity lookup code
    };
    
    // Search filter
    if (query.search && query.search.trim() !== '') {
      const searchTerm = query.search.trim();
      where.OR = [
        { lde_value: { contains: searchTerm } },
        { lde_description: { contains: searchTerm } },
        { lde_description2: { contains: searchTerm } },
      ];
    }
    
    // Smart filter for status
    if (query.lde_status) {
      // Convert ACTIVE/INACTIVE to 1/0
      const statusValue = query.lde_status === 'ACTIVE' ? '1' : 
                         query.lde_status === 'INACTIVE' ? '0' : 
                         query.lde_status;
      where.lde_status = statusValue;
    }

    // Fetch account activities from database
    const activities = await prisma.lookup_details.findMany({
      where,
      orderBy: {
        lde_sorting: 'asc',
      },
    });

    // Format the response
    const formattedData = activities.map((item, index) => ({
      no: index + 1,
      lde_value: item.lde_value,
      lde_description: item.lde_description,
      lde_description2: item.lde_description2 || '',
      lde_status: item.lde_status === '1' || item.lde_status === 1 ? 'ACTIVE' : 'INACTIVE',
      lde_id: item.lde_id,
      lde_sorting: item.lde_sorting,
    }));

    return {
      statusCode: 200,
      message: "Account activities fetched successfully",
      data: formattedData,
    };
  } catch (error) {
    console.error("Error fetching account activities:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    };
  }
});
