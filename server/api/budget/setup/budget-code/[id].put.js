import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);
    
    if (!id) {
      return {
        statusCode: 400,
        message: "ID is required",
      };
    }
    
    // Validation
    if (body.lbc_level !== undefined && !body.lbc_level) {
      return {
        statusCode: 400,
        message: "Level is required",
      };
    }
    
    if (body.lbc_budget_code !== undefined && !body.lbc_budget_code) {
      return {
        statusCode: 400,
        message: "Budget Code is required",
      };
    }
    
    if (body.lbc_status !== undefined && !body.lbc_status) {
      return {
        statusCode: 400,
        message: "Status is required",
      };
    }
    
    // Check if budget code exists
    const existing = await prisma.lkp_budget_code.findUnique({
      where: {
        lbc_id: parseInt(id),
      },
    });
    
    if (!existing) {
      return {
        statusCode: 404,
        message: "Budget code not found",
      };
    }
    
    // Check if budget code is being changed and if new code already exists
    if (body.lbc_budget_code && body.lbc_budget_code !== existing.lbc_budget_code) {
      const codeExists = await prisma.lkp_budget_code.findUnique({
        where: {
          lbc_budget_code: body.lbc_budget_code,
        },
      });
      
      if (codeExists) {
        return {
          statusCode: 400,
          message: "Budget code already exists",
        };
      }
    }
    
    // Convert status: ACTIVE -> '1', INACTIVE -> '0'
    const statusValue = body.lbc_status === 'ACTIVE' ? '1' : 
                       body.lbc_status === 'INACTIVE' ? '0' : 
                       body.lbc_status;
    
    // Get user from context (if available)
    const user = event.context.user || event.context.userId || 'system';
    const username = typeof user === 'string' ? user : (user?.username || user?.USERNAME || 'system');
    
    // Update budget code - allow updating all fields (frontend supports it)
    // Note: Original business logic only updated status, but frontend allows full edit
    const updateData = {
      updateddate: new Date(),
      updatedby: username,
    };
    
    // Only update fields that are provided
    if (body.lbc_level !== undefined) updateData.lbc_level = body.lbc_level;
    if (body.lbc_budget_code !== undefined) updateData.lbc_budget_code = body.lbc_budget_code;
    if (body.lbc_description !== undefined) updateData.lbc_description = body.lbc_description || '';
    if (body.lbc_status !== undefined) updateData.lbc_status = statusValue;
    
    const budgetCode = await prisma.lkp_budget_code.update({
      where: {
        lbc_id: parseInt(id),
      },
      data: updateData,
    });
    
    return {
      statusCode: 200,
      message: "Budget code updated successfully",
      data: {
        lbc_id: budgetCode.lbc_id.toString(),
        lbc_level: budgetCode.lbc_level,
        lbc_budget_code: budgetCode.lbc_budget_code,
        lbc_description: budgetCode.lbc_description || '',
        lbc_status: budgetCode.lbc_status === '1' ? 'ACTIVE' : 'INACTIVE',
      },
    };
  } catch (error) {
    console.error("Error updating budget code:", error);
    
    if (error.code === 'P2025') {
      return {
        statusCode: 404,
        message: "Budget code not found",
      };
    }
    
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    };
  }
});
