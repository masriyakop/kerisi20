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

    // Get reference number
    const master = await prisma.budget_movement_master.findUnique({
      where: {
        bmm_budget_movement_id: bmm_budget_movement_id,
      },
      select: {
        bmm_budget_movement_no: true,
      },
    });

    if (!master || !master.bmm_budget_movement_no) {
      return {
        statusCode: 200,
        data: [],
      };
    }

    // Query workflow application status
    // Note: This would need to join with workflow tables which may not exist in Prisma schema
    // For now, returning empty array as placeholder
    // TODO: Implement actual workflow query when workflow tables are available

    return {
      statusCode: 200,
      data: [],
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

