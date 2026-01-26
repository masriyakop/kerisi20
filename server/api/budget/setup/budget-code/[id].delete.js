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
    
    // Get the budget code first
    const budgetCode = await prisma.lkp_budget_code.findUnique({
      where: {
        lbc_id: parseInt(id),
      },
      select: {
        lbc_budget_code: true,
      },
    });
    
    if (!budgetCode) {
      return {
        statusCode: 404,
        message: "Budget code not found",
      };
    }
    
    // Check if budget code is being used in structure_budget
    const usedInStructure = await prisma.structure_budget.findFirst({
      where: {
        lbc_budget_code: budgetCode.lbc_budget_code,
      },
    });
    
    if (usedInStructure) {
      return {
        statusCode: 400,
        message: "Cannot delete budget code. It is being used in budget structure.",
      };
    }
    
    // Delete budget code
    await prisma.lkp_budget_code.delete({
      where: {
        lbc_id: parseInt(id),
      },
    });
    
    return {
      statusCode: 200,
      message: "Budget code deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting budget code:", error);
    
    if (error.code === 'P2025') {
      return {
        statusCode: 404,
        message: "Budget code not found",
      };
    }
    
    // Handle foreign key constraint error
    if (error.code === 'P2003') {
      return {
        statusCode: 400,
        message: "Cannot delete budget code. It is being used in budget structure.",
      };
    }
    
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    };
  }
});

