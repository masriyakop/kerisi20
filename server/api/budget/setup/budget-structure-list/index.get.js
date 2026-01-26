import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    // Build where clause for filtering
    const where = {};
    
    // Top filters
    if (query.tf_year && query.tf_year !== 'null' && query.tf_year.trim() !== '') {
      where.sby_year = query.tf_year.trim();
    }
    if (query.tf_fund && query.tf_fund !== 'null' && query.tf_fund.trim() !== '') {
      where.fty_fund_type = query.tf_fund.trim();
    }
    if (query.tf_ouncode && query.tf_ouncode !== 'null' && query.tf_ouncode.trim() !== '') {
      where.oun_code = query.tf_ouncode.trim();
    }
    if (query.tf_costcentre && query.tf_costcentre !== 'null' && query.tf_costcentre.trim() !== '') {
      where.ccr_costcentre = query.tf_costcentre.trim();
    }
    if (query.tf_activity && query.tf_activity !== 'null' && query.tf_activity.trim() !== '') {
      where.at_activity_code = query.tf_activity.trim();
    }
    
    // Smart filters (these override top filters if both are provided)
    if (query.FUND && query.FUND.trim() !== '') {
      where.fty_fund_type = query.FUND.trim();
    }
    if (query.ACTIVITY && query.ACTIVITY.trim() !== '') {
      where.at_activity_code = query.ACTIVITY.trim();
    }
    if (query.OUN && query.OUN.trim() !== '') {
      where.oun_code = query.OUN.trim();
    }
    if (query.CCR && query.CCR.trim() !== '') {
      where.ccr_costcentre = query.CCR.trim();
    }
    if (query.BUDGETCODE && query.BUDGETCODE.trim() !== '') {
      where.lbc_budget_code = query.BUDGETCODE.trim();
    }
    if (query.YEAR && query.YEAR.trim() !== '') {
      where.sby_year = query.YEAR.trim();
    }
    if (query.STAT && query.STAT.trim() !== '') {
      where.sbg_status = query.STAT === 'ACTIVE' ? '1' : '0';
    }
    if (query.DEFISIT && query.DEFISIT.trim() !== '') {
      where.acm_defisit = query.DEFISIT === 'YES' ? 'Y' : 'N';
    }
    
    // Search filter (searches across multiple fields)
    if (query.search && query.search.trim() !== '') {
      const searchTerm = query.search.trim();
      const searchNum = parseInt(searchTerm);
      where.OR = [
        ...(isNaN(searchNum) ? [] : [{ sbg_budget_id: searchNum }]),
        { fty_fund_type: { contains: searchTerm } },
        { oun_code: { contains: searchTerm } },
        { ccr_costcentre: { contains: searchTerm } },
        { at_activity_code: { contains: searchTerm } },
        { lbc_budget_code: { contains: searchTerm } },
        { sby_year: { contains: searchTerm } },
      ];
    }

    // Fetch all budget structures from database with related data (no pagination, frontend handles it)
    const structures = await prisma.structure_budget.findMany({
      where: Object.keys(where).length > 0 ? where : {},
      include: {
        activity_type: {
          select: {
            at_activity_description_bm: true,
          },
        },
        lkp_budget_code: {
          select: {
            lbc_description: true,
          },
        },
        organization_unit: {
          select: {
            oun_desc: true,
          },
        },
      },
      orderBy: {
        sbg_budget_id: 'desc',
      },
    });

    // Format the response
    const formattedData = structures.map((item, index) => {
      const status = item.sbg_status === '1' ? 'ACTIVE' : 'INACTIVE';
      const deficit = item.acm_defisit === 'Y' ? 'YES' : 'NO';
      
      return {
        ID: item.sbg_budget_id.toString(),
        FUND: item.fty_fund_type || '',
        OUN: item.oun_code || '',
        CCR: item.ccr_costcentre || '',
        ACTIVITY: item.at_activity_code || '',
        activity_desc: item.activity_type?.at_activity_description_bm || '',
        BUDGETCODE: item.lbc_budget_code || '',
        lbc_description: item.lkp_budget_code?.lbc_description || '',
        DEFISIT: deficit,
        STAT: status,
        YEAR: item.sby_year || '',
        no: index + 1,
      };
    });

    return {
      statusCode: 200,
      message: "Budget structures fetched successfully",
      data: formattedData,
    };
  } catch (error) {
    console.error("Error fetching budget structures:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    };
  }
});

