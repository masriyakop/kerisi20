import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  const method = getMethod(event);

  // Ensure prisma is available
  if (!prisma) {
    console.error("Prisma client is not available - import may have failed");
    return {
      statusCode: 500,
      message: "Database connection not available",
    };
  }

  if (!prisma.site_settings) {
    console.error("Prisma site_settings model is not available");
    return {
      statusCode: 500,
      message: "Database model not available",
    };
  }

  try {
    if (method === "GET") {
      // Get only the loading logo and site name for faster loading
      const settings = await prisma.site_settings.findFirst({
        select: {
          siteLoadingLogo: true,
          siteName: true,
        },
        orderBy: { settingID: "desc" },
      });

      return {
        statusCode: 200,
        message: "Success",
        data: {
          siteLoadingLogo: settings?.siteLoadingLogo || '',
          siteName: settings?.siteName || 'corradAF',
        },
      };
    }

    return {
      statusCode: 405,
      message: "Method not allowed",
    };
  } catch (error) {
    console.error("Loading logo API error:", error);
    
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    };
  }
}); 