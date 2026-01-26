import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);

    if (!id) {
      return {
        statusCode: 400,
        message: "Cost centre ID is required",
      };
    }

    if (!body.ccr_costcentre_desc || !body.oun_code) {
      return {
        statusCode: 400,
        message: "ccr_costcentre_desc and oun_code are required",
      };
    }

    // Update cost centre
    const updated = await prisma.costcentre.update({
      where: { ccr_costcentre_id: parseInt(id) },
      data: {
        ccr_costcentre_desc: body.ccr_costcentre_desc,
        ccr_costcentre_desc_eng: body.ccr_costcentre_desc_eng || null,
        oun_code: body.oun_code,
        ccr_address: body.ccr_address || null,
        ccr_hostel_code: body.ccr_hostel_code || null,
        ccr_status: body.ccr_status === 'ACTIVE' ? '1' : '0',
        ccr_flag_salary: body.ccr_flag_salary || 'N',
        updateddate: new Date(),
      },
    });

    return {
      statusCode: 200,
      message: "Cost centre updated successfully",
      data: updated,
    };
  } catch (error) {
    console.error("Error updating cost centre:", error);
    if (error.code === "P2025") {
      return {
        statusCode: 404,
        message: "Cost centre not found",
      };
    }
    return {
      statusCode: 500,
      message: error.message || "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    };
  }
});
