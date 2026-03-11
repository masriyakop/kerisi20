import prisma from "~/server/utils/prisma";

/**
 * POST /api/workflow-configuration/authorized-role
 * Create a new authorized role (wf_authorized_role)
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    if (!body.war_process_id || !body.war_group_code) {
      return {
        statusCode: 400,
        message: "Process ID and group code are required",
      };
    }

    const role = await prisma.wf_authorized_role.create({
      data: {
        war_process_id: parseInt(body.war_process_id),
        war_group_code: body.war_group_code,
        war_limit_min: body.war_limit_min != null ? parseFloat(body.war_limit_min) : null,
        war_limit_max: body.war_limit_max != null ? parseFloat(body.war_limit_max) : null,
      },
    });

    return {
      statusCode: 200,
      message: "Authorized role created successfully",
      data: role,
    };
  } catch (error) {
    console.error("Error creating authorized role:", error);
    return {
      statusCode: 500,
      message: "Failed to create authorized role",
      error: error.message,
    };
  }
});
