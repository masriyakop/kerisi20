import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");

    if (!id) {
      return {
        statusCode: 400,
        message: "Cost centre ID is required",
      };
    }

    // Check if there are dependent records
    const hasDependencies = await prisma.org_unit_costcentre.findFirst({
      where: { ccr_costcentre: { not: null } },
    });

    // Delete cost centre
    await prisma.costcentre.delete({
      where: { ccr_costcentre_id: parseInt(id) },
    });

    return {
      statusCode: 200,
      message: "Cost centre deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting cost centre:", error);
    if (error.code === "P2025") {
      return {
        statusCode: 404,
        message: "Cost centre not found",
      };
    }
    if (error.code === "P2003") {
      return {
        statusCode: 400,
        message: "Cannot delete cost centre with existing dependencies",
      };
    }
    return {
      statusCode: 500,
      message: error.message || "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    };
  }
});
