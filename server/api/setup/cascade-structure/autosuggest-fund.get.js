import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const search = query.search || '';
    
    let where = {};
    
    if (search) {
      where.OR = [
        { fty_fund_type: { contains: search } },
        { fty_fund_desc: { contains: search } },
      ];
    }

    const fundTypes = await prisma.fund_type.findMany({
      where,
      select: {
        fty_fund_type: true,
        fty_fund_desc: true,
      },
      take: 50,
      orderBy: {
        fty_fund_type: 'asc',
      },
    });

    const results = fundTypes.map(ft => ({
      id: ft.fty_fund_type,
      text: `${ft.fty_fund_type} - ${ft.fty_fund_desc}`,
      _Desc: ft.fty_fund_desc,
    }));

    return {
      statusCode: 200,
      message: 'Fund types fetched successfully',
      results,
    };
  } catch (error) {
    console.error('Error in autosuggest fund API:', error);
    return {
      statusCode: 500,
      message: error.message || 'Internal server error',
      results: [],
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    };
  }
});
