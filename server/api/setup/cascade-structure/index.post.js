import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // Validate required fields
    if (!body.fty_fund_type || !body.at_activity_code || !body.oun_code || !body.ccr_costcentre || !body.ouc_status) {
      return {
        statusCode: 400,
        message: "Missing required fields: Fund Type, Activity Code, PTJ Code, Cost Centre, and Status are required",
      };
    }

    // Check if combination already exists
    const existing = await prisma.org_unit_costcentre.findFirst({
      where: {
        fty_fund_type: body.fty_fund_type,
        at_activity_code: body.at_activity_code,
        oun_code: body.oun_code,
        ccr_costcentre: body.ccr_costcentre,
        ouc_status: body.ouc_status,
      },
    });

    if (existing) {
      return {
        statusCode: 409,
        message: "The data you selected already exists.",
      };
    }

    // Get the next ID
    const maxId = await prisma.org_unit_costcentre.findFirst({
      orderBy: { ouc_ounit_costcentre_id: "desc" },
      select: { ouc_ounit_costcentre_id: true },
    });

    const nextId = maxId ? maxId.ouc_ounit_costcentre_id + 1 : 1;

    // Create new record
    const newRecord = await prisma.org_unit_costcentre.create({
      data: {
        ouc_ounit_costcentre_id: nextId,
        fty_fund_type: body.fty_fund_type,
        at_activity_code: body.at_activity_code,
        oun_code: body.oun_code,
        ccr_costcentre: body.ccr_costcentre,
        ouc_status: body.ouc_status === 'ACTIVE' ? '1' : '0',
        createddate: new Date(),
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
      // Create capital_project record
      const projectNo = `${body.fty_fund_type}${body.at_activity_code}${body.ccr_costcentre}00000`;
      
      const maxCpId = await prisma.capital_project.findFirst({
        orderBy: { cpa_project_id: "desc" },
        select: { cpa_project_id: true },
      });

      const nextCpId = maxCpId ? maxCpId.cpa_project_id + 1 : 1;

      await prisma.capital_project.create({
        data: {
          cpa_project_id: nextCpId,
          cpa_project_no: projectNo,
          fty_fund_type: body.fty_fund_type,
          ccr_costcentre: body.ccr_costcentre,
          lat_activity_code: body.at_activity_code,
          oun_code: body.oun_code,
          so_code: '00000',
          cpa_project_status: 'OPEN',
          createddate: new Date(),
        },
      });
    }

    return {
      statusCode: 200,
      message: 'Cascade structure created successfully',
      data: {
        ouc_ounit_costcentre_id: newRecord.ouc_ounit_costcentre_id,
        fty_fund_type: newRecord.fty_fund_type,
        ouc_status: newRecord.ouc_status === '1' || newRecord.ouc_status === 1 ? 'ACTIVE' : 'INACTIVE',
      },
    };
  } catch (error) {
    console.error("Error creating cascade structure:", error);
    
    if (error.code === 'P2002') {
      return {
        statusCode: 409,
        message: "The data you selected already exists.",
        error: error.message,
      };
    }
    
    return {
      statusCode: 500,
      message: "An error occurred while creating cascade structure",
      error: error.message,
    };
  }
});
