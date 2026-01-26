import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const code = getRouterParam(event, "code");

    if (!code) {
      return {
        statusCode: 400,
        message: "Activity group code is required",
      };
    }

    // Check if there are dependent records
    const hasSubgroups = await prisma.activity_subgroup.findFirst({
      where: { activity_group_code: code },
    });

    if (hasSubgroups) {
      return {
        statusCode: 400,
        message: "Cannot delete activity group with existing subgroups",
      };
    }

    // Delete activity group
    await prisma.activity_group.delete({
      where: { activity_group_code: code },
    });

    return {
      statusCode: 200,
      message: "Activity group deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting activity group:", error);
    if (error.code === "P2025") {
      return {
        statusCode: 404,
        message: "Activity group not found",
      };
    }
    return {
      statusCode: 500,
      message: error.message || "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    };
  }
});
