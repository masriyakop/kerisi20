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
    
    // Delete allocation
    await prisma.quarter_budget.delete({
      where: {
        qbu_quarter_id: BigInt(id),
      },
    });
    
    return {
      statusCode: 200,
      message: "Allocation deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting allocation:", error);
    
    if (error.code === 'P2025') {
      return {
        statusCode: 404,
        message: "Allocation not found",
      };
    }
    
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    };
  }
});

