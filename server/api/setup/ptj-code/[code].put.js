import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const code = getRouterParam(event, "code");
    const body = await readBody(event);

    // Validation
    if (!code) {
      return {
        statusCode: 400,
        message: "PTJ code is required",
      };
    }

    if (!body.oun_desc || !body.oun_status) {
      return {
        statusCode: 400,
        message: "oun_desc and oun_status are required",
      };
    }

    // Update organization unit
    const updated = await prisma.organization_unit.update({
      where: { oun_code: code },
      data: {
        oun_desc: body.oun_desc,
        oun_desc_bi: body.oun_desc_bi || null,
        org_desc: body.org_desc || null,
        oun_address: body.oun_address || null,
        oun_state: body.oun_state || null,
        st_staff_id_head: body.st_staff_id_head || null,
        oun_tel_no: body.oun_tel_no || null,
        oun_fax_no: body.oun_fax_no || null,
        oun_status: body.oun_status === 'ACTIVE' ? '1' : '0',
        st_staff_id_superior: body.st_staff_id_superior || null,
        tanggung_start_date: body.tanggung_start_date ? new Date(body.tanggung_start_date) : null,
        tanggung_end_date: body.tanggung_end_date ? new Date(body.tanggung_end_date) : null,
        oun_shortname: body.oun_shortname || null,
        oun_region: body.oun_region || null,
        cny_country_code: body.cny_country_code || null,
        updateddate: new Date(),
      },
    });

    return {
      statusCode: 200,
      message: "PTJ code updated successfully",
      data: updated,
    };
  } catch (error) {
    console.error("Error updating PTJ code:", error);
    if (error.code === "P2025") {
      return {
        statusCode: 404,
        message: "PTJ code not found",
      };
    }
    return {
      statusCode: 500,
      message: error.message || "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    };
  }
});
