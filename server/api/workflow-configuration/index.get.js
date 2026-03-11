import prisma from "~/server/utils/prisma";

/**
 * GET /api/workflow-configuration
 * List all workflows (wf_workflow_name)
 * Maps to: SELECT wfa_workflow_code, wfa_workflow_title, wfa_prevent_self_process, wfa_involve_posting FROM wf_workflow_name ORDER BY wfa_workflow_code
 */
export default defineEventHandler(async () => {
  try {
    const workflows = await prisma.wf_workflow_name.findMany({
      select: {
        wfa_workflow_code: true,
        wfa_workflow_title: true,
        wfa_prevent_self_process: true,
        wfa_involve_posting: true,
      },
      orderBy: {
        wfa_workflow_code: "asc",
      },
    });

    return {
      statusCode: 200,
      message: "Workflows fetched successfully",
      data: workflows,
    };
  } catch (error) {
    console.error("Error fetching workflows:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch workflows",
      error: error.message,
    };
  }
});
