import { buildResponseData, getNextPageId, readPages, writePages } from "./helpers";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const pageTitle = body?.pageTitle?.toString().trim();

    if (!pageTitle) {
      return {
        statusCode: 400,
        message: "Page Title is required",
      };
    }

    const pages = readPages();
    const pageId = getNextPageId();

    pages.push({ pageId, pageTitle });
    writePages(pages);

    return {
      statusCode: 200,
      message: "Page created successfully",
      data: buildResponseData(pages),
    };
  } catch (error) {
    console.error("Error creating page:", error);
    return {
      statusCode: 500,
      message: "Failed to create page",
      error: error.message,
    };
  }
});

