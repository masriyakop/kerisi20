import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const code = getRouterParam(event, "code");
    const query = getQuery(event);
    const activity_group = query.activity_group;
    const activity_subgroup_code = query.activity_subgroup_code;

    if (!code || !activity_group || !activity_subgroup_code) {
      return {
        statusCode: 400,
        message: "activity_subsiri_code, activity_group, and activity_subgroup_code are required",
      };
    }

    // Check if there are dependent records
    const hasActivityTypes = await prisma.activity_type.findFirst({
      where: {
        activity_group_code: activity_group,
        activity_subgroup_code,
        activity_subsiri_code: code,
      },
    });

    if (hasActivityTypes) {
      return {
        statusCode: 400,
        message: "Cannot delete activity subsiri with existing activity types",
      };
    }

    // Delete activity subsiri
    await prisma.activity_subsiri.delete({
      where: {
        activity_subsiri_code_activity_subgroup_code_activity_group: {
          activity_subsiri_code: code,
          activity_subgroup_code,
          activity_group,
        },
      },
    });

    return {
      statusCode: 200,
      message: "Activity subsiri deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting activity subsiri:", error);
    if (error.code === "P2025") {
      return {
        statusCode: 404,
        message: "Activity subsiri not found",
      };
    }
    return {
      statusCode: 500,
      message: error.message || "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    };
  }
});
