import prisma from "~/server/utils/prisma2";

export default defineEventHandler(async (event) => {
  try {
    // Build WHERE conditions from parsed lookup_queryMapping (using Prisma ORM, not raw SQL)
    const where = {};
    // Add WHERE conditions from lookup_queryMapping
      where.lma_code_name = "MESSAGE_TYPE";
    
    // Execute query using Prisma ORM (no raw SQL)
    const data = await prisma.lookup_details_adm.findMany({
      select: {
        lde_description: true,
        lde_value: true,
        lde_id: true,
      },
      where,
      orderBy: { lde_id: 'asc' },
    });

    // Map to options format with label and value (standard FormKit format)
    // Note: Prisma returns data with actual database field names, not SQL aliases
    // So we use labelField/valueField to access the data, then map to aliases in response
    const mappedData = data.map((item) => {
      return {
        label: item.lde_description || item.label || "",
        value: item.lde_value || item.value || "",
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
