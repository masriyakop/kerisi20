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
    
    const budgetCode = await prisma.lkp_budget_code.findUnique({
      where: {
        lbc_id: parseInt(id),
      },
    });
    
    if (!budgetCode) {
      return {
        statusCode: 404,
        message: "Budget code not found",
      };
    }
    
    // Convert status to ACTIVE/INACTIVE
    const status = budgetCode.lbc_status === '1' || budgetCode.lbc_status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE';
    
    return {
      statusCode: 200,
      message: "Budget code fetched successfully",
      data: {
        lbc_id: budgetCode.lbc_id.toString(),
        lbc_level: budgetCode.lbc_level,
        lbc_budget_code: budgetCode.lbc_budget_code,
        lbc_description: budgetCode.lbc_description || '',
        lbc_status: status,
      },
    };
  } catch (error) {
    console.error("Error fetching budget code:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    };
  }
});
