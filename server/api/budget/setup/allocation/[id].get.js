import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    
    if (!id) {
      return {
        statusCode: 400,
        message: "ID is required",
      };
    }
    
    const allocation = await prisma.quarter_budget.findUnique({
      where: {
        qbu_quarter_id: BigInt(id),
      },
    });
    
    if (!allocation) {
      return {
        statusCode: 404,
        message: "Allocation not found",
      };
    }
    
    const startDate = allocation.qbu_start_date ? new Date(allocation.qbu_start_date).toLocaleDateString('en-GB') : '';
    const endDate = allocation.qbu_end_date ? new Date(allocation.qbu_end_date).toLocaleDateString('en-GB') : '';
    
    return {
      statusCode: 200,
      message: "Allocation fetched successfully",
      data: {
        ID: allocation.qbu_quarter_id.toString(),
        YEARS: allocation.qbu_year,
        DESCS: allocation.qbu_description,
        SDATE: startDate,
        EDATE: endDate,
        STAT: allocation.qbu_status || 'INACTIVE',
      },
    };
  } catch (error) {
    console.error("Error fetching allocation:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    };
  }
});

