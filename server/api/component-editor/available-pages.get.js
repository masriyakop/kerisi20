import { readPages } from "../page-editor/helpers";

export default defineEventHandler(async (event) => {
  try {
    // Get all pages that have menus attached
    const pages = readPages();
    const pagesWithMenus = pages.filter((p) => p.menu && p.menu.trim() !== "");

    // Format for display
    const pageOptions = pagesWithMenus.map((page) => ({
      pageId: typeof page.pageId === "number" ? page.pageId : parseInt(page.pageId) || 0,
      pageTitle: page.pageTitle || "",
      menu: page.menu || "",
    }));

    return {
      statusCode: 200,
      message: "Available pages fetched successfully",
      data: pageOptions,
    };
  } catch (error) {
    console.error("Error fetching available pages:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch available pages",
      error: error.message,
    };
  }
});
