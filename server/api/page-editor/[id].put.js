import { buildResponseData, readPages, writePages } from "./helpers";

export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(getRouterParam(event, "id"));
    const body = await readBody(event);
    const pageTitle = body?.pageTitle?.toString().trim();
    const menu = body?.menu?.toString().trim() || "";
    const status = body?.status?.toString().trim() || "ACTIVE";
    const customized = body?.customized === true || body?.customized === 1 ? 1 : 0;

    if (!pageTitle) {
      return {
        statusCode: 400,
        message: "Page Title is required",
      };
    }

    if (!status || (status !== "ACTIVE" && status !== "INACTIVE")) {
      return {
        statusCode: 400,
        message: "Status must be either ACTIVE or INACTIVE",
      };
    }

    const pages = readPages();
    const pageIndex = pages.findIndex((p) => parseInt(p.pageId) === id);

    if (pageIndex === -1) {
      return {
        statusCode: 404,
        message: "Page not found",
      };
    }

    // Check if menu is already attached to another page
    if (menu) {
      const existingPageWithMenu = pages.find((p) => p.menu === menu && parseInt(p.pageId) !== id);
      if (existingPageWithMenu) {
        return {
          statusCode: 400,
          message: "This menu is already attached to another page",
        };
      }
    }

    // Preserve createdTimestamp, update updateTimestamp
    const existingPage = pages[pageIndex];
    pages[pageIndex] = {
      ...existingPage,
      pageTitle,
      menu,
      status,
      customized,
      updateTimestamp: new Date().toISOString(),
    };

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
