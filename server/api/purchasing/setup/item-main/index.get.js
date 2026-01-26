import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    let whereClause = {};

    if (query.search) {
      const searchTerm = query.search.trim();
      whereClause.OR = [
        { im_item_main_code: { contains: searchTerm } },
        { im_item_main_desc: { contains: searchTerm } },
      ];
    }

    const itemMains = await prisma.item_main.findMany({
      where: whereClause,
      orderBy: {
        im_item_main_id: 'desc',
      },
    });

    const data = itemMains.map((item) => {
      return {
        im_item_main_id: item.im_item_main_id,
        im_item_main_code: item.im_item_main_code || '',
        im_item_main_desc: item.im_item_main_desc || '',
        im_status: item.im_status ? 'ACTIVE' : 'INACTIVE',
        urlEdit: `/purchasing/setup/item-main/edit/${item.im_item_main_id}`,
      };
    });

    return {
      statusCode: 200,
      message: "Item main list fetched successfully",
      data: data,
    };
  } catch (error) {
    console.error("Error fetching item main list:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch item main list",
      error: error.message,
    };
  }
});
