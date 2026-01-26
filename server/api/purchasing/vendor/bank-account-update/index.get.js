import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    let whereClause = {};

    if (query.search) {
      const searchTerm = query.search.trim();
      whereClause.OR = [
        { vba_account_id: { contains: searchTerm } },
        { vcs_vendor_code: { contains: searchTerm } },
        { vba_bank_name: { contains: searchTerm } },
        { vba_account_no: { contains: searchTerm } },
        { vba_reason: { contains: searchTerm } },
      ];
    }

    const bankAccounts = await prisma.vend_bank_account.findMany({
      where: whereClause,
      orderBy: {
        vba_account_id: 'desc',
      },
    });

    const data = bankAccounts.map((account) => {
      return {
        vba_account_id: account.vba_account_id,
        vcs_vendor_code: account.vcs_vendor_code || '',
        vba_bank_name: account.vba_bank_name || '',
        vba_account_no: account.vba_account_no || '',
        vba_reason: account.vba_reason || '',
        vba_status: account.vba_status ? 'ACTIVE' : 'INACTIVE',
        urlEdit: `/purchasing/vendor/bank-account-updated/edit/${account.vba_account_id}`,
      };
    });

    return {
      statusCode: 200,
      message: "Bank account list fetched successfully",
      data: data,
    };
  } catch (error) {
    console.error("Error fetching bank account list:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch bank account list",
      error: error.message,
    };
  }
});
