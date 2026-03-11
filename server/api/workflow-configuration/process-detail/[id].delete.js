import prisma from "~/server/utils/prisma";

/**
 * DELETE /api/workflow-configuration/process-detail/[id]
 * Delete a process detail (wf_process_details)
 */
export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(getRouterParam(event, "id"));

    if (!id || isNaN(id)) {
      return {
        statusCode: 400,
        message: "Process detail ID is required",
      };
    }

    await prisma.wf_process_details.delete({
      where: { wpd_process_details_id: id },
    });

    return {
      statusCode: 200,
      message: "Process detail deleted successfully",
    };
  } catch (error) {
    if (error.code === "P2025") {
      return {
        statusCode: 404,
        message: "Process detail not found",
      };
    }
    console.error("Error deleting process detail:", error);
    return {
      statusCode: 500,
      message: "Failed to delete process detail",
      error: error.message,
    };
  }
});
