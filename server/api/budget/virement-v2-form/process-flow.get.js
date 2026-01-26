import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const bmm_budget_movement_id = parseInt(query.bmm_budget_movement_id);

    if (!bmm_budget_movement_id) {
      return {
        statusCode: 400,
        message: "bmm_budget_movement_id is required",
      };
    }

    // Get reference number from master
    const master = await prisma.budget_movement_master.findUnique({
      where: {
        bmm_budget_movement_id: bmm_budget_movement_id,
      },
    });

    if (!master) {
      return {
        statusCode: 404,
        message: "Budget movement master not found",
      };
    }

    // Fetch process flow data (simplified - would need workflow tables)
    // For now, return empty array as workflow integration is complex
    const processFlow = [];

    return {
      statusCode: 200,
      data: processFlow,
    };
  } catch (error) {
    console.error("Error fetching process flow:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch process flow",
      error: error.message,
    };
  }
});

