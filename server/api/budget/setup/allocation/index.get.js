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
        ...(isNaN(searchNum) ? [] : [{ qbu_quarter_id: searchNum }]),
        { qbu_year: { contains: searchTerm } },
        { qbu_description: { contains: searchTerm } },
      ];
    }
    
    // Smart filters
    if (query.qbu_year && query.qbu_year.trim() !== '') {
      where.qbu_year = query.qbu_year.trim();
    }
    
    if (query.qbu_description && query.qbu_description.trim() !== '') {
      where.qbu_description = {
        contains: query.qbu_description.trim(),
      };
    }
    
    if (query.qbu_start_date && query.qbu_start_date.trim() !== '') {
      where.qbu_start_date = {
        gte: new Date(query.qbu_start_date),
      };
    }
    
    if (query.qbu_end_date && query.qbu_end_date.trim() !== '') {
      where.qbu_end_date = {
        lte: new Date(query.qbu_end_date),
      };
    }
    
    // Note: statusDesc filtering will be done after fetch since it might be in extended_field JSON

    // Fetch all allocations from database (no pagination, frontend handles it)
    const allocations = await prisma.quarter_budget.findMany({
      where: Object.keys(where).length > 0 ? where : {},
      orderBy: {
        qbu_year: 'desc',
      },
    });

    // Format the response
    const formattedData = allocations.map((item, index) => {
      // Get status from extended_field or qbu_status, default to INACTIVE
      let statusDesc = 'INACTIVE';
      if (item.qbu_extended_field && typeof item.qbu_extended_field === 'object' && 'statusDesc' in item.qbu_extended_field) {
        statusDesc = item.qbu_extended_field.statusDesc;
      } else if (item.qbu_status) {
        statusDesc = item.qbu_status;
      }
      
      // Convert status: 1/0 to ACTIVE/INACTIVE if needed
      if (statusDesc === '1' || statusDesc === 1) {
        statusDesc = 'ACTIVE';
      } else if (statusDesc === '0' || statusDesc === 0) {
        statusDesc = 'INACTIVE';
      }
      
      // Format dates
      const startDate = item.qbu_start_date ? new Date(item.qbu_start_date).toLocaleDateString('en-GB') : '';
      const endDate = item.qbu_end_date ? new Date(item.qbu_end_date).toLocaleDateString('en-GB') : '';
      
      // Format description - just use the description as is
      const descFormatted = item.qbu_description || '';
      
      return {
        ID: item.qbu_quarter_id.toString(),
        YEARS: item.qbu_year,
        DESCS: item.qbu_description || '',
        DESCSFORMATTED: descFormatted,
        SDATE: startDate,
        EDATE: endDate,
        STAT: statusDesc,
        no: index + 1,
      };
    });
    
    // Filter by statusDesc if provided (since it might be in extended_field JSON)
    let finalData = formattedData;
    if (query.statusDesc && query.statusDesc.trim() !== '') {
      const statusFilter = query.statusDesc.trim();
      finalData = formattedData.filter(item => item.STAT === statusFilter);
    }

    return {
      statusCode: 200,
      message: "Allocations fetched successfully",
      data: finalData,
    };
  } catch (error) {
    console.error("Error fetching allocations:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    };
  }
});

