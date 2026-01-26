import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    let where = {};
    
    // Search filter
    if (query.search) {
      const searchTerm = query.search.trim();
      where.OR = [
        { fty_fund_type: { contains: searchTerm } },
        { at_activity_code: { contains: searchTerm } },
        { oun_code: { contains: searchTerm } },
        { ccr_costcentre: { contains: searchTerm } },
      ];
    }

    // Smart filter for fund type
    if (query.smartFilter_fty_fund_type_sm) {
      where.fty_fund_type = query.smartFilter_fty_fund_type_sm;
    }

    // Smart filter for activity (PTJ)
    if (query.smartFilter_activity_smptj) {
      where.at_activity_code = query.smartFilter_activity_smptj;
    }

    // Smart filter for activity (OU)
    if (query.smartFilter_activity_smou) {
      where.at_activity_code = query.smartFilter_activity_smou;
    }

    // Smart filter for PTJ code
    if (query.smartFilter_oun_codePTJ) {
      where.oun_code = query.smartFilter_oun_codePTJ;
    }

    // Smart filter for cost centre
    if (query.smartFilter_costcenter_sm) {
      where.ccr_costcentre = query.smartFilter_costcenter_sm;
    }

    // Smart filter for status
    if (query.smartFilter_ouc_status) {
      if (query.smartFilter_ouc_status === 'ACTIVE') {
        where.ouc_status = '1';
      } else if (query.smartFilter_ouc_status === 'INACTIVE') {
        where.ouc_status = { not: '1' };
      }
    }

    // Fetch org_unit_costcentre records with relations
    const records = await prisma.org_unit_costcentre.findMany({
      where,
      include: {
        fund_type: {
          select: {
            fty_fund_type: true,
            fty_fund_desc: true,
          },
        },
        activity_type: {
          select: {
            at_activity_code: true,
            at_activity_description_bm: true,
          },
        },
        organization_unit: {
          select: {
            oun_code: true,
            oun_desc: true,
          },
        },
        costcentre: {
          select: {
            ccr_costcentre: true,
            ccr_costcentre_desc: true,
          },
        },
      },
      orderBy: {
        ouc_ounit_costcentre_id: 'desc',
      },
    });

    // Map data to match datatable format
    const data = records.map((item, index) => ({
      no: index + 1,
      'Costcentre ID': item.ouc_ounit_costcentre_id,
      'Fund': item.fty_fund_type || '',
      'Fund Desc': item.fund_type?.fty_fund_desc || '',
      'Activity': item.at_activity_code || '',
      'Activity Description': item.activity_type?.at_activity_description_bm || '',
      'PTJ': item.oun_code || '',
      'OU Code': item.oun_code || '',
      'PTJ Description': item.organization_unit?.oun_desc || '',
      'OU Description': item.organization_unit?.oun_desc || '',
      'Cost Center': item.ccr_costcentre || '',
      'Cost Center Description': item.costcentre?.ccr_costcentre_desc || '',
      'Status': item.ouc_status === '1' || item.ouc_status === 1 ? 'ACTIVE' : 'INACTIVE',
      'Action': '',
      // Keep original data
      ouc_ounit_costcentre_id: item.ouc_ounit_costcentre_id,
      fty_fund_type: item.fty_fund_type,
      at_activity_code: item.at_activity_code,
      oun_code: item.oun_code,
      ccr_costcentre: item.ccr_costcentre,
      ouc_status: item.ouc_status,
    }));

    return {
      statusCode: 200,
      message: 'Cascade structure fetched successfully',
      data,
    };
  } catch (error) {
    console.error('Error in cascade-structure API:', error);
    return {
      statusCode: 500,
      message: error.message || 'Internal server error',
      data: [],
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    };
  }
});
