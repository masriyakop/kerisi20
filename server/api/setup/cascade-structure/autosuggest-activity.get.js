import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const search = query.search || '';
    
    let where = {
      at_status: '1',
      at_activity_code: { not: null },
    };
    
    if (search) {
      where.OR = [
        { at_activity_code: { contains: search } },
        { at_activity_description_bm: { contains: search } },
      ];
    }

    const activities = await prisma.activity_type.findMany({
      where,
      select: {
        at_activity_code: true,
        at_activity_description_bm: true,
      },
      take: 50,
      orderBy: {
        at_activity_code: 'asc',
      },
    });

    const results = activities.map(at => ({
      id: at.at_activity_code,
      text: `${at.at_activity_code} - ${at.at_activity_description_bm}`,
      _Desc: at.at_activity_description_bm,
    }));

    return {
      statusCode: 200,
      message: 'Activity types fetched successfully',
      results,
    };
  } catch (error) {
    console.error('Error in autosuggest activity API:', error);
    return {
      statusCode: 500,
      message: error.message || 'Internal server error',
      results: [],
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    };
  }
});
