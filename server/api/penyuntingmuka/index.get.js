import { buildResponseData, readPages } from "./helpers";

export default defineEventHandler(async () => {
  try {
    const pages = readPages();
    return {
      statusCode: 200,
      message: "Pages fetched successfully",
      data: buildResponseData(pages),
    };
  } catch (error) {
    console.error("Error reading pages:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch pages",
      error: error.message,
    };
  }
});

