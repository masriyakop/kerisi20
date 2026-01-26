import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(getRouterParam(event, "id"));
    const body = await readBody(event);
    const {
      at_activity_description_bm,
      at_activity_description_en,
      at_status,
    } = body;

    // Validation
    if (!id) {
      return {
        statusCode: 400,
        message: "Activity type ID is required",
      };
    }

    if (!at_activity_description_bm || !at_status) {
      return {
        statusCode: 400,
        message: "at_activity_description_bm and at_status are required",
      };
    }

    // Update activity type
    const updated = await prisma.activity_type.update({
      where: { at_activity_id: id },
      data: {
        at_activity_description_bm,
        at_activity_description_en: at_activity_description_en || null,
        at_status: at_status === "ACTIVE" ? "1" : "0",
        updateddate: new Date(),
      },
    });

    return {
      statusCode: 200,
      message: "Activity type updated successfully",
      data: updated,
    };
  } catch (error) {
    console.error("Error updating activity type:", error);
    if (error.code === "P2025") {
      return {
        statusCode: 404,
        message: "Activity type not found",
      };
    }
    return {
      statusCode: 500,
      message: error.message || "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    };
  }
});
