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

    return {
      statusCode: 200,
      data: master,
    };
  } catch (error) {
    console.error("Error fetching master data:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch master data",
      error: error.message,
    };
  }
});

