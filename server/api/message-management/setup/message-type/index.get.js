import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const page = parseInt(query.page) || 1;
    const pageSize = parseInt(query.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    // Build where clause from query parameters
    const where = {};
    
    // Add WHERE conditions from queryMapping
    where.lma_code_name = "MESSAGE_TYPE";
    
    // Add search filter if provided
    if (query.search && query.search.trim() !== "") {
      where.OR = [
        { lde_value: { contains: query.search, mode: 'insensitive' } },
        { lde_description: { contains: query.search, mode: 'insensitive' } },
        { lde_status: { contains: query.search, mode: 'insensitive' } }
      ];
    }

    // Add top filter conditions (accept both aliases and original field names)
    if (query.lde_value) {
      where.lde_value = { contains: query.lde_value, mode: 'insensitive' };
    }
    if (query.lde_value) {
      where.lde_value = { contains: query.lde_value, mode: 'insensitive' };
    }
    if (query.lde_description) {
      where.lde_description = { contains: query.lde_description, mode: 'insensitive' };
    }
    if (query.lde_description) {
      where.lde_description = { contains: query.lde_description, mode: 'insensitive' };
    }
    if (query.lde_status) {
      where.lde_status = { contains: query.lde_status, mode: 'insensitive' };
    }
    if (query.lde_status) {
      where.lde_status = { contains: query.lde_status, mode: 'insensitive' };
    }
    if (query.Code) {
      where.lde_value = { contains: query.Code, mode: 'insensitive' };
    }
    if (query.lde_value) {
      where.lde_value = { contains: query.lde_value, mode: 'insensitive' };
    }
    if (query.Description) {
      where.lde_description = { contains: query.Description, mode: 'insensitive' };
    }
    if (query.lde_description) {
      where.lde_description = { contains: query.lde_description, mode: 'insensitive' };
    }
    if (query.Status) {
      where.lde_status = { contains: query.Status, mode: 'insensitive' };
    }
    if (query.lde_status) {
      where.lde_status = { contains: query.lde_status, mode: 'insensitive' };
    }

    // Get total count
    const total = await prisma.lookup_details.count({ where });

    // Get data
    const data = await prisma.lookup_details.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { lde_id: 'desc' },
    });

    // Map fields to aliases for frontend and ensure primary key is included
    const mappedData = data.map((item) => {
      const mapped = { ...item };
      mapped.Code = item.lde_value;
      mapped.Description = item.lde_description;
      mapped.Status = item.lde_status;
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
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
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
