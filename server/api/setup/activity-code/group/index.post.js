import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { activity_group_code, activity_group_desc } = body;

    // Validation
    if (!activity_group_code || !activity_group_desc) {
      return {
        statusCode: 400,
        message: "activity_group_code and activity_group_desc are required",
      };
    }

    // Check if code already exists
    const existing = await prisma.activity_group.findUnique({
      where: { activity_group_code },
    });

    if (existing) {
      return {
        statusCode: 400,
        message: "Activity group code already exists",
      };
    }

    // Create new activity group
    const newGroup = await prisma.activity_group.create({
      data: {
        activity_group_code,
        activity_group_desc,
        activity_group_flag_kodso: "0", // Default value
        createddate: new Date(),
      },
    });

    return {
      statusCode: 201,
      message: "Activity group created successfully",
      data: newGroup,
    };
  } catch (error) {
    console.error("Error creating activity group:", error);
    return {
      statusCode: 500,
      message: error.message || "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    };
  }
});
