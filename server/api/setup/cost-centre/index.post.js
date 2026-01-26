import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // Validate required fields
    if (!body.ccr_costcentre || !body.ccr_costcentre_desc || !body.oun_code) {
      return {
        statusCode: 400,
        message: "Missing required fields: Cost Centre Code, Description (Malay), and PTJ are required",
      };
    }

    // Check cost centre code length
    const lengthParam = await prisma.lookup_parameter_main.findFirst({
      where: {
        lpm_code: 'FINAL_COSTCENTRE_LENGTH',
      },
      select: {
        lpm_value: true,
      },
    });

    const requiredLength = lengthParam?.lpm_value ? parseInt(lengthParam.lpm_value) : null;
    if (requiredLength && body.ccr_costcentre.length !== requiredLength) {
      return {
        statusCode: 400,
        message: `Please make sure you insert ${requiredLength} digit number to continue.`,
      };
    }

    // Check if cost centre code already exists
    const existing = await prisma.costcentre.findUnique({
      where: {
        ccr_costcentre: body.ccr_costcentre,
      },
    });

    if (existing) {
      return {
        statusCode: 409,
        message: `CostCentre Code for ${existing.ccr_costcentre} - ${existing.ccr_costcentre_desc} already exist. Please fill in another code.`,
      };
    }

    // Get the next ID
    const maxId = await prisma.costcentre.findFirst({
      orderBy: { ccr_costcentre_id: "desc" },
      select: { ccr_costcentre_id: true },
    });

    const nextId = maxId ? maxId.ccr_costcentre_id + 1 : 1;

    // Create new cost centre
    const newCostCentre = await prisma.costcentre.create({
      data: {
        ccr_costcentre_id: nextId,
        ccr_costcentre: body.ccr_costcentre,
        ccr_costcentre_desc: body.ccr_costcentre_desc,
        ccr_costcentre_desc_eng: body.ccr_costcentre_desc_eng || null,
        oun_code: body.oun_code,
        ccr_address: body.ccr_address || null,
        ccr_hostel_code: body.ccr_hostel_code || null,
        ccr_status: body.ccr_status === 'ACTIVE' ? '1' : '0',
        ccr_flag_salary: body.ccr_flag_salary || 'N',
        createddate: new Date(),
      },
    });

    return {
      statusCode: 200,
      message: 'Cost centre created successfully',
      data: {
        ccr_costcentre_id: newCostCentre.ccr_costcentre_id,
        ccr_costcentre: newCostCentre.ccr_costcentre,
        ccr_costcentre_desc: newCostCentre.ccr_costcentre_desc,
        ccr_status: newCostCentre.ccr_status === '1' || newCostCentre.ccr_status === 1 ? 'ACTIVE' : 'INACTIVE',
      },
    };
  } catch (error) {
    console.error("Error creating cost centre:", error);
    
    if (error.code === 'P2002') {
      return {
        statusCode: 409,
        message: "Cost centre code already exists",
        error: error.message,
      };
    }
    
    return {
      statusCode: 500,
      message: "An error occurred while creating cost centre",
      error: error.message,
    };
  }
});
