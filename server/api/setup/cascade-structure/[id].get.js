import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    
    if (!id) {
      return {
        statusCode: 400,
        message: "Cascade structure ID is required",
      };
    }

    const record = await prisma.org_unit_costcentre.findUnique({
      where: {
        ouc_ounit_costcentre_id: parseInt(id),
      },
      include: {
        fund_type: {
          select: {
            fty_fund_type: true,
            fty_fund_desc: true,
          },
        },
        activity_type: {
          select: {
            at_activity_code: true,
            at_activity_description_bm: true,
          },
        },
        organization_unit: {
          select: {
            oun_code: true,
            oun_desc: true,
          },
        },
        costcentre: {
          select: {
            ccr_costcentre: true,
            ccr_costcentre_desc: true,
          },
        },
      },
    });

    if (!record) {
      return {
        statusCode: 404,
        message: "Cascade structure not found",
      };
    }

    return {
      statusCode: 200,
      message: 'Cascade structure fetched successfully',
      data: {
        ouc_ounit_costcentre_id: record.ouc_ounit_costcentre_id,
        fty_fund_type: record.fty_fund_type || '',
        fty_fund_desc: record.fund_type?.fty_fund_desc || '',
        at_activity_code: record.at_activity_code || '',
        at_activity_description_bm: record.activity_type?.at_activity_description_bm || '',
        oun_code: record.oun_code || '',
        oun_desc: record.organization_unit?.oun_desc || '',
        ccr_costcentre: record.ccr_costcentre || '',
        ccr_costcentre_desc: record.costcentre?.ccr_costcentre_desc || '',
        ouc_status: record.ouc_status === '1' || record.ouc_status === 1 ? 'ACTIVE' : 'INACTIVE',
      },
    };
  } catch (error) {
    console.error('Error in cascade-structure get by ID API:', error);
    return {
      statusCode: 500,
      message: error.message || 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    };
  }
});
