import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    // TODO: Update when tender/quotation table is created
    // For now, return empty data as placeholder
    const data = [];

    return {
      statusCode: 200,
      message: "Tender/quotation/DP for selection list fetched successfully",
      data: data,
    };
  } catch (error) {
    console.error("Error fetching tender/quotation/DP for selection list:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch tender/quotation/DP for selection list",
      error: error.message,
    };
  }
});
