import prisma from "~/server/utils/prisma";

/**
 * GET /api/workflow-configuration/processes/[id]/authorized-roles
 * List authorized roles for a given process id
 * Maps to: SELECT war_group_code, war_limit_min, war_limit_max FROM wf_authorized_role WHERE war_process_id = ?
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

    const roles = await prisma.wf_authorized_role.findMany({
      where: {
        war_process_id: id,
      },
      select: {
        war_authorized_role_id: true,
        war_group_code: true,
        war_limit_min: true,
        war_limit_max: true,
      },
    });

    return {
      statusCode: 200,
      message: "Authorized roles fetched successfully",
      data: roles,
    };
  } catch (error) {
    console.error("Error fetching authorized roles:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch authorized roles",
      error: error.message,
    };
  }
});
