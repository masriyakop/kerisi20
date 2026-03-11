import prisma from "~/server/utils/prisma";

/**
 * POST /api/workflow-configuration/process
 * Create a new workflow process (wf_process)
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    if (!body.wfp_workflow_code || !body.wfp_process_name || body.wfp_sequence == null) {
      return {
        statusCode: 400,
        message: "Workflow code, process name, and sequence are required",
      };
    }

    const process = await prisma.wf_process.create({
      data: {
        wfp_workflow_code: body.wfp_workflow_code,
        wfp_process_name: body.wfp_process_name,
        wfp_process_desc_bm: body.wfp_process_desc_bm ?? null,
        wfp_process_desc_bi: body.wfp_process_desc_bi ?? null,
        wfp_sequence: parseInt(body.wfp_sequence) || 0,
        wfp_status: body.wfp_status ?? "1",
        wfp_duration_kpi: body.wfp_duration_kpi ?? null,
        wfp_duration_kpi_withquery: body.wfp_duration_kpi_withquery ?? null,
        wfp_is_email_notification: body.wfp_is_email_notification ?? 1,
        wfp_is_todo_notification: body.wfp_is_todo_notification ?? 1,
        wfp_is_by_unit: body.wfp_is_by_unit ?? null,
        wfp_is_by_ptj: body.wfp_is_by_ptj ?? null,
        wfp_is_allow_query: body.wfp_is_allow_query ?? null,
      },
    });

    return {
      statusCode: 200,
      message: "Process created successfully",
      data: process,
    };
  } catch (error) {
    console.error("Error creating process:", error);
    return {
      statusCode: 500,
      message: "Failed to create process",
      error: error.message,
    };
  }
});
