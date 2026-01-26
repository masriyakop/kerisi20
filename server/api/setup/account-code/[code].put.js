import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const code = getRouterParam(event, 'code');
    const body = await readBody(event);

    if (!code) {
      return {
        statusCode: 400,
        message: "Account code is required",
      };
    }

    // Check if account exists
    const existing = await prisma.account_main.findUnique({
      where: {
        acm_acct_code: code,
      },
    });

    if (!existing) {
      return {
        statusCode: 404,
        message: "Account code not found",
      };
    }

    // If account code is being changed, check if new code already exists
    if (body.acm_acct_code && body.acm_acct_code !== code) {
      const duplicate = await prisma.account_main.findUnique({
        where: {
          acm_acct_code: body.acm_acct_code,
        },
      });

      if (duplicate) {
        return {
          statusCode: 409,
          message: "Account code already exists",
        };
      }
    }

    // Validate parent exists if provided and changed
    if (body.acm_acct_parent && body.acm_acct_parent !== existing.acm_acct_parent) {
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

    // Validate activity exists if provided and changed
    if (body.acm_acct_activity && body.acm_acct_activity !== existing.acm_acct_activity) {
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

    // Update account
    const updated = await prisma.account_main.update({
      where: {
        acm_acct_code: code,
      },
      data: {
        acm_acct_code: body.acm_acct_code || existing.acm_acct_code,
        acm_acct_desc: body.acm_acct_desc || existing.acm_acct_desc,
        acm_acct_desc_eng: body.acm_acct_desc_eng !== undefined ? body.acm_acct_desc_eng : existing.acm_acct_desc_eng,
        acm_acct_activity: body.acm_acct_activity !== undefined ? body.acm_acct_activity : existing.acm_acct_activity,
        acm_acct_group: body.acm_acct_group !== undefined ? body.acm_acct_group : existing.acm_acct_group,
        acm_acct_status: body.acm_acct_status ? (body.acm_acct_status === 'ACTIVE' ? '1' : '0') : existing.acm_acct_status,
        acm_acct_parent: body.acm_acct_parent !== undefined ? body.acm_acct_parent : existing.acm_acct_parent,
        updateddate: new Date(),
      },
    });

    return {
      statusCode: 200,
      message: "Account updated successfully",
      data: {
        acm_acct_code: updated.acm_acct_code,
        acm_acct_desc: updated.acm_acct_desc,
        acm_acct_desc_eng: updated.acm_acct_desc_eng,
        acm_acct_activity: updated.acm_acct_activity,
        acm_acct_group: updated.acm_acct_group,
        acm_acct_status: updated.acm_acct_status === '1' || updated.acm_acct_status === 1 ? 'ACTIVE' : 'INACTIVE',
        acm_acct_level: updated.acm_acct_level ? Number(updated.acm_acct_level) : null,
        acm_acct_parent: updated.acm_acct_parent,
      },
    };
  } catch (error) {
    console.error("Error updating account:", error);
    
    if (error.code === 'P2002') {
      return {
        statusCode: 409,
        message: "Account code already exists",
        error: error.message,
      };
    }
    
    return {
      statusCode: 500,
      message: "An error occurred while updating account",
      error: error.message,
    };
  }
});
