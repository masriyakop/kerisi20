import prisma from "~/server/utils/prisma";
import crypto from "crypto";

function generateApiKey() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = crypto.randomBytes(32);
  let result = "";
  for (let i = 0; i < 32; i++) {
    result += chars[bytes[i] % chars.length];
  }
  return result;
}

export default defineEventHandler(async (event) => {
  try {
    let body = {};
    try {
      body = (await readBody(event)) || {};
    } catch (e) {
      console.error("readBody error:", e);
      setResponseStatus(event, 400);
      return { statusCode: 400, message: "Invalid request body" };
    }
    const { api_base_url, api_data_path, api_output_type, api_gen_template_details } = body;

    if (!api_output_type) {
      return {
        statusCode: 400,
        message: "api_output_type is required",
      };
    }

    // Derive base URL: use api_base_url if valid, else build from request origin + api_data_path (export URL)
    const getRequestOrigin = () => {
      try {
        const url = getRequestURL(event);
        return url?.origin || "";
      } catch {
        return "";
      }
    };
    let baseUrl = (api_base_url || "").replace(/\?$/, "").trim();
    if (!baseUrl && api_data_path) {
      const origin = getRequestOrigin();
      const exportPath = api_data_path.replace(/^\/api\//, "").replace(/^\//, "");
      baseUrl = origin ? `${origin}/api/kerisi-export/${exportPath}` : "";
    }

    const validOutputTypes = ["JSON", "PDF", "CSV", "EXCEL"];
    if (!validOutputTypes.includes(api_output_type)) {
      return {
        statusCode: 400,
        message: "api_output_type must be one of: JSON, PDF, CSV, EXCEL",
      };
    }

    const userId = event.context.user?.userID ?? event.context.user?.email ?? "system";
    const createdby = userId != null ? String(userId) : "system";
    let apiKey = generateApiKey();

    let attempts = 0;
    const maxAttempts = 5;
    while (attempts < maxAttempts) {
      const existing = await prisma.api_gen_template.findUnique({ where: { api_key: apiKey } });
      if (!existing) break;
      apiKey = generateApiKey();
      attempts++;
    }

    if (attempts >= maxAttempts) {
      return {
        statusCode: 500,
        message: "Failed to generate unique API key. Please try again.",
      };
    }

    const storedBaseUrl = baseUrl ? (baseUrl.endsWith("?") ? baseUrl : `${baseUrl}?`) : "?";
    await prisma.api_gen_template.create({
      data: {
        api_key: apiKey,
        api_base_url: storedBaseUrl,
        api_data_path: api_data_path || null,
        api_output_type,
        api_gen_template_details: api_gen_template_details || null,
        createdby,
      },
    });

    const fullUrl = baseUrl ? `${baseUrl}?kerisiApiKey=${apiKey}` : `?kerisiApiKey=${apiKey}`;

    return {
      statusCode: 200,
      message: "API key created successfully",
      data: {
        api_key: apiKey,
        full_url: fullUrl,
      },
    };
  } catch (error) {
    console.error("Error creating API gen template:", error);
    setResponseStatus(event, 500);
    let message = "Internal server error";
    if (error.code === "P2021" || (error.message && error.message.includes("does not exist"))) {
      message = "Database table api_gen_template does not exist. Please run: npx prisma db push";
    } else if (error.message) {
      message = error.message;
    }
    return {
      statusCode: 500,
      message,
      error: error.message,
    };
  }
});
