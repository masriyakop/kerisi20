import { buildResponseData, readPages, writePages } from "./helpers";

export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(getRouterParam(event, "id"));
    const pages = readPages();
    const pageIndex = pages.findIndex((p) => parseInt(p.pageId) === id);

    if (pageIndex === -1) {
      return {
        statusCode: 404,
        message: "Page not found",
      };
    }

    pages.splice(pageIndex, 1);
    writePages(pages);

    return {
      statusCode: 200,
      message: "Page deleted successfully",
      data: buildResponseData(pages),
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
