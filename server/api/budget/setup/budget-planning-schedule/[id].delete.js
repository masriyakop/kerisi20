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
    
    // Delete schedule
    await prisma.budget_planning_schedule.delete({
      where: {
        bps_id: parseInt(id),
      },
    });
    
    return {
      statusCode: 200,
      message: "Budget planning schedule deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting budget planning schedule:", error);
    
    if (error.code === 'P2025') {
      return {
        statusCode: 404,
        message: "Budget planning schedule not found",
      };
    }
    
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    };
  }
});

