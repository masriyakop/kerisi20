import prisma from "~/server/utils/prisma";

/**
 * PUT /api/workflow-configuration/process/[id]
 * Update a workflow process (wf_process)
 */
export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(getRouterParam(event, "id"));
    const body = await readBody(event);

    if (!id || isNaN(id)) {
      return {
        statusCode: 400,
        message: "Process ID is required",
      };
    }

    const process = await prisma.wf_process.update({
      where: { wfp_process_id: id },
      data: {
        wfp_process_name: body.wfp_process_name,
        wfp_process_desc_bm: body.wfp_process_desc_bm ?? null,
        wfp_process_desc_bi: body.wfp_process_desc_bi ?? null,
        wfp_sequence: body.wfp_sequence != null ? parseInt(body.wfp_sequence) : undefined,
        wfp_status: body.wfp_status,
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
      message: "Process updated successfully",
      data: process,
    };
  } catch (error) {
    if (error.code === "P2025") {
      return {
        statusCode: 404,
        message: "Process not found",
      };
    }
    console.error("Error updating process:", error);
    return {
      statusCode: 500,
      message: "Failed to update process",
      error: error.message,
    };
  }
});
