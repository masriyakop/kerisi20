import prisma from "~/server/utils/prisma2";

export default defineEventHandler(async (event) => {
  try {
    // Build WHERE conditions from parsed lookup_queryMapping (using Prisma ORM, not raw SQL)
    const where = {};
    
    
    // Execute query using Prisma ORM (no raw SQL)
    const data = await prisma.adm_message_log.findMany({
      select: {
        ml_page_name: true,
        ml_message_log_id: true,
      },
      
      orderBy: { ml_message_log_id: 'asc' },
    });

    // Map to options format with label and value (standard FormKit format)
    // Note: Prisma returns data with actual database field names, not SQL aliases
    // So we use labelField/valueField to access the data, then map to aliases in response
    const mappedData = data.map((item) => {
      return {
        label: item.ml_page_name || item.label || "",
        value: item.ml_page_name || item.value || "",
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
