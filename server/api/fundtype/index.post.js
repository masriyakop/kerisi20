import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // Validate required fields
    if (!body.fundType || !body.descriptionMalay || !body.typeBasis || !body.status) {
      return {
        statusCode: 400,
        message: "Missing required fields: fundType, descriptionMalay, typeBasis, and status are required",
      };
    }

    // Check if fund type already exists
    const existingFundType = await prisma.fund_type.findUnique({
      where: {
        fty_fund_type: body.fundType,
      },
    });

    if (existingFundType) {
      return {
        statusCode: 409,
        message: "Fund type already exists",
      };
    }

    // Create new fund type
    const newFundType = await prisma.fund_type.create({
      data: {
        fty_fund_type: body.fundType,
        fty_fund_desc: body.descriptionMalay,
        fty_fund_desc_eng: body.descriptionEnglish || null,
        fty_basis: body.typeBasis || null,
        fty_status: body.status,
        fty_remark: body.remark || null,
        createddate: new Date(),
        updateddate: new Date(),
      },
    });

    return {
      statusCode: 200,
      message: "Fund type created successfully",
      data: newFundType,
    };
  } catch (error) {
    console.error("Error creating fund type:", error);
    return {
      statusCode: 500,
      message: "An error occurred while creating fund type",
      error: error.message,
    };
  }
});

