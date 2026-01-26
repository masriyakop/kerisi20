import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');

    if (!id) {
      return {
        statusCode: 400,
        message: "Account code ID is required",
      };
    }

    // Check if account code exists
    const existingAccountCode = await prisma.account_code.findUnique({
      where: {
        id: BigInt(id),
      },
    });

    if (!existingAccountCode) {
      return {
        statusCode: 404,
        message: "Account code not found",
      };
    }

    // Delete account code
    await prisma.account_code.delete({
      where: {
        id: BigInt(id),
      },
    });

    return {
      statusCode: 200,
      message: "Account code deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting account code:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    };
  }
});

