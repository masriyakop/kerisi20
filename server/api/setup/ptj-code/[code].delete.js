import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const code = getRouterParam(event, "code");

    if (!code) {
      return {
        statusCode: 400,
        message: "PTJ code is required",
      };
    }

    // Check if there are dependent records (child organization units)
    const hasChildren = await prisma.organization_unit.findFirst({
      where: { oun_code_parent: code },
    });

    if (hasChildren) {
      return {
        statusCode: 400,
        message: "Cannot delete PTJ code with existing child units",
      };
    }

    // Delete organization unit
    await prisma.organization_unit.delete({
      where: { oun_code: code },
    });

    return {
      statusCode: 200,
      message: "PTJ code deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting PTJ code:", error);
    if (error.code === "P2025") {
      return {
        statusCode: 404,
        message: "PTJ code not found",
      };
    }
    return {
      statusCode: 500,
      message: error.message || "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    };
  }
});
