import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(getRouterParam(event, "id"));

    if (!id) {
      return {
        statusCode: 400,
        message: "Activity type ID is required",
      };
    }

    // Check if there are dependent records (e.g., in structure_budget, org_unit_costcentre, etc.)
    // For now, we'll allow deletion but this can be enhanced with proper checks

    // Delete activity type
    await prisma.activity_type.delete({
      where: { at_activity_id: id },
    });

    return {
      statusCode: 200,
      message: "Activity type deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting activity type:", error);
    if (error.code === "P2025") {
      return {
        statusCode: 404,
        message: "Activity type not found",
      };
    }
    return {
      statusCode: 500,
      message: error.message || "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    };
  }
});
