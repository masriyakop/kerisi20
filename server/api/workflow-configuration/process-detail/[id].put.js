import prisma from "~/server/utils/prisma";

/**
 * PUT /api/workflow-configuration/process-detail/[id]
 * Update a process detail (wf_process_details)
 */
export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(getRouterParam(event, "id"));
    const body = await readBody(event);

    if (!id || isNaN(id)) {
      return {
        statusCode: 400,
        message: "Process detail ID is required",
      };
    }

    const existing = await prisma.wf_process_details.findUnique({
      where: { wpd_process_details_id: id },
    });

    const extendedField = existing?.wpd_extended_field && typeof existing.wpd_extended_field === "object"
      ? { ...existing.wpd_extended_field }
      : {};
    if (body.wpd_status_desc != null) {
      extendedField.wpd_status_desc = body.wpd_status_desc;
    }

    const detail = await prisma.wf_process_details.update({
      where: { wpd_process_details_id: id },
      data: {
        wpd_status_code: body.wpd_status_code,
        wpd_reroute_process: body.wpd_reroute_process ?? null,
        wpd_proc_to_exec: body.wpd_proc_to_exec ?? null,
        wpd_order: body.wpd_order ?? null,
        wpd_extended_field: Object.keys(extendedField).length > 0 ? extendedField : null,
      },
    });

    return {
      statusCode: 200,
      message: "Process detail updated successfully",
      data: detail,
    };
  } catch (error) {
    if (error.code === "P2025") {
      return {
        statusCode: 404,
        message: "Process detail not found",
      };
    }
    console.error("Error updating process detail:", error);
    return {
      statusCode: 500,
      message: "Failed to update process detail",
      error: error.message,
    };
  }
});
