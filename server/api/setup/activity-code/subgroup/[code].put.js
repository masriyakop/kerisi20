import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const code = getRouterParam(event, "code");
    const body = await readBody(event);
    const { activity_group_code, activity_subgroup_desc } = body;

    // Validation
    if (!code || !activity_group_code) {
      return {
        statusCode: 400,
        message: "activity_subgroup_code and activity_group_code are required",
      };
    }

    if (!activity_subgroup_desc) {
      return {
        statusCode: 400,
        message: "activity_subgroup_desc is required",
      };
    }

    // Update activity subgroup
    const updated = await prisma.activity_subgroup.update({
      where: {
        activity_subgroup_code_activity_group_code: {
          activity_subgroup_code: code,
          activity_group_code,
        },
      },
      data: {
        activity_subgroup_desc,
        updateddate: new Date(),
      },
    });

    return {
      statusCode: 200,
      message: "Activity subgroup updated successfully",
      data: updated,
    };
  } catch (error) {
    console.error("Error updating activity subgroup:", error);
    if (error.code === "P2025") {
      return {
        statusCode: 404,
        message: "Activity subgroup not found",
      };
    }
    return {
      statusCode: 500,
      message: error.message || "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    };
  }
});
