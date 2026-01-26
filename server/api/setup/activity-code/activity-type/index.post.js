import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const {
      activity_group_code,
      activity_subgroup_code,
      activity_subsiri_code,
      at_activity_code,
      at_activity_description_bm,
      at_activity_description_en,
      at_status,
    } = body;

    // Validation
    if (!activity_group_code || !activity_subgroup_code || !activity_subsiri_code || !at_activity_code || !at_activity_description_bm || !at_status) {
      return {
        statusCode: 400,
        message: "All required fields must be provided",
      };
    }

    // Check if code already exists
    const existing = await prisma.activity_type.findUnique({
      where: { at_activity_code },
    });

    if (existing) {
      return {
        statusCode: 400,
        message: "Activity type code already exists",
      };
    }

    // Get the next ID
    const maxId = await prisma.activity_type.findFirst({
      orderBy: { at_activity_id: "desc" },
      select: { at_activity_id: true },
    });

    const nextId = maxId ? maxId.at_activity_id + 1 : 1;

    // Create new activity type
    const newActivityType = await prisma.activity_type.create({
      data: {
        at_activity_id: nextId,
        at_activity_code,
        activity_group_code,
        activity_subgroup_code,
        activity_subsiri_code,
        at_activity_description_bm,
        at_activity_description_en: at_activity_description_en || null,
        at_status: at_status === "ACTIVE" ? "1" : "0",
        createddate: new Date(),
      },
    });

    return {
      statusCode: 201,
      message: "Activity type created successfully",
      data: newActivityType,
    };
  } catch (error) {
    console.error("Error creating activity type:", error);
    return {
      statusCode: 500,
      message: error.message || "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    };
  }
});
