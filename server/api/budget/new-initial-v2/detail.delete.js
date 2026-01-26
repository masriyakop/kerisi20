import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const bad_detl_id = parseInt(query.bad_detl_id);

    if (!bad_detl_id) {
      return {
        statusCode: 400,
        message: "bad_detl_id is required",
      };
    }

    // Get detail to get master ID before deletion
    const detail = await prisma.budget_movement_detl.findUnique({
      where: {
        bmd_bgt_movement_detl_id: bad_detl_id,
      },
    });

    if (!detail) {
      return {
        statusCode: 404,
        message: "Detail not found",
      };
    }

    const masterId = detail.bmm_budget_movement_id;

    // Delete detail record
    await prisma.budget_movement_detl.delete({
      where: {
        bmd_bgt_movement_detl_id: bad_detl_id,
      },
    });

    // Update master total amount
    const master = await prisma.budget_movement_master.findUnique({
      where: { bmm_budget_movement_id: masterId },
      include: {
        budget_movement_detl: true,
      },
    });

    if (master) {
      const totalAmt = master.budget_movement_detl.reduce(
        (sum, d) => sum + (parseFloat(d.bmd_mvt_amt) || 0),
        0
      );
      await prisma.budget_movement_master.update({
        where: { bmm_budget_movement_id: masterId },
        data: { bmm_total_amt: totalAmt },
      });
    }

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

