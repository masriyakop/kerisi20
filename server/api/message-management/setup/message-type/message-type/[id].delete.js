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

    // Check if record exists before deleting
    const existingRecord = await prisma.lookup_details.findUnique({
      where: { lde_id: parseInt(id) },
    });

    if (!existingRecord) {
      return {
        statusCode: 404,
        message: "Record not found",
      };
    }

    // Delete record
    await prisma.lookup_details.delete({
      where: { lde_id: parseInt(id) },
    });

    return {
      statusCode: 200,
      message: "Record deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting record:", error);
    
    // Handle Prisma-specific errors
    if (error.code === 'P2025') {
      return {
        statusCode: 404,
        message: "Record not found",
      };
    }
    
    if (error.code === 'P2003') {
      return {
        statusCode: 400,
        message: "Cannot delete record. It is referenced by other records.",
        error: "Foreign key constraint violation",
      };
    }
    
    return {
      statusCode: 500,
      message: "Failed to delete record",
      error: "development" === 'development' ? error.message : "An error occurred while deleting the record",
    };
  }
});
