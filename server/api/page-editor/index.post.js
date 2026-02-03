import { buildResponseData, getNextPageId, readPages, writePages } from "./helpers";

export default defineEventHandler(async (event) => {
  try {
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
    
    // Check for duplicate pageId (should not happen with auto-increment, but just in case)
    const pageId = getNextPageId();
    
    // Check if menu is already attached to another page
    if (menu) {
      const existingPageWithMenu = pages.find((p) => p.menu === menu && p.pageId !== pageId);
      if (existingPageWithMenu) {
        return {
          statusCode: 400,
          message: "This menu is already attached to another page",
        };
      }
    }

    const newPage = {
      pageId,
      pageTitle,
      menu,
      status,
      customized,
      createdTimestamp: new Date().toISOString(),
      updateTimestamp: null,
    };

    pages.push(newPage);
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
