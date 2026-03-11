import prisma from "~/server/utils/prisma";

/**
 * DELETE /api/workflow-configuration/authorized-role/[id]
 * Delete an authorized role (wf_authorized_role)
 */
export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(getRouterParam(event, "id"));

    if (!id || isNaN(id)) {
      return {
        statusCode: 400,
        message: "Authorized role ID is required",
      };
    }

    await prisma.wf_authorized_role.delete({
      where: { war_authorized_role_id: id },
    });

    return {
      statusCode: 200,
      message: "Authorized role deleted successfully",
    };
  } catch (error) {
    if (error.code === "P2025") {
      return {
        statusCode: 404,
        message: "Authorized role not found",
      };
    }
    console.error("Error deleting authorized role:", error);
    return {
      statusCode: 500,
      message: "Failed to delete authorized role",
      error: error.message,
    };
  }
});
