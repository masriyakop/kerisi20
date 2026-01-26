import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    if (!query.itm_category_code || !query.isc_subcategory_code || !query.iss_subsiri_code) {
      return {
        statusCode: 400,
        message: "itm_category_code, isc_subcategory_code, and iss_subsiri_code are required",
        data: [],
      };
    }
    
    // Build where clause
    const where = {
      itm_category_code: query.itm_category_code,
      isc_subcategory_code: query.isc_subcategory_code,
      iss_subsiri_code: query.iss_subsiri_code,
    };
    
    // Search filter
    if (query.search && query.search.trim() !== '') {
      const searchTerm = query.search.trim();
      const searchNum = parseInt(searchTerm);
      
      where.OR = [
        ...(isNaN(searchNum) ? [] : [{ itm_item_id: searchNum }]),
        { itm_item_code: { contains: searchTerm } },
        { itm_item_desc: { contains: searchTerm } },
        { acm_acct_code: { contains: searchTerm } },
        { itm_status: { contains: searchTerm } },
      ];
    }
    
    // Fetch item mains with account_main relation
    const itemMains = await prisma.item_main.findMany({
      where,
      include: {
        account_main: {
          select: {
            acm_acct_code: true,
            acm_acct_desc: true,
          },
        },
      },
      orderBy: {
        itm_item_code: 'asc',
      },
    });
    
    // Format the response
    const formattedData = itemMains.map((item) => ({
      itm_item_id: item.itm_item_id,
      itm_item_code: item.itm_item_code || '',
      itm_item_desc: item.itm_item_desc || '',
      itm_category_code: item.itm_category_code || '',
      isc_subcategory_code: item.isc_subcategory_code || '',
      iss_subsiri_code: item.iss_subsiri_code || '',
      acm_acct_code: item.account_main 
        ? `${item.acm_acct_code || ''} - ${item.account_main.acm_acct_desc || ''}`
        : item.acm_acct_code || '',
      itm_myfislite_flag: item.itm_myfislite_flag === 'Y' ? 'YES' : 'NO',
      itm_status: item.itm_status === '1' ? 'ACTIVE' : 'INACTIVE',
    }));
    
    return {
      statusCode: 200,
      message: "Item mains fetched successfully",
      data: formattedData,
    };
  } catch (error) {
    console.error("Error fetching item mains:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch item mains",
      error: error.message,
    };
  }
});
