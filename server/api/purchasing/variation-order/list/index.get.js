import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    // TODO: Update when variation_order table is created
    // For now, return empty data as placeholder
    const data = [];

    return {
      statusCode: 200,
      message: "Variation orders fetched successfully",
      data: data,
    };
  } catch (error) {
    console.error("Error fetching variation orders:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch variation orders",
      error: error.message,
    };
  }
});
