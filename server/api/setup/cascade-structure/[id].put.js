import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);

    if (!id) {
      return {
        statusCode: 400,
        message: "Cascade structure ID is required",
      };
    }

    if (!body.fty_fund_type || !body.at_activity_code || !body.oun_code || !body.ccr_costcentre || !body.ouc_status) {
      return {
        statusCode: 400,
        message: "All required fields must be provided",
      };
    }

    // Get existing record
    const existing = await prisma.org_unit_costcentre.findUnique({
      where: { ouc_ounit_costcentre_id: parseInt(id) },
    });

    if (!existing) {
      return {
        statusCode: 404,
        message: "Cascade structure not found",
      };
    }

    // Check if new combination already exists (excluding current record)
    const duplicate = await prisma.org_unit_costcentre.findFirst({
      where: {
        fty_fund_type: body.fty_fund_type,
        at_activity_code: body.at_activity_code,
        oun_code: body.oun_code,
        ccr_costcentre: body.ccr_costcentre,
        ouc_status: body.ouc_status,
        ouc_ounit_costcentre_id: { not: parseInt(id) },
      },
    });

    if (duplicate) {
      return {
        statusCode: 409,
        message: "The data you selected already exists.",
      };
    }

    // Update record
    const updated = await prisma.org_unit_costcentre.update({
      where: { ouc_ounit_costcentre_id: parseInt(id) },
      data: {
        fty_fund_type: body.fty_fund_type,
        at_activity_code: body.at_activity_code,
        oun_code: body.oun_code,
        ccr_costcentre: body.ccr_costcentre,
        ouc_status: body.ouc_status === 'ACTIVE' ? '1' : '0',
        updateddate: new Date(),
      },
    });

    // Check if fund type has CASH BASIS or PROJECT BASIS
    const fundType = await prisma.fund_type.findUnique({
      where: {
        fty_fund_type: body.fty_fund_type,
      },
      select: {
        fty_basis: true,
      },
    });

    if (fundType?.fty_basis && (fundType.fty_basis.includes('CASH BASIS') || fundType.fty_basis.includes('PROJECT BASIS'))) {
      // Check if capital_project exists
      const capitalProject = await prisma.capital_project.findFirst({
        where: {
          fty_fund_type: existing.fty_fund_type,
          ccr_costcentre: existing.ccr_costcentre,
          lat_activity_code: existing.at_activity_code,
          oun_code: existing.oun_code,
          so_code: '00000',
        },
      });

      if (capitalProject) {
        const projectNo = `${body.fty_fund_type}${body.at_activity_code}${body.ccr_costcentre}00000`;
        const statusProject = body.ouc_status === 'ACTIVE' ? 'OPEN' : '0';

        await prisma.capital_project.update({
          where: { cpa_project_id: capitalProject.cpa_project_id },
          data: {
            cpa_project_no: projectNo,
            fty_fund_type: body.fty_fund_type,
            ccr_costcentre: body.ccr_costcentre,
            lat_activity_code: body.at_activity_code,
            oun_code: body.oun_code,
            cpa_project_status: statusProject,
            cpa_project_no_old: capitalProject.cpa_project_no,
            updateddate: new Date(),
          },
        });
      }
    }

    return {
      statusCode: 200,
      message: "Cascade structure updated successfully",
      data: updated,
    };
  } catch (error) {
    console.error("Error updating cascade structure:", error);
    if (error.code === "P2025") {
      return {
        statusCode: 404,
        message: "Cascade structure not found",
      };
    }
    return {
      statusCode: 500,
      message: error.message || "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    };
  }
});
