import prisma from "~/server/utils/prisma";

/**
 * PUT /api/workflow-configuration/workflow/[code]
 * Update a workflow (wf_workflow_name)
 */
export default defineEventHandler(async (event) => {
  try {
    const code = getRouterParam(event, "code");
    const body = await readBody(event);

    if (!code) {
      return {
        statusCode: 400,
        message: "Workflow code is required",
      };
    }

    const workflow = await prisma.wf_workflow_name.update({
      where: { wfa_workflow_code: code },
      data: {
        wfa_workflow_title: body.wfa_workflow_title,
        wfa_prevent_self_process: body.wfa_prevent_self_process ?? null,
        wfa_involve_posting: body.wfa_involve_posting ?? 1,
      },
    });

    return {
      statusCode: 200,
      message: "Workflow updated successfully",
      data: workflow,
    };
  } catch (error) {
    if (error.code === "P2025") {
      return {
        statusCode: 404,
        message: "Workflow not found",
      };
    }
    console.error("Error updating workflow:", error);
    return {
      statusCode: 500,
      message: "Failed to update workflow",
      error: error.message,
    };
  }
});
