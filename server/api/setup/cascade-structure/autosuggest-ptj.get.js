import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const search = query.search || '';
    
    let where = {
      oun_code: { not: null },
    };
    
    if (search) {
      where.OR = [
        { oun_code: { contains: search } },
        { oun_desc: { contains: search } },
      ];
    }

    const orgUnits = await prisma.organization_unit.findMany({
      where,
      select: {
        oun_code: true,
        oun_desc: true,
      },
      take: 50,
      orderBy: {
        oun_code: 'asc',
      },
    });

    const results = orgUnits.map(ou => ({
      id: ou.oun_code,
      text: `${ou.oun_code} - ${ou.oun_desc}`,
      _Desc: ou.oun_desc,
    }));

    return {
      statusCode: 200,
      message: 'Organization units fetched successfully',
      results,
    };
  } catch (error) {
    console.error('Error in autosuggest PTJ API:', error);
    return {
      statusCode: 500,
      message: error.message || 'Internal server error',
      results: [],
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    };
  }
});
