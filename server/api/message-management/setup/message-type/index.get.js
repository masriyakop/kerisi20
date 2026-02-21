import prisma from "~/server/utils/prisma2";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);

    // Build where clause from query parameters
    const where = {};
    
    // Add WHERE conditions from queryMapping
    where.lma_code_name = "MESSAGE_TYPE";
    
    // Add search filter if provided
    if (query.search && query.search.trim() !== "") {
      where.OR = [
        { lde_value: { contains: query.search } },
        { lde_description: { contains: query.search } },
        { lde_status: { contains: query.search } }
      ];
    }

    // Add top filter conditions (accept both aliases and original field names)
    // Note: Using contains without mode for cross-database compatibility
    if (query.lde_value || query.lde_value || query.lde_value) {
      const filterValue = query.lde_value || query.lde_value || query.lde_value;
      where.lde_value = { contains: filterValue };
    }
    if (query.lde_description || query.lde_description || query.lde_description) {
      const filterValue = query.lde_description || query.lde_description || query.lde_description;
      where.lde_description = { contains: filterValue };
    }
    if (query.lde_status || query.lde_status || query.lde_status) {
      const filterValue = query.lde_status || query.lde_status || query.lde_status;
      where.lde_status = { contains: filterValue };
    }
    if (query.Code || query.Code || query.lde_value) {
      const filterValue = query.Code || query.Code || query.lde_value;
      where.lde_value = { contains: filterValue };
    }
    if (query.Description || query.Description || query.lde_description) {
      const filterValue = query.Description || query.Description || query.lde_description;
      where.lde_description = { contains: filterValue };
    }
    if (query.Status || query.Status || query.lde_status) {
      const filterValue = query.Status || query.Status || query.lde_status;
      where.lde_status = { contains: filterValue };
    }
    
    // Add Top Filter component field conditions (tf_xxx fields)
    

    // Get data - no pagination, rs-table handles it client-side
    const data = await prisma.lookup_details_adm.findMany({
      where,
      orderBy: { lde_id: 'desc' },
      
    });

    // Map fields to aliases for frontend and ensure primary key is included
    const mappedData = data.map((item) => {
      const mapped = { ...item };
      mapped.Code = item.lde_value;
      mapped.code = item.lde_value;
      mapped.Description = item.lde_description;
      mapped.description = item.lde_description;
      mapped.Status = item.lde_status;
      mapped.status = item.lde_status;
      // Ensure primary key is available (even if not in SELECT)
      if (!mapped.lde_id && item.lde_id) {
        mapped.lde_id = item.lde_id;
      }
      // Add id field for CRUD operations (use primary key value)
      mapped.id = item.lde_id;
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
