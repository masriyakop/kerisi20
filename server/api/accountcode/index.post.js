import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // Validate required fields
    if (!body.fundTypeCode || !body.accountCode || !body.accountDescription) {
      return {
        statusCode: 400,
        message: "Fund type code, account code, and account description are required",
      };
    }

    // Validate account type enum
    const validAccountTypes = ['ASET', 'LIABILITI', 'EKUITI', 'HASIL', 'BELANJA'];
    if (body.accountType && !validAccountTypes.includes(body.accountType)) {
      return {
        statusCode: 400,
        message: "Invalid account type",
      };
    }

    // Validate statement item enum
    const validStatementItems = ['BS', 'PL'];
    if (body.statementItem && !validStatementItems.includes(body.statementItem)) {
      return {
        statusCode: 400,
        message: "Invalid statement item",
      };
    }

    // Validate account status enum
    const validAccountStatuses = ['ACTIVE', 'INACTIVE'];
    if (body.accountStatus && !validAccountStatuses.includes(body.accountStatus)) {
      return {
        statusCode: 400,
        message: "Invalid account status",
      };
    }

    // Check if account code already exists
    const existingAccountCode = await prisma.account_code.findUnique({
      where: {
        account_code: body.accountCode,
      },
    });

    if (existingAccountCode) {
      return {
        statusCode: 409,
        message: "Account code already exists",
      };
    }

    // Create account code
    const accountCode = await prisma.account_code.create({
      data: {
        fund_type_code: body.fundTypeCode,
        account_code: body.accountCode,
        account_description: body.accountDescription,
        account_level: parseInt(body.accountLevel) || 1,
        account_type: body.accountType || 'ASET',
        account_class: body.accountClass || '',
        statement_item: body.statementItem || 'BS',
        account_status: body.accountStatus || 'ACTIVE',
      },
    });

    return {
      statusCode: 201,
      message: "Account code created successfully",
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
    console.error("Error creating account code:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    };
  }
});

