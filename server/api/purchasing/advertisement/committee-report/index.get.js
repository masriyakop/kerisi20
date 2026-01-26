import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    // TODO: Update when submission table is created
    // For now, return empty data as placeholder
    const data = [];

    return {
      statusCode: 200,
      message: "Submission list fetched successfully",
      data: data,
    };
  } catch (error) {
    console.error("Error fetching submission list:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch submission list",
      error: error.message,
    };
  }
});
