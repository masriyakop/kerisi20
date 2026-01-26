import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    // TODO: Update when work_progress_note table is created
    // For now, return empty data as placeholder
    const data = [];

    return {
      statusCode: 200,
      message: "Work progress note cancel list fetched successfully",
      data: data,
    };
  } catch (error) {
    console.error("Error fetching work progress note cancel list:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch work progress note cancel list",
      error: error.message,
    };
  }
});
