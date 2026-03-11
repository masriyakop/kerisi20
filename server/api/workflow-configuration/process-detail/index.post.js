import prisma from "~/server/utils/prisma";

/**
 * POST /api/workflow-configuration/process-detail
 * Create a new process detail (wf_process_details)
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    if (!body.wpd_process_id || !body.wpd_status_code) {
      return {
        statusCode: 400,
        message: "Process ID and status code are required",
      };
    }

    const detail = await prisma.wf_process_details.create({
      data: {
        wpd_process_id: parseInt(body.wpd_process_id),
        wpd_status_code: body.wpd_status_code,
        wpd_reroute_process: body.wpd_reroute_process ?? null,
        wpd_proc_to_exec: body.wpd_proc_to_exec ?? null,
        wpd_order: body.wpd_order ?? null,
        wpd_extended_field: body.wpd_status_desc
          ? { wpd_status_desc: body.wpd_status_desc }
          : null,
      },
    });

    return {
      statusCode: 200,
      message: "Process detail created successfully",
      data: detail,
    };
  } catch (error) {
    console.error("Error creating process detail:", error);
    return {
      statusCode: 500,
      message: "Failed to create process detail",
      error: error.message,
    };
  }
});
