import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const code = getRouterParam(event, "code");
    const query = getQuery(event);
    const activity_group_code = query.activity_group_code;

    if (!code || !activity_group_code) {
      return {
        statusCode: 400,
        message: "activity_subgroup_code and activity_group_code are required",
      };
    }

    // Check if there are dependent records
    const hasSubsiris = await prisma.activity_subsiri.findFirst({
      where: {
        activity_group: activity_group_code,
        activity_subgroup_code: code,
      },
    });

    if (hasSubsiris) {
      return {
        statusCode: 400,
        message: "Cannot delete activity subgroup with existing subsiris",
      };
    }

    // Delete activity subgroup
    await prisma.activity_subgroup.delete({
      where: {
        activity_subgroup_code_activity_group_code: {
          activity_subgroup_code: code,
          activity_group_code,
        },
      },
    });

    return {
      statusCode: 200,
      message: "Activity subgroup deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting activity subgroup:", error);
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
