import prisma from "~/server/utils/prisma";

/**
 * DELETE /api/workflow-configuration/process/[id]
 * Delete a workflow process (wf_process) - cascades to details and authorized roles
 */
export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(getRouterParam(event, "id"));

    if (!id || isNaN(id)) {
      return {
        statusCode: 400,
        message: "Process ID is required",
      };
    }

    await prisma.wf_process.delete({
      where: { wfp_process_id: id },
    });

    return {
      statusCode: 200,
      message: "Process deleted successfully",
    };
  } catch (error) {
    if (error.code === "P2025") {
      return {
        statusCode: 404,
        message: "Process not found",
      };
    }
    console.error("Error deleting process:", error);
    return {
      statusCode: 500,
      message: "Failed to delete process",
      error: error.message,
    };
  }
});
