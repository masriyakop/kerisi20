import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    
    // Validation
    if (!body.lbc_level || !body.lbc_budget_code || !body.lbc_status) {
      return {
        statusCode: 400,
        message: "Level, Budget Code, and Status are required",
      };
    }
    
    // Check if budget code already exists (check by level and budget code combination)
    const existing = await prisma.lkp_budget_code.findFirst({
      where: {
        lbc_level: body.lbc_level,
        lbc_budget_code: body.lbc_budget_code,
      },
    });
    
    if (existing) {
      return {
        statusCode: 400,
        message: `Budget code "${body.lbc_budget_code}" with level "${body.lbc_level}" already exists`,
      };
    }
    
    // Check if budget code already exists (unique constraint)
    const existingByCode = await prisma.lkp_budget_code.findUnique({
      where: {
        lbc_budget_code: body.lbc_budget_code,
      },
    });
    
    if (existingByCode) {
      return {
        statusCode: 400,
        message: "Budget code already exists",
      };
    }
    
    // Get the next available ID
    const maxId = await prisma.lkp_budget_code.findFirst({
      orderBy: {
        lbc_id: 'desc',
      },
      select: {
        lbc_id: true,
      },
    });
    
    const nextId = maxId ? maxId.lbc_id + 1 : 1;
    
    // Convert status: ACTIVE -> '1', INACTIVE -> '0'
    const statusValue = body.lbc_status === 'ACTIVE' ? '1' : 
                       body.lbc_status === 'INACTIVE' ? '0' : 
                       body.lbc_status;
    
    // Get user from context (if available)
    const user = event.context.user || event.context.userId || 'system';
    const username = typeof user === 'string' ? user : (user?.username || user?.USERNAME || 'system');
    
    // Create new budget code
    const budgetCode = await prisma.lkp_budget_code.create({
      data: {
        lbc_id: nextId,
        lbc_level: body.lbc_level,
        lbc_budget_code: body.lbc_budget_code,
        lbc_description: body.lbc_description || '',
        lbc_status: statusValue,
        createddate: new Date(),
        createdby: username,
      },
    });
    
    return {
      statusCode: 201,
      message: "Budget code created successfully",
      data: {
        lbc_id: budgetCode.lbc_id.toString(),
        lbc_level: budgetCode.lbc_level,
        lbc_budget_code: budgetCode.lbc_budget_code,
        lbc_description: budgetCode.lbc_description || '',
        lbc_status: budgetCode.lbc_status === '1' ? 'ACTIVE' : 'INACTIVE',
      },
    };
  } catch (error) {
    console.error("Error creating budget code:", error);
    
    if (error.code === 'P2002') {
      return {
        statusCode: 400,
        message: "Budget code already exists",
      };
    }
    
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    };
  }
});
