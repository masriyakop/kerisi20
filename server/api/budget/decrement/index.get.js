import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    // Build where clause for filtering
    const where = {
      bmm_trans_type: 'DECREMENT',
    };
    
    // Smart filters
    if (query.sm_bmm_year && query.sm_bmm_year.trim() !== '') {
      where.bmm_year = query.sm_bmm_year.trim();
    }
    if (query.sm_bmm_status && query.sm_bmm_status.trim() !== '') {
      where.bmm_status = query.sm_bmm_status.trim();
    }
    
    // Search filter (searches across multiple fields)
    if (query.search && query.search.trim() !== '') {
      const searchTerm = query.search.trim();
      const searchNum = parseInt(searchTerm);
      where.OR = [
        ...(isNaN(searchNum) ? [] : [{ bmm_budget_movement_id: searchNum }]),
        { bmm_year: { contains: searchTerm } },
        { bmm_budget_movement_no: { contains: searchTerm } },
        { bmm_endorse_doc: { contains: searchTerm } },
        { bmm_description: { contains: searchTerm } },
        { bmm_status: { contains: searchTerm } },
      ];
    }

    // Fetch all budget decrement records from database (no pagination, frontend handles it)
    const records = await prisma.budget_movement_master.findMany({
      where: Object.keys(where).length > 0 ? where : {},
      orderBy: {
        bmm_budget_movement_id: 'desc',
      },
    });

    // Format the response - map to dt_key fields
    const formattedData = records.map((item, index) => {
      const date = item.updateddate || item.createddate;
      const dateStr = date ? new Date(date).toLocaleDateString('en-GB') : '';
      
      return {
        bmm_year: item.bmm_year || '',
        bmm_budget_movement_no: item.bmm_budget_movement_no || '',
        bmm_endorse_doc: item.bmm_endorse_doc || '',
        bmm_description: item.bmm_description || '',
        bmm_total_amt: item.bmm_total_amt ? parseFloat(item.bmm_total_amt.toString()) : 0,
        bmm_status: item.bmm_status || '',
        date: dateStr,
        bmm_budget_movement_id: item.bmm_budget_movement_id,
        // Note: urlView and urlEdit are handled in frontend via sessionStorage, not URL parameters
      };
    });

    return {
      statusCode: 200,
      message: "Budget decrement records fetched successfully",
      data: formattedData,
    };
  } catch (error) {
    console.error("Error fetching budget decrement records:", error);
    return {
      statusCode: 500,
      message: "An error occurred while fetching budget decrement records",
      error: error.message,
    };
  }
});

