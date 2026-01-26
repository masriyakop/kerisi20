import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    if (!query.isc_category_code) {
      return {
        statusCode: 400,
        message: "isc_category_code is required",
        data: [],
      };
    }
    
    // Build where clause
    const where = {
      isc_category_code: query.isc_category_code,
    };
    
    // Search filter
    if (query.search && query.search.trim() !== '') {
      const searchTerm = query.search.trim();
      const searchNum = parseInt(searchTerm);
      
      where.OR = [
        ...(isNaN(searchNum) ? [] : [{ isc_subcategory_id: searchNum }]),
        { isc_subcategory_code: { contains: searchTerm } },
        { isc_subcategory_desc: { contains: searchTerm } },
        { isc_status: { contains: searchTerm } },
      ];
    }
    
    // Fetch item subcategories
    const subcategories = await prisma.item_subcategory.findMany({
      where,
      select: {
        isc_subcategory_id: true,
        isc_subcategory_code: true,
        isc_subcategory_desc: true,
        isc_category_code: true,
        isc_status: true,
      },
      orderBy: {
        isc_subcategory_code: 'asc',
      },
    });
    
    // Format the response
    const formattedData = subcategories.map((item) => ({
      isc_subcategory_id: item.isc_subcategory_id,
      isc_subcategory_code: item.isc_subcategory_code || '',
      isc_subcategory_desc: item.isc_subcategory_desc || '',
      isc_category_code: item.isc_category_code || '',
      isc_status: item.isc_status === '1' ? 'ACTIVE' : 'INACTIVE',
    }));
    
    return {
      statusCode: 200,
      message: "Item subcategories fetched successfully",
      data: formattedData,
    };
  } catch (error) {
    console.error("Error fetching item subcategories:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch item subcategories",
      error: error.message,
    };
  }
});
