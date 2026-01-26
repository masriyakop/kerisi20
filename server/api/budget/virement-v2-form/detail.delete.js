import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const bmd_bgt_movement_detl_id = parseInt(query.bmd_bgt_movement_detl_id);

    if (!bmd_bgt_movement_detl_id) {
      return {
        statusCode: 400,
        message: "bmd_bgt_movement_detl_id is required",
      };
    }

    await prisma.budget_movement_detl.delete({
      where: {
        bmd_bgt_movement_detl_id: bmd_bgt_movement_detl_id,
      },
    });

    return {
      statusCode: 200,
      message: "Detail deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting detail:", error);
    return {
      statusCode: 500,
      message: "Failed to delete detail",
      error: error.message,
    };
  }
});

