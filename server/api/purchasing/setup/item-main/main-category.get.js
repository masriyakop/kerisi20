import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    // Build where clause
    const where = {
      lma_code_name: 'ITEM_CATEGORY',
      lde_group: query.grouplookup || 'PO', // Default to 'PO' if not provided
    };
    
    // Search filter
    if (query.search && query.search.trim() !== '') {
      const searchTerm = query.search.trim();
      const searchNum = parseInt(searchTerm);
      
      where.OR = [
        ...(isNaN(searchNum) ? [] : [{ lde_id: searchNum }]),
        { lde_value: { contains: searchTerm } },
        { lde_description: { contains: searchTerm } },
        { lde_status: { contains: searchTerm } },
      ];
    }
    
    // Fetch main categories from lookup_details
    const mainCategories = await prisma.lookup_details.findMany({
      where,
      select: {
        lde_id: true,
        lde_value: true,
        lde_description: true,
        lde_status: true,
      },
      orderBy: {
        lde_value: 'asc',
      },
    });
    
    // Format the response
    const formattedData = mainCategories.map((item) => ({
      lde_id: item.lde_id,
      lde_value: item.lde_value || '',
      lde_description: item.lde_description || '',
      lde_status: item.lde_status === '1' ? 'ACTIVE' : 'INACTIVE',
    }));
    
    return {
      statusCode: 200,
      message: "Main categories fetched successfully",
      data: formattedData,
    };
  } catch (error) {
    console.error("Error fetching main categories:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch main categories",
      error: error.message,
    };
  }
});
