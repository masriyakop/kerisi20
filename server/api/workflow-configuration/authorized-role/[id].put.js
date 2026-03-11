import prisma from "~/server/utils/prisma";

/**
 * PUT /api/workflow-configuration/authorized-role/[id]
 * Update an authorized role (wf_authorized_role)
 */
export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(getRouterParam(event, "id"));
    const body = await readBody(event);

    if (!id || isNaN(id)) {
      return {
        statusCode: 400,
        message: "Authorized role ID is required",
      };
    }

    const role = await prisma.wf_authorized_role.update({
      where: { war_authorized_role_id: id },
      data: {
        war_group_code: body.war_group_code,
        war_limit_min: body.war_limit_min != null ? parseFloat(body.war_limit_min) : null,
        war_limit_max: body.war_limit_max != null ? parseFloat(body.war_limit_max) : null,
      },
    });

    return {
      statusCode: 200,
      message: "Authorized role updated successfully",
      data: role,
    };
  } catch (error) {
    if (error.code === "P2025") {
      return {
        statusCode: 404,
        message: "Authorized role not found",
      };
    }
    console.error("Error updating authorized role:", error);
    return {
      statusCode: 500,
      message: "Failed to update authorized role",
      error: error.message,
    };
  }
});
