import prisma from "~/server/utils/prisma";

/**
 * GET /api/workflow-configuration/[code]/processes
 * List workflow processes for a given workflow code
 * Maps to: SELECT ... FROM wf_process WHERE wfp_workflow_code = ? ORDER BY wfp_sequence
 */
export default defineEventHandler(async (event) => {
  try {
    const code = getRouterParam(event, "code");
    if (!code) {
      return {
        statusCode: 400,
        message: "Workflow code is required",
        data: [],
      };
    }

    const processes = await prisma.wf_process.findMany({
      where: {
        wfp_workflow_code: code,
      },
      select: {
        wfp_process_id: true,
        wfp_workflow_code: true,
        wfp_process_name: true,
        wfp_process_desc_bm: true,
        wfp_sequence: true,
        wfp_duration_kpi: true,
        wfp_duration_kpi_withquery: true,
        wfp_status: true,
        wfp_is_email_notification: true,
        wfp_is_todo_notification: true,
        wfp_is_by_unit: true,
        wfp_is_by_ptj: true,
        wfp_is_allow_query: true,
      },
      orderBy: {
        wfp_sequence: "asc",
      },
    });

    return {
      statusCode: 200,
      message: "Workflow processes fetched successfully",
      data: processes,
    };
  } catch (error) {
    console.error("Error fetching workflow processes:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch workflow processes",
      error: error.message,
    };
  }
});
