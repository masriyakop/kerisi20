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
    
    // Delete details first
    await prisma.budget_planning_details.deleteMany({
      where: {
        bpm_id: BigInt(id),
      },
    });
    
    // Delete master
    await prisma.budget_planning_master.delete({
      where: {
        bpm_id: BigInt(id),
      },
    });
    
    return {
      statusCode: 200,
      message: "Budget planning deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting budget planning:", error);
    
    if (error.code === 'P2025') {
      return {
        statusCode: 404,
        message: "Budget planning not found",
      };
    }
    
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    };
  }
});

