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
    
    // Delete budget structure
    await prisma.structure_budget.delete({
      where: {
        sbg_budget_id: parseInt(id),
      },
    });
    
    return {
      statusCode: 200,
      message: "Budget structure deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting budget structure:", error);
    
    if (error.code === 'P2025') {
      return {
        statusCode: 404,
        message: "Budget structure not found",
      };
    }
    
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    };
  }
});

