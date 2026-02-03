import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const page = parseInt(query.page) || 1;
    const pageSize = parseInt(query.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    // Build where clause from query parameters
    const where = {};
    
    
    
    // Add search filter if provided
    if (query.search && query.search.trim() !== "") {
      where.OR = [
        { fty_fund_id: { contains: query.search } },
        { fty_fund_type: { contains: query.search } },
        { fty_fund_desc: { contains: query.search } },
        { fty_basis: { contains: query.search } },
        { fty_remark: { contains: query.search } }
      ];
    }

    // Add top filter conditions (accept both aliases and original field names)
    // Note: Using contains without mode for cross-database compatibility
    if (query.fty_fund_id || query.fty_fund_id || query.fty_fund_id) {
      const filterValue = query.fty_fund_id || query.fty_fund_id || query.fty_fund_id;
      where.fty_fund_id = { contains: filterValue };
    }
    if (query.fty_fund_type || query.fty_fund_type || query.fty_fund_type) {
      const filterValue = query.fty_fund_type || query.fty_fund_type || query.fty_fund_type;
      where.fty_fund_type = { contains: filterValue };
    }
    if (query.fty_fund_desc || query.fty_fund_desc || query.fty_fund_desc) {
      const filterValue = query.fty_fund_desc || query.fty_fund_desc || query.fty_fund_desc;
      where.fty_fund_desc = { contains: filterValue };
    }
    if (query.fty_basis || query.fty_basis || query.fty_basis) {
      const filterValue = query.fty_basis || query.fty_basis || query.fty_basis;
      where.fty_basis = { contains: filterValue };
    }
    if (query.fty_remark || query.fty_remark || query.fty_remark) {
      const filterValue = query.fty_remark || query.fty_remark || query.fty_remark;
      where.fty_remark = { contains: filterValue };
    }
    if (query.fty_status || query.fty_status || query.fty_status) {
      const filterValue = query.fty_status || query.fty_status || query.fty_status;
      where.fty_status = { contains: filterValue };
    }
    if (query.entryDate || query.entryDate || query.createddate) {
      const filterValue = query.entryDate || query.entryDate || query.createddate;
      where.createddate = { contains: filterValue };
    }
    if (query["Fund Type"] || query.Fund_Type || query.fty_fund_type) {
      const filterValue = query["Fund Type"] || query.Fund_Type || query.fty_fund_type;
      where.fty_fund_type = { contains: filterValue };
    }
    if (query.Description || query.Description || query.fty_fund_desc) {
      const filterValue = query.Description || query.Description || query.fty_fund_desc;
      where.fty_fund_desc = { contains: filterValue };
    }
    if (query["Type Basis"] || query.Type_Basis || query.fty_basis) {
      const filterValue = query["Type Basis"] || query.Type_Basis || query.fty_basis;
      where.fty_basis = { contains: filterValue };
    }
    if (query.Remark || query.Remark || query.fty_remark) {
      const filterValue = query.Remark || query.Remark || query.fty_remark;
      where.fty_remark = { contains: filterValue };
    }
    if (query.Status || query.Status || query.fty_status) {
      const filterValue = query.Status || query.Status || query.fty_status;
      where.fty_status = { contains: filterValue };
    }
    if (query["Entry Date"] || query.Entry_Date || query.createddate) {
      const filterValue = query["Entry Date"] || query.Entry_Date || query.createddate;
      where.createddate = { contains: filterValue };
    }

    // Get total count
    const total = await prisma.fund_type.count({ where });

    // Get data
    const data = await prisma.fund_type.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { fty_fund_id: 'desc' },
    });

    // Map fields to aliases for frontend and ensure primary key is included
    const mappedData = data.map((item) => {
      const mapped = { ...item };
      mapped.entryDate = item.createddate;
      mapped.entrydate = item.createddate;
      mapped["Fund Type"] = item.fty_fund_type;
      mapped.Fund_Type = item.fty_fund_type;
      mapped.fund_type = item.fty_fund_type;
      mapped.Description = item.fty_fund_desc;
      mapped.description = item.fty_fund_desc;
      mapped["Type Basis"] = item.fty_basis;
      mapped.Type_Basis = item.fty_basis;
      mapped.type_basis = item.fty_basis;
      mapped.Remark = item.fty_remark;
      mapped.remark = item.fty_remark;
      mapped.Status = item.fty_status;
      mapped.status = item.fty_status;
      mapped["Entry Date"] = item.createddate;
      mapped.Entry_Date = item.createddate;
      mapped.entry_date = item.createddate;
      // Ensure primary key is available (even if not in SELECT)
      
      // Add id field for CRUD operations (use primary key value)
      mapped.id = item.fty_fund_id;
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
