import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    // Build WHERE conditions from parsed lookup_queryMapping (using Prisma ORM, not raw SQL)
    const where = {};
    // Add WHERE conditions from lookup_queryMapping
      where.acm_acct_level = 3;
    
    // Execute query using Prisma ORM (no raw SQL)
    const data = await prisma.account_main.findMany({
      select: {
        acm_acct_level: true,
      },
      distinct: ['acm_acct_level'],
      where,
      orderBy: { acm_acct_level: 'asc' },
    });

    // Map to options format with label and value (standard FormKit format)
    // Note: Prisma returns data with actual database field names, not SQL aliases
    // So we use labelField/valueField to access the data, then map to aliases in response
    const mappedData = data.map((item) => {
      return {
        label: item.acm_acct_level || item.flc_name || "",
        value: item.acm_acct_level || item.flc_id || "",
        flc_name: item.acm_acct_level || item.flc_name || "",
        flc_id: item.acm_acct_level || item.flc_id || "",
      };
    });

    return {
      statusCode: 200,
      message: "Lookup data fetched successfully",
      data: mappedData,
    };
  } catch (error) {
    console.error("Error fetching lookup data:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch lookup data",
      error: "development" === 'development' ? error.message : "An error occurred while fetching lookup data",
    };
  }
});
