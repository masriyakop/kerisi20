import { buildResponseData, readPages, writePages } from "./helpers";

export default defineEventHandler(async (event) => {
  try {
    const { id } = event.context.params;
    const pageId = parseInt(id);
    
    if (isNaN(pageId)) {
      return {
        statusCode: 400,
        message: "Invalid page id",
      };
    }

    const pages = readPages();
    const filtered = pages.filter(
      (item) => parseInt(item.pageId) !== pageId
    );

    if (filtered.length === pages.length) {
      return {
        statusCode: 404,
        message: "Page not found",
      };
    }

    writePages(filtered);

    return {
      statusCode: 200,
      message: "Page deleted successfully",
      data: buildResponseData(filtered),
    };
  } catch (error) {
    console.error("Error deleting page:", error);
    return {
      statusCode: 500,
      message: "Failed to delete page",
      error: error.message,
    };
  }
});

