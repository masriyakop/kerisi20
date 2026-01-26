import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { activity_group, activity_subgroup_code, activity_subsiri_code, activity_subsiri_desc, activity_subsiri_desc_eng } = body;

    // Validation
    if (!activity_group || !activity_subgroup_code || !activity_subsiri_code || !activity_subsiri_desc) {
      return {
        statusCode: 400,
        message: "activity_group, activity_subgroup_code, activity_subsiri_code, and activity_subsiri_desc are required",
      };
    }

    // Check if code already exists
    const existing = await prisma.activity_subsiri.findUnique({
      where: {
        activity_subsiri_code_activity_subgroup_code_activity_group: {
          activity_subsiri_code,
          activity_subgroup_code,
          activity_group,
        },
      },
    });

    if (existing) {
      return {
        statusCode: 400,
        message: "Activity subsiri code already exists for this group and subgroup",
      };
    }

    // Create new activity subsiri
    const newSubsiri = await prisma.activity_subsiri.create({
      data: {
        activity_group,
        activity_subgroup_code,
        activity_subsiri_code,
        activity_subsiri_desc,
        activity_subsiri_desc_eng: activity_subsiri_desc_eng || null,
        createddate: new Date(),
      },
    });

    return {
      statusCode: 201,
      message: "Activity subsiri created successfully",
      data: newSubsiri,
    };
  } catch (error) {
    console.error("Error creating activity subsiri:", error);
    return {
      statusCode: 500,
      message: error.message || "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    };
  }
});
