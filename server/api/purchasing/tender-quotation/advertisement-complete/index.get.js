import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    // TODO: Update when advertisement table is created
    // For now, return empty data as placeholder
    const data = [];

    return {
      statusCode: 200,
      message: "Advertisement list fetched successfully",
      data: data,
    };
  } catch (error) {
    console.error("Error fetching advertisement list:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch advertisement list",
      error: error.message,
    };
  }
});
