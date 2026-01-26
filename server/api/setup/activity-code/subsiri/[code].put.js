import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const code = getRouterParam(event, "code");
    const body = await readBody(event);
    const { activity_group, activity_subgroup_code, activity_subsiri_desc, activity_subsiri_desc_eng } = body;

    // Validation
    if (!code || !activity_group || !activity_subgroup_code) {
      return {
        statusCode: 400,
        message: "activity_subsiri_code, activity_group, and activity_subgroup_code are required",
      };
    }

    if (!activity_subsiri_desc) {
      return {
        statusCode: 400,
        message: "activity_subsiri_desc is required",
      };
    }

    // Update activity subsiri
    const updated = await prisma.activity_subsiri.update({
      where: {
        activity_subsiri_code_activity_subgroup_code_activity_group: {
          activity_subsiri_code: code,
          activity_subgroup_code,
          activity_group,
        },
      },
      data: {
        activity_subsiri_desc,
        activity_subsiri_desc_eng: activity_subsiri_desc_eng || null,
        updateddate: new Date(),
      },
    });

    return {
      statusCode: 200,
      message: "Activity subsiri updated successfully",
      data: updated,
    };
  } catch (error) {
    console.error("Error updating activity subsiri:", error);
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
