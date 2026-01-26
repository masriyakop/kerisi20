import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    
    if (!id) {
      return {
        statusCode: 400,
        message: "Cost centre ID is required",
      };
    }

    const costCentre = await prisma.costcentre.findUnique({
      where: {
        ccr_costcentre_id: parseInt(id),
      },
    });

    if (!costCentre) {
      return {
        statusCode: 404,
        message: "Cost centre not found",
      };
    }

    // Get organization unit description
    let ounDesc = '';
    if (costCentre.oun_code) {
      const orgUnit = await prisma.organization_unit.findUnique({
        where: {
          oun_code: costCentre.oun_code,
        },
        select: {
          oun_desc: true,
        },
      });
      ounDesc = orgUnit?.oun_desc || '';
    }

    return {
      statusCode: 200,
      message: 'Cost centre fetched successfully',
      data: {
        ccr_costcentre_id: costCentre.ccr_costcentre_id,
        ccr_costcentre: costCentre.ccr_costcentre,
        ccr_costcentre_desc: costCentre.ccr_costcentre_desc,
        ccr_costcentre_desc_eng: costCentre.ccr_costcentre_desc_eng || '',
        oun_code: costCentre.oun_code || '',
        oun_desc: ounDesc,
        ccr_address: costCentre.ccr_address || '',
        ccr_hostel_code: costCentre.ccr_hostel_code || '',
        ccr_status: costCentre.ccr_status === '1' || costCentre.ccr_status === 1 ? 'ACTIVE' : 'INACTIVE',
        ccr_flag_salary: costCentre.ccr_flag_salary || 'N',
      },
    };
  } catch (error) {
    console.error('Error in cost-centre get by ID API:', error);
    return {
      statusCode: 500,
      message: error.message || 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    };
  }
});
