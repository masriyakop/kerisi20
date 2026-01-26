import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    if (!query.iss_category_code || !query.isc_subcategory_code) {
      return {
        statusCode: 400,
        message: "iss_category_code and isc_subcategory_code are required",
        data: [],
      };
    }
    
    // Build where clause
    const where = {
      iss_category_code: query.iss_category_code,
      isc_subcategory_code: query.isc_subcategory_code,
    };
    
    // Search filter
    if (query.search && query.search.trim() !== '') {
      const searchTerm = query.search.trim();
      const searchNum = parseInt(searchTerm);
      
      where.OR = [
        ...(isNaN(searchNum) ? [] : [{ iss_subsiri_id: searchNum }]),
        { iss_subsiri_code: { contains: searchTerm } },
        { iss_subsiri_desc: { contains: searchTerm } },
        { iss_status: { contains: searchTerm } },
      ];
    }
    
    // Fetch item subsiris
    const subsiris = await prisma.item_subsiri.findMany({
      where,
      select: {
        iss_subsiri_id: true,
        iss_subsiri_code: true,
        iss_subsiri_desc: true,
        isc_subcategory_code: true,
        iss_category_code: true,
        iss_status: true,
      },
      orderBy: {
        iss_subsiri_code: 'asc',
      },
    });
    
    // Format the response
    const formattedData = subsiris.map((item) => ({
      iss_subsiri_id: item.iss_subsiri_id,
      iss_subsiri_code: item.iss_subsiri_code || '',
      iss_subsiri_desc: item.iss_subsiri_desc || '',
      isc_subcategory_code: item.isc_subcategory_code || '',
      iss_category_code: item.iss_category_code || '',
      iss_status: item.iss_status === '1' ? 'ACTIVE' : 'INACTIVE',
    }));
    
    return {
      statusCode: 200,
      message: "Item subsiris fetched successfully",
      data: formattedData,
    };
  } catch (error) {
    console.error("Error fetching item subsiris:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch item subsiris",
      error: error.message,
    };
  }
});
