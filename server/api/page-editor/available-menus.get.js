import Menu from "~/navigation/index.js";
import { readPages } from "./helpers";
import fs from "fs";
import path from "path";

// Recursive function to extract all menu paths from navigation structure
const extractMenuPaths = (items, paths = []) => {
  items.forEach((item) => {
    if (item.path && item.path !== "/") {
      paths.push(item.path);
    }
    if (item.child && item.child.length > 0) {
      extractMenuPaths(item.child, paths);
    }
  });
  return paths;
};

// Check if a page component file exists for a given menu path
const hasPageComponent = (menuPath) => {
  try {
    // Convert menu path to page file path
    // e.g., "/accountcode" -> "pages/accountcode/index.vue" or "pages/accountcode.vue"
    // e.g., "/budget/setup/budget-code" -> "pages/budget/setup/budget-code/index.vue"
    
    const pagesDir = path.join(process.cwd(), "pages");
    
    // Remove leading slash and handle nested paths
    let filePath = menuPath.replace(/^\//, "");
    
    // Check for index.vue file (e.g., pages/accountcode/index.vue)
    const indexPath = path.join(pagesDir, filePath, "index.vue");
    if (fs.existsSync(indexPath)) {
      return true;
    }
    
    // Check for direct .vue file (e.g., pages/accountcode.vue)
    const directPath = path.join(pagesDir, `${filePath}.vue`);
    if (fs.existsSync(directPath)) {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error checking page component for ${menuPath}:`, error);
    return false;
  }
};

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const excludePageId = query.excludePageId ? parseInt(query.excludePageId) : null;

    // Get all pages that have menus attached
    const pages = readPages();
    const attachedMenus = pages
      .filter((p) => {
        // If editing, exclude the current page's menu from the attached list
        if (excludePageId && parseInt(p.pageId) === excludePageId) {
          return false;
        }
        return p.menu && p.menu.trim() !== "";
      })
      .map((p) => p.menu);

    // Get all menu paths from navigation
    const allMenuPaths = [];
    Menu.forEach((section) => {
      if (section.child) {
        extractMenuPaths(section.child, allMenuPaths);
      }
    });

    // Filter out menus that:
    // 1. Are already attached to pages in page_editor.json
    const availableMenus = allMenuPaths.filter((menuPath) => {
      // Skip if already attached to a page
      if (attachedMenus.includes(menuPath)) {
        return false;
      }
      
      return true;
    });

    // Format for select dropdown (FormKit select expects array of objects with label and value)
    const menuOptions = availableMenus.map((path) => ({
      label: path,
      value: path,
    }));

    return {
      statusCode: 200,
      message: "Available menus fetched successfully",
      data: menuOptions,
    };
  } catch (error) {
    console.error("Error fetching available menus:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch available menus",
      error: error.message,
    };
  }
});
