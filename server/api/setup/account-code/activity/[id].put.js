import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    const body = await readBody(event);

    if (!id) {
      return {
        statusCode: 400,
        message: "Account activity ID is required",
      };
    }

    // Check if account activity exists
    const existing = await prisma.lookup_details.findUnique({
      where: {
        lde_id: parseInt(id),
      },
    });

    if (!existing || existing.lma_code_name !== 'ACCOUNT_ACTIVITY') {
      return {
        statusCode: 404,
        message: "Account activity not found",
      };
    }

    // Check if lde_value is being changed and if it already exists
    if (body.lde_value && body.lde_value !== existing.lde_value) {
      const duplicate = await prisma.lookup_details.findFirst({
        where: {
          lma_code_name: 'ACCOUNT_ACTIVITY',
          lde_value: body.lde_value,
          lde_id: { not: parseInt(id) },
        },
      });

      if (duplicate) {
        return {
          statusCode: 409,
          message: "Account activity code already exists",
        };
      }
    }

    // Update account activity
    const updated = await prisma.lookup_details.update({
      where: {
        lde_id: parseInt(id),
      },
      data: {
        lde_value: body.lde_value || existing.lde_value,
        lde_description: body.lde_description || existing.lde_description,
        lde_description2: body.lde_description2 !== undefined ? body.lde_description2 : existing.lde_description2,
        lde_status: body.lde_status ? (body.lde_status === 'ACTIVE' ? '1' : '0') : existing.lde_status,
        updateddate: new Date(),
      },
    });

    return {
      statusCode: 200,
      message: "Account activity updated successfully",
      data: {
        lde_id: updated.lde_id,
        lde_value: updated.lde_value,
        lde_description: updated.lde_description,
        lde_description2: updated.lde_description2,
        lde_status: updated.lde_status === '1' || updated.lde_status === 1 ? 'ACTIVE' : 'INACTIVE',
      },
    };
  } catch (error) {
    console.error("Error updating account activity:", error);
    
    if (error.code === 'P2002') {
      return {
        statusCode: 409,
        message: "Account activity code already exists",
        error: error.message,
      };
    }
    
    return {
      statusCode: 500,
      message: "An error occurred while updating account activity",
      error: error.message,
    };
  }
});
