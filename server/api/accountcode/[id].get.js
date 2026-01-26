import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    
    if (!id) {
      return {
        statusCode: 400,
        message: "Account code ID is required",
      };
    }

    const accountCode = await prisma.account_code.findUnique({
      where: {
        id: BigInt(id),
      },
    });

    if (!accountCode) {
      return {
        statusCode: 404,
        message: "Account code not found",
      };
    }

    return {
      statusCode: 200,
      message: "Account code fetched successfully",
      data: {
        id: accountCode.id.toString(),
        fundTypeCode: accountCode.fund_type_code,
        accountCode: accountCode.account_code,
        accountDescription: accountCode.account_description,
        accountLevel: accountCode.account_level,
        accountType: accountCode.account_type,
        accountClass: accountCode.account_class,
        statementItem: accountCode.statement_item,
        accountStatus: accountCode.account_status,
      },
    };
  } catch (error) {
    console.error("Error fetching account code:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    };
  }
});

