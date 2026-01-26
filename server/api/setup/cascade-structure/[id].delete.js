import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");

    if (!id) {
      return {
        statusCode: 400,
        message: "Cascade structure ID is required",
      };
    }

    // Delete cascade structure
    await prisma.org_unit_costcentre.delete({
      where: { ouc_ounit_costcentre_id: parseInt(id) },
    });

    return {
      statusCode: 200,
      message: "Cascade structure deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting cascade structure:", error);
    if (error.code === "P2025") {
      return {
        statusCode: 404,
        message: "Cascade structure not found",
      };
    }
    if (error.code === "P2003") {
      return {
        statusCode: 400,
        message: "Cannot delete cascade structure with existing dependencies",
      };
    }
    return {
      statusCode: 500,
      message: error.message || "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    };
  }
});
