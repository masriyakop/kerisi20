import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const search = query.search || '';
    const ptjCode = query.PTJCode || '';
    
    let where = {
      ccr_costcentre: { not: null },
    };
    
    if (ptjCode) {
      where.oun_code = ptjCode;
    }
    
    if (search) {
      where.OR = [
        { ccr_costcentre: { contains: search } },
        { ccr_costcentre_desc: { contains: search } },
      ];
    }

    const costCentres = await prisma.costcentre.findMany({
      where,
      select: {
        ccr_costcentre: true,
        ccr_costcentre_desc: true,
      },
      take: 50,
      orderBy: {
        ccr_costcentre: 'asc',
      },
    });

    const results = costCentres.map(cc => ({
      id: cc.ccr_costcentre,
      text: `${cc.ccr_costcentre} - ${cc.ccr_costcentre_desc}`,
      _Desc: cc.ccr_costcentre_desc,
    }));

    return {
      statusCode: 200,
      message: 'Cost centres fetched successfully',
      results,
    };
  } catch (error) {
    console.error('Error in autosuggest cost centre API:', error);
    return {
      statusCode: 500,
      message: error.message || 'Internal server error',
      results: [],
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    };
  }
});
