import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    const body = await readBody(event);

    if (!id) {
      return {
        statusCode: 400,
        message: "Fund type ID is required",
      };
    }

    // Check if fund type exists
    const existingFundType = await prisma.fund_type.findUnique({
      where: {
        fty_fund_id: parseInt(id),
      },
    });

    if (!existingFundType) {
      return {
        statusCode: 404,
        message: "Fund type not found",
      };
    }

    // Check if fund type code is being changed and if it already exists
    if (body.fundType && body.fundType !== existingFundType.fty_fund_type) {
      const duplicateFundType = await prisma.fund_type.findUnique({
        where: {
          fty_fund_type: body.fundType,
        },
      });

      if (duplicateFundType) {
        return {
          statusCode: 409,
          message: "Fund type code already exists",
        };
      }
    }

    // Update fund type
    const updatedFundType = await prisma.fund_type.update({
      where: {
        fty_fund_id: parseInt(id),
      },
      data: {
        fty_fund_type: body.fundType || existingFundType.fty_fund_type,
        fty_fund_desc: body.descriptionMalay || existingFundType.fty_fund_desc,
        fty_fund_desc_eng: body.descriptionEnglish !== undefined ? body.descriptionEnglish : existingFundType.fty_fund_desc_eng,
        fty_basis: body.typeBasis !== undefined ? body.typeBasis : existingFundType.fty_basis,
        fty_status: body.status || existingFundType.fty_status,
        fty_remark: body.remark !== undefined ? body.remark : existingFundType.fty_remark,
        updateddate: new Date(),
      },
    });

    return {
      statusCode: 200,
      message: "Fund type updated successfully",
      data: updatedFundType,
    };
  } catch (error) {
    console.error("Error updating fund type:", error);
    return {
      statusCode: 500,
      message: "An error occurred while updating fund type",
      error: error.message,
    };
  }
});

