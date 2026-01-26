import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    // Build where clause for filtering
    const where = {};
    
    // Search filter (searches across multiple fields)
    if (query.search && query.search.trim() !== '') {
      const searchTerm = query.search.trim();
      const searchNum = parseInt(searchTerm);
      where.OR = [
        ...(isNaN(searchNum) ? [] : [{ lbc_id: searchNum }]),
        { lbc_level: { contains: searchTerm } },
        { lbc_budget_code: { contains: searchTerm } },
        { lbc_description: { contains: searchTerm } },
        { lbc_status: { contains: searchTerm } },
      ];
    }
    
    // Smart filters
    if (query.lbc_level_filter && query.lbc_level_filter.trim() !== '') {
      where.lbc_level = query.lbc_level_filter.trim();
    }
    
    if (query.lbc_budget_code_filter && query.lbc_budget_code_filter.trim() !== '') {
      where.lbc_budget_code = query.lbc_budget_code_filter.trim();
    }
    
    if (query.lbc_description_filter && query.lbc_description_filter.trim() !== '') {
      where.lbc_description = {
        contains: query.lbc_description_filter.trim(),
      };
    }
    
    if (query.lbc_status_filter && query.lbc_status_filter.trim() !== '') {
      // Convert ACTIVE/INACTIVE to 1/0 if needed, or use as is
      const statusFilter = query.lbc_status_filter === 'ACTIVE' ? '1' : 
                          query.lbc_status_filter === 'INACTIVE' ? '0' : 
                          query.lbc_status_filter;
      where.lbc_status = statusFilter;
    }

    // Fetch all budget codes from database
    // If where is empty, fetch all records
    const budgetCodes = await prisma.lkp_budget_code.findMany({
      where: Object.keys(where).length > 0 ? where : {},
      orderBy: {
        lbc_id: 'asc',
      },
    });

    // Format the response - convert status to ACTIVE/INACTIVE
    const formattedData = budgetCodes.map((item, index) => {
      const status = item.lbc_status === '1' || item.lbc_status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE';
      return {
        lbc_id: item.lbc_id.toString(),
        lbc_level: item.lbc_level,
        lbc_budget_code: item.lbc_budget_code,
        lbc_description: item.lbc_description || '',
        lbc_status: status,
        no: index + 1,
      };
    });

    return {
      statusCode: 200,
      message: "Budget codes fetched successfully",
      data: formattedData,
    };
  } catch (error) {
    console.error("Error fetching budget codes:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    };
  }
});
