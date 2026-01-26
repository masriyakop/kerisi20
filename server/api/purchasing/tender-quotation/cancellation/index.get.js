import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    // TODO: Update when tender/quotation table is created
    // For now, return empty data as placeholder
    const data = [];

    return {
      statusCode: 200,
      message: "Quotation/DP to be cancel list fetched successfully",
      data: data,
    };
  } catch (error) {
    console.error("Error fetching quotation/DP to be cancel list:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch quotation/DP to be cancel list",
      error: error.message,
    };
  }
});
