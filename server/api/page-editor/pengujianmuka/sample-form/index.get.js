import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);

    // Build where clause from query parameters
    const where = {};
    
    
    
    // Add search filter if provided
    if (query.search && query.search.trim() !== "") {
      where.OR = [
        { lbc_id: { contains: query.search } },
        { lbc_level: { contains: query.search } },
        { lbc_budget_code: { contains: query.search } },
        { lbc_description: { contains: query.search } },
        { IF: { contains: query.search } }
      ];
    }

    // Add top filter conditions (accept both aliases and original field names)
    // Note: Using contains without mode for cross-database compatibility
    if (query.lbc_id || query.lbc_id || query.lbc_id) {
      const filterValue = query.lbc_id || query.lbc_id || query.lbc_id;
      where.lbc_id = { contains: filterValue };
    }
    if (query.lbc_level || query.lbc_level || query.lbc_level) {
      const filterValue = query.lbc_level || query.lbc_level || query.lbc_level;
      where.lbc_level = { contains: filterValue };
    }
    if (query.lbc_budget_code || query.lbc_budget_code || query.lbc_budget_code) {
      const filterValue = query.lbc_budget_code || query.lbc_budget_code || query.lbc_budget_code;
      where.lbc_budget_code = { contains: filterValue };
    }
    if (query.lbc_description || query.lbc_description || query.lbc_description) {
      const filterValue = query.lbc_description || query.lbc_description || query.lbc_description;
      where.lbc_description = { contains: filterValue };
    }
    if (query.IF || query.IF || query.IF) {
      const filterValue = query.IF || query.IF || query.IF;
      where.IF = { contains: filterValue };
    }
    if (query["Budget Code"] || query.Budget_Code || query.lbc_budget_code) {
      const filterValue = query["Budget Code"] || query.Budget_Code || query.lbc_budget_code;
      where.lbc_budget_code = { contains: filterValue };
    }
    if (query.Description || query.Description || query.lbc_description) {
      const filterValue = query.Description || query.Description || query.lbc_description;
      where.lbc_description = { contains: filterValue };
    }
    if (query.Status || query.Status || query.lbc_status) {
      const filterValue = query.Status || query.Status || query.lbc_status;
      where.lbc_status = { contains: filterValue };
    }
    
    // Add Top Filter component field conditions (tf_xxx fields)
    

    // Get data - no pagination, rs-table handles it client-side
    const data = await prisma.lkp_budget_code.findMany({
      where,
      orderBy: { lbc_id: 'desc' },
      
    });

    // Map fields to aliases for frontend and ensure primary key is included
    const mappedData = data.map((item) => {
      const mapped = { ...item };
      mapped["Budget Code"] = item.lbc_budget_code;
      mapped.Budget_Code = item.lbc_budget_code;
      mapped.budget_code = item.lbc_budget_code;
      mapped.Description = item.lbc_description;
      mapped.description = item.lbc_description;
      mapped.Status = item.lbc_status;
      mapped.status = item.lbc_status;
      // Ensure primary key is available (even if not in SELECT)
      
      // Add id field for CRUD operations (use primary key value)
      mapped.id = item.lbc_id;
      return mapped;
    });

    return {
      statusCode: 200,
      message: "Data fetched successfully",
      data: mappedData,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    
    // Handle Prisma-specific errors
    if (error.code === 'P2001') {
      return {
        statusCode: 404,
        message: "No records found",
      };
    }
    
    return {
      statusCode: 500,
      message: "Failed to fetch data",
      error: "development" === 'development' ? error.message : "An error occurred while fetching data",
    };
  }
});
