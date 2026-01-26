import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    // Build where clause for filtering
    const where = {};
    
    // Smart filters
    if (query.fundType && query.fundType.trim() !== '') {
      // Note: fund_type is not directly in account_main, would need join
      // For now, skip this filter
    }
    
    if (query.accountType && query.accountType.trim() !== '') {
      where.acm_acct_type = { contains: query.accountType.trim() };
    }
    
    if (query.accountClass && query.accountClass.trim() !== '') {
      where.acm_acct_group = { contains: query.accountClass.trim() };
    }
    
    if (query.accountStatus && query.accountStatus.trim() !== '') {
      where.acm_acct_status = query.accountStatus.trim();
    }
    
    // Search filter (searches across multiple fields)
    if (query.search && query.search.trim() !== '') {
      const searchTerm = query.search.trim();
      where.OR = [
        { acm_acct_code: { contains: searchTerm } },
        { acm_acct_desc: { contains: searchTerm } },
        { acm_acct_desc_eng: { contains: searchTerm } },
        { acm_acct_type: { contains: searchTerm } },
        { acm_acct_group: { contains: searchTerm } },
        { acm_acct_activity: { contains: searchTerm } },
        { acm_acct_status: { contains: searchTerm } },
      ];
    }

    // Fetch all account codes from account_main table (no pagination, frontend handles it)
    const accountCodes = await prisma.account_main.findMany({
      where: Object.keys(where).length > 0 ? where : {},
      orderBy: {
        createddate: 'desc',
      },
    });

    // Format the response
    const formattedData = accountCodes.map((item, index) => ({
      id: item.acm_acct_code,
      no: index + 1,
      accountCode: item.acm_acct_code,
      accountCodeDescription: item.acm_acct_desc || '',
      accountLevel: item.acm_acct_level ? Number(item.acm_acct_level) : null,
      accountType: item.acm_acct_type || '',
      accountClass: item.acm_acct_group || '',
      fundType: '', // Not available in account_main directly
      statementItem: '', // Not available in account_main directly
      accountStatus: item.acm_acct_status || '',
    }));

    return {
      statusCode: 200,
      message: "Account codes fetched successfully",
      data: formattedData,
    };
  } catch (error) {
    console.error("Error fetching account codes:", error);
    console.error("Error stack:", error.stack);
    console.error("Error name:", error.name);
    
    // Check if it's a Prisma model not found error
    if (error.message && error.message.includes('model') && error.message.includes('not found')) {
      return {
        statusCode: 500,
        message: "Prisma model not found. Please check if 'account_code' model exists in schema.prisma",
        error: error.message,
      };
    }
    
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
      errorDetails: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    };
  }
});

