import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    // Check if model exists in Prisma client
    try {
      if (!prisma.budget_planning_schedule || typeof prisma.budget_planning_schedule.findMany !== 'function') {
        console.error("Prisma model 'budget_planning_schedule' not found in client");
        return {
          statusCode: 500,
          message: "Prisma model not found. Please ensure you have run 'npx prisma generate' and restarted the server.",
          error: "Model budget_planning_schedule does not exist in Prisma client",
          data: [],
        };
      }
    } catch (checkError) {
      console.error("Error checking Prisma model:", checkError);
      return {
        statusCode: 500,
        message: "Prisma model not found. Please ensure you have run 'npx prisma generate' and restarted the server.",
        error: checkError.message,
        data: [],
      };
    }

    const query = getQuery(event);
    
    // Build where clause for filtering
    const where = {};
    
    // Top filter - Year (bps_year_budget is Int? in schema)
    if (query.cm_filter_year && query.cm_filter_year.trim() !== '') {
      const yearInt = parseInt(query.cm_filter_year.trim());
      if (!isNaN(yearInt)) {
        where.bps_year_budget = yearInt;
      }
    }
    
    // Search filter (searches across multiple fields)
    if (query.search && query.search.trim() !== '') {
      const searchTerm = query.search.trim();
      const searchNum = parseInt(searchTerm);
      where.OR = [
        ...(isNaN(searchNum) ? [] : [{ bps_id: searchNum }]),
        ...(isNaN(searchNum) ? [] : [{ bps_year_budget: searchNum }]),
        { bps_status: { contains: searchTerm } },
      ];
    }

    // Fetch all schedules from database (no pagination, frontend handles it)
    const schedules = await prisma.budget_planning_schedule.findMany({
      where: Object.keys(where).length > 0 ? where : {},
      orderBy: {
        bps_id: 'desc',
      },
    });
    
    // Sort by year in memory (handles nulls better)
    schedules.sort((a, b) => {
      if (!a.bps_year_budget && !b.bps_year_budget) return 0;
      if (!a.bps_year_budget) return 1;
      if (!b.bps_year_budget) return -1;
      return (b.bps_year_budget || 0) - (a.bps_year_budget || 0); // Numeric comparison for integers
    });

    // Format the response
    const currentYear = new Date().getFullYear();
    const formattedData = schedules.map((item, index) => {
      const startDate = item.bps_plan_startDate ? new Date(item.bps_plan_startDate).toLocaleDateString('en-GB') : '';
      const endDate = item.bps_plan_endDate ? new Date(item.bps_plan_endDate).toLocaleDateString('en-GB') : '';
      const planningDate = startDate && endDate ? `${startDate} - ${endDate}` : (startDate || endDate || '');
      
      // Convert status: 1/0 to ACTIVE/INACTIVE
      let status = 'INACTIVE';
      if (item.bps_status === '1' || item.bps_status === 1 || item.bps_status === 'ACTIVE') {
        status = 'ACTIVE';
      } else if (item.bps_status === '0' || item.bps_status === 0 || item.bps_status === 'INACTIVE') {
        status = 'INACTIVE';
      }
      
      return {
        bps_id: item.bps_id.toString(),
        current_year: currentYear,
        bps_year_budget: item.bps_year_budget?.toString() || '',
        planning_date: planningDate,
        bps_status: status,
        no: index + 1,
      };
    });

    return {
      statusCode: 200,
      message: "Budget planning schedules fetched successfully",
      data: formattedData,
    };
  } catch (error) {
    console.error("Error fetching budget planning schedules:", error);
    console.error("Error stack:", error.stack);
    console.error("Error name:", error.name);
    console.error("Error code:", error.code);
    
    // Check if model doesn't exist in Prisma client
    if (error.message && (
      error.message.includes('model') || 
      error.message.includes('does not exist') ||
      error.message.includes('Unknown arg') ||
      error.message.includes('prisma.budget_planning_schedule') ||
      error.code === 'P2001'
    )) {
      return {
        statusCode: 500,
        message: "Prisma model not found. Please stop the dev server, run 'npx prisma generate', then restart the server.",
        error: error.message,
        errorCode: error.code,
        data: [],
      };
    }
    
    // Check for database connection errors
    if (error.code === 'P1001' || error.message.includes('connect') || error.message.includes('ECONNREFUSED')) {
      return {
        statusCode: 500,
        message: "Database connection error. Please check your database connection.",
        error: error.message,
        errorCode: error.code,
        data: [],
      };
    }
    
    // Check for table not found errors
    if (error.code === 'P2025' || error.message.includes('Table') || error.message.includes('doesn\'t exist')) {
      return {
        statusCode: 404,
        message: "Table not found in database. Please ensure the table 'budget_planning_schedule' exists.",
        error: error.message,
        errorCode: error.code,
        data: [],
      };
    }
    
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
      errorCode: error.code,
      errorName: error.name,
      data: [],
    };
  }
});

