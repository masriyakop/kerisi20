import prisma from "~/server/utils/prisma";

/**
 * DELETE /api/workflow-configuration/workflow/[code]
 * Delete a workflow (wf_workflow_name) - cascades to processes
 */
export default defineEventHandler(async (event) => {
  try {
    const code = getRouterParam(event, "code");

    if (!code) {
      return {
        statusCode: 400,
        message: "Workflow code is required",
      };
    }

    await prisma.wf_workflow_name.delete({
      where: { wfa_workflow_code: code },
    });

    return {
      statusCode: 200,
      message: "Workflow deleted successfully",
    };
  } catch (error) {
    if (error.code === "P2025") {
      return {
        statusCode: 404,
        message: "Workflow not found",
      };
    }
    console.error("Error deleting workflow:", error);
    return {
      statusCode: 500,
      message: "Failed to delete workflow",
      error: error.message,
    };
  }
});
