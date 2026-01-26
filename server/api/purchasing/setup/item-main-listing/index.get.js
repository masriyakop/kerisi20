import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    let whereClause = {};

    if (query.search) {
      const searchTerm = query.search.trim();
      whereClause.OR = [
        { itm_item_code: { contains: searchTerm } },
        { itm_item_desc: { contains: searchTerm } },
        { acm_acct_code: { contains: searchTerm } },
        { itm_category_code: { contains: searchTerm } },
      ];
    }

    const items = await prisma.item_main.findMany({
      where: whereClause,
      include: {
        account_main: {
          select: {
            acm_acct_code: true,
            acm_acct_desc: true,
          },
        },
      },
      orderBy: {
        itm_item_id: 'desc',
      },
    });

    const data = items.map((item) => {
      return {
        itm_item_id: item.itm_item_id,
        ItemCode: item.itm_item_code || '',
        ItemDescription: item.itm_item_desc || '',
        AccountCode: item.acm_acct_code || '',
        CategoryCode: item.itm_category_code || '',
        Description: item.itm_item_desc || '',
        SubcategoryCode: item.isc_subcategory_code || '',
        SubsiriCode: item.iss_subsiri_code || '',
        Category: item.itm_category_code || '',
        Level: item.itm_level ? item.itm_level.toString() : '',
        urlEdit: `/purchasing/setup/item-main/edit/${item.itm_item_id}`,
      };
    });

    return {
      statusCode: 200,
      message: "Item main listing fetched successfully",
      data: data,
    };
  } catch (error) {
    console.error("Error fetching item main listing:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch item main listing",
      error: error.message,
    };
  }
});
