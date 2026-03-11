import prisma from "~/server/utils/prisma";

/**
 * GET /api/workflow-configuration/processes/[id]/details
 * List process details for a given process id
 * Maps to: SELECT wpd_process_details_id, wpd_status_code, CONCAT_WS(...) wpd_status, wpd_reroute_process, wpd_proc_to_exec
 * FROM wf_process_details WHERE wpd_process_id = ? ORDER BY wpd_order, wpd_status_code
 */
export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(getRouterParam(event, "id"));
    if (!id || isNaN(id)) {
      return {
        statusCode: 400,
        message: "Process ID is required",
        data: [],
      };
    }

    const details = await prisma.wf_process_details.findMany({
      where: {
        wpd_process_id: id,
      },
      select: {
        wpd_process_details_id: true,
        wpd_status_code: true,
        wpd_reroute_process: true,
        wpd_proc_to_exec: true,
        wpd_order: true,
        wpd_extended_field: true,
      },
      orderBy: [{ wpd_order: "asc" }, { wpd_status_code: "asc" }],
    });

    // Build wpd_status: CONCAT_WS(' - ', wpd_status_code, wpd_extended_field ->> '$.wpd_status_desc')
    const data = details.map((d) => {
      const ext = (d.wpd_extended_field && typeof d.wpd_extended_field === "object"
        ? d.wpd_extended_field
        : {}) || {};
      const desc = ext.wpd_status_desc || "";
      const wpd_status = [d.wpd_status_code, desc].filter(Boolean).join(" - ");
      return {
        wpd_process_details_id: d.wpd_process_details_id,
        wpd_status_code: d.wpd_status_code,
        wpd_status: wpd_status || d.wpd_status_code || "",
        wpd_status_desc: desc,
        wpd_reroute_process: d.wpd_reroute_process,
        wpd_proc_to_exec: d.wpd_proc_to_exec,
        wpd_order: d.wpd_order,
        wpd_extended_field: d.wpd_extended_field,
      };
    });

    return {
      statusCode: 200,
      message: "Process details fetched successfully",
      data,
    };
  } catch (error) {
    console.error("Error fetching process details:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch process details",
      error: error.message,
    };
  }
});
