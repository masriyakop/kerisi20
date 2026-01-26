import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    
    // Validation
    if (!body.YEARS || !body.DESCS || !body.SDATE || !body.EDATE || !body.STAT) {
      return {
        statusCode: 400,
        message: "Year, Description, Start Date, End Date, and Status are required",
      };
    }
    
    // Parse dates
    const startDate = new Date(body.SDATE.split('/').reverse().join('-'));
    const endDate = new Date(body.EDATE.split('/').reverse().join('-'));
    
    // Create new allocation
    const allocation = await prisma.quarter_budget.create({
      data: {
        qbu_year: body.YEARS,
        qbu_description: body.DESCS.toUpperCase(),
        qbu_start_date: startDate,
        qbu_end_date: endDate,
        qbu_status: body.STAT,
        qbu_extended_field: {
          statusDesc: body.STAT,
        },
      },
    });
    
    return {
      statusCode: 201,
      message: "Allocation created successfully",
      data: {
        ID: allocation.qbu_quarter_id.toString(),
        YEARS: allocation.qbu_year,
        DESCS: allocation.qbu_description,
        SDATE: new Date(allocation.qbu_start_date).toLocaleDateString('en-GB'),
        EDATE: new Date(allocation.qbu_end_date).toLocaleDateString('en-GB'),
        STAT: allocation.qbu_status || 'INACTIVE',
      },
    };
  } catch (error) {
    console.error("Error creating allocation:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    };
  }
});

