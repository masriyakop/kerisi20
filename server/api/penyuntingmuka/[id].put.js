import { buildResponseData, readPages, writePages } from "./helpers";

export default defineEventHandler(async (event) => {
  try {
    const { id } = event.context.params;
    const body = await readBody(event);
    const pageTitle = body?.pageTitle?.toString().trim();

    if (!pageTitle) {
      return {
        statusCode: 400,
        message: "Page Title is required",
      };
    }

    const pages = readPages();
    const pageId = parseInt(id);
    
    if (isNaN(pageId)) {
      return {
        statusCode: 400,
        message: "Invalid page id",
      };
    }

    const index = pages.findIndex(
      (item) => parseInt(item.pageId) === pageId
    );

    if (index === -1) {
      return {
        statusCode: 404,
        message: "Page not found",
      };
    }

    // Update only pageTitle, keep the original pageId (cannot be changed)
    pages[index] = { pageId, pageTitle };
    writePages(pages);

    return {
      statusCode: 200,
      message: "Page updated successfully",
      data: buildResponseData(pages),
    };
  } catch (error) {
    console.error("Error updating page:", error);
    return {
      statusCode: 500,
      message: "Failed to update page",
      error: error.message,
    };
  }
});

