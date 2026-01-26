import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    let where = {};
    
    // Search filter
    if (query.search) {
      const searchTerm = query.search.trim();
      where.OR = [
        { ccr_costcentre: { contains: searchTerm } },
        { ccr_costcentre_desc: { contains: searchTerm } },
        { ccr_costcentre_desc_eng: { contains: searchTerm } },
        { oun_code: { contains: searchTerm } },
        { ccr_address: { contains: searchTerm } },
        { ccr_hostel_code: { contains: searchTerm } },
      ];
    }

    // Smart filter for cost centre code
    if (query.smartFilter_ccr_costcentre) {
      where.ccr_costcentre = query.smartFilter_ccr_costcentre;
    }

    // Smart filter for PTJ code
    if (query.smartFilter_PTJCodesm) {
      where.oun_code = query.smartFilter_PTJCodesm;
    }

    // Smart filter for OU code (same as PTJ code in this case)
    if (query.smartFilter_OUcodesm) {
      where.oun_code = query.smartFilter_OUcodesm;
    }

    // Smart filter for status
    if (query.smartFilter_statussm) {
      if (query.smartFilter_statussm === 'ACTIVE') {
        where.ccr_status = '1';
      } else if (query.smartFilter_statussm === 'INACTIVE') {
        where.ccr_status = { not: '1' };
      }
    }

    // Fetch cost centres
    const costCentres = await prisma.costcentre.findMany({
      where,
      select: {
        ccr_costcentre_id: true,
        ccr_costcentre: true,
        ccr_costcentre_desc: true,
        ccr_costcentre_desc_eng: true,
        oun_code: true,
        ccr_address: true,
        ccr_hostel_code: true,
        ccr_status: true,
        ccr_flag_salary: true,
      },
      orderBy: {
        ccr_costcentre: 'asc',
      },
    });

    // Get organization unit descriptions
    const ounCodes = [...new Set(costCentres.map(cc => cc.oun_code).filter(Boolean))];
    const orgUnits = ounCodes.length > 0 ? await prisma.organization_unit.findMany({
      where: {
        oun_code: { in: ounCodes },
      },
      select: {
        oun_code: true,
        oun_desc: true,
      },
    }) : [];

    const orgUnitMap = {};
    orgUnits.forEach(ou => {
      orgUnitMap[ou.oun_code] = ou.oun_desc;
    });

    // Map data to match datatable format
    const data = costCentres.map((item, index) => ({
      no: index + 1,
      'Code': item.ccr_costcentre || '',
      'Description (Malay)': item.ccr_costcentre_desc || '',
      'Description (English)': item.ccr_costcentre_desc_eng || '',
      'PTJ': item.oun_code || '',
      'OU': item.oun_code || '',
      'PTJ Description': orgUnitMap[item.oun_code] || '',
      'OU Description': orgUnitMap[item.oun_code] || '',
      'Address': item.ccr_address || '',
      'Hostel Code': item.ccr_hostel_code || '',
      'Status': item.ccr_status === '1' || item.ccr_status === 1 ? 'ACTIVE' : 'INACTIVE',
      'Action': '',
      // Keep original data
      ccr_costcentre_id: item.ccr_costcentre_id,
      ccr_costcentre: item.ccr_costcentre,
      ccr_costcentre_desc: item.ccr_costcentre_desc,
      ccr_costcentre_desc_eng: item.ccr_costcentre_desc_eng,
      oun_code: item.oun_code,
      ccr_address: item.ccr_address,
      ccr_hostel_code: item.ccr_hostel_code,
      ccr_status: item.ccr_status,
      ccr_flag_salary: item.ccr_flag_salary,
      oun_desc: orgUnitMap[item.oun_code] || '',
    }));

    return {
      statusCode: 200,
      message: 'Cost centres fetched successfully',
      data,
    };
  } catch (error) {
    console.error('Error in cost-centre API:', error);
    return {
      statusCode: 500,
      message: error.message || 'Internal server error',
      data: [],
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    };
  }
});
