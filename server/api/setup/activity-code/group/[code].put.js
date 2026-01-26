import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const code = getRouterParam(event, "code");
    const body = await readBody(event);
    const { activity_group_desc } = body;

    // Validation
    if (!code) {
      return {
        statusCode: 400,
        message: "Activity group code is required",
      };
    }

    if (!activity_group_desc) {
      return {
        statusCode: 400,
        message: "activity_group_desc is required",
      };
    }

    // Update activity group
    const updated = await prisma.activity_group.update({
      where: { activity_group_code: code },
      data: {
        activity_group_desc,
        updateddate: new Date(),
      },
    });

    return {
      statusCode: 200,
      message: "Activity group updated successfully",
      data: updated,
    };
  } catch (error) {
    console.error("Error updating activity group:", error);
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
