import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const code = getRouterParam(event, 'code');

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

    // Check if it has child accounts
    const hasChildren = await prisma.account_main.findFirst({
      where: {
        acm_acct_parent: code,
      },
    });

    if (hasChildren) {
      return {
        statusCode: 409,
        message: "Cannot delete account code because it has child accounts",
      };
    }

    // Delete account
    await prisma.account_main.delete({
      where: {
        acm_acct_code: code,
      },
    });

    return {
      statusCode: 200,
      message: "Account code deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting account:", error);
    
    // Check if it's a foreign key constraint error
    if (error.code === 'P2003' || error.message.includes('Foreign key constraint')) {
      return {
        statusCode: 409,
        message: "Cannot delete account code because it is being used by other records",
        error: error.message,
      };
    }
    
    return {
      statusCode: 500,
      message: "An error occurred while deleting account code",
      error: error.message,
    };
  }
});
