import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');

    if (!id) {
      return {
        statusCode: 400,
        message: "Fund type ID is required",
      };
    }

    // Check if fund type exists
    const existingFundType = await prisma.fund_type.findUnique({
      where: {
        fty_fund_id: parseInt(id),
      },
    });

    if (!existingFundType) {
      return {
        statusCode: 404,
        message: "Fund type not found",
      };
    }

    // Delete fund type
    await prisma.fund_type.delete({
      where: {
        fty_fund_id: parseInt(id),
      },
    });

    return {
      statusCode: 200,
      message: "Fund type deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting fund type:", error);
    
    // Check if it's a foreign key constraint error
    if (error.code === 'P2003' || error.message.includes('Foreign key constraint')) {
      return {
        statusCode: 409,
        message: "Cannot delete fund type because it is being used by other records",
        error: error.message,
      };
    }

    return {
      statusCode: 500,
      message: "An error occurred while deleting fund type",
      error: error.message,
    };
  }
});

