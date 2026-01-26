import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const query = getQuery(event);
    
    // Determine which level to create
    const level = query.level || body.acm_acct_level ? parseInt(body.acm_acct_level) : null;
    
    if (level === null || level < 1 || level > 5) {
      return {
        statusCode: 400,
        message: "Please specify a valid level (1-5)",
      };
    }

    // Validate required fields
    if (!body.acm_acct_code || !body.acm_acct_desc || !body.acm_acct_status) {
      return {
        statusCode: 400,
        message: "Missing required fields: acm_acct_code, acm_acct_desc, and acm_acct_status are required",
      };
    }

    // Check if account code already exists
    const existing = await prisma.account_main.findUnique({
      where: {
        acm_acct_code: body.acm_acct_code,
      },
    });

    if (existing) {
      return {
        statusCode: 409,
        message: "Account code already exists",
      };
    }

    // Validate parent exists if provided (for levels 2-5)
    if (level > 1 && body.acm_acct_parent) {
      const parent = await prisma.account_main.findUnique({
        where: {
          acm_acct_code: body.acm_acct_parent,
        },
      });

      if (!parent) {
        return {
          statusCode: 404,
          message: "Parent account code not found",
        };
      }
    }

    // Validate activity exists if provided (for level 1)
    if (level === 1 && body.acm_acct_activity) {
      const activity = await prisma.lookup_details.findFirst({
        where: {
          lma_code_name: 'ACCOUNT_ACTIVITY',
          lde_value: body.acm_acct_activity,
        },
      });

      if (!activity) {
        return {
          statusCode: 404,
          message: "Account activity not found",
        };
      }
    }

    // Create new account
    const newAccount = await prisma.account_main.create({
      data: {
        acm_acct_code: body.acm_acct_code,
        acm_acct_desc: body.acm_acct_desc,
        acm_acct_desc_eng: body.acm_acct_desc_eng || null,
        acm_acct_activity: body.acm_acct_activity || null,
        acm_acct_group: body.acm_acct_group || null,
        acm_acct_status: body.acm_acct_status === 'ACTIVE' ? '1' : '0',
        acm_acct_level: level.toString(),
        acm_acct_parent: body.acm_acct_parent || null,
        createddate: new Date(),
        updateddate: new Date(),
      },
    });

    return {
      statusCode: 200,
      message: `Account level ${level} created successfully`,
      data: {
        acm_acct_code: newAccount.acm_acct_code,
        acm_acct_desc: newAccount.acm_acct_desc,
        acm_acct_desc_eng: newAccount.acm_acct_desc_eng,
        acm_acct_activity: newAccount.acm_acct_activity,
        acm_acct_group: newAccount.acm_acct_group,
        acm_acct_status: newAccount.acm_acct_status === '1' || newAccount.acm_acct_status === 1 ? 'ACTIVE' : 'INACTIVE',
        acm_acct_level: newAccount.acm_acct_level ? Number(newAccount.acm_acct_level) : null,
        acm_acct_parent: newAccount.acm_acct_parent,
      },
    };
  } catch (error) {
    console.error("Error creating account:", error);
    
    if (error.code === 'P2002') {
      return {
        statusCode: 409,
        message: "Account code already exists",
        error: error.message,
      };
    }
    
    return {
      statusCode: 500,
      message: "An error occurred while creating account",
      error: error.message,
    };
  }
});
