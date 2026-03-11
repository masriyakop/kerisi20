import prisma from "~/server/utils/prisma";

/**
 * POST /api/workflow-configuration/workflow
 * Create a new workflow (wf_workflow_name)
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    if (!body.wfa_workflow_code || !body.wfa_workflow_title) {
      return {
        statusCode: 400,
        message: "Workflow code and title are required",
      };
    }

    const existing = await prisma.wf_workflow_name.findUnique({
      where: { wfa_workflow_code: body.wfa_workflow_code },
    });
    if (existing) {
      return {
        statusCode: 400,
        message: "Workflow code already exists",
      };
    }

    const workflow = await prisma.wf_workflow_name.create({
      data: {
        wfa_workflow_code: body.wfa_workflow_code,
        wfa_workflow_title: body.wfa_workflow_title,
        wfa_prevent_self_process: body.wfa_prevent_self_process ?? null,
        wfa_involve_posting: body.wfa_involve_posting ?? 1,
      },
    });

    return {
      statusCode: 200,
      message: "Workflow created successfully",
      data: workflow,
    };
  } catch (error) {
    console.error("Error creating workflow:", error);
    return {
      statusCode: 500,
      message: "Failed to create workflow",
      error: error.message,
    };
  }
});
