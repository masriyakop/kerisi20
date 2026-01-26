import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { activity_group_code, activity_subgroup_code, activity_subgroup_desc } = body;

    // Validation
    if (!activity_group_code || !activity_subgroup_code || !activity_subgroup_desc) {
      return {
        statusCode: 400,
        message: "activity_group_code, activity_subgroup_code, and activity_subgroup_desc are required",
      };
    }

    // Check if code already exists
    const existing = await prisma.activity_subgroup.findUnique({
      where: {
        activity_subgroup_code_activity_group_code: {
          activity_subgroup_code,
          activity_group_code,
        },
      },
    });

    if (existing) {
      return {
        statusCode: 400,
        message: "Activity subgroup code already exists for this group",
      };
    }

    // Create new activity subgroup
    const newSubgroup = await prisma.activity_subgroup.create({
      data: {
        activity_group_code,
        activity_subgroup_code,
        activity_subgroup_desc,
        createddate: new Date(),
      },
    });

    return {
      statusCode: 201,
      message: "Activity subgroup created successfully",
      data: newSubgroup,
    };
  } catch (error) {
    console.error("Error creating activity subgroup:", error);
    return {
      statusCode: 500,
      message: error.message || "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    };
  }
});
