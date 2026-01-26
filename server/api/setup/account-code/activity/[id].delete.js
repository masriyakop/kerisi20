import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');

    if (!id) {
      return {
        statusCode: 400,
        message: "Account activity ID is required",
      };
    }

    // Check if account activity exists
    const existing = await prisma.lookup_details.findUnique({
      where: {
        lde_id: parseInt(id),
      },
    });

    if (!existing || existing.lma_code_name !== 'ACCOUNT_ACTIVITY') {
      return {
        statusCode: 404,
        message: "Account activity not found",
      };
    }

    // Check if it's being used by account_main (level 1)
    const usedInAccounts = await prisma.account_main.findFirst({
      where: {
        acm_acct_activity: existing.lde_value,
        acm_acct_level: '1',
      },
    });

    if (usedInAccounts) {
      return {
        statusCode: 409,
        message: "Cannot delete account activity because it is being used by account classes",
      };
    }

    // Delete account activity
    await prisma.lookup_details.delete({
      where: {
        lde_id: parseInt(id),
      },
    });

    return {
      statusCode: 200,
      message: "Account activity deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting account activity:", error);
    
    // Check if it's a foreign key constraint error
    if (error.code === 'P2003' || error.message.includes('Foreign key constraint')) {
      return {
        statusCode: 409,
        message: "Cannot delete account activity because it is being used by other records",
        error: error.message,
      };
    }
    
    return {
      statusCode: 500,
      message: "An error occurred while deleting account activity",
      error: error.message,
    };
  }
});
