import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    const body = await readBody(event);

    if (!id) {
      return {
        statusCode: 400,
        message: "Account code ID is required",
      };
    }

    // Check if account code exists
    const existingAccountCode = await prisma.account_code.findUnique({
      where: {
        id: BigInt(id),
      },
    });

    if (!existingAccountCode) {
      return {
        statusCode: 404,
        message: "Account code not found",
      };
    }

    // Validate account type enum if provided
    const validAccountTypes = ['ASET', 'LIABILITI', 'EKUITI', 'HASIL', 'BELANJA'];
    if (body.accountType && !validAccountTypes.includes(body.accountType)) {
      return {
        statusCode: 400,
        message: "Invalid account type",
      };
    }

    // Validate statement item enum if provided
    const validStatementItems = ['BS', 'PL'];
    if (body.statementItem && !validStatementItems.includes(body.statementItem)) {
      return {
        statusCode: 400,
        message: "Invalid statement item",
      };
    }

    // Validate account status enum if provided
    const validAccountStatuses = ['ACTIVE', 'INACTIVE'];
    if (body.accountStatus && !validAccountStatuses.includes(body.accountStatus)) {
      return {
        statusCode: 400,
        message: "Invalid account status",
      };
    }

    // Check if account code is being changed and if it already exists
    if (body.accountCode && body.accountCode !== existingAccountCode.account_code) {
      const duplicateAccountCode = await prisma.account_code.findUnique({
        where: {
          account_code: body.accountCode,
        },
      });

      if (duplicateAccountCode) {
        return {
          statusCode: 409,
          message: "Account code already exists",
        };
      }
    }

    // Build update data object
    const updateData = {};
    if (body.fundTypeCode !== undefined) updateData.fund_type_code = body.fundTypeCode;
    if (body.accountCode !== undefined) updateData.account_code = body.accountCode;
    if (body.accountDescription !== undefined) updateData.account_description = body.accountDescription;
    if (body.accountLevel !== undefined) updateData.account_level = parseInt(body.accountLevel);
    if (body.accountType !== undefined) updateData.account_type = body.accountType;
    if (body.accountClass !== undefined) updateData.account_class = body.accountClass;
    if (body.statementItem !== undefined) updateData.statement_item = body.statementItem;
    if (body.accountStatus !== undefined) updateData.account_status = body.accountStatus;
    updateData.updated_at = new Date();

    // Update account code
    const accountCode = await prisma.account_code.update({
      where: {
        id: BigInt(id),
      },
      data: updateData,
    });

    return {
      statusCode: 200,
      message: "Account code updated successfully",
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
    console.error("Error updating account code:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    };
  }
});

