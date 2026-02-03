import prisma from "~/server/utils/prisma";
import { readComponents, writeComponents } from "../component-editor/helpers";
import { readPages } from "../page-editor/helpers";
import { readComponentItems } from "../component-item-editor/helpers";
import fs from "fs";
import path from "path";

// Helper function to update navigation menu with generated page
function updateNavigationMenu(menuPath, pageTitle, generatedPagePath) {
  try {
    const navigationFilePath = path.join(process.cwd(), "navigation", "index.js");
    
    if (!fs.existsSync(navigationFilePath)) {
      console.warn("Navigation file not found:", navigationFilePath);
      return false;
    }
    
    // Read the navigation file
    let navigationContent = fs.readFileSync(navigationFilePath, "utf-8");
    
    // Extract the array from the export default
    const exportMatch = navigationContent.match(/export\s+default\s+(\[[\s\S]*\])\s*;?\s*$/);
    if (!exportMatch) {
      console.warn("Could not parse navigation file");
      return false;
    }
    
    let navigationArray;
    try {
      // Use eval to parse the JavaScript array (since it's a JS file, not JSON)
      navigationArray = eval(exportMatch[1]);
    } catch (parseError) {
      console.error("Error parsing navigation array:", parseError);
      return false;
    }
    
    // Normalize paths for comparison (ensure leading slash, lowercase)
    const normalizedMenuPath = menuPath.startsWith("/") ? menuPath.toLowerCase() : "/" + menuPath.toLowerCase();
    const normalizedGeneratedPath = generatedPagePath.startsWith("/") ? generatedPagePath.toLowerCase() : "/" + generatedPagePath.toLowerCase();
    
    // Check if menu path already matches the generated page path (no need to add child)
    // This happens when the page's menu is already set to the full path
    if (normalizedMenuPath === normalizedGeneratedPath) {
      console.log(`Menu path already matches generated path: ${menuPath}. No navigation update needed.`);
      return true; // Return true as no update is needed
    }
    
    // Recursive function to find existing menu item by path
    function findMenuByPath(items, targetPath) {
      for (let item of items) {
        const itemPath = (item.path || "").toLowerCase();
        if (itemPath === targetPath) {
          return item;
        }
        if (item.child && item.child.length > 0) {
          const found = findMenuByPath(item.child, targetPath);
          if (found) return found;
        }
      }
      return null;
    }
    
    // Check if a menu item already exists at the generated path
    const existingMenuItem = findMenuByPath(navigationArray, normalizedGeneratedPath);
    if (existingMenuItem) {
      // Menu item already exists at the generated path, just update its title
      existingMenuItem.title = pageTitle;
      const updatedContent = `export default ${JSON.stringify(navigationArray, null, 2)};`;
      fs.writeFileSync(navigationFilePath, updatedContent, "utf-8");
      console.log(`Updated existing menu item title: ${pageTitle} at ${generatedPagePath}`);
      return true;
    }
    
    // Recursive function to find and update the parent menu item
    function findAndUpdateMenu(items, targetPath, newChild) {
      for (let item of items) {
        const itemPath = (item.path || "").toLowerCase();
        
        // Check if this item matches the target menu path
        if (itemPath === targetPath) {
          // Ensure child array exists
          if (!item.child) {
            item.child = [];
          }
          
          // Check if the child already exists (update instead of duplicate)
          const existingChildIndex = item.child.findIndex(
            (child) => (child.path || "").toLowerCase() === newChild.path.toLowerCase()
          );
          
          if (existingChildIndex >= 0) {
            // Update existing child
            item.child[existingChildIndex] = {
              ...item.child[existingChildIndex],
              title: newChild.title,
              path: newChild.path,
            };
            console.log(`Updated existing navigation child: ${newChild.title} at ${newChild.path}`);
          } else {
            // Add new child
            item.child.push(newChild);
            console.log(`Added new navigation child: ${newChild.title} at ${newChild.path}`);
          }
          return true;
        }
        
        // Recursively search in children
        if (item.child && item.child.length > 0) {
          if (findAndUpdateMenu(item.child, targetPath, newChild)) {
            return true;
          }
        }
      }
      return false;
    }
    
    // Create the new child menu item
    const newChildItem = {
      title: pageTitle,
      path: generatedPagePath,
      icon: "",
      child: [],
      meta: {}
    };
    
    // Find and update the menu
    const updated = findAndUpdateMenu(navigationArray, normalizedMenuPath, newChildItem);
    
    if (updated) {
      // Write the updated navigation back to file
      const updatedContent = `export default ${JSON.stringify(navigationArray, null, 2)};`;
      fs.writeFileSync(navigationFilePath, updatedContent, "utf-8");
      console.log(`Navigation menu updated successfully for ${pageTitle}`);
      return true;
    } else {
      console.warn(`Parent menu not found in navigation: ${menuPath}`);
      return false;
    }
  } catch (error) {
    console.error("Error updating navigation menu:", error);
    return false;
  }
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const pageId = parseInt(body?.pageId);

    if (!pageId) {
      return {
        statusCode: 400,
        message: "Page ID is required",
      };
    }

    // Read components for this page (only active components)
    const components = readComponents();
    const pageComponents = components.filter((c) => 
      parseInt(c.pageId) === pageId && 
      (c.active === 1 || c.active === "1" || c.active === true)
    );

    if (pageComponents.length === 0) {
      return {
        statusCode: 400,
        message: "No active components found for this page",
      };
    }

    // Validate datatable components have Query Mapping
    const datatableComponents = pageComponents.filter((c) => c.type === "datatable");
    const invalidDatatables = datatableComponents.filter(
      (c) => !c.queryMapping || c.queryMapping.trim() === ""
    );

    if (invalidDatatables.length > 0) {
      return {
        statusCode: 400,
        message: `Datatable components missing Query Mapping: ${invalidDatatables
          .map((c) => c.title || c.name)
          .join(", ")}`,
      };
    }

    // Validate datatable components have Title BM, Title BI, and Key configured
    for (const dt of datatableComponents) {
      try {
        const componentData = dt.componentData ? JSON.parse(dt.componentData) : {};
        const dtBi = componentData.dt_bi || [];
        const dtBm = componentData.dt_bm || [];
        const dtKey = componentData.dt_key || [];
        
        // Skip validation for special columns (No, Action, checkbox inputs)
        const isSpecialColumn = (value) => {
          if (!value || typeof value !== 'string') return true;
          const trimmed = value.trim().toLowerCase();
          return trimmed === 'no' || 
                 trimmed === 'action' || 
                 trimmed.includes('<input') ||
                 trimmed === '';
        };
        
        // Get indices of non-special columns (actual data columns that need validation)
        const dataColumnIndices = [];
        for (let i = 0; i < Math.max(dtBi.length, dtBm.length, dtKey.length); i++) {
          const bi = dtBi[i] || '';
          const bm = dtBm[i] || '';
          const key = dtKey[i] || '';
          
          // If any of the values suggest this is a data column, validate it
          if (!isSpecialColumn(bi) || !isSpecialColumn(bm) || !isSpecialColumn(key)) {
            dataColumnIndices.push(i);
          }
        }
        
        // Validate each data column has all three values filled
        const emptyFields = [];
        for (const idx of dataColumnIndices) {
          const bi = (dtBi[idx] || '').trim();
          const bm = (dtBm[idx] || '').trim();
          const key = (dtKey[idx] || '').trim();
          
          // Skip if this looks like a special column
          if (isSpecialColumn(bi) && isSpecialColumn(bm) && isSpecialColumn(key)) {
            continue;
          }
          
          if (!bi || bi === '') {
            emptyFields.push(`Column ${idx + 1}: Title BI is empty`);
          }
          if (!bm || bm === '') {
            emptyFields.push(`Column ${idx + 1}: Title BM is empty`);
          }
          if (!key || key === '') {
            emptyFields.push(`Column ${idx + 1}: Key is empty`);
          }
        }
        
        if (emptyFields.length > 0) {
          return {
            statusCode: 400,
            message: `Datatable "${dt.title || dt.name}" has incomplete column configuration:\n${emptyFields.join('\n')}`,
          };
        }
      } catch (e) {
        console.error(`Error validating datatable ${dt.id}:`, e);
      }
    }

    // Read page data (only active pages)
    const pages = readPages();
    const page = pages.find((p) => parseInt(p.pageId) === pageId);

    if (!page) {
      return {
        statusCode: 404,
        message: "Page not found",
      };
    }

    // Check if page is active
    if (page.status && page.status.toUpperCase() !== "ACTIVE") {
      return {
        statusCode: 400,
        message: "Page is not active. Only active pages can be generated.",
      };
    }

    const generatedApis = [];
    const updatedComponents = [];

    // Read component items for filters and forms (only active component items)
    // This must be done BEFORE processing datatables so topFilterItems is available
    const componentItems = readComponentItems();
    const pageComponentItems = componentItems.filter((ci) => 
      parseInt(ci.pageId) === pageId && 
      (ci.active === 1 || ci.active === "1" || ci.active === true)
    );

    // Process each datatable component
    for (const component of datatableComponents) {
      try {
        const componentData = component.componentData
          ? JSON.parse(component.componentData)
          : {};

        // Generate folder path from menu structure (for file system and URL)
        // Use folder path for both to ensure consistency
        const apiFolderPath = getApiFolderPathFromMenu(page.menu, page.pageTitle);
        const apiPath = apiFolderPath || `page-generated/${pageId}/${component.id}`;
        // Use the same path for URL (folder path) to match the actual API location
        const apiUrlPath = apiPath;
        
        // Generate API name for reference
        const apiName = `PAGE_${pageId}_${component.id}`.toUpperCase().replace(/[^A-Z0-9_]/g, "_");

        // Parse queryMapping to extract table and fields
        const queryMapping = component.queryMapping || "";
        const tableInfo = parseQueryMapping(queryMapping);

        if (!tableInfo.table) {
          console.warn(`Could not parse table from queryMapping for component ${component.id}`);
          continue;
        }

        // Generate CRUD APIs based on Popup Modal checkboxes
        const popupModal = {
          view: componentData.dt_popup_view || false,
          edit: componentData.dt_popup_edit || false,
          add: componentData.dt_popup_add || false,
          delete: componentData.dt_popup_delete || false,
        };

        // Check if old API exists and needs to be removed
        const oldApiPath = `page-generated/${pageId}/${component.id}`;
        if (apiPath !== oldApiPath) {
          // Remove old API directory if it exists
          const oldApiDir = path.join(process.cwd(), "server", "api", ...oldApiPath.split("/"));
          if (fs.existsSync(oldApiDir)) {
            try {
              fs.rmSync(oldApiDir, { recursive: true, force: true });
              console.log(`Removed old API directory: ${oldApiDir}`);
            } catch (error) {
              console.warn(`Could not remove old API directory: ${error.message}`);
            }
          }
        }
        
        // Also remove old path if it exists (e.g., messagemanagement -> message-management)
        // Check for old path without hyphens if folder path has hyphens
        if (apiFolderPath) {
          const apiPathFromMenu = getApiPathFromMenu(page.menu, page.pageTitle);
          if (apiPathFromMenu && apiPathFromMenu !== apiFolderPath) {
            const oldApiDir = path.join(process.cwd(), "server", "api", ...apiPathFromMenu.split("/"));
            if (fs.existsSync(oldApiDir)) {
              try {
                fs.rmSync(oldApiDir, { recursive: true, force: true });
                console.log(`Removed old API directory: ${oldApiDir}`);
              } catch (error) {
                console.warn(`Could not remove old API directory: ${error.message}`);
              }
            }
          }
        }

        // Get Top Filter component and items for filter generation
        const topFilterComponent = pageComponents.find((c) => c.type === "form_TopFilter");
        const topFilterItems = topFilterComponent 
          ? pageComponentItems.filter((ci) => ci.componentId === topFilterComponent.id)
          : [];
        
        // Get Popup Modal component and items for form field mapping
        const popupModalComponent = pageComponents.find((c) => c.type === "form_PopupModal");
        const popupModalItems = popupModalComponent 
          ? pageComponentItems.filter((ci) => ci.componentId === popupModalComponent.id)
          : [];
        
        // Generate GET endpoint (always needed for datatable)
        await generateGetEndpoint(apiPath, tableInfo, componentData, topFilterItems, popupModalItems);

        // Generate POST endpoint if add is enabled
        if (popupModal.add) {
          await generatePostEndpoint(apiPath, tableInfo, componentData, popupModalItems);
        }

        // Generate PUT endpoint if edit is enabled
        if (popupModal.edit) {
          await generatePutEndpoint(apiPath, tableInfo, componentData, popupModalItems);
        }

        // Generate DELETE endpoint if delete is enabled
        if (popupModal.delete) {
          await generateDeleteEndpoint(apiPath, tableInfo, componentData);
        }

        // Update component dt_ajax (use folder path which matches the actual API location)
        const apiUrlPathWithSlash = apiUrlPath.startsWith('/') ? apiUrlPath : `/${apiUrlPath}`;
        const updatedComponentData = {
          ...componentData,
          dt_ajax: `/api${apiUrlPathWithSlash}`,
        };

        updatedComponents.push({
          ...component,
          componentData: JSON.stringify(updatedComponentData),
        });

        generatedApis.push({
          componentId: component.id,
          componentName: component.name,
          apiPath: `/api${apiUrlPathWithSlash}`,
          operations: {
            get: true,
            post: popupModal.add,
            put: popupModal.edit,
            delete: popupModal.delete,
          },
        });
      } catch (error) {
        console.error(`Error processing component ${component.id}:`, error);
        // Continue with other components
      }
    }

    // Update components with new dt_ajax values
    for (const updatedComponent of updatedComponents) {
      const index = components.findIndex((c) => c.id === updatedComponent.id);
      if (index !== -1) {
        components[index] = updatedComponent;
      }
    }
    writeComponents(components);

    // Generate lookup API endpoints for dropdown fields with lookup_queryMapping (SQL only, skip JSON arrays)
    // Get all components (datatable, top filter, smart filter, popup modal, button) for lookup generation
    const allComponentsForLookup = pageComponents.filter((c) => 
      c.type === "datatable" || c.type === "form_TopFilter" || c.type === "form_SmartFilter" || c.type === "form_PopupModal" || c.type === "Button" || c.type === "button"
    );
    for (const component of allComponentsForLookup) {
      const items = pageComponentItems.filter((ci) => ci.componentId === component.id && ci.type === "dropdown" && ci.lookup_queryMapping && ci.lookup_queryMapping.trim());
      for (const item of items) {
        try {
          const lookupQuery = item.lookup_queryMapping.trim();
          
          // Skip JSON array format (starts with [)
          if (lookupQuery.trim().startsWith('[')) {
            continue; // JSON arrays don't need API endpoints
          }
          
          const lookupTableInfo = parseQueryMapping(lookupQuery);
          
          if (lookupTableInfo.table) {
            // Generate lookup endpoint path
            const lookupApiPath = `page-generated/${pageId}/lookups/${item.name.replace(/[^a-zA-Z0-9]/g, "_")}`;
            await generateLookupEndpoint(lookupApiPath, lookupTableInfo, lookupQuery);
          }
        } catch (error) {
          console.error(`Error generating lookup endpoint for ${item.name}:`, error);
        }
      }
    }

    // Generate Vue page file
    await generateVuePage(page, pageComponents, pageComponentItems);

    // Update navigation menu with the generated page
    const sanitizedPageTitle = page.pageTitle.toLowerCase().replace(/[^a-z0-9]+/g, "");
    
    // Check if the menu already ends with the sanitized page title
    // If so, don't append it again (prevents duplicates like /path/pagename/pagename)
    const normalizedMenu = page.menu.toLowerCase().replace(/\/+$/, ""); // Remove trailing slashes
    const menuAlreadyIncludesPage = normalizedMenu.endsWith(sanitizedPageTitle) || 
                                     normalizedMenu.endsWith(`/${sanitizedPageTitle}`);
    
    let generatedPagePath;
    let parentMenuPath;
    
    if (menuAlreadyIncludesPage) {
      // Menu already includes the page name, use it as-is
      generatedPagePath = page.menu;
      // Parent menu is the path without the page name
      const lastSlashIndex = page.menu.lastIndexOf('/');
      parentMenuPath = lastSlashIndex > 0 ? page.menu.substring(0, lastSlashIndex) : page.menu;
    } else {
      // Menu is the parent path, append page title
      generatedPagePath = `${page.menu}/${sanitizedPageTitle}`;
      parentMenuPath = page.menu;
    }
    
    const navigationUpdated = updateNavigationMenu(parentMenuPath, page.pageTitle, generatedPagePath);

    return {
      statusCode: 200,
      message: navigationUpdated 
        ? "Page generated successfully and navigation menu updated" 
        : "Page generated successfully (navigation menu not updated - parent menu not found)",
      data: {
        pageId,
        generatedApis,
        componentsUpdated: updatedComponents.length,
        navigationUpdated,
        generatedPath: generatedPagePath,
      },
    };
  } catch (error) {
    console.error("Error generating page:", error);
    return {
      statusCode: 500,
      message: "Failed to generate page",
      error: error.message,
    };
  }
});

// Helper function to convert menu and pageTitle to API path (for URL)
// This returns the path that will be used in the API URL
function getApiPathFromMenu(menu, pageTitle) {
  if (!menu || !pageTitle) {
    return null;
  }

  let apiPath = "";

  // Generate page name from pageTitle - convert to lowercase, remove spaces
  const pageName = pageTitle
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  const pageNameWithoutHyphens = pageName.replace(/-/g, "");

  if (menu.startsWith("/")) {
    // Menu is a path like "/messagemanagement/setup"
    const menuPath = menu.substring(1); // Remove leading /
    const menuParts = menuPath.split("/");
    const lastMenuPart = (menuParts[menuParts.length - 1] || "").toLowerCase().replace(/-/g, "");
    
    // Check if menu already ends with the page name
    if (lastMenuPart === pageNameWithoutHyphens) {
      apiPath = menuPath;
    } else {
      apiPath = `${menuPath}/${pageName}`;
    }
  } else if (menu.includes(">")) {
    // Menu uses ">" separator like "Budget>Setup>Budget Code"
    const menuParts = menu.split(">").map((part) =>
      part
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
    );
    const lastMenuPart = (menuParts[menuParts.length - 1] || "").replace(/-/g, "");
    
    // Check if menu already ends with the page name
    if (lastMenuPart === pageNameWithoutHyphens) {
      apiPath = menuParts.join("/");
    } else {
      apiPath = `${menuParts.join("/")}/${pageName}`;
    }
  } else {
    // Simple menu string
    const menuPath = menu
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    const menuPathWithoutHyphens = menuPath.replace(/-/g, "");
    
    // Check if menu already equals the page name
    if (menuPathWithoutHyphens === pageNameWithoutHyphens) {
      apiPath = menuPath;
    } else {
      apiPath = `${menuPath}/${pageName}`;
    }
  }

  return apiPath;
}

// Helper function to convert menu and pageTitle to folder path (with hyphens)
// This returns the folder structure that should be created
// Converts camelCase or concatenated words to hyphenated format
function getApiFolderPathFromMenu(menu, pageTitle) {
  if (!menu || !pageTitle) {
    return null;
  }

  // Helper function to add hyphens to camelCase or concatenated words
  // e.g., "messagemanagement" -> "message-management"
  function addHyphensToWords(str) {
    // First, handle camelCase: add hyphen before capital letters
    let result = str.replace(/([a-z])([A-Z])/g, "$1-$2");
    // Then, try to detect word boundaries in lowercase concatenated words
    // Common patterns: "message" + "management", "budget" + "code", etc.
    // This is a heuristic - we'll add hyphens before common word endings
    const commonEndings = ['management', 'setup', 'code', 'type', 'list', 'detail', 'item', 'group'];
    for (const ending of commonEndings) {
      const pattern = new RegExp(`([a-z]+)(${ending})`, 'i');
      if (pattern.test(result)) {
        result = result.replace(pattern, (match, prefix, suffix) => {
          // Only add hyphen if prefix is a reasonable word (more than 2 chars)
          if (prefix.length > 2) {
            return `${prefix}-${suffix}`;
          }
          return match;
        });
      }
    }
    return result.toLowerCase();
  }

  let folderPath = "";

  if (menu.startsWith("/")) {
    // Menu is a path like "/messagemanagement/setup"
    // Convert to folder path with hyphens: "message-management/setup"
    const menuParts = menu.substring(1).split("/"); // Remove leading / and split
    const folderParts = menuParts.map((part) => {
      // Add hyphens between words
      return addHyphensToWords(part)
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
    });
    // Generate page name from pageTitle
    const pageName = pageTitle
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    
    // Check if menu already ends with the page name (with or without hyphens)
    const lastMenuPart = folderParts[folderParts.length - 1] || "";
    const pageNameWithoutHyphens = pageName.replace(/-/g, "");
    const lastMenuPartWithoutHyphens = lastMenuPart.replace(/-/g, "");
    const menuAlreadyIncludesPage = lastMenuPartWithoutHyphens === pageNameWithoutHyphens;
    
    if (menuAlreadyIncludesPage) {
      // Menu already ends with page name, don't append again
      folderPath = folderParts.join("/");
    } else {
      folderPath = `${folderParts.join("/")}/${pageName}`;
    }
  } else if (menu.includes(">")) {
    // Menu uses ">" separator like "Budget>Setup>Budget Code"
    const menuParts = menu.split(">").map((part) => {
      const trimmed = part.trim();
      // Add hyphens between words
      return addHyphensToWords(trimmed)
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
    });
    const pageName = pageTitle
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    
    // Check if menu already ends with the page name (with or without hyphens)
    const lastMenuPart = menuParts[menuParts.length - 1] || "";
    const pageNameWithoutHyphens = pageName.replace(/-/g, "");
    const lastMenuPartWithoutHyphens = lastMenuPart.replace(/-/g, "");
    const menuAlreadyIncludesPage = lastMenuPartWithoutHyphens === pageNameWithoutHyphens;
    
    if (menuAlreadyIncludesPage) {
      folderPath = menuParts.join("/");
    } else {
      folderPath = `${menuParts.join("/")}/${pageName}`;
    }
  } else {
    // Simple menu string
    const menuPath = addHyphensToWords(menu)
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    const pageName = pageTitle
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    
    // Check if menu already equals the page name (with or without hyphens)
    const menuPathWithoutHyphens = menuPath.replace(/-/g, "");
    const pageNameWithoutHyphens = pageName.replace(/-/g, "");
    const menuAlreadyIncludesPage = menuPathWithoutHyphens === pageNameWithoutHyphens;
    
    if (menuAlreadyIncludesPage) {
      folderPath = menuPath;
    } else {
      folderPath = `${menuPath}/${pageName}`;
    }
  }

  return folderPath;
}

// Helper function to parse queryMapping SQL
function parseQueryMapping(queryMapping) {
  if (!queryMapping || queryMapping.trim() === "") {
    return { table: null, fields: [], originalQuery: queryMapping };
  }

  // Remove comments and normalize whitespace
  const cleaned = queryMapping
    .replace(/--.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .trim();

  // Remove subqueries (content in parentheses containing SELECT) before extracting main table
  // This prevents matching FROM clauses inside subqueries
  let cleanedForTable = cleaned;
  let prevLength = 0;
  while (cleanedForTable.length !== prevLength) {
    prevLength = cleanedForTable.length;
    // Remove innermost subqueries first (those without nested parens)
    cleanedForTable = cleanedForTable.replace(/\([^()]*SELECT[^()]*\)/gi, ' SUBQUERY_PLACEHOLDER ');
    // Also remove any remaining nested parentheses content that might contain SELECT
    cleanedForTable = cleanedForTable.replace(/\(\s*SELECT[^)]+\)/gi, ' SUBQUERY_PLACEHOLDER ');
  }
  
  // Extract table name from the main FROM clause (after subqueries removed)
  // Handle FROM with optional schema/alias: FROM schema.table alias, FROM table AS alias, FROM table alias
  const tableMatch = cleanedForTable.match(/FROM\s+(?:`?(\w+)`?\.)?`?(\w+)`?(?:\s+AS\s+(\w+)|\s+(\w+))?/i);
  const table = tableMatch ? (tableMatch[2] || tableMatch[1]) : null;

  // Extract fields from SELECT clause - handle aliases and functions
  // Use cleanedForTable (with subqueries replaced) to find the main FROM position
  // Then extract the SELECT clause from the original cleaned string
  const selectMatchForTable = cleanedForTable.match(/SELECT\s+(.+?)\s+FROM/i);
  let fields = [];
  let fieldMapping = {}; // Map alias to original field name
  let subqueryRelations = []; // Store subquery relation info for Prisma includes
  let ifExpressions = []; // Store IF() expression info for value conversions
  
  if (selectMatchForTable) {
    // Find where the main FROM clause starts in the original cleaned string
    // by finding the position in cleanedForTable and mapping back
    const fromIndexInCleaned = cleanedForTable.indexOf(selectMatchForTable[0]);
    const mainFromMatch = cleaned.match(/\bFROM\s+\w+/gi);
    
    // Find the last FROM that's likely the main one (after SELECT clause)
    // We do this by counting parentheses - main FROM is at depth 0
    let mainFromIndex = -1;
    let depth = 0;
    const fromRegex = /\bFROM\b/gi;
    let match;
    while ((match = fromRegex.exec(cleaned)) !== null) {
      // Count parentheses up to this point
      const upToHere = cleaned.substring(0, match.index);
      depth = (upToHere.match(/\(/g) || []).length - (upToHere.match(/\)/g) || []).length;
      if (depth === 0) {
        mainFromIndex = match.index;
        break; // First FROM at depth 0 is the main FROM
      }
    }
    
    // Extract SELECT clause from start to main FROM
    let selectClause = '';
    if (mainFromIndex > 0) {
      const selectStart = cleaned.toUpperCase().indexOf('SELECT');
      if (selectStart >= 0) {
        selectClause = cleaned.substring(selectStart + 6, mainFromIndex).trim();
      }
    } else {
      // Fallback to old method
      selectClause = selectMatchForTable[1];
    }
    
    // Split by comma, but handle nested parentheses (subqueries, functions)
    const fieldParts = [];
    let current = '';
    let parenDepth = 0;
    for (let i = 0; i < selectClause.length; i++) {
      const char = selectClause[i];
      if (char === '(') {
        parenDepth++;
        current += char;
      } else if (char === ')') {
        parenDepth--;
        current += char;
      } else if (char === ',' && parenDepth === 0) {
        fieldParts.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    if (current.trim()) {
      fieldParts.push(current.trim());
    }
    
    // Process each field part - collect subquery, IF expression, and regular fields separately
    const subqueryAliases = [];
    const ifExpressionAliases = [];
    
    fields = fieldParts.map((f) => {
      // Check if this is a subquery - extract relation info for Prisma includes
      if (f.trim().startsWith('(') && f.toUpperCase().includes('SELECT')) {
        // Parse subquery to extract: table, field, alias
        // Pattern: ( SELECT field FROM table WHERE condition ) alias
        // or: ( SELECT field FROM table WHERE condition ) AS alias
        const subqueryMatch = f.match(/\(\s*SELECT\s+(?:DISTINCT\s+)?(\w+)\s+FROM\s+(\w+)(?:\s+\w+)?\s+WHERE\s+[^)]+\)\s*(?:AS\s+)?(\w+)/i);
        if (subqueryMatch) {
          const selectField = subqueryMatch[1]; // e.g., at_activity_description_bm
          const relatedTable = subqueryMatch[2]; // e.g., activity_type
          const alias = subqueryMatch[3]; // e.g., activity_desc
          
          subqueryRelations.push({
            alias: alias,
            relatedTable: relatedTable,
            selectField: selectField,
            // Prisma relation name is typically the table name (snake_case)
            prismaRelation: relatedTable,
          });
          
          // Collect alias to add to fields later
          subqueryAliases.push(alias);
          // Add to fieldMapping - the "original field" will be resolved from relation
          fieldMapping[alias] = `__RELATION__${relatedTable}.${selectField}`;
        }
        return null; // Will be filtered out from regular fields
      }
      
      // Check if this is an IF() expression - extract conversion info
      // Pattern: IF(field = 'value1', 'result1', 'result2') AS alias
      // or: IF(field = 'value1', 'result1', 'result2') alias
      const ifMatch = f.match(/IF\s*\(\s*(\w+)\s*=\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]\s*\)\s*(?:AS\s+)?(\w+)/i);
      if (ifMatch) {
        const sourceField = ifMatch[1]; // e.g., acm_defisit, sbg_status
        const compareValue = ifMatch[2]; // e.g., 'N', '1'
        const trueResult = ifMatch[3]; // e.g., 'NO', 'ACTIVE'
        const falseResult = ifMatch[4]; // e.g., 'YES', 'INACTIVE'
        const alias = ifMatch[5]; // e.g., DEFISIT, STAT
        
        ifExpressions.push({
          alias: alias,
          sourceField: sourceField,
          compareValue: compareValue,
          trueResult: trueResult,
          falseResult: falseResult,
        });
        
        // Collect alias to add to fields later
        ifExpressionAliases.push(alias);
        // Add to fieldMapping with special marker
        fieldMapping[alias] = `__IF__${sourceField}`;
        return null; // Will be filtered out from regular fields
      }
      
      // Check for alias (AS keyword or space-separated alias)
      const aliasMatch = f.match(/\s+AS\s+(\w+)/i);
      const spaceAliasMatch = !aliasMatch ? f.match(/^(\w+)\s+(\w+)$/) : null;
      
      let originalField, alias;
      
      if (aliasMatch) {
        // Has AS keyword: "lde_value AS Code"
        originalField = f.replace(/\s+AS\s+\w+/i, "").trim();
        alias = aliasMatch[1];
      } else if (spaceAliasMatch && spaceAliasMatch[1] !== spaceAliasMatch[2]) {
        // Space-separated alias: "lde_value Code"
        originalField = spaceAliasMatch[1];
        alias = spaceAliasMatch[2];
      } else {
        // No alias, field name is the same
        originalField = f.replace(/^\w+\./, "").replace(/`/g, "").trim();
        const nameMatch = originalField.match(/^(\w+)/);
        originalField = nameMatch ? nameMatch[1] : originalField;
        alias = originalField;
      }
      
      // Skip if alias contains invalid characters (likely a malformed field)
      if (!alias || !/^[\w]+$/.test(alias)) {
        return null;
      }
      
      // Remove table prefixes from original field
      originalField = originalField.replace(/^\w+\./, "").replace(/`/g, "").trim();
      const nameMatch = originalField.match(/^(\w+)/);
      originalField = nameMatch ? nameMatch[1] : originalField;
      
      // Store mapping
      fieldMapping[alias] = originalField;
      
      return alias; // Return alias for display
    }).filter(f => f !== null); // Remove null entries (skipped subqueries)
    
    // Add subquery and IF expression aliases to fields array
    fields = [...fields, ...subqueryAliases, ...ifExpressionAliases];
  }

  // Extract WHERE conditions if any (use cleanedForTable which has subqueries removed)
  // This prevents matching WHERE clauses inside subqueries
  const whereMatch = cleanedForTable.match(/FROM\s+\S+(?:\s+\w+)?\s+WHERE\s+(.+?)(?:\s+GROUP\s+BY|\s+ORDER\s+BY|\s+LIMIT|$)/i);
  const whereClause = whereMatch ? whereMatch[1] : null;

  // Extract primary key field - look for _id pattern in table name or fields
  // Special case for lookup_details table - primary key is lde_id (check FIRST)
  let primaryKey = null;
  let primaryKeyAlias = null; // The alias used in SELECT (e.g., ID)
  if (table && table.toLowerCase() === 'lookup_details') {
    primaryKey = 'lde_id';
    primaryKeyAlias = 'lde_id';
  } else {
    // Common patterns: table_id, id, or any field ending with _id
    primaryKeyAlias = fields.find((f) => f.toLowerCase().endsWith("_id") || f.toLowerCase() === "id");
    if (!primaryKeyAlias && table) {
      // Try to infer from table name (e.g., budget_movement -> bm_id)
      const tablePrefix = table.split('_').map(w => w.charAt(0)).join('').toLowerCase();
      primaryKeyAlias = `${tablePrefix}_id`;
    }
    if (!primaryKeyAlias) {
      primaryKeyAlias = fields[0] || "id";
    }
    // Resolve alias to actual database column name using fieldMapping
    // If the alias is in fieldMapping, use the original field name for Prisma operations
    primaryKey = fieldMapping[primaryKeyAlias] || primaryKeyAlias;
  }
  if (!primaryKey) {
    primaryKey = fields[0] || "id";
  }

  // Parse WHERE clause to extract conditions
  let whereConditions = {};
  if (whereClause) {
    // Simple WHERE clause parsing - handle common patterns
    // Pattern: field='value' or field="value"
    const equalityMatch = whereClause.match(/(\w+)\s*=\s*['"]([^'"]+)['"]/i);
    if (equalityMatch) {
      whereConditions[equalityMatch[1]] = equalityMatch[2];
    }
    // Pattern: field IN ('value1', 'value2')
    const inMatch = whereClause.match(/(\w+)\s+IN\s*\(([^)]+)\)/i);
    if (inMatch) {
      const values = inMatch[2].split(',').map(v => v.trim().replace(/['"]/g, ''));
      whereConditions[inMatch[1]] = { in: values };
    }
  }

  return {
    table,
    fields,
    fieldMapping, // Map of alias -> original field name
    primaryKey, // Actual database column name for Prisma operations
    primaryKeyAlias, // Alias used in SELECT clause (for data mapping)
    whereClause,
    whereConditions, // Parsed WHERE conditions
    subqueryRelations, // Subquery relations for Prisma includes
    ifExpressions, // IF() expression conversions
    originalQuery: queryMapping,
  };
}

// Generate GET endpoint
async function generateGetEndpoint(apiPath, tableInfo, componentData, topFilterItems = [], popupModalItems = []) {
  // Split the path into individual folder names
  const pathParts = apiPath.split("/").filter(part => part && part.trim() !== "");
  
  // Build the directory path by joining all parts
  const endpointDir = path.join(
    process.cwd(),
    "server",
    "api",
    ...pathParts
  );

  // Create the directory structure recursively
  if (!fs.existsSync(endpointDir)) {
    fs.mkdirSync(endpointDir, { recursive: true });
  }

  // Build the full file path
  const endpointPath = path.join(endpointDir, "index.get.js");

  // Build search conditions from original field names (not aliases)
  // Note: mode: 'insensitive' is PostgreSQL-only; removed for cross-database compatibility
  const searchFields = Object.values(tableInfo.fieldMapping || {})
    .filter((f) => {
      if (!f || f.trim() === "") return false;
      // Skip invalid field names (subqueries, SQL keywords, etc.)
      if (f.includes('(') || f.includes(')')) return false;
      if (f.toUpperCase().includes('SELECT')) return false;
      // Skip relation fields (they start with __RELATION__)
      if (f.startsWith('__RELATION__')) return false;
      // Skip IF expression fields (they start with __IF__)
      if (f.startsWith('__IF__')) return false;
      if (!/^[\w]+$/.test(f)) return false;
      return true;
    })
    .slice(0, 5); // Limit to first 5 fields for performance
  const searchConditions = searchFields
    .map((field) => `{ ${field}: { contains: query.search } }`)
    .join(",\n        ");

  // Build WHERE conditions from queryMapping
  let whereConditionsCode = "";
  if (tableInfo.whereConditions && Object.keys(tableInfo.whereConditions).length > 0) {
    whereConditionsCode = Object.entries(tableInfo.whereConditions)
      .map(([field, value]) => {
        if (typeof value === 'object' && value.in) {
          return `where.${field} = { in: ${JSON.stringify(value.in)} };`;
        } else {
          return `where.${field} = ${JSON.stringify(value)};`;
        }
      })
      .join("\n    ");
  }

  // Build field mapping from componentData if queryMapping doesn't have aliases
  // Use dt_bi (column headers/aliases) and dt_key (original field names) from componentData
  let effectiveFieldMapping = { ...tableInfo.fieldMapping };
  if (componentData.dt_bi && componentData.dt_key) {
    const columns = componentData.dt_bi || [];
    const keys = componentData.dt_key || [];
    columns.forEach((alias, index) => {
      let originalField = keys[index];
      if (alias && originalField && alias !== 'No' && alias !== 'Action' && 
          originalField !== 'No' && originalField !== 'Action' &&
          alias !== originalField) {
        // Check if the key (originalField) is actually a SQL alias from the query mapping
        // If so, resolve it to the actual database column name
        if (tableInfo.fieldMapping && tableInfo.fieldMapping[originalField]) {
          originalField = tableInfo.fieldMapping[originalField];
        }
        effectiveFieldMapping[alias] = originalField;
      }
    });
  }

  // Build Prisma include statement for subquery relations
  const subqueryRelations = tableInfo.subqueryRelations || [];
  let includeCode = "";
  if (subqueryRelations.length > 0) {
    const includeEntries = subqueryRelations.map(rel => {
      return `${rel.prismaRelation}: {
          select: {
            ${rel.selectField}: true,
          },
        }`;
    });
    includeCode = `include: {
        ${includeEntries.join(",\n        ")}
      },`;
  }
  
  // Build mapping from dt_key to dt_bi (column titles) for consistent casing
  // e.g., dt_key: ["FUND", "OUN"] and dt_bi: ["Fund", "PTJ"] -> keyToTitle: {"FUND": "Fund", "OUN": "PTJ"}
  const dtKey = componentData?.dt_key || [];
  const dtBi = componentData?.dt_bi || [];
  const keyToTitle = {};
  for (let i = 0; i < dtKey.length && i < dtBi.length; i++) {
    const key = dtKey[i];
    const title = dtBi[i];
    if (key && title && key !== title) {
      keyToTitle[key] = title;
    }
  }

  // Build relation field mapping code (for fields from related tables via subqueries)
  const relationFieldMappingCode = subqueryRelations.map(rel => {
    const alias = rel.alias;
    const isValidIdentifier = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(alias);
    const aliasAccess = isValidIdentifier ? `mapped.${alias}` : `mapped[${JSON.stringify(alias)}]`;
    const formFieldName = alias.replace(/[^a-zA-Z0-9]/g, "_");
    const formFieldNameLower = formFieldName.toLowerCase();
    
    let lines = `// ${alias} from related ${rel.prismaRelation}
      ${aliasAccess} = item.${rel.prismaRelation}?.${rel.selectField} || '';`;
    if (formFieldName !== alias) {
      lines += `\n      mapped.${formFieldName} = item.${rel.prismaRelation}?.${rel.selectField} || '';`;
    }
    if (formFieldNameLower !== formFieldName && formFieldNameLower !== alias) {
      lines += `\n      mapped.${formFieldNameLower} = item.${rel.prismaRelation}?.${rel.selectField} || '';`;
    }
    // Add column title mapping from dt_bi
    const columnTitle = keyToTitle[alias];
    if (columnTitle && columnTitle !== alias && columnTitle !== formFieldName && columnTitle !== formFieldNameLower) {
      const titleIsValidIdentifier = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(columnTitle);
      if (titleIsValidIdentifier) {
        lines += `\n      mapped.${columnTitle} = item.${rel.prismaRelation}?.${rel.selectField} || '';`;
      } else {
        lines += `\n      mapped[${JSON.stringify(columnTitle)}] = item.${rel.prismaRelation}?.${rel.selectField} || '';`;
      }
    }
    return lines;
  }).join("\n      ");

  // Build IF expression mapping code (for value conversions like status, deficit)
  const ifExpressions = tableInfo.ifExpressions || [];
  const ifExpressionMappingCode = ifExpressions.map(expr => {
    const alias = expr.alias;
    const isValidIdentifier = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(alias);
    const aliasAccess = isValidIdentifier ? `mapped.${alias}` : `mapped[${JSON.stringify(alias)}]`;
    const formFieldName = alias.replace(/[^a-zA-Z0-9]/g, "_");
    const formFieldNameLower = formFieldName.toLowerCase();
    
    // Generate: item.field === 'compareValue' ? 'trueResult' : 'falseResult'
    let lines = `// ${alias} - IF(${expr.sourceField} = '${expr.compareValue}', '${expr.trueResult}', '${expr.falseResult}')
      ${aliasAccess} = item.${expr.sourceField} === '${expr.compareValue}' ? '${expr.trueResult}' : '${expr.falseResult}';`;
    if (formFieldName !== alias) {
      lines += `\n      mapped.${formFieldName} = item.${expr.sourceField} === '${expr.compareValue}' ? '${expr.trueResult}' : '${expr.falseResult}';`;
    }
    if (formFieldNameLower !== formFieldName && formFieldNameLower !== alias) {
      lines += `\n      mapped.${formFieldNameLower} = item.${expr.sourceField} === '${expr.compareValue}' ? '${expr.trueResult}' : '${expr.falseResult}';`;
    }
    // Add column title mapping from dt_bi
    const columnTitle = keyToTitle[alias];
    if (columnTitle && columnTitle !== alias && columnTitle !== formFieldName && columnTitle !== formFieldNameLower) {
      const titleIsValidIdentifier = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(columnTitle);
      if (titleIsValidIdentifier) {
        lines += `\n      mapped.${columnTitle} = item.${expr.sourceField} === '${expr.compareValue}' ? '${expr.trueResult}' : '${expr.falseResult}';`;
      } else {
        lines += `\n      mapped[${JSON.stringify(columnTitle)}] = item.${expr.sourceField} === '${expr.compareValue}' ? '${expr.trueResult}' : '${expr.falseResult}';`;
      }
    }
    return lines;
  }).join("\n      ");

  // Map response fields to aliases for frontend; also set form field name (e.g. Type_Basis) so edit/view form populates
  const fieldMappingCode = Object.entries(effectiveFieldMapping || {})
    .filter(([alias, originalField]) => {
      // Skip invalid field names (subqueries, SQL keywords, etc.)
      if (!alias || !originalField) return false;
      if (alias.includes('(') || alias.includes(')')) return false;
      if (alias.toUpperCase().includes('SELECT')) return false;
      if (originalField.includes('(') || originalField.includes(')')) return false;
      if (originalField.toUpperCase().includes('SELECT')) return false;
      // Skip relation fields (they start with __RELATION__)
      if (originalField.startsWith('__RELATION__')) return false;
      // Skip IF expression fields (they start with __IF__)
      if (originalField.startsWith('__IF__')) return false;
      // Skip if original field is not a valid identifier
      if (!/^[\w]+$/.test(originalField)) return false;
      return true;
    })
    .map(([alias, originalField]) => {
      if (alias !== originalField) {
        const isValidIdentifier = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(alias);
        const aliasAccess = isValidIdentifier ? `mapped.${alias}` : `mapped[${JSON.stringify(alias)}]`;
        const formFieldName = alias.replace(/[^a-zA-Z0-9]/g, "_");
        const formFieldNameValid = formFieldName && /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(formFieldName);
        const formFieldNameLower = formFieldName.toLowerCase();
        let lines = `${aliasAccess} = item.${originalField};`;
        // Add form field name (e.g. "Fund Type" -> Fund_Type)
        if (formFieldNameValid && formFieldName !== alias) {
          lines += `\n      mapped.${formFieldName} = item.${originalField};`;
        }
        // Add lowercase form field name (e.g. fund_type) for v-model binding in view/edit forms
        if (formFieldNameLower !== formFieldName && formFieldNameLower !== alias) {
          lines += `\n      mapped.${formFieldNameLower} = item.${originalField};`;
        }
        // Add column title mapping from dt_bi for consistent casing with table columns
        // e.g., if alias is "FUND" and dt_bi has "Fund", add mapped.Fund = item.fty_fund_type
        const columnTitle = keyToTitle[alias];
        if (columnTitle && columnTitle !== alias && columnTitle !== formFieldName && columnTitle !== formFieldNameLower) {
          const titleIsValidIdentifier = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(columnTitle);
          if (titleIsValidIdentifier) {
            lines += `\n      mapped.${columnTitle} = item.${originalField};`;
          } else {
            lines += `\n      mapped[${JSON.stringify(columnTitle)}] = item.${originalField};`;
          }
        }
        return lines;
      }
      return "";
    })
    .filter(c => c)
    .join("\n      ");
  
  // Generate popup modal form field mappings for edit/view forms
  // This ensures form field names like CostCentre, BudgetCode, deficit_budget are available in API response
  let popupModalFieldMappingCode = '';
  if (popupModalItems && popupModalItems.length > 0) {
    const popupModalMappings = [];
    
    popupModalItems.forEach((item) => {
      const formFieldName = item.name;
      if (!formFieldName) return;
      
      // Determine the database column for this form field
      let dbColumn = null;
      
      // Priority 1: Use crudColumn if defined
      if (item.crudColumn && item.crudColumn.trim()) {
        const crudColumnParts = item.crudColumn.trim().split('.');
        if (crudColumnParts.length === 2) {
          dbColumn = crudColumnParts[1];
        }
      }
      
      // Priority 2: Try to match from existing field mapping
      if (!dbColumn) {
        const formFieldLower = formFieldName.toLowerCase();
        for (const [alias, origField] of Object.entries(effectiveFieldMapping || {})) {
          if (!origField || origField.startsWith('__IF__') || origField.startsWith('__RELATION__')) continue;
          
          const aliasLower = alias.toLowerCase().replace(/[_\s]/g, '');
          const fieldLower = formFieldLower.replace(/[_\s]/g, '');
          
          if (aliasLower === fieldLower || origField.toLowerCase().includes(fieldLower)) {
            dbColumn = origField;
            break;
          }
        }
      }
      
      if (dbColumn && /^[\w]+$/.test(dbColumn)) {
        const isValidIdentifier = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(formFieldName);
        if (isValidIdentifier) {
          // Check if this mapping already exists
          const existingMappings = fieldMappingCode + relationFieldMappingCode + ifExpressionMappingCode;
          if (!existingMappings.includes(`mapped.${formFieldName} = item.${dbColumn}`)) {
            popupModalMappings.push(`mapped.${formFieldName} = item.${dbColumn};`);
          }
        }
      }
    });
    
    popupModalFieldMappingCode = popupModalMappings.join("\n      ");
  }
  
  // Combine regular field mapping with relation field mapping, IF expression mapping, and popup modal mappings
  const combinedFieldMappingCode = [fieldMappingCode, relationFieldMappingCode, ifExpressionMappingCode, popupModalFieldMappingCode].filter(c => c).join("\n      ");

  const code = `import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);

    // Build where clause from query parameters
    const where = {};
    
    ${whereConditionsCode ? `// Add WHERE conditions from queryMapping\n    ${whereConditionsCode}` : ""}
    
    // Add search filter if provided
    if (query.search && query.search.trim() !== "") {
      where.OR = [
        ${searchConditions || "// No searchable fields"}
      ];
    }

    // Add top filter conditions (accept both aliases and original field names)
    // Note: Using contains without mode for cross-database compatibility
    ${Object.entries(effectiveFieldMapping || {})
      .filter(([alias, originalField]) => {
        // Skip invalid field names (subqueries, SQL keywords, etc.)
        if (!alias || !originalField) return false;
        if (alias.includes('(') || alias.includes(')')) return false;
        if (alias.toUpperCase().includes('SELECT')) return false;
        if (originalField.includes('(') || originalField.includes(')')) return false;
        if (originalField.toUpperCase().includes('SELECT')) return false;
        // Skip relation fields (they start with __RELATION__)
        if (originalField.startsWith('__RELATION__')) return false;
        // Skip IF expression fields (they start with __IF__)
        if (originalField.startsWith('__IF__')) return false;
        // Skip if original field is not a valid identifier
        if (!/^[\w]+$/.test(originalField)) return false;
        return true;
      })
      .map(([alias, originalField]) => {
        const isValidIdentifier = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(alias);
        const formFieldName = alias.replace(/[^a-zA-Z0-9]/g, "_");
        const aliasQueryAccess = isValidIdentifier ? `query.${alias}` : `query[${JSON.stringify(alias)}]`;
        return `if (${aliasQueryAccess} || query.${formFieldName} || query.${originalField}) {
      const filterValue = ${aliasQueryAccess} || query.${formFieldName} || query.${originalField};
      where.${originalField} = { contains: filterValue };
    }`;
      })
      .join("\n    ")}
    
    // Add Top Filter component field conditions (tf_xxx fields)
    ${(() => {
      // Build mapping from Top Filter item titles to database columns
      const topFilterConditions = [];
      const titleToDbColumn = {};
      
      // First, build a map of column titles to database columns from datatable field mapping
      const dtBi = componentData?.dt_bi || [];
      const dtKey = componentData?.dt_key || [];
      for (let i = 0; i < dtBi.length && i < dtKey.length; i++) {
        const title = (dtBi[i] || '').trim();
        const key = (dtKey[i] || '').trim();
        if (title && key && effectiveFieldMapping && effectiveFieldMapping[key]) {
          titleToDbColumn[title.toLowerCase()] = effectiveFieldMapping[key];
        }
      }
      
      // Now generate filter conditions for each Top Filter item
      topFilterItems.forEach(item => {
        const fieldName = item.name.replace(/[^a-zA-Z0-9]/g, "_");
        const title = (item.title || '').replace(/<[^>]*>/g, '').trim(); // Remove HTML tags like <font color=red>*</font>
        const titleLower = title.toLowerCase();
        
        // Try to find the database column by matching title
        let dbColumn = titleToDbColumn[titleLower];
        
        // Also try common variations
        if (!dbColumn && titleLower === 'fund') dbColumn = effectiveFieldMapping?.['FUND'] || effectiveFieldMapping?.['Fund'] || 'fty_fund_type';
        if (!dbColumn && titleLower === 'ptj') dbColumn = effectiveFieldMapping?.['OUN'] || effectiveFieldMapping?.['PTJ'] || 'oun_code';
        if (!dbColumn && (titleLower === 'cost centre' || titleLower === 'costcentre')) dbColumn = effectiveFieldMapping?.['CCR'] || effectiveFieldMapping?.['Cost Centre'] || 'ccr_costcentre';
        if (!dbColumn && titleLower === 'activity') dbColumn = effectiveFieldMapping?.['ACTIVITY'] || effectiveFieldMapping?.['Activity'] || 'at_activity_code';
        if (!dbColumn && titleLower === 'year') dbColumn = effectiveFieldMapping?.['YEAR'] || effectiveFieldMapping?.['Year'] || 'sby_year';
        
        if (dbColumn && /^[\w]+$/.test(dbColumn)) {
          // Use exact match for dropdown filters (they send specific codes)
          topFilterConditions.push(`if (query.${fieldName}) {
      where.${dbColumn} = query.${fieldName};
    }`);
        }
      });
      
      return topFilterConditions.join("\n    ");
    })()}

    // Get data${includeCode ? ' with related tables' : ''} - no pagination, rs-table handles it client-side
    const data = await prisma.${tableInfo.table}.findMany({
      where,
      orderBy: { ${tableInfo.primaryKey || Object.values(tableInfo.fieldMapping || {})[0] || 'id'}: 'desc' },
      ${includeCode}
    });

    // Map fields to aliases for frontend and ensure primary key is included
    const mappedData = data.map((item) => {
      const mapped = { ...item };
      ${combinedFieldMappingCode || "// No field mapping needed"}
      // Ensure primary key is available (even if not in SELECT)
      ${tableInfo.primaryKey && !tableInfo.fields.includes(tableInfo.primaryKey) ? `if (!mapped.${tableInfo.primaryKey} && item.${tableInfo.primaryKey}) {
        mapped.${tableInfo.primaryKey} = item.${tableInfo.primaryKey};
      }` : ""}
      // Add id field for CRUD operations (use primary key value)
      mapped.id = item.${tableInfo.primaryKey || 'id'};
      return mapped;
    });

    return {
      statusCode: 200,
      message: "Data fetched successfully",
      data: mappedData,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    
    // Handle Prisma-specific errors
    if (error.code === 'P2001') {
      return {
        statusCode: 404,
        message: "No records found",
      };
    }
    
    return {
      statusCode: 500,
      message: "Failed to fetch data",
      error: process.env.NODE_ENV === 'development' ? error.message : "An error occurred while fetching data",
    };
  }
});
`;

  fs.writeFileSync(endpointPath, code, "utf8");
}

// Generate POST endpoint
async function generatePostEndpoint(apiPath, tableInfo, componentData, popupModalItems = []) {
  // Split the path into individual folder names
  const pathParts = apiPath.split("/").filter(part => part && part.trim() !== "");
  
  // Build the directory path by joining all parts
  const endpointDir = path.join(
    process.cwd(),
    "server",
    "api",
    ...pathParts
  );

  // Create the directory structure recursively
  if (!fs.existsSync(endpointDir)) {
    fs.mkdirSync(endpointDir, { recursive: true });
  }

  // Build the full file path
  const endpointPath = path.join(endpointDir, "index.post.js");

  // Build effective field mapping from componentData if queryMapping doesn't have aliases
  let effectiveFieldMapping = { ...tableInfo.fieldMapping };
  if (componentData.dt_bi && componentData.dt_key) {
    const columns = componentData.dt_bi || [];
    const keys = componentData.dt_key || [];
    columns.forEach((alias, index) => {
      let originalField = keys[index];
      if (alias && originalField && alias !== 'No' && alias !== 'Action' && 
          originalField !== 'No' && originalField !== 'Action' &&
          alias !== originalField) {
        // Check if the key (originalField) is actually a SQL alias from the query mapping
        // If so, resolve it to the actual database column name
        if (tableInfo.fieldMapping && tableInfo.fieldMapping[originalField]) {
          originalField = tableInfo.fieldMapping[originalField];
        }
        effectiveFieldMapping[alias] = originalField;
      }
    });
  }
  
  // Add popup modal form field mappings (name -> database field)
  // This ensures form fields like CostCentre, BudgetCode, Status, deficit_budget are properly mapped
  if (popupModalItems && popupModalItems.length > 0) {
    // Build reverse mapping: database column -> SQL alias (for lookup)
    const dbColumnToAlias = {};
    Object.entries(tableInfo.fieldMapping || {}).forEach(([alias, dbCol]) => {
      if (dbCol && !dbCol.startsWith('__IF__') && !dbCol.startsWith('__RELATION__')) {
        dbColumnToAlias[dbCol.toLowerCase()] = { alias, dbCol };
      }
    });
    
    // Also build mapping of IF expression source fields (e.g., STAT -> sbg_status from IF(sbg_status=...))
    const ifExpressionSourceFields = {};
    Object.entries(tableInfo.fieldMapping || {}).forEach(([alias, dbCol]) => {
      if (dbCol && dbCol.startsWith('__IF__')) {
        // Extract actual field name from __IF__fieldname
        const actualField = dbCol.replace('__IF__', '');
        ifExpressionSourceFields[alias.toLowerCase()] = actualField;
      }
    });
    
    popupModalItems.forEach((item) => {
      const formFieldName = item.name;
      if (!formFieldName) return;
      
      // PRIORITY 0: Check if crudColumn is explicitly defined (format: model.fieldName)
      // This takes ABSOLUTE priority and overrides any existing mapping
      if (item.crudColumn && item.crudColumn.trim()) {
        const crudColumnParts = item.crudColumn.trim().split('.');
        if (crudColumnParts.length === 2) {
          // Use the field name part directly (ignore model name for now, assume it matches the table)
          const dbFieldName = crudColumnParts[1];
          effectiveFieldMapping[formFieldName] = dbFieldName;
          return;
        }
      }
      
      // Skip if already mapped (only for auto-detection, not for explicit crudColumn)
      if (effectiveFieldMapping[formFieldName]) return;
      
      const formFieldLower = formFieldName.toLowerCase();
      
      // 1. Try to find matching database column by common patterns
      // Check if form field name matches any database column directly
      if (dbColumnToAlias[formFieldLower]) {
        effectiveFieldMapping[formFieldName] = dbColumnToAlias[formFieldLower].dbCol;
        return;
      }
      
      // 2. Check common variations: CostCentre -> ccr_costcentre, BudgetCode -> lbc_budget_code
      let foundMatch = false;
      for (const [dbColLower, info] of Object.entries(dbColumnToAlias)) {
        // Check if form field name is contained in db column (e.g., 'costcentre' in 'ccr_costcentre')
        const formFieldNormalized = formFieldLower.replace(/[_\s]/g, '');
        const dbColNormalized = dbColLower.replace(/[_\s]/g, '');
        if (dbColNormalized.includes(formFieldNormalized) || formFieldNormalized.includes(dbColNormalized)) {
          effectiveFieldMapping[formFieldName] = info.dbCol;
          foundMatch = true;
          break;
        }
      }
      if (foundMatch) return;
      
      // 3. Check if form field matches an IF expression source field (e.g., Status -> sbg_status via STAT)
      // This handles cases where STAT is IF(sbg_status=...) and form field is 'Status'
      for (const [aliasLower, actualField] of Object.entries(ifExpressionSourceFields)) {
        const formFieldNormalized = formFieldLower.replace(/[_\s]/g, '');
        const actualFieldNormalized = actualField.toLowerCase().replace(/[_\s]/g, '');
        
        // Check if form field relates to the actual database field
        if (formFieldNormalized.includes(actualFieldNormalized) || actualFieldNormalized.includes(formFieldNormalized)) {
          effectiveFieldMapping[formFieldName] = actualField;
          foundMatch = true;
          break;
        }
        
        // Also check common keywords (e.g., both 'Status' and 'sbg_status' contain 'status')
        const keywords = ['status', 'defisit', 'deficit', 'active', 'flag', 'type'];
        for (const keyword of keywords) {
          if (formFieldNormalized.includes(keyword) && actualFieldNormalized.includes(keyword)) {
            effectiveFieldMapping[formFieldName] = actualField;
            foundMatch = true;
            break;
          }
        }
        if (foundMatch) break;
      }
      if (foundMatch) return;
      
      // 4. For fields with common keywords, try to find matching DB columns with same keyword
      const commonKeywords = {
        'status': '_status',
        'deficit': '_defisit',
        'defisit': '_defisit',
        'active': '_active',
        'flag': '_flag',
      };
      for (const [keyword, dbSuffix] of Object.entries(commonKeywords)) {
        if (formFieldLower.includes(keyword)) {
          // Look for a db column that contains this suffix
          for (const [dbColLower, info] of Object.entries(dbColumnToAlias)) {
            if (dbColLower.includes(dbSuffix) || dbColLower.endsWith(keyword)) {
              effectiveFieldMapping[formFieldName] = info.dbCol;
              return;
            }
          }
          // Also check IF expression source fields
          for (const [aliasLower, actualField] of Object.entries(ifExpressionSourceFields)) {
            const actualFieldLower = actualField.toLowerCase();
            if (actualFieldLower.includes(dbSuffix) || actualFieldLower.endsWith(keyword)) {
              effectiveFieldMapping[formFieldName] = actualField;
              return;
            }
          }
        }
      }
      
      // 5. Last resort: try to construct db column name using table prefix + form field name
      // Get table prefix from primary key (e.g., sbg_budget_id -> sbg_)
      const tablePrefix = tableInfo.primaryKey 
        ? tableInfo.primaryKey.split('_').slice(0, -1).join('_') + '_'
        : '';
      if (tablePrefix) {
        const guessedDbCol = tablePrefix + formFieldLower;
        // Just add it - if it's wrong, Prisma will error but at least we tried
        effectiveFieldMapping[formFieldName] = guessedDbCol;
      }
    });
  }

  // Build field mapping code (alias -> original field)
  const fieldMappingReverse = Object.entries(effectiveFieldMapping || {})
    .filter(([alias, originalField]) => {
      // Skip invalid field names (subqueries, SQL keywords, etc.)
      if (!alias || !originalField) return false;
      if (alias.includes('(') || alias.includes(')')) return false;
      if (alias.toUpperCase().includes('SELECT')) return false;
      if (originalField.includes('(') || originalField.includes(')')) return false;
      if (originalField.toUpperCase().includes('SELECT')) return false;
      // Skip relation fields (they start with __RELATION__)
      if (originalField.startsWith('__RELATION__')) return false;
      // Skip IF expression fields (they start with __IF__) - these are computed fields, not actual DB columns
      if (originalField.startsWith('__IF__')) return false;
      // Skip if original field is not a valid identifier
      if (!/^[\w]+$/.test(originalField)) return false;
      return true;
    })
    .map(([alias, originalField]) => {
      const isValidIdentifier = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(alias);
      const aliasAccess = isValidIdentifier ? `body.${alias}` : `body[${JSON.stringify(alias)}]`;
      // Form field name (non-alphanumeric -> underscore, case preserved) - e.g. "Type Basis" -> "Type_Basis"
      const formFieldName = alias.replace(/[^a-zA-Z0-9]/g, "_");
      const formFieldNameValid = formFieldName && /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(formFieldName);
      // Normalized form field name (lowercase) - e.g. "Type Basis" -> "type_basis"
      const normalizedAlias = alias.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
      const normalizedAccess = `body.${normalizedAlias}`;
      
      let mappingCode = "";
      if (alias !== originalField) {
        mappingCode = `if (${aliasAccess} !== undefined) createData.${originalField} = ${aliasAccess};`;
        // Map form field name (Type_Basis) so generated form v-model binding is persisted after regeneration
        if (formFieldNameValid && formFieldName !== alias) {
          mappingCode += `\n    if (body.${formFieldName} !== undefined && createData.${originalField} === undefined) createData.${originalField} = body.${formFieldName};`;
        }
        // Also map normalized (lowercase) form field name if different
        if (normalizedAlias !== formFieldName && normalizedAlias !== alias) {
          mappingCode += `\n    if (${normalizedAccess} !== undefined && createData.${originalField} === undefined) createData.${originalField} = ${normalizedAccess};`;
        }
      } else {
        mappingCode = `if (body.${originalField} !== undefined) createData.${originalField} = body.${originalField};`;
      }
      return mappingCode;
    })
    .join("\n    ");
  
  // Get prefix from primary key (e.g., lde_id -> lde_, bm_id -> bm_)
  const primaryKeyPrefix = tableInfo.primaryKey 
    ? tableInfo.primaryKey.split('_').slice(0, -1).join('_') + '_'
    : tableInfo.table.split('_').map(w => w.charAt(0)).join('') + '_';
  
  // Add WHERE conditions for required fields (like lma_code_name)
  const whereConditionsForCreate = Object.entries(tableInfo.whereConditions || {})
    .map(([field, value]) => {
      if (typeof value === 'object' && value.in) {
        return `createData.${field} = ${JSON.stringify(value.in[0])}; // From queryMapping WHERE clause`;
      } else {
        return `createData.${field} = ${JSON.stringify(value)}; // From queryMapping WHERE clause`;
      }
    })
    .join("\n    ");

  // Build validation code for required fields (only primary key if not auto-generated)
  // Note: WHERE condition fields are automatically set from queryMapping, so they don't need validation
  const requiredFields = [];
  let primaryKeyAutoGenCode = '';
  if (tableInfo.primaryKey) {
    const pkField = tableInfo.primaryKey;
    // Check if primary key is auto-generated (has @default(autoincrement()))
    // Since we can't easily check the schema, we'll auto-generate if it's an Int and not provided
    // For Int primary keys without auto-increment, generate next ID if missing
    primaryKeyAutoGenCode = `// Auto-generate primary key if not provided (for non-auto-increment Int primary keys)
    if (!createData.${pkField} || createData.${pkField} === 0) {
      const maxRecord = await prisma.${tableInfo.table}.findFirst({
        orderBy: { ${pkField}: 'desc' },
        select: { ${pkField}: true },
      });
      createData.${pkField} = maxRecord ? maxRecord.${pkField} + 1 : 1;
    }`;
  }
  
  const validationCode = requiredFields.length > 0
    ? requiredFields.map(field => {
        // Check if field exists in createData (after mapping and WHERE conditions)
        return `if (!createData.${field} && createData.${field} !== 0 && createData.${field} !== false) {
      return {
        statusCode: 400,
        message: "${field} is required",
      };
    }`;
      }).join('\n    ')
    : '// No required fields validation needed';

  const code = `import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // Map aliased fields back to original field names
    const createData = {};
    ${fieldMappingReverse || "// No field mapping needed"}
    // Copy any fields that match original field names
    Object.keys(body).forEach(key => {
      if (key.startsWith('${primaryKeyPrefix}') && key !== '${tableInfo.primaryKey || ''}') {
        if (!createData.hasOwnProperty(key)) {
          createData[key] = body[key];
        }
      }
    });
    ${whereConditionsForCreate ? `// Add WHERE conditions from queryMapping\n    ${whereConditionsForCreate}` : ""}

    ${primaryKeyAutoGenCode}

    // Validate required fields (check createData after mapping and WHERE conditions are applied)
    ${validationCode}

    // Convert year fields to string if they are numbers (database may expect String for year fields)
    Object.keys(createData).forEach(key => {
      if ((key.toLowerCase().includes('year') || key.toLowerCase().includes('_year')) && typeof createData[key] === 'number') {
        createData[key] = String(createData[key]);
      }
    });

    // Create record
    const data = await prisma.${tableInfo.table}.create({
      data: createData,
    });

    return {
      statusCode: 200,
      message: "Record created successfully",
      data,
    };
  } catch (error) {
    console.error("Error creating record:", error);
    
    // Handle Prisma-specific errors
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0] || 'field';
      return {
        statusCode: 409,
        message: \`Record with this \${field} already exists\`,
        error: "Unique constraint violation",
      };
    }
    
    if (error.code === 'P2003') {
      return {
        statusCode: 400,
        message: "Foreign key constraint violation. Please check related records.",
        error: "Foreign key constraint violation",
      };
    }
    
    return {
      statusCode: 500,
      message: "Failed to create record",
      error: process.env.NODE_ENV === 'development' ? error.message : "An error occurred while creating the record",
    };
  }
});
`;

  fs.writeFileSync(endpointPath, code, "utf8");
}

// Generate PUT endpoint
async function generatePutEndpoint(apiPath, tableInfo, componentData, popupModalItems = []) {
  // Split the path into individual folder names
  const pathParts = apiPath.split("/").filter(part => part && part.trim() !== "");
  
  // Build the directory path by joining all parts
  const endpointDir = path.join(
    process.cwd(),
    "server",
    "api",
    ...pathParts
  );

  // Create the directory structure recursively
  if (!fs.existsSync(endpointDir)) {
    fs.mkdirSync(endpointDir, { recursive: true });
  }

  // Build the full file path
  const endpointPath = path.join(endpointDir, "[id].put.js");

  // Build field mapping code (alias -> original field)
  // Build effective field mapping from componentData if queryMapping doesn't have aliases
  let effectiveFieldMapping = { ...tableInfo.fieldMapping };
  if (componentData.dt_bi && componentData.dt_key) {
    const columns = componentData.dt_bi || [];
    const keys = componentData.dt_key || [];
    columns.forEach((alias, index) => {
      let originalField = keys[index];
      if (alias && originalField && alias !== 'No' && alias !== 'Action' && 
          originalField !== 'No' && originalField !== 'Action' &&
          alias !== originalField) {
        // Check if the key (originalField) is actually a SQL alias from the query mapping
        // If so, resolve it to the actual database column name
        if (tableInfo.fieldMapping && tableInfo.fieldMapping[originalField]) {
          originalField = tableInfo.fieldMapping[originalField];
        }
        effectiveFieldMapping[alias] = originalField;
      }
    });
  }
  
  // Add popup modal form field mappings (name -> database field)
  // This ensures form fields like CostCentre, BudgetCode, Status, deficit_budget are properly mapped
  if (popupModalItems && popupModalItems.length > 0) {
    // Build reverse mapping: database column -> SQL alias (for lookup)
    const dbColumnToAlias = {};
    Object.entries(tableInfo.fieldMapping || {}).forEach(([alias, dbCol]) => {
      if (dbCol && !dbCol.startsWith('__IF__') && !dbCol.startsWith('__RELATION__')) {
        dbColumnToAlias[dbCol.toLowerCase()] = { alias, dbCol };
      }
    });
    
    // Also build mapping of IF expression source fields (e.g., STAT -> sbg_status from IF(sbg_status=...))
    const ifExpressionSourceFields = {};
    Object.entries(tableInfo.fieldMapping || {}).forEach(([alias, dbCol]) => {
      if (dbCol && dbCol.startsWith('__IF__')) {
        // Extract actual field name from __IF__fieldname
        const actualField = dbCol.replace('__IF__', '');
        ifExpressionSourceFields[alias.toLowerCase()] = actualField;
      }
    });
    
    popupModalItems.forEach((item) => {
      const formFieldName = item.name;
      if (!formFieldName) return;
      
      // PRIORITY 0: Check if crudColumn is explicitly defined (format: model.fieldName)
      // This takes ABSOLUTE priority and overrides any existing mapping
      if (item.crudColumn && item.crudColumn.trim()) {
        const crudColumnParts = item.crudColumn.trim().split('.');
        if (crudColumnParts.length === 2) {
          // Use the field name part directly (ignore model name for now, assume it matches the table)
          const dbFieldName = crudColumnParts[1];
          effectiveFieldMapping[formFieldName] = dbFieldName;
          return;
        }
      }
      
      // Skip if already mapped (only for auto-detection, not for explicit crudColumn)
      if (effectiveFieldMapping[formFieldName]) return;
      
      const formFieldLower = formFieldName.toLowerCase();
      
      // 1. Try to find matching database column by common patterns
      // Check if form field name matches any database column directly
      if (dbColumnToAlias[formFieldLower]) {
        effectiveFieldMapping[formFieldName] = dbColumnToAlias[formFieldLower].dbCol;
        return;
      }
      
      // 2. Check common variations: CostCentre -> ccr_costcentre, BudgetCode -> lbc_budget_code
      let foundMatch = false;
      for (const [dbColLower, info] of Object.entries(dbColumnToAlias)) {
        // Check if form field name is contained in db column (e.g., 'costcentre' in 'ccr_costcentre')
        const formFieldNormalized = formFieldLower.replace(/[_\s]/g, '');
        const dbColNormalized = dbColLower.replace(/[_\s]/g, '');
        if (dbColNormalized.includes(formFieldNormalized) || formFieldNormalized.includes(dbColNormalized)) {
          effectiveFieldMapping[formFieldName] = info.dbCol;
          foundMatch = true;
          break;
        }
      }
      if (foundMatch) return;
      
      // 3. Check if form field matches an IF expression source field (e.g., Status -> sbg_status via STAT)
      // This handles cases where STAT is IF(sbg_status=...) and form field is 'Status'
      for (const [aliasLower, actualField] of Object.entries(ifExpressionSourceFields)) {
        const formFieldNormalized = formFieldLower.replace(/[_\s]/g, '');
        const actualFieldNormalized = actualField.toLowerCase().replace(/[_\s]/g, '');
        
        // Check if form field relates to the actual database field
        if (formFieldNormalized.includes(actualFieldNormalized) || actualFieldNormalized.includes(formFieldNormalized)) {
          effectiveFieldMapping[formFieldName] = actualField;
          foundMatch = true;
          break;
        }
        
        // Also check common keywords (e.g., both 'Status' and 'sbg_status' contain 'status')
        const keywords = ['status', 'defisit', 'deficit', 'active', 'flag', 'type'];
        for (const keyword of keywords) {
          if (formFieldNormalized.includes(keyword) && actualFieldNormalized.includes(keyword)) {
            effectiveFieldMapping[formFieldName] = actualField;
            foundMatch = true;
            break;
          }
        }
        if (foundMatch) break;
      }
      if (foundMatch) return;
      
      // 4. For fields with common keywords, try to find matching DB columns with same keyword
      const commonKeywords = {
        'status': '_status',
        'deficit': '_defisit',
        'defisit': '_defisit',
        'active': '_active',
        'flag': '_flag',
      };
      for (const [keyword, dbSuffix] of Object.entries(commonKeywords)) {
        if (formFieldLower.includes(keyword)) {
          // Look for a db column that contains this suffix
          for (const [dbColLower, info] of Object.entries(dbColumnToAlias)) {
            if (dbColLower.includes(dbSuffix) || dbColLower.endsWith(keyword)) {
              effectiveFieldMapping[formFieldName] = info.dbCol;
              return;
            }
          }
          // Also check IF expression source fields
          for (const [aliasLower, actualField] of Object.entries(ifExpressionSourceFields)) {
            const actualFieldLower = actualField.toLowerCase();
            if (actualFieldLower.includes(dbSuffix) || actualFieldLower.endsWith(keyword)) {
              effectiveFieldMapping[formFieldName] = actualField;
              return;
            }
          }
        }
      }
      
      // 5. Last resort: try to construct db column name using table prefix + form field name
      // Get table prefix from primary key (e.g., sbg_budget_id -> sbg_)
      const tablePrefix = tableInfo.primaryKey 
        ? tableInfo.primaryKey.split('_').slice(0, -1).join('_') + '_'
        : '';
      if (tablePrefix) {
        const guessedDbCol = tablePrefix + formFieldLower;
        // Just add it - if it's wrong, Prisma will error but at least we tried
        effectiveFieldMapping[formFieldName] = guessedDbCol;
      }
    });
  }

  // Split field mapping into aliases and original fields
  // CRITICAL: Process aliases FIRST, then original fields LAST
  // This ensures user edits (in original fields) take priority over stale alias values
  const aliasMapping = Object.entries(effectiveFieldMapping || {})
    .filter(([alias, originalField]) => {
      // Skip entries where alias equals original field
      if (alias === originalField) return false;
      // Skip invalid field names (subqueries, SQL keywords, etc.)
      if (!alias || !originalField) return false;
      if (alias.includes('(') || alias.includes(')')) return false;
      if (alias.toUpperCase().includes('SELECT')) return false;
      if (originalField.includes('(') || originalField.includes(')')) return false;
      if (originalField.toUpperCase().includes('SELECT')) return false;
      // Skip relation fields (they start with __RELATION__)
      if (originalField.startsWith('__RELATION__')) return false;
      // Skip IF expression fields (they start with __IF__) - these are computed fields, not actual DB columns
      if (originalField.startsWith('__IF__')) return false;
      // Skip if original field is not a valid identifier
      if (!/^[\w]+$/.test(originalField)) return false;
      return true;
    })
    .map(([alias, originalField]) => {
      const isValidIdentifier = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(alias);
      const aliasAccess = isValidIdentifier ? `body.${alias}` : `body[${JSON.stringify(alias)}]`;
      // Form field name (e.g. "Type Basis" -> "Type_Basis") so generated form stays editable after regeneration
      const formFieldName = alias.replace(/[^a-zA-Z0-9]/g, "_");
      const formFieldNameValid = formFieldName && /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(formFieldName);
      let lines = `if (${aliasAccess} !== undefined) updateData.${originalField} = ${aliasAccess};`;
      if (formFieldNameValid && formFieldName !== alias) {
        lines += `\n    if (body.${formFieldName} !== undefined) updateData.${originalField} = body.${formFieldName};`;
      }
      const normalizedAlias = alias.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
      if (normalizedAlias !== formFieldName && normalizedAlias !== alias) {
        lines += `\n    if (body.${normalizedAlias} !== undefined) updateData.${originalField} = body.${normalizedAlias};`;
      }
      return lines;
    })
    .join("\n    ");
  
  // Get unique original fields to avoid duplicates, filtering out invalid ones
  const uniqueOriginalFields = [...new Set(Object.values(effectiveFieldMapping || {}))]
    .filter((originalField) => {
      if (!originalField) return false;
      if (originalField.includes('(') || originalField.includes(')')) return false;
      if (originalField.toUpperCase().includes('SELECT')) return false;
      // Skip relation fields (they start with __RELATION__)
      if (originalField.startsWith('__RELATION__')) return false;
      // Skip IF expression fields (they start with __IF__) - these are computed fields, not actual DB columns
      if (originalField.startsWith('__IF__')) return false;
      if (!/^[\w]+$/.test(originalField)) return false;
      return true;
    });
  const originalFieldMapping = uniqueOriginalFields
    .map((originalField) => {
      return `if (body.${originalField} !== undefined) updateData.${originalField} = body.${originalField};`;
    })
    .join("\n    ");
  
  // Get prefix from primary key (e.g., lde_id -> lde_, bm_id -> bm_)
  const primaryKeyPrefix = tableInfo.primaryKey 
    ? tableInfo.primaryKey.split('_').slice(0, -1).join('_') + '_'
    : tableInfo.table.split('_').map(w => w.charAt(0)).join('') + '_';

  const code = `import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);

    if (!id) {
      return {
        statusCode: 400,
        message: "ID is required",
      };
    }

    // Check if record exists before updating
    const existingRecord = await prisma.${tableInfo.table}.findUnique({
      where: { ${tableInfo.primaryKey}: parseInt(id) },
    });

    if (!existingRecord) {
      return {
        statusCode: 404,
        message: "Record not found",
      };
    }

    // Map aliased fields back to original field names
    // CRITICAL: Process aliases FIRST (stale values from form load), then original fields LAST (user edits)
    // This ensures user edits take priority over stale alias values
    const updateData = {};
    ${aliasMapping || "// No alias mapping needed"}
    // Process original field names LAST so they take priority over stale alias values
    ${originalFieldMapping || "// No original field mapping needed"}
    // Copy any other fields that match original field names (excluding id fields)
    Object.keys(body).forEach(key => {
      if (key.startsWith('${primaryKeyPrefix}') && key !== '${tableInfo.primaryKey}' && body[key] !== undefined) {
        if (!updateData.hasOwnProperty(key)) {
          updateData[key] = body[key];
        }
      }
    });

    // Check if there's any data to update
    if (Object.keys(updateData).length === 0) {
      return {
        statusCode: 400,
        message: "No fields to update",
      };
    }

    // Convert year fields to string if they are numbers (database may expect String for year fields)
    Object.keys(updateData).forEach(key => {
      if ((key.toLowerCase().includes('year') || key.toLowerCase().includes('_year')) && typeof updateData[key] === 'number') {
        updateData[key] = String(updateData[key]);
      }
    });

    // Update record
    const data = await prisma.${tableInfo.table}.update({
      where: { ${tableInfo.primaryKey}: parseInt(id) },
      data: updateData,
    });

    return {
      statusCode: 200,
      message: "Record updated successfully",
      data,
    };
  } catch (error) {
    console.error("Error updating record:", error);
    
    // Handle Prisma-specific errors
    if (error.code === 'P2025') {
      return {
        statusCode: 404,
        message: "Record not found",
      };
    }
    
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0] || 'field';
      return {
        statusCode: 409,
        message: \`Record with this \${field} already exists\`,
        error: "Unique constraint violation",
      };
    }
    
    if (error.code === 'P2003') {
      return {
        statusCode: 400,
        message: "Foreign key constraint violation. Please check related records.",
        error: "Foreign key constraint violation",
      };
    }
    
    return {
      statusCode: 500,
      message: "Failed to update record",
      error: process.env.NODE_ENV === 'development' ? error.message : "An error occurred while updating the record",
    };
  }
});
`;

  fs.writeFileSync(endpointPath, code, "utf8");
}

// Generate DELETE endpoint
async function generateDeleteEndpoint(apiPath, tableInfo, componentData) {
  // Split the path into individual folder names
  const pathParts = apiPath.split("/").filter(part => part && part.trim() !== "");
  
  // Build the directory path by joining all parts
  const endpointDir = path.join(
    process.cwd(),
    "server",
    "api",
    ...pathParts
  );

  // Create the directory structure recursively
  if (!fs.existsSync(endpointDir)) {
    fs.mkdirSync(endpointDir, { recursive: true });
  }

  // Build the full file path
  const endpointPath = path.join(endpointDir, "[id].delete.js");

  const code = `import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");

    if (!id) {
      return {
        statusCode: 400,
        message: "ID is required",
      };
    }

    // Check if record exists before deleting
    const existingRecord = await prisma.${tableInfo.table}.findUnique({
      where: { ${tableInfo.primaryKey}: parseInt(id) },
    });

    if (!existingRecord) {
      return {
        statusCode: 404,
        message: "Record not found",
      };
    }

    // Delete record
    await prisma.${tableInfo.table}.delete({
      where: { ${tableInfo.primaryKey}: parseInt(id) },
    });

    return {
      statusCode: 200,
      message: "Record deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting record:", error);
    
    // Handle Prisma-specific errors
    if (error.code === 'P2025') {
      return {
        statusCode: 404,
        message: "Record not found",
      };
    }
    
    if (error.code === 'P2003') {
      return {
        statusCode: 400,
        message: "Cannot delete record. It is referenced by other records.",
        error: "Foreign key constraint violation",
      };
    }
    
    return {
      statusCode: 500,
      message: "Failed to delete record",
      error: process.env.NODE_ENV === 'development' ? error.message : "An error occurred while deleting the record",
    };
  }
});
`;

  fs.writeFileSync(endpointPath, code, "utf8");
}

// Helper function to extract variable names from ${variableName} or {variableName} patterns in lookup query
function extractLookupVariables(lookupQuery) {
  const variables = [];
  
  // Match ${variableName} pattern
  const dollarPattern = /\$\{(\w+)\}/g;
  let match;
  while ((match = dollarPattern.exec(lookupQuery)) !== null) {
    if (!variables.includes(match[1])) {
      variables.push(match[1]);
    }
  }
  
  // Match {variableName} pattern (without $) - but not inside ${...}
  // Use negative lookbehind to exclude ${...} patterns
  const bracePattern = /(?<!\$)\{(\w+)\}/g;
  while ((match = bracePattern.exec(lookupQuery)) !== null) {
    if (!variables.includes(match[1])) {
      variables.push(match[1]);
    }
  }
  
  return variables;
}

// Generate lookup endpoint for dropdown options
async function generateLookupEndpoint(apiPath, tableInfo, lookupQuery) {
  // Split the path into individual folder names
  const pathParts = apiPath.split("/").filter(part => part && part.trim() !== "");
  
  // Build the directory path by joining all parts
  const endpointDir = path.join(
    process.cwd(),
    "server",
    "api",
    ...pathParts
  );

  // Create the directory structure recursively
  if (!fs.existsSync(endpointDir)) {
    fs.mkdirSync(endpointDir, { recursive: true });
  }

  // Build the full file path
  const endpointPath = path.join(endpointDir, "index.get.js");

  // Extract variables from lookup query (e.g., ${Fund}, ${PTJ})
  const variables = extractLookupVariables(lookupQuery);
  const hasVariables = variables.length > 0;

  // Parse the lookup query to extract fields and aliases
  const parsedFields = parseLookupQueryFields(lookupQuery);
  
  // If parsing fails, use raw SQL execution as fallback
  if (!parsedFields) {
    // Generate raw SQL endpoint - this handles complex queries with functions like CONCAT_WS()
    // Also handles variable substitution for cascading dropdowns
    const code = `import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    // Base SQL query${hasVariables ? ` (contains variables: ${variables.join(', ')})` : ''}
    let rawQuery = \`${lookupQuery.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;
    
${hasVariables ? `    // Replace variables with query parameter values (cascading dropdown support)
${variables.map(v => `    // Replace \${${v}} or {${v}} with query.${v} value
    if (query.${v} !== undefined && query.${v} !== null && query.${v} !== '') {
      // Check if variable is already quoted in SQL, if not add quotes for string values
      const ${v}Value = query.${v};
      // Replace \${var} patterns - quoted first (keep the quotes)
      rawQuery = rawQuery.replace(/'\\$\\{${v}\\}'/g, "'" + ${v}Value + "'");
      rawQuery = rawQuery.replace(/"\\$\\{${v}\\}"/g, '"' + ${v}Value + '"');
      rawQuery = rawQuery.replace(/\\$\\{${v}\\}/g, "'" + ${v}Value + "'");
      // Replace {var} patterns (without $) - quoted first (keep the quotes)
      rawQuery = rawQuery.replace(/'\\{${v}\\}'/g, "'" + ${v}Value + "'");
      rawQuery = rawQuery.replace(/"\\{${v}\\}"/g, '"' + ${v}Value + '"');
      rawQuery = rawQuery.replace(/(?<!\\$)\\{${v}\\}/g, "'" + ${v}Value + "'");
    } else {
      // If variable not provided, first try to remove simple AND/OR conditions
      rawQuery = rawQuery.replace(/AND\\s+\\w+\\s*=\\s*'\\$\\{${v}\\}'/gi, "");
      rawQuery = rawQuery.replace(/AND\\s+\\w+\\s*=\\s*"\\$\\{${v}\\}"/gi, "");
      rawQuery = rawQuery.replace(/AND\\s+\\w+\\s*=\\s*\\$\\{${v}\\}/gi, "");
      rawQuery = rawQuery.replace(/AND\\s+\\w+\\s*=\\s*'\\{${v}\\}'/gi, "");
      rawQuery = rawQuery.replace(/AND\\s+\\w+\\s*=\\s*"\\{${v}\\}"/gi, "");
      rawQuery = rawQuery.replace(/AND\\s+\\w+\\s*=\\s*\\{${v}\\}/gi, "");
      // Then replace any remaining variables with NULL (for complex patterns like: or {var} is null)
      rawQuery = rawQuery.replace(/'\\$\\{${v}\\}'/g, "NULL");
      rawQuery = rawQuery.replace(/"\\$\\{${v}\\}"/g, "NULL");
      rawQuery = rawQuery.replace(/\\$\\{${v}\\}/g, "NULL");
      rawQuery = rawQuery.replace(/'\\{${v}\\}'/g, "NULL");
      rawQuery = rawQuery.replace(/"\\{${v}\\}"/g, "NULL");
      rawQuery = rawQuery.replace(/(?<!\\$)\\{${v}\\}/g, "NULL");
    }
`).join('\n')}` : ''}
    const data = await prisma.$queryRawUnsafe(rawQuery);
    
    // Map to standard label/value format
    // Convention: value = code (for filtering), label = description (for display)
    const mappedData = data.map((item) => {
      const keys = Object.keys(item);
      const values = Object.values(item);
      
      // Check if SQL used 'label' and 'value' aliases
      if (item.value !== undefined && item.label !== undefined) {
        // Detect if aliases are swapped: if 'label' is shorter/simpler than 'value', they're correct
        // If 'label' contains separator like ' - ' or is longer, they're swapped
        const labelStr = String(item.label || "");
        const valueStr = String(item.value || "");
        const labelLooksLikeDescription = labelStr.includes(' - ') || labelStr.includes(' : ') || labelStr.length > valueStr.length + 10;
        
        if (labelLooksLikeDescription) {
          // Swapped: label is actually description, value is actually code
          return { label: item.label || "", value: item.value || "" };
        } else {
          // User has label=code, value=description - need to swap
          return { label: item.value || "", value: item.label || "" };
        }
      }
      
      // Fallback: assume first column is value (code), second is label (description)
      return {
        label: values[1] || values[0] || "",
        value: values[0] || "",
      };
    });
    
    return {
      statusCode: 200,
      message: "Lookup data retrieved successfully",
      data: mappedData,
    };
  } catch (error) {
    console.error("Error fetching lookup data:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch lookup data",
      error: error.message,
    };
  }
});
`;
    fs.writeFileSync(endpointPath, code, "utf8");
    return;
  }
  
  const { labelField, labelAlias, valueField, valueAlias } = parsedFields;

  // Build WHERE conditions from parsed tableInfo
  let whereConditionsCode = "";
  if (tableInfo.whereConditions && Object.keys(tableInfo.whereConditions).length > 0) {
    whereConditionsCode = Object.entries(tableInfo.whereConditions)
      .map(([field, value]) => {
        if (typeof value === 'object' && value.in) {
          return `where.${field} = { in: ${JSON.stringify(value.in)} };`;
        } else {
          return `where.${field} = ${JSON.stringify(value)};`;
        }
      })
      .join("\n      ");
  }

  // Build select clause to only fetch the fields we need (using Prisma ORM, not raw SQL)
  const selectFields = new Set();
  
  // Add label field (the actual database field name)
  if (labelField) {
    selectFields.add(labelField);
  }
  
  // Add value field (the actual database field name)
  if (valueField) {
    selectFields.add(valueField);
  }
  
  // Always include primary key for ordering
  const primaryKeyField = tableInfo.primaryKey || 'id';
  if (primaryKeyField) {
    selectFields.add(primaryKeyField);
  }
  
  // Build select object for Prisma
  const selectFieldsArray = Array.from(selectFields);
  const selectCode = selectFieldsArray.length > 0 
    ? `select: {\n        ${selectFieldsArray.map(f => `${f}: true`).join(',\n        ')},\n      },`
    : '';

  const code = `import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    // Build WHERE conditions from parsed lookup_queryMapping (using Prisma ORM, not raw SQL)
    const where = {};
    ${whereConditionsCode ? `// Add WHERE conditions from lookup_queryMapping\n      ${whereConditionsCode}` : ""}
    
    // Execute query using Prisma ORM (no raw SQL)
    const data = await prisma.${tableInfo.table}.findMany({
      ${selectCode}
      ${whereConditionsCode ? `where,` : ""}
      orderBy: { ${primaryKeyField}: 'asc' },
    });

    // Map to options format with label and value (standard FormKit format)
    // Note: Prisma returns data with actual database field names, not SQL aliases
    // So we use labelField/valueField to access the data, then map to aliases in response
    const mappedData = data.map((item) => {
      return {
        label: item.${labelField} || item.${labelAlias} || "",
        value: item.${valueField} || item.${valueAlias} || "",
        // Also include original aliases for backward compatibility
        ${labelAlias}: item.${labelField} || item.${labelAlias} || "",
        ${valueAlias}: item.${valueField} || item.${valueAlias} || "",
      };
    });

    return {
      statusCode: 200,
      message: "Lookup data fetched successfully",
      data: mappedData,
    };
  } catch (error) {
    console.error("Error fetching lookup data:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch lookup data",
      error: process.env.NODE_ENV === 'development' ? error.message : "An error occurred while fetching lookup data",
    };
  }
});
`;

  fs.writeFileSync(endpointPath, code, "utf8");
}

// Generate Vue page file
async function generateVuePage(page, components, componentItems) {
  // Generate page path based on menu
  let pageDirPath = "";
  let pageFileName = "";

  if (page.menu) {
    // Check if menu is already a path (starts with /)
    if (page.menu.startsWith("/")) {
      // Menu is already a path like "/messagemanagement/setup"
      // Remove leading slash and use as directory path
      const menuPath = page.menu.substring(1); // Remove leading /
      // Generate page name from pageTitle - remove spaces and special chars, keep lowercase
      const pageName = page.pageTitle
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/[^a-z0-9]/g, "");
      
      // Check if menu path already ends with the page name
      // If so, don't append it again (prevents duplicates like /path/pagename/pagename)
      const normalizedMenuPath = menuPath.toLowerCase().replace(/\/+$/, ""); // Remove trailing slashes
      const menuAlreadyIncludesPage = normalizedMenuPath.endsWith(pageName) || 
                                       normalizedMenuPath.endsWith(`/${pageName}`);
      
      if (menuAlreadyIncludesPage) {
        // Menu already includes the page name, use menu path as the full page directory
        pageDirPath = menuPath;
        pageFileName = ""; // No additional folder needed, just put index.vue in the menu path
      } else {
        // Menu is the parent path, append page name
        pageDirPath = menuPath;
        pageFileName = pageName;
      }
    } else if (page.menu.includes(">")) {
      // Menu uses ">" separator like "Budget>Setup>Budget Code"
      const menuParts = page.menu.split(">").map((part) =>
        part
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "")
      );
      // Last part is the page name, rest is directory path
      pageFileName = menuParts.pop() || `page-${page.pageId}`;
      pageDirPath = menuParts.join("/");
    } else {
      // Simple menu string
      const menuPath = page.menu
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      pageDirPath = menuPath;
      pageFileName = `page-${page.pageId}`;
    }
  } else {
    // No menu, use pageId
    pageDirPath = "";
    pageFileName = `page-${page.pageId}`;
  }

  // Build full page path
  const pagesBaseDir = path.join(process.cwd(), "pages");
  const fullPageDir = pageDirPath
    ? path.join(pagesBaseDir, ...pageDirPath.split("/"))
    : pagesBaseDir;
  // If pageFileName is empty, put index.vue directly in fullPageDir
  const pagePath = pageFileName 
    ? path.join(fullPageDir, pageFileName, "index.vue")
    : path.join(fullPageDir, "index.vue");

  // Create directory structure
  const pageDir = path.dirname(pagePath);
  if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir, { recursive: true });
  }

  // Generate page content based on components
  const pageContent = generateVuePageContent(page, components, componentItems, page.pageId || pageId);

  fs.writeFileSync(pagePath, pageContent, "utf8");
}

function generateVuePageContent(page, components, componentItems, pageId) {
  // Sort components by order
  const sortedComponents = [...components].sort((a, b) => (a.order || 0) - (b.order || 0));

  // Find datatable components
  const datatableComponents = sortedComponents.filter((c) => c.type === "datatable");

  // Find filter components
  const smartFilterComponents = sortedComponents.filter(
    (c) => c.type === "form_SmartFilter"
  );
  const topFilterComponents = sortedComponents.filter((c) => c.type === "form_TopFilter");
  const popupModalComponents = sortedComponents.filter((c) => c.type === "form_PopupModal");
  const buttonComponents = sortedComponents.filter((c) => c.type === "Button" || c.type === "button");

  // Generate script section (also returns dropdownOptionsMap for template generation)
  const { scriptSection, dropdownOptionsMap } = generateScriptSection(page, datatableComponents, smartFilterComponents, topFilterComponents, popupModalComponents, buttonComponents, componentItems, pageId);

  // Generate template section
  const templateSection = generateTemplateSection(page, sortedComponents, componentItems, dropdownOptionsMap, pageId);

  return `${scriptSection}\n\n${templateSection}`;
}

function generateScriptSection(page, datatableComponents, smartFilterComponents, topFilterComponents, popupModalComponents, buttonComponents, componentItems, pageId) {
  const pageTitle = page.pageTitle.replace(/"/g, '\\"');
  const pageName = page.pageTitle
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9]/g, "");
  
  // Use pageId parameter or fallback to page.pageId
  const currentPageId = pageId || page.pageId;
  
  // Compute API path at generation time for fallback scenarios
  const fallbackApiPath = (() => {
    if (datatableComponents.length > 0) {
      const dt = datatableComponents[0];
      const apiFolderPath = getApiFolderPathFromMenu(page.menu, page.pageTitle);
      if (apiFolderPath) {
        return `/api/${apiFolderPath}`;
      }
      return `/api/page-generated/${currentPageId}/${dt?.id}`;
    }
    return `/api/page-generated/${currentPageId}`;
  })();
  
  // Generate breadcrumb from menu
  let breadcrumbItems = [];
  if (page.menu) {
    if (page.menu.startsWith("/")) {
      // Menu is a path like "/messagemanagement/setup"
      const parts = page.menu.substring(1).split("/");
      let currentPath = "";
      parts.forEach((part, index) => {
        currentPath = index === 0 ? `/${part}` : `${currentPath}/${part}`;
        const partName = part
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
        breadcrumbItems.push({
          name: partName,
          path: currentPath,
        });
      });
      // Add current page
      breadcrumbItems.push({
        name: page.pageTitle,
        path: `${currentPath}/${pageName}`,
      });
    } else if (page.menu.includes(">")) {
      // Menu uses ">" separator
      const parts = page.menu.split(">").map((p) => p.trim());
      let currentPath = "";
      parts.forEach((part, index) => {
        const partPath = part
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");
        currentPath = index === 0 ? `/${partPath}` : `${currentPath}/${partPath}`;
        breadcrumbItems.push({
          name: part,
          path: currentPath,
        });
      });
      // Add current page
      breadcrumbItems.push({
        name: page.pageTitle,
        path: `${currentPath}/${pageName}`,
      });
    }
  }

  const breadcrumbJson = JSON.stringify(breadcrumbItems, null, 2).replace(/"/g, '\\"');

  // Find all dropdown items with lookup_queryMapping
  // Include form_PopupModal and Button components in dropdown options generation
  const allComponents = [...datatableComponents, ...topFilterComponents, ...smartFilterComponents, ...popupModalComponents, ...buttonComponents];
  const dropdownItems = [];
  allComponents.forEach(component => {
    const items = componentItems.filter((ci) => ci.componentId === component.id && ci.type === "dropdown" && ci.lookup_queryMapping && ci.lookup_queryMapping.trim());
    dropdownItems.push(...items);
  });

  // Generate dropdown options refs
  let dropdownOptionsRefs = "";
  const dropdownOptionsMap = {}; // Map fieldName -> {optionsVarName, lookupQuery, apiPath, isJson}
  const processedOptionsVarNames = new Set(); // Track processed optionsVarNames to prevent duplicates
  
  // Sort dropdown items to prefer ones with variables (for cascading dropdown support)
  // Items with ${variableName} or {variableName} patterns should be processed first for each field name
  const sortedDropdownItems = [...dropdownItems].sort((a, b) => {
    const aHasVars = /\$\{(\w+)\}/.test(a.lookup_queryMapping || '') || /(?<!\$)\{(\w+)\}/.test(a.lookup_queryMapping || '');
    const bHasVars = /\$\{(\w+)\}/.test(b.lookup_queryMapping || '') || /(?<!\$)\{(\w+)\}/.test(b.lookup_queryMapping || '');
    // Items with variables come first
    if (aHasVars && !bHasVars) return -1;
    if (!aHasVars && bHasVars) return 1;
    return 0;
  });
  
  sortedDropdownItems.forEach((item) => {
    const fieldName = item.name.replace(/[^a-zA-Z0-9]/g, "_");
    const optionsVarName = `${fieldName}Options`;
    const lookupQuery = item.lookup_queryMapping.trim();
    
    // Skip if this optionsVarName has already been processed (prevent duplicates)
    if (processedOptionsVarNames.has(optionsVarName)) {
      // Still add to dropdownOptionsMap if not already present (for reference)
      if (!dropdownOptionsMap[fieldName]) {
        dropdownOptionsMap[fieldName] = dropdownOptionsMap[fieldName] || {};
      }
      return;
    }
    
    processedOptionsVarNames.add(optionsVarName);
    
    // Check if lookup_queryMapping is a JSON array
    const isJsonArray = lookupQuery.trim().startsWith('[');
    
    if (isJsonArray) {
      // JSON array format - parse and set directly
      try {
        const jsonOptions = JSON.parse(lookupQuery);
        // Validate it's an array with label/value structure
        if (Array.isArray(jsonOptions) && jsonOptions.length > 0 && jsonOptions[0].label && jsonOptions[0].value) {
          dropdownOptionsRefs += `const ${optionsVarName} = ref(${JSON.stringify(jsonOptions)});\n`;
          dropdownOptionsMap[fieldName] = {
            optionsVarName,
            isJson: true,
            jsonOptions: jsonOptions,
          };
        } else {
          // Invalid JSON format, treat as empty
          dropdownOptionsRefs += `const ${optionsVarName} = ref([]);\n`;
          dropdownOptionsMap[fieldName] = {
            optionsVarName,
            isJson: true,
            jsonOptions: [],
          };
        }
      } catch (error) {
        // Invalid JSON, treat as empty
        console.error(`Error parsing JSON for ${fieldName}:`, error);
        dropdownOptionsRefs += `const ${optionsVarName} = ref([]);\n`;
        dropdownOptionsMap[fieldName] = {
          optionsVarName,
          isJson: true,
          jsonOptions: [],
        };
      }
    } else {
      // SQL query format - use API endpoint
      dropdownOptionsRefs += `const ${optionsVarName} = ref([]);\n`;
      
      // Parse the lookup query to extract fields and aliases
      const parsedFields = parseLookupQueryFields(lookupQuery);
      const lookupApiPath = `/api/page-generated/${currentPageId}/lookups/${fieldName}`;
      
      // Extract variables for cascading dropdown support (e.g., ${Fund}, ${PTJ})
      const dependsOn = extractLookupVariables(lookupQuery);
      
      // Always add to dropdownOptionsMap - use parsed fields if available, otherwise use defaults
      dropdownOptionsMap[fieldName] = {
        optionsVarName,
        lookupQuery,
        apiPath: lookupApiPath,
        labelField: parsedFields?.labelField || 'label',
        valueField: parsedFields?.valueField || 'value',
        labelAlias: parsedFields?.labelAlias || 'label',
        valueAlias: parsedFields?.valueAlias || 'value',
        isJson: false,
        dependsOn: dependsOn, // Array of parent field names this dropdown depends on
      };
    }
  });

  // Generate fetch dropdown options function (only for SQL-based lookups)
  let fetchDropdownOptionsCode = "";
  const sqlBasedDropdowns = Object.values(dropdownOptionsMap).filter(config => !config.isJson);
  const hasSqlBasedDropdowns = sqlBasedDropdowns.length > 0;
  
  // Separate independent dropdowns from dependent ones
  const independentDropdowns = sqlBasedDropdowns.filter(config => !config.dependsOn || config.dependsOn.length === 0);
  const dependentDropdowns = sqlBasedDropdowns.filter(config => config.dependsOn && config.dependsOn.length > 0);
  
  if (hasSqlBasedDropdowns) {
    // Generate individual fetch functions for dependent dropdowns (cascading)
    dependentDropdowns.forEach((config) => {
      const fieldName = config.optionsVarName.replace('Options', '');
      const dataVarName = fieldName + 'Data';
      const fetchFnName = `fetch${fieldName}Options`;
      const paramsCode = config.dependsOn.map(dep => `${dep}: params?.${dep} || ''`).join(', ');
      
      fetchDropdownOptionsCode += `// Fetch ${fieldName} options (depends on: ${config.dependsOn.join(', ')})
const ${fetchFnName} = async (params = {}) => {
  try {
    const queryParams = { ${paramsCode} };
    const { data: ${dataVarName} } = await useFetch("${config.apiPath}", {
      method: "GET",
      query: queryParams,
      initialCache: false,
    });
    if (${dataVarName}.value?.statusCode === 200 && ${dataVarName}.value?.data) {
      ${config.optionsVarName}.value = ${dataVarName}.value.data.map((item) => ({
        label: item.label || item.${config.labelAlias} || item.${config.labelField} || "",
        value: item.value || item.${config.valueAlias} || item.${config.valueField} || "",
      }));
    } else {
      ${config.optionsVarName}.value = [];
    }
  } catch (error) {
    console.error("Error fetching ${fieldName} options:", error);
    ${config.optionsVarName}.value = [];
  }
};

`;
    });
    
    // Generate main fetch function for independent dropdowns
    fetchDropdownOptionsCode += `// Fetch dropdown options function (independent dropdowns)
const fetchDropdownOptions = async () => {
  try {
`;
    independentDropdowns.forEach((config) => {
      const dataVarName = config.optionsVarName.replace('Options', '') + 'Data';
      fetchDropdownOptionsCode += `    // Fetch ${config.optionsVarName.replace('Options', '')} options
    const { data: ${dataVarName} } = await useFetch("${config.apiPath}", {
      method: "GET",
      initialCache: false,
    });
    if (${dataVarName}.value?.statusCode === 200 && ${dataVarName}.value?.data) {
      ${config.optionsVarName}.value = ${dataVarName}.value.data.map((item) => ({
        label: item.label || item.${config.labelAlias} || item.${config.labelField} || "",
        value: item.value || item.${config.valueAlias} || item.${config.valueField} || "",
      }));
    }

`;
    });
    
    // Also fetch dependent dropdowns with empty params initially (to show all options)
    dependentDropdowns.forEach((config) => {
      const fieldName = config.optionsVarName.replace('Options', '');
      fetchDropdownOptionsCode += `    // Fetch ${fieldName} options (cascading dropdown - initial load)
    await fetch${fieldName}Options();

`;
    });
    
    fetchDropdownOptionsCode += `  } catch (error) {
    console.error("Error fetching dropdown options:", error);
  }
};

`;
    
    // Generate watchers for cascading dropdowns
    // Group dependent dropdowns by their parent fields
    const parentFieldsMap = {}; // parentField -> [dependentDropdownConfigs]
    dependentDropdowns.forEach((config) => {
      config.dependsOn.forEach((parentField) => {
        if (!parentFieldsMap[parentField]) {
          parentFieldsMap[parentField] = [];
        }
        parentFieldsMap[parentField].push(config);
      });
    });
    
    // Generate watch statements for each parent field
    Object.entries(parentFieldsMap).forEach(([parentField, dependentConfigs]) => {
      const parentFieldSafe = parentField.replace(/[^a-zA-Z0-9]/g, "_");
      
      // Get all dependency fields needed for each dependent dropdown
      const fetchCalls = dependentConfigs.map((config) => {
        const fieldName = config.optionsVarName.replace('Options', '');
        const paramsObj = config.dependsOn.map(dep => {
          const depSafe = dep.replace(/[^a-zA-Z0-9]/g, "_");
          return `${dep}: ${pageName}Form.value.${depSafe} || topFilter.value.${depSafe} || ''`;
        }).join(', ');
        return `  await fetch${fieldName}Options({ ${paramsObj} });`;
      }).join('\n');
      
      fetchDropdownOptionsCode += `// Watch ${parentField} changes to update cascading dropdowns
watch(
  () => [${pageName}Form.value.${parentFieldSafe}, topFilter.value.${parentFieldSafe}],
  async ([newFormValue, newFilterValue]) => {
    const newValue = newFormValue || newFilterValue;
    if (newValue !== undefined) {
${fetchCalls}
    }
  },
  { deep: true }
);

`;
    });
  }

  let script = `<script setup>
definePageMeta({
  title: "${pageTitle}",
  middleware: ["auth"],
  requiresAuth: true,${breadcrumbItems.length > 0 ? `
  breadcrumb: ${breadcrumbJson.replace(/\\"/g, '"')},` : ""}
});

const { $swal } = useNuxtApp();

// Table data
const ${pageName}List = ref([]);
const loading = ref(false);

// Search and filter state
const searchKeyword = ref("");
const pageSize = ref(10);

// Smart Filter modal state
const showSmartFilter = ref(false);

// Add/Edit modal state
const show${pageName.charAt(0).toUpperCase() + pageName.slice(1)}Modal = ref(false);
const isEditMode = ref(false);
const isViewMode = ref(false);
const editingId = ref(null);

// Smart Filter values
const smartFilter = ref({});
const originalFilter = ref({});

// Top Filter state
const topFilter = ref({});

// Smart Filter labels for export (field key -> display label)
// Smart Filter options mapping for export (field key -> options variable name for dropdown/radio/checkbox/listbox)
${(() => {
  // Build smart filter labels and options mapping from component items
  const smartFilterLabels = {};
  const smartFilterOptionsMap = {}; // Maps filter key to options variable name
  
  if (smartFilterComponents.length > 0) {
    const smartFilterComponent = smartFilterComponents[0];
    const smartFilterItems = componentItems.filter((ci) => ci.componentId === smartFilterComponent.id);
    
    // Get dt_bi and dt_key for field mapping
    let fieldNameMap = {};
    if (datatableComponents.length > 0) {
      const dt = datatableComponents[0];
      const dtComponentData = dt.componentData ? JSON.parse(dt.componentData) : {};
      const aliases = dtComponentData.dt_bi || [];
      const keys = dtComponentData.dt_key || {};
      Object.entries(keys).forEach(([alias, key]) => {
        if (key && alias && key !== 'No' && key !== 'Action' && alias !== 'No' && alias !== 'Action') {
          fieldNameMap[key] = alias;
        }
      });
    }
    
    smartFilterItems.forEach((item) => {
      // Use mapped field name (alias) if available, otherwise use item name
      let apiFieldName = item.name;
      for (const [key, alias] of Object.entries(fieldNameMap)) {
        const itemNameNorm = item.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const itemTitleNorm = (item.title || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const keyNorm = key.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const aliasNorm = alias.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        
        if (keyNorm === itemNameNorm || aliasNorm === itemNameNorm ||
            keyNorm === itemTitleNorm || aliasNorm === itemTitleNorm) {
          apiFieldName = alias;
          break;
        }
      }
      const fieldName = apiFieldName.replace(/[^a-zA-Z0-9]/g, "_");
      const filterKey = fieldName + "_filter";
      const displayLabel = item.title || item.name;
      smartFilterLabels[filterKey] = displayLabel;
      
      // Check if this is a dropdown/radio/checkbox/listbox field with lookup options
      const isLookupType = item.type === "dropdown" || item.type === "radio" || item.type === "checkbox" || item.type === "listbox";
      if (isLookupType && item.lookup_queryMapping && item.lookup_queryMapping.trim()) {
        const originalFieldName = item.name.replace(/[^a-zA-Z0-9]/g, "_");
        const optionsVarName = originalFieldName + "Options";
        smartFilterOptionsMap[filterKey] = optionsVarName;
      }
    });
  }
  
  let result = '';
  if (Object.keys(smartFilterLabels).length > 0) {
    result += `const smartFilterLabels = ${JSON.stringify(smartFilterLabels)};\n`;
  } else {
    result += '// No smart filter labels\n';
  }
  if (Object.keys(smartFilterOptionsMap).length > 0) {
    result += `const smartFilterOptionsMap = ${JSON.stringify(smartFilterOptionsMap)};`;
  } else {
    result += '// No smart filter options mapping';
  }
  return result;
})()}

// Top Filter labels for export (field key -> display label)
// Top Filter options mapping for export (field key -> options variable name for dropdown/radio/checkbox/listbox)
${(() => {
  // Build top filter labels and options mapping from component items
  const topFilterLabels = {};
  const topFilterOptionsMap = {}; // Maps filter key to options variable name
  
  // Check TopFilter component first, then SmartFilter as fallback for top filter type
  let topFilterComponent = topFilterComponents.length > 0 ? topFilterComponents[0] : null;
  if (!topFilterComponent && smartFilterComponents.length > 0) {
    // Check if datatable filter type is "top" - use SmartFilter items
    if (datatableComponents.length > 0) {
      const dt = datatableComponents[0];
      const dtComponentData = dt.componentData ? JSON.parse(dt.componentData) : {};
      if (dtComponentData.dt_filter === "top" || dtComponentData.dt_filter === "Top") {
        topFilterComponent = smartFilterComponents[0];
      }
    }
  }
  
  if (topFilterComponent) {
    const topFilterItems = componentItems.filter((ci) => ci.componentId === topFilterComponent.id);
    
    topFilterItems.forEach((item) => {
      const fieldName = item.name.replace(/[^a-zA-Z0-9]/g, "_");
      const displayLabel = item.title || item.name;
      topFilterLabels[fieldName] = displayLabel;
      
      // Check if this is a dropdown/radio/checkbox/listbox field with lookup options
      const isLookupType = item.type === "dropdown" || item.type === "radio" || item.type === "checkbox" || item.type === "listbox";
      if (isLookupType && item.lookup_queryMapping && item.lookup_queryMapping.trim()) {
        const optionsVarName = fieldName + "Options";
        topFilterOptionsMap[fieldName] = optionsVarName;
      }
    });
  }
  
  let result = '';
  if (Object.keys(topFilterLabels).length > 0) {
    result += `const topFilterLabels = ${JSON.stringify(topFilterLabels)};\n`;
  } else {
    result += '// No top filter labels\n';
  }
  if (Object.keys(topFilterOptionsMap).length > 0) {
    result += `const topFilterOptionsMap = ${JSON.stringify(topFilterOptionsMap)};`;
  } else {
    result += '// No top filter options mapping';
  }
  return result;
})()}

// Form data
const ${pageName}Form = ref({});

${dropdownOptionsRefs ? `// Dropdown options - generated for fields with lookup_queryMapping
${dropdownOptionsRefs}` : ""}
${fetchDropdownOptionsCode}

// Helper function to get lookup label from options array
const getLookupLabel = (options, value) => {
  if (!options || !Array.isArray(options) || value === null || value === undefined || value === '') {
    return value || '';
  }
  const valueStr = String(value);
  const option = options.find(opt => String(opt.value) === valueStr || String(opt.label) === valueStr);
  return option ? option.label : value;
};

// Helper function to format date to DD/MM/YYYY
const formatDate = (value) => {
  if (!value) return '-';
  try {
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return '-';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return \`\${day}/\${month}/\${year}\`;
  } catch (error) {
    return '-';
  }
};

// Helper function to format datetime to DD/MM/YYYY HH:MI:SS AM/PM
const formatDateTime = (value) => {
  if (!value) return '-';
  try {
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return '-';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = String(hours % 12 || 12).padStart(2, '0');
    return \`\${day}/\${month}/\${year} \${displayHours}:\${minutes}:\${seconds} \${ampm}\`;
  } catch (error) {
    return '-';
  }
};

// Helper function to format date to YYYY-MM-DD for HTML date input
const formatDateForInput = (value) => {
  if (!value) return '';
  try {
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return \`\${year}-\${month}-\${day}\`;
  } catch (error) {
    return '';
  }
};

// Fetch data function - fetches all data, rs-table handles pagination client-side
const fetchData = async () => {
  try {
    loading.value = true;
    const query = {
      ...topFilter.value,
    };

    // Remove empty values
    Object.keys(query).forEach((key) => {
      if (query[key] === "" || query[key] === null) {
        delete query[key];
      }
    });

`;

  // Add API calls for each datatable
  datatableComponents.forEach((dt, index) => {
    const componentData = dt.componentData ? JSON.parse(dt.componentData) : {};
    // Use dt_ajax if available, otherwise generate from menu structure (folder path to match actual location)
    let apiPath = componentData.dt_ajax;
    if (!apiPath) {
      const apiFolderPath = getApiFolderPathFromMenu(page.menu, page.pageTitle);
      apiPath = apiFolderPath ? `/api/${apiFolderPath}` : `/api/page-generated/${page.pageId}/${dt.id}`;
    }
    // Ensure absolute path (starts with /)
    if (!apiPath.startsWith('/')) {
      apiPath = '/' + apiPath;
    }
    script += `
    const { data: data${index} } = await useFetch("${apiPath}", {
      method: "GET",
      query,
      initialCache: false,
    });

    if (data${index}.value?.statusCode === 200) {
      ${pageName}List.value = (data${index}.value.data || []).map((item, idx) => {
        const mappedItem = {
          no: idx + 1,
          Action: "",
        };
        // Map fields from API response
        Object.keys(item).forEach((key) => {
          mappedItem[key] = item[key];
        });
        return mappedItem;
      });
      applyFilters();
    }`;
  });

  script += `
  } catch (error) {
    console.error("Error fetching data:", error);
    $swal.fire({
      title: "Error",
      text: "Failed to fetch data",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Filtered data - using ref instead of computed for better reactivity
const filtered${pageName.charAt(0).toUpperCase() + pageName.slice(1)}List = ref([...${pageName}List.value]);

// Function to apply filters
const applyFilters = () => {
  let filtered = [...${pageName}List.value];

  // Apply search filter - search all columns except 'No' and 'Action'
  if (searchKeyword.value && searchKeyword.value.trim() !== "") {
    const keyword = searchKeyword.value.toLowerCase().trim();
    filtered = filtered.filter((item) => {
      return Object.keys(item).some((key) => {
        if (key === 'no' || key === 'Action') return false;
        const value = String(item[key] || "").toLowerCase();
        return value.includes(keyword);
      });
    });
  }

  // Apply smart filter
  // Build set of dropdown field names for exact matching (built at generation time)
  const dropdownFilterFields = ${JSON.stringify((() => {
    try {
      const dropdownFields = new Set();
      if (!smartFilterComponents || !Array.isArray(smartFilterComponents) || smartFilterComponents.length === 0) {
        return [];
      }
      if (!datatableComponents || !Array.isArray(datatableComponents) || datatableComponents.length === 0) {
        return [];
      }
      if (!componentItems || !Array.isArray(componentItems)) {
        return [];
      }
      
      const dt = datatableComponents[0];
      if (!dt) return [];
      
      let componentData = {};
      try {
        if (dt.componentData) {
          if (typeof dt.componentData === 'string') {
            componentData = JSON.parse(dt.componentData);
          } else if (typeof dt.componentData === 'object') {
            componentData = dt.componentData;
          }
        }
      } catch (e) {
        // Ignore parse errors, use empty object
        componentData = {};
      }
      
      smartFilterComponents.forEach(component => {
        if (!component || !component.id) return;
        try {
          const items = componentItems.filter((ci) => ci && ci.componentId === component.id);
          items.forEach((item) => {
            if (!item) return;
            try {
              if ((item.type === "dropdown" || item.type === "select" || item.type === "radio" || item.type === "listbox") && 
                  item.lookup_queryMapping) {
                // Get the field name that would be used in smartFilter (using alias if available)
                if (!item.name) return;
                const itemFieldName = item.name.replace(/[^a-zA-Z0-9]/g, "_");
                if (!itemFieldName) return;
                
                // Check if there's a field mapping (alias) from componentData
                if (componentData && componentData.dt_bi && componentData.dt_key && 
                    Array.isArray(componentData.dt_bi) && Array.isArray(componentData.dt_key)) {
                  const aliases = componentData.dt_bi || [];
                  const keys = componentData.dt_key || [];
                  keys.forEach((key, index) => {
                    if (!key) return;
                    const alias = aliases[index];
                    // Use case-insensitive matching that ignores spaces, hyphens, and underscores
                    if (alias && (fieldNamesMatch(key, item.name) || fieldNamesMatch(alias, item.name))) {
                      const aliasFieldName = (alias || key).replace(/[^a-zA-Z0-9]/g, "_");
                      if (aliasFieldName) {
                        dropdownFields.add(aliasFieldName);
                      }
                    }
                  });
                }
                dropdownFields.add(itemFieldName);
              }
            } catch (e) {
              // Ignore individual item errors
            }
          });
        } catch (e) {
          // Ignore component processing errors
        }
      });
      return Array.from(dropdownFields);
    } catch (e) {
      // Return empty array on any error
      return [];
    }
  })())};
  
  Object.keys(smartFilter.value).forEach((key) => {
    if (smartFilter.value[key]) {
      // Remove _filter suffix to get the actual field name
      const fieldName = key.replace(/_filter$/, "");
      
      filtered = filtered.filter((item) => {
        // Try both the field name and the original key (for backward compatibility)
        const itemValue = item[fieldName] || item[key];
        const filterValue = smartFilter.value[key];
        
        // For dropdown fields, use exact match (handle type conversion)
        if (dropdownFilterFields.includes(fieldName)) {
          // Convert both to strings for comparison (handles number/string mismatches)
          return String(itemValue) === String(filterValue);
        } else {
          // For text fields, use includes (substring match)
          const itemValueStr = String(itemValue || "").toLowerCase();
          const filterValueStr = String(filterValue).toLowerCase();
          return itemValueStr.includes(filterValueStr);
        }
      });
    }
  });

  // Update the filtered list - force reactivity by creating new array reference
  filtered${pageName.charAt(0).toUpperCase() + pageName.slice(1)}List.value = [];
  nextTick(() => {
    filtered${pageName.charAt(0).toUpperCase() + pageName.slice(1)}List.value = [...filtered];
  });
};

// Total records count
const totalRecords = computed(() => filtered${pageName.charAt(0).toUpperCase() + pageName.slice(1)}List.value.length);

// Watch searchKeyword and apply filters when it changes
watch(searchKeyword, () => {
  applyFilters();
}, { immediate: false });

// Watch smartFilter and apply filters when it changes
watch(smartFilter, () => {
  applyFilters();
}, { deep: true });

// Check if any smart filter is active
const hasActiveFilters = computed(() => {
  return Object.values(smartFilter.value).some((value) => {
    return value !== null && value !== undefined && value !== '' && String(value).trim() !== '';
  });
});

// Handle filter - open Smart Filter modal
const handleFilter = () => {
  originalFilter.value = { ...smartFilter.value };
  showSmartFilter.value = true;
};

// Handle Smart Filter Reset
const handleFilterReset = () => {
  smartFilter.value = {};
  originalFilter.value = {};
};

// Handle Smart Filter Ok
const handleFilterOk = () => {
  showSmartFilter.value = false;
};

// Handle Smart Filter Cancel/Close
const handleFilterClose = () => {
  smartFilter.value = { ...originalFilter.value };
  showSmartFilter.value = false;
};

${(() => {
  // Check if download PDF is enabled
  if (datatableComponents.length > 0) {
    const dt = datatableComponents[0];
    if (dt?.componentData) {
      try {
        const compData = typeof dt.componentData === 'string' ? JSON.parse(dt.componentData) : dt.componentData;
        if (compData.dt_download_pdf === true || compData.dt_download_pdf === "true") {
          // Get column headers (dt_bi) excluding 'No' and 'Action'
          const columns = (compData.dt_bi || []).filter((col) => col && col !== 'No' && col !== 'Action');
          
          // Build mapping of column names to their options variable names for dropdowns/radios/checkboxes/listboxes
          const columnToOptionsMap = {};
          // Build mapping of column names to date type ("date" or "datetime")
          const columnDateTypeMap = {};
          const dt_key = compData.dt_key || [];
          
          columns.forEach((columnHeader, index) => {
            const key = dt_key[index] || "";
            const columnHeaderLower = columnHeader.toLowerCase();
            const keyLower = key.toLowerCase();
            
            // Find matching component item (similar to how datatable template does it)
            // Use case-insensitive matching that ignores spaces, hyphens, and underscores
            const matchingItem = componentItems.find((ci) => {
              // Match by: item name, item title, or dt_key value against columnHeader
              const nameMatches = fieldNamesMatch(ci.name, columnHeader) ||
                                 fieldNamesMatch(ci.title, columnHeader) ||
                                 (key && fieldNamesMatch(key, ci.name));
              
              return nameMatches &&
                     (ci.type === "dropdown" || ci.type === "radio" || ci.type === "checkbox" || ci.type === "listbox") &&
                     ci.lookup_queryMapping && ci.lookup_queryMapping.trim();
            });
            
            if (matchingItem && matchingItem.lookup_queryMapping) {
              const itemFieldName = matchingItem.name.replace(/[^a-zA-Z0-9]/g, "_");
              const lookupKey = findDropdownOptionsKey(dropdownOptionsMap, matchingItem.name) || itemFieldName;
              const lookupInfo = dropdownOptionsMap[lookupKey];
              
              if (lookupInfo) {
                const optionsVarName = lookupInfo.optionsVarName || `${itemFieldName}Options`;
                columnToOptionsMap[columnHeader] = optionsVarName;
              }
            }
            
            // Check if this is a date/datetime column based on column header or key name
            const isDateTimeColumn = 
              columnHeaderLower.includes('datetime') || 
              keyLower.includes('datetime') ||
              columnHeaderLower.includes('timestamp') || 
              keyLower.includes('timestamp') ||
              keyLower.includes('createdat') ||
              keyLower.includes('updatedat') ||
              keyLower.includes('modifiedat') ||
              keyLower.includes('deletedat');
            
            const isDateOnlyColumn = !isDateTimeColumn && (
              columnHeaderLower.includes('date') || 
              keyLower.includes('date') ||
              keyLower.includes('createddate') ||
              keyLower.includes('updateddate') ||
              keyLower.includes('modifieddate') ||
              keyLower.includes('entrydate') ||
              keyLower.includes('birthdate') ||
              keyLower.includes('startdate') ||
              keyLower.includes('enddate') ||
              keyLower.includes('effectivedate') ||
              keyLower.includes('expirydate') ||
              keyLower.includes('duedate')
            );
            
            // Also check if there's a matching component item with type "date" or "datetime"
            const dateMatchingItem = componentItems.find((ci) => {
              const nameMatches = fieldNamesMatch(ci.name, key) || 
                                 fieldNamesMatch(ci.name, columnHeader) ||
                                 fieldNamesMatch(ci.title, key) ||
                                 fieldNamesMatch(ci.title, columnHeader);
              return nameMatches && (ci.type === "date" || ci.type === "datetime");
            });
            
            const itemIsDateTime = dateMatchingItem?.type === "datetime";
            const itemIsDateOnly = dateMatchingItem?.type === "date";
            
            if (isDateTimeColumn || itemIsDateTime) {
              columnDateTypeMap[columnHeader] = "datetime";
            } else if (isDateOnlyColumn || itemIsDateOnly) {
              columnDateTypeMap[columnHeader] = "date";
            }
          });
          
          return `// Download PDF function
const handleDownloadPDF = async () => {
  try {
    // Import jsPDF and jspdf-autotable dynamically
    const { default: jsPDF } = await import('jspdf');
    const autoTable = (await import('jspdf-autotable')).default;
    
    // Get current filtered data
    let dataToExport = [...filtered${pageName.charAt(0).toUpperCase() + pageName.slice(1)}List.value];
    
    if (dataToExport.length === 0) {
      $swal.fire({
        title: "No Data",
        text: "There is no data to export",
        icon: "warning",
      });
      return;
    }
    
    // Create PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    const logoSize = 12;
    const logoY = margin;
    const logoX = margin;
    
    // Format current date and time: Date : 05/05/2025 11:25:02 AM
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const formattedDateTime = \`Date : \${day}/\${month}/\${year} \${String(displayHours).padStart(2, '0')}:\${minutes}:\${seconds} \${ampm}\`;
    
    // Add logo on top left
    let logoHeight = 0;
    try {
      const logoUrl = '/img/logo/organization_logo.png';
      const response = await fetch(logoUrl);
      if (response.ok) {
        const blob = await response.blob();
        const logoData = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject(new Error('Failed to read logo file'));
          reader.readAsDataURL(blob);
        });
        
        const img = await new Promise((resolve, reject) => {
          const image = new Image();
          image.onload = () => resolve(image);
          image.onerror = () => reject(new Error('Failed to load image'));
          image.src = logoData;
        });
        
        const aspectRatio = img.width / img.height;
        logoHeight = logoSize;
        const logoWidth = logoSize * aspectRatio;
        doc.addImage(logoData, 'PNG', logoX, logoY, logoWidth, logoHeight);
      }
    } catch (error) {
      console.error('Error loading logo:', error);
      logoHeight = 0;
    }
    
    // Add date and time at top right
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(0, 0, 0);
    const dateTimeWidth = doc.getTextWidth(formattedDateTime);
    const dateTimeX = pageWidth - margin - dateTimeWidth;
    const dateTimeY = margin + 8;
    doc.text(formattedDateTime, dateTimeX, dateTimeY);
    
    // Add title in the center
    const title = "${pageTitle}";
    const titleFontSize = 16;
    doc.setFontSize(titleFontSize);
    doc.setFont(undefined, 'bold');
    const titleWidth = doc.getTextWidth(title);
    const titleX = (pageWidth - titleWidth) / 2;
    const titleY = margin + (logoHeight > 0 ? logoHeight + 3 : 10);
    doc.text(title, titleX, titleY);
    
    // Prepare table data
    const exportColumns = ${JSON.stringify(columns)};
    const columnToOptionsMap = ${JSON.stringify(columnToOptionsMap)};
    const columnDateTypeMap = ${JSON.stringify(columnDateTypeMap)};
    
    // Build options lookup object for dropdown/radio/checkbox/listbox columns
    const columnOptionsLookup = {};
    ${(() => {
      if (Object.keys(columnToOptionsMap).length === 0) return '';
      return Object.entries(columnToOptionsMap).map(([colName, varName]) => {
        return `columnOptionsLookup[${JSON.stringify(colName)}] = ${varName}.value;`;
      }).join('\n    ');
    })()}
    
    const tableData = dataToExport.map((item, index) => {
      const row = [(index + 1).toString()];
      exportColumns.forEach((col) => {
        // Check if this column has a lookup (dropdown/radio/checkbox/listbox)
        const options = columnOptionsLookup[col];
        // Check if this column is a date/datetime column
        const dateType = columnDateTypeMap[col];
        
        if (options) {
          // Use getLookupLabel to convert value to label
          const label = getLookupLabel(options, item[col]);
          row.push((label || '').toString());
        } else if (dateType === 'datetime') {
          // Format as datetime: DD/MM/YYYY HH:MI:SS AM/PM
          row.push(formatDateTime(item[col]));
        } else if (dateType === 'date') {
          // Format as date: DD/MM/YYYY
          row.push(formatDate(item[col]));
        } else {
          row.push((item[col] || '').toString());
        }
      });
      return row;
    });
    
    // Add table
    autoTable(doc, {
      head: [['No.', ...exportColumns]],
      body: tableData,
      startY: titleY + 8,
      margin: { left: margin, right: margin },
      styles: {
        fontSize: 9,
        cellPadding: 2,
        textColor: [0, 0, 0],
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center',
      },
      bodyStyles: {
        halign: 'left',
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 15 },
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      didDrawPage: (data) => {
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 0, 0);
        const dateTimeWidth = doc.getTextWidth(formattedDateTime);
        const dateTimeX = pageWidth - margin - dateTimeWidth;
        const dateTimeY = margin + 8;
        doc.text(formattedDateTime, dateTimeX, dateTimeY);
      },
    });
    
    // Save PDF
    const fileName = \`${pageTitle.replace(/\s+/g, '_')}_\${new Date().toISOString().split('T')[0]}.pdf\`;
    doc.save(fileName);
    
    $swal.fire({
      title: "Success",
      text: "PDF downloaded successfully",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    $swal.fire({
      title: "Error",
      text: "Failed to generate PDF. Please try again.",
      icon: "error",
    });
  }
};
`;
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
  }
  return "";
})()}${(() => {
  // Check if download CSV is enabled
  if (datatableComponents.length > 0) {
    const dt = datatableComponents[0];
    if (dt?.componentData) {
      try {
        const compData = typeof dt.componentData === 'string' ? JSON.parse(dt.componentData) : dt.componentData;
        if (compData.dt_download_csv === true || compData.dt_download_csv === "true") {
          // Get column headers (dt_bi) excluding 'No' and 'Action'
          const columns = (compData.dt_bi || []).filter((col) => col && col !== 'No' && col !== 'Action');
          
          // Build mapping of column names to their options variable names for dropdowns/radios/checkboxes/listboxes
          const columnToOptionsMap = {};
          // Build mapping of column names to date type ("date" or "datetime")
          const columnDateTypeMap = {};
          const dt_key = compData.dt_key || [];
          
          columns.forEach((columnHeader, index) => {
            const key = dt_key[index] || "";
            const columnHeaderLower = columnHeader.toLowerCase();
            const keyLower = key.toLowerCase();
            
            // Find matching component item (similar to how datatable template does it)
            // Use case-insensitive matching that ignores spaces, hyphens, and underscores
            const matchingItem = componentItems.find((ci) => {
              // Match by: item name, item title, or dt_key value against columnHeader
              const nameMatches = fieldNamesMatch(ci.name, columnHeader) ||
                                 fieldNamesMatch(ci.title, columnHeader) ||
                                 (key && fieldNamesMatch(key, ci.name));
              
              return nameMatches &&
                     (ci.type === "dropdown" || ci.type === "radio" || ci.type === "checkbox" || ci.type === "listbox") &&
                     ci.lookup_queryMapping && ci.lookup_queryMapping.trim();
            });
            
            if (matchingItem && matchingItem.lookup_queryMapping) {
              const itemFieldName = matchingItem.name.replace(/[^a-zA-Z0-9]/g, "_");
              const lookupKey = findDropdownOptionsKey(dropdownOptionsMap, matchingItem.name) || itemFieldName;
              const lookupInfo = dropdownOptionsMap[lookupKey];
              
              if (lookupInfo) {
                const optionsVarName = lookupInfo.optionsVarName || `${itemFieldName}Options`;
                columnToOptionsMap[columnHeader] = optionsVarName;
              }
            }
            
            // Check if this is a date/datetime column based on column header or key name
            const isDateTimeColumn = 
              columnHeaderLower.includes('datetime') || 
              keyLower.includes('datetime') ||
              columnHeaderLower.includes('timestamp') || 
              keyLower.includes('timestamp') ||
              keyLower.includes('createdat') ||
              keyLower.includes('updatedat') ||
              keyLower.includes('modifiedat') ||
              keyLower.includes('deletedat');
            
            const isDateOnlyColumn = !isDateTimeColumn && (
              columnHeaderLower.includes('date') || 
              keyLower.includes('date') ||
              keyLower.includes('createddate') ||
              keyLower.includes('updateddate') ||
              keyLower.includes('modifieddate') ||
              keyLower.includes('entrydate') ||
              keyLower.includes('birthdate') ||
              keyLower.includes('startdate') ||
              keyLower.includes('enddate') ||
              keyLower.includes('effectivedate') ||
              keyLower.includes('expirydate') ||
              keyLower.includes('duedate')
            );
            
            // Also check if there's a matching component item with type "date" or "datetime"
            const dateMatchingItem = componentItems.find((ci) => {
              const nameMatches = fieldNamesMatch(ci.name, key) || 
                                 fieldNamesMatch(ci.name, columnHeader) ||
                                 fieldNamesMatch(ci.title, key) ||
                                 fieldNamesMatch(ci.title, columnHeader);
              return nameMatches && (ci.type === "date" || ci.type === "datetime");
            });
            
            const itemIsDateTime = dateMatchingItem?.type === "datetime";
            const itemIsDateOnly = dateMatchingItem?.type === "date";
            
            if (isDateTimeColumn || itemIsDateTime) {
              columnDateTypeMap[columnHeader] = "datetime";
            } else if (isDateOnlyColumn || itemIsDateOnly) {
              columnDateTypeMap[columnHeader] = "date";
            }
          });
          
          return `// Download CSV function
const handleDownloadCSV = () => {
  try {
    // Get current filtered data
    let dataToExport = [...filtered${pageName.charAt(0).toUpperCase() + pageName.slice(1)}List.value];
    
    if (dataToExport.length === 0) {
      $swal.fire({
        title: "No Data",
        text: "There is no data to export",
        icon: "warning",
      });
      return;
    }
    
    // Format current date and time: Date : 05/05/2025 11:25:02 AM
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const formattedDateTime = \`Date : \${day}/\${month}/\${year} \${String(displayHours).padStart(2, '0')}:\${minutes}:\${seconds} \${ampm}\`;
    
    // Helper function to escape CSV field
    const escapeCSVField = (field) => {
      if (field === null || field === undefined) return '';
      const str = String(field);
      if (str.includes(',') || str.includes('"') || str.includes('\\n') || str.includes('\\r')) {
        return \`"\${str.replace(/"/g, '""')}"\`;
      }
      return str;
    };
    
    // CSV Headers
    const exportColumns = ${JSON.stringify(columns)};
    const columnToOptionsMap = ${JSON.stringify(columnToOptionsMap)};
    const columnDateTypeMap = ${JSON.stringify(columnDateTypeMap)};
    const headers = ['No.', ...exportColumns];
    
    // Build options lookup object for dropdown/radio/checkbox/listbox columns
    const columnOptionsLookup = {};
    ${(() => {
      if (Object.keys(columnToOptionsMap).length === 0) return '';
      return Object.entries(columnToOptionsMap).map(([colName, varName]) => {
        return `columnOptionsLookup[${JSON.stringify(colName)}] = ${varName}.value;`;
      }).join('\n    ');
    })()}
    
    // Build smart filter options lookup for dropdown/radio/checkbox/listbox filter fields
    const smartFilterOptionsLookup = {};
    ${(() => {
      // Build smart filter options lookup from component items
      const smartFilterOptionsEntries = [];
      if (smartFilterComponents.length > 0) {
        const smartFilterComponent = smartFilterComponents[0];
        const smartFilterItems = componentItems.filter((ci) => ci.componentId === smartFilterComponent.id);
        
        // Get dt_bi and dt_key for field mapping
        let fieldNameMap = {};
        if (datatableComponents.length > 0) {
          const dt = datatableComponents[0];
          const dtComponentData = dt.componentData ? JSON.parse(dt.componentData) : {};
          const keys = dtComponentData.dt_key || {};
          Object.entries(keys).forEach(([alias, key]) => {
            if (key && alias && key !== 'No' && key !== 'Action' && alias !== 'No' && alias !== 'Action') {
              fieldNameMap[key] = alias;
            }
          });
        }
        
        smartFilterItems.forEach((item) => {
          const isLookupType = item.type === "dropdown" || item.type === "radio" || item.type === "checkbox" || item.type === "listbox";
          if (isLookupType && item.lookup_queryMapping && item.lookup_queryMapping.trim()) {
            // Use mapped field name (alias) if available, otherwise use item name
            let apiFieldName = item.name;
            for (const [key, alias] of Object.entries(fieldNameMap)) {
              const itemNameNorm = item.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
              const itemTitleNorm = (item.title || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
              const keyNorm = key.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
              const aliasNorm = alias.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
              
              if (keyNorm === itemNameNorm || aliasNorm === itemNameNorm ||
                  keyNorm === itemTitleNorm || aliasNorm === itemTitleNorm) {
                apiFieldName = alias;
                break;
              }
            }
            const fieldName = apiFieldName.replace(/[^a-zA-Z0-9]/g, "_");
            const filterKey = fieldName + "_filter";
            const originalFieldName = item.name.replace(/[^a-zA-Z0-9]/g, "_");
            const optionsVarName = originalFieldName + "Options";
            smartFilterOptionsEntries.push({ filterKey, optionsVarName });
          }
        });
      }
      
      if (smartFilterOptionsEntries.length === 0) return '';
      return smartFilterOptionsEntries.map(({ filterKey, optionsVarName }) => {
        return `if (typeof ${optionsVarName} !== 'undefined') smartFilterOptionsLookup[${JSON.stringify(filterKey)}] = ${optionsVarName}.value;`;
      }).join('\n    ');
    })()}
    
    // Build top filter options lookup for dropdown/radio/checkbox/listbox filter fields
    const topFilterOptionsLookup = {};
    ${(() => {
      // Build top filter options lookup from component items
      const topFilterOptionsEntries = [];
      
      // Check TopFilter component first, then SmartFilter as fallback for top filter type
      let topFilterComponent = topFilterComponents.length > 0 ? topFilterComponents[0] : null;
      if (!topFilterComponent && smartFilterComponents.length > 0) {
        if (datatableComponents.length > 0) {
          const dt = datatableComponents[0];
          const dtComponentData = dt.componentData ? JSON.parse(dt.componentData) : {};
          if (dtComponentData.dt_filter === "top" || dtComponentData.dt_filter === "Top") {
            topFilterComponent = smartFilterComponents[0];
          }
        }
      }
      
      if (topFilterComponent) {
        const topFilterItems = componentItems.filter((ci) => ci.componentId === topFilterComponent.id);
        
        topFilterItems.forEach((item) => {
          const isLookupType = item.type === "dropdown" || item.type === "radio" || item.type === "checkbox" || item.type === "listbox";
          if (isLookupType && item.lookup_queryMapping && item.lookup_queryMapping.trim()) {
            const fieldName = item.name.replace(/[^a-zA-Z0-9]/g, "_");
            const optionsVarName = fieldName + "Options";
            topFilterOptionsEntries.push({ fieldName, optionsVarName });
          }
        });
      }
      
      if (topFilterOptionsEntries.length === 0) return '';
      return topFilterOptionsEntries.map(({ fieldName, optionsVarName }) => {
        return `if (typeof ${optionsVarName} !== 'undefined') topFilterOptionsLookup[${JSON.stringify(fieldName)}] = ${optionsVarName}.value;`;
      }).join('\n    ');
    })()}
    
    // Build CSV content
    let csvContent = '';
    csvContent += escapeCSVField(formattedDateTime) + '\\n';
    csvContent += escapeCSVField("${pageTitle}") + '\\n';
    
    // Add search keyword if any
    if (searchKeyword.value && searchKeyword.value.trim() !== '') {
      csvContent += escapeCSVField(\`Search: \${searchKeyword.value.trim()}\`) + '\\n';
    }
    
    // Add top filter values if any
    const activeTopFilters = [];
    Object.keys(topFilter.value).forEach((key) => {
      if (topFilter.value[key] && String(topFilter.value[key]).trim() !== '') {
        // Use topFilterLabels for proper display label, fallback to key
        const displayLabel = (typeof topFilterLabels !== 'undefined' && topFilterLabels[key]) ? topFilterLabels[key] : key;
        // For dropdown/radio/checkbox/listbox fields, convert value to label using options
        let displayValue = String(topFilter.value[key]).trim();
        if (topFilterOptionsLookup[key]) {
          displayValue = getLookupLabel(topFilterOptionsLookup[key], displayValue);
        }
        activeTopFilters.push(\`\${displayLabel}: \${displayValue}\`);
      }
    });
    
    if (activeTopFilters.length > 0) {
      activeTopFilters.forEach(filter => {
        csvContent += escapeCSVField(filter) + '\\n';
      });
    }
    
    // Add smart filter values if any
    const activeFilters = [];
    Object.keys(smartFilter.value).forEach((key) => {
      if (smartFilter.value[key] && String(smartFilter.value[key]).trim() !== '') {
        // Use smartFilterLabels for proper display label, fallback to fieldName
        const displayLabel = (typeof smartFilterLabels !== 'undefined' && smartFilterLabels[key]) ? smartFilterLabels[key] : key.replace(/_filter$/, "");
        // For dropdown/radio/checkbox/listbox fields, convert value to label using options
        let displayValue = String(smartFilter.value[key]).trim();
        if (smartFilterOptionsLookup[key]) {
          displayValue = getLookupLabel(smartFilterOptionsLookup[key], displayValue);
        }
        activeFilters.push(\`\${displayLabel}: \${displayValue}\`);
      }
    });
    
    if (activeFilters.length > 0) {
      activeFilters.forEach(filter => {
        csvContent += escapeCSVField(filter) + '\\n';
      });
    }
    
    // Add blank line if there are filters or search
    if ((searchKeyword.value && searchKeyword.value.trim() !== '') || activeTopFilters.length > 0 || activeFilters.length > 0) {
      csvContent += '\\n';
    }
    
    // Add headers
    csvContent += headers.map(escapeCSVField).join(',') + '\\n';
    
    // Add data rows
    dataToExport.forEach((item, index) => {
      const row = [(index + 1).toString()];
      exportColumns.forEach((col) => {
        // Check if this column has a lookup (dropdown/radio/checkbox/listbox)
        const options = columnOptionsLookup[col];
        // Check if this column is a date/datetime column
        const dateType = columnDateTypeMap[col];
        
        if (options) {
          // Use getLookupLabel to convert value to label
          const label = getLookupLabel(options, item[col]);
          row.push(label || '');
        } else if (dateType === 'datetime') {
          // Format as datetime: DD/MM/YYYY HH:MI:SS AM/PM
          row.push(formatDateTime(item[col]));
        } else if (dateType === 'date') {
          // Format as date: DD/MM/YYYY
          row.push(formatDate(item[col]));
        } else {
          row.push(item[col] || '');
        }
      });
      csvContent += row.map(escapeCSVField).join(',') + '\\n';
    });
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', \`${pageTitle.replace(/\s+/g, '_')}_\${new Date().toISOString().split('T')[0]}.csv\`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    
    $swal.fire({
      title: "Success",
      text: "CSV downloaded successfully",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error("Error generating CSV:", error);
    $swal.fire({
      title: "Error",
      text: "Failed to generate CSV. Please try again.",
      icon: "error",
    });
  }
};
`;
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
  }
  return "";
})()}${(() => {
  // Check if download Excel is enabled
  if (datatableComponents.length > 0) {
    const dt = datatableComponents[0];
    if (dt?.componentData) {
      try {
        const compData = typeof dt.componentData === 'string' ? JSON.parse(dt.componentData) : dt.componentData;
        if (compData.dt_download_excel === true || compData.dt_download_excel === "true") {
          // Get column headers (dt_bi) excluding 'No' and 'Action'
          const columns = (compData.dt_bi || []).filter((col) => col && col !== 'No' && col !== 'Action');
          
          // Build mapping of column names to their options variable names for dropdowns/radios/checkboxes/listboxes
          const columnToOptionsMap = {};
          // Build mapping of column names to date type ("date" or "datetime")
          const columnDateTypeMap = {};
          const dt_key = compData.dt_key || [];
          
          columns.forEach((columnHeader, index) => {
            const key = dt_key[index] || "";
            const columnHeaderLower = columnHeader.toLowerCase();
            const keyLower = key.toLowerCase();
            
            // Find matching component item (similar to how datatable template does it)
            // Use case-insensitive matching that ignores spaces, hyphens, and underscores
            const matchingItem = componentItems.find((ci) => {
              // Match by: item name, item title, or dt_key value against columnHeader
              const nameMatches = fieldNamesMatch(ci.name, columnHeader) ||
                                 fieldNamesMatch(ci.title, columnHeader) ||
                                 (key && fieldNamesMatch(key, ci.name));
              
              return nameMatches &&
                     (ci.type === "dropdown" || ci.type === "radio" || ci.type === "checkbox" || ci.type === "listbox") &&
                     ci.lookup_queryMapping && ci.lookup_queryMapping.trim();
            });
            
            if (matchingItem && matchingItem.lookup_queryMapping) {
              const itemFieldName = matchingItem.name.replace(/[^a-zA-Z0-9]/g, "_");
              const lookupKey = findDropdownOptionsKey(dropdownOptionsMap, matchingItem.name) || itemFieldName;
              const lookupInfo = dropdownOptionsMap[lookupKey];
              
              if (lookupInfo) {
                const optionsVarName = lookupInfo.optionsVarName || `${itemFieldName}Options`;
                columnToOptionsMap[columnHeader] = optionsVarName;
              }
            }
            
            // Check if this is a date/datetime column based on column header or key name
            const isDateTimeColumn = 
              columnHeaderLower.includes('datetime') || 
              keyLower.includes('datetime') ||
              columnHeaderLower.includes('timestamp') || 
              keyLower.includes('timestamp') ||
              keyLower.includes('createdat') ||
              keyLower.includes('updatedat') ||
              keyLower.includes('modifiedat') ||
              keyLower.includes('deletedat');
            
            const isDateOnlyColumn = !isDateTimeColumn && (
              columnHeaderLower.includes('date') || 
              keyLower.includes('date') ||
              keyLower.includes('createddate') ||
              keyLower.includes('updateddate') ||
              keyLower.includes('modifieddate') ||
              keyLower.includes('entrydate') ||
              keyLower.includes('birthdate') ||
              keyLower.includes('startdate') ||
              keyLower.includes('enddate') ||
              keyLower.includes('effectivedate') ||
              keyLower.includes('expirydate') ||
              keyLower.includes('duedate')
            );
            
            // Also check if there's a matching component item with type "date" or "datetime"
            const dateMatchingItem = componentItems.find((ci) => {
              const nameMatches = fieldNamesMatch(ci.name, key) || 
                                 fieldNamesMatch(ci.name, columnHeader) ||
                                 fieldNamesMatch(ci.title, key) ||
                                 fieldNamesMatch(ci.title, columnHeader);
              return nameMatches && (ci.type === "date" || ci.type === "datetime");
            });
            
            const itemIsDateTime = dateMatchingItem?.type === "datetime";
            const itemIsDateOnly = dateMatchingItem?.type === "date";
            
            if (isDateTimeColumn || itemIsDateTime) {
              columnDateTypeMap[columnHeader] = "datetime";
            } else if (isDateOnlyColumn || itemIsDateOnly) {
              columnDateTypeMap[columnHeader] = "date";
            }
          });
          
          return `// Download Excel function
const handleDownloadExcel = async () => {
  try {
    // Import ExcelJS dynamically for better styling support
    const ExcelJS = await import('exceljs');
    
    // Get current filtered data
    let dataToExport = [...filtered${pageName.charAt(0).toUpperCase() + pageName.slice(1)}List.value];
    
    if (dataToExport.length === 0) {
      $swal.fire({
        title: "No Data",
        text: "There is no data to export",
        icon: "warning",
      });
      return;
    }
    
    // Format current date and time: Date : 05/05/2025 11:25:02 AM
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const formattedDateTime = \`Date : \${day}/\${month}/\${year} \${String(displayHours).padStart(2, '0')}:\${minutes}:\${seconds} \${ampm}\`;
    
    // Prepare worksheet data
    const worksheetData = [];
    
    // Add date/time (row 1)
    worksheetData.push([formattedDateTime]);
    
    // Add title (row 2)
    worksheetData.push(["${pageTitle}"]);
    
    // Add search keyword if any
    if (searchKeyword.value && searchKeyword.value.trim() !== '') {
      worksheetData.push([\`Search: \${searchKeyword.value.trim()}\`]);
    }
    
    // Build smart filter options lookup for dropdown/radio/checkbox/listbox filter fields
    const smartFilterOptionsLookup = {};
    ${(() => {
      // Build smart filter options lookup from component items
      const smartFilterOptionsEntries = [];
      if (smartFilterComponents.length > 0) {
        const smartFilterComponent = smartFilterComponents[0];
        const smartFilterItems = componentItems.filter((ci) => ci.componentId === smartFilterComponent.id);
        
        // Get dt_bi and dt_key for field mapping
        let fieldNameMap = {};
        if (datatableComponents.length > 0) {
          const dt = datatableComponents[0];
          const dtComponentData = dt.componentData ? JSON.parse(dt.componentData) : {};
          const keys = dtComponentData.dt_key || {};
          Object.entries(keys).forEach(([alias, key]) => {
            if (key && alias && key !== 'No' && key !== 'Action' && alias !== 'No' && alias !== 'Action') {
              fieldNameMap[key] = alias;
            }
          });
        }
        
        smartFilterItems.forEach((item) => {
          const isLookupType = item.type === "dropdown" || item.type === "radio" || item.type === "checkbox" || item.type === "listbox";
          if (isLookupType && item.lookup_queryMapping && item.lookup_queryMapping.trim()) {
            // Use mapped field name (alias) if available, otherwise use item name
            let apiFieldName = item.name;
            for (const [key, alias] of Object.entries(fieldNameMap)) {
              const itemNameNorm = item.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
              const itemTitleNorm = (item.title || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
              const keyNorm = key.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
              const aliasNorm = alias.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
              
              if (keyNorm === itemNameNorm || aliasNorm === itemNameNorm ||
                  keyNorm === itemTitleNorm || aliasNorm === itemTitleNorm) {
                apiFieldName = alias;
                break;
              }
            }
            const fieldName = apiFieldName.replace(/[^a-zA-Z0-9]/g, "_");
            const filterKey = fieldName + "_filter";
            const originalFieldName = item.name.replace(/[^a-zA-Z0-9]/g, "_");
            const optionsVarName = originalFieldName + "Options";
            smartFilterOptionsEntries.push({ filterKey, optionsVarName });
          }
        });
      }
      
      if (smartFilterOptionsEntries.length === 0) return '';
      return smartFilterOptionsEntries.map(({ filterKey, optionsVarName }) => {
        return `if (typeof ${optionsVarName} !== 'undefined') smartFilterOptionsLookup[${JSON.stringify(filterKey)}] = ${optionsVarName}.value;`;
      }).join('\n    ');
    })()}
    
    // Build top filter options lookup for dropdown/radio/checkbox/listbox filter fields
    const topFilterOptionsLookup = {};
    ${(() => {
      // Build top filter options lookup from component items
      const topFilterOptionsEntries = [];
      
      // Check TopFilter component first, then SmartFilter as fallback for top filter type
      let topFilterComponent = topFilterComponents.length > 0 ? topFilterComponents[0] : null;
      if (!topFilterComponent && smartFilterComponents.length > 0) {
        if (datatableComponents.length > 0) {
          const dt = datatableComponents[0];
          const dtComponentData = dt.componentData ? JSON.parse(dt.componentData) : {};
          if (dtComponentData.dt_filter === "top" || dtComponentData.dt_filter === "Top") {
            topFilterComponent = smartFilterComponents[0];
          }
        }
      }
      
      if (topFilterComponent) {
        const topFilterItems = componentItems.filter((ci) => ci.componentId === topFilterComponent.id);
        
        topFilterItems.forEach((item) => {
          const isLookupType = item.type === "dropdown" || item.type === "radio" || item.type === "checkbox" || item.type === "listbox";
          if (isLookupType && item.lookup_queryMapping && item.lookup_queryMapping.trim()) {
            const fieldName = item.name.replace(/[^a-zA-Z0-9]/g, "_");
            const optionsVarName = fieldName + "Options";
            topFilterOptionsEntries.push({ fieldName, optionsVarName });
          }
        });
      }
      
      if (topFilterOptionsEntries.length === 0) return '';
      return topFilterOptionsEntries.map(({ fieldName, optionsVarName }) => {
        return `if (typeof ${optionsVarName} !== 'undefined') topFilterOptionsLookup[${JSON.stringify(fieldName)}] = ${optionsVarName}.value;`;
      }).join('\n    ');
    })()}
    
    // Add top filter values if any
    const activeTopFilters = [];
    Object.keys(topFilter.value).forEach((key) => {
      if (topFilter.value[key] && String(topFilter.value[key]).trim() !== '') {
        // Use topFilterLabels for proper display label, fallback to key
        const displayLabel = (typeof topFilterLabels !== 'undefined' && topFilterLabels[key]) ? topFilterLabels[key] : key;
        // For dropdown/radio/checkbox/listbox fields, convert value to label using options
        let displayValue = String(topFilter.value[key]).trim();
        if (topFilterOptionsLookup[key]) {
          displayValue = getLookupLabel(topFilterOptionsLookup[key], displayValue);
        }
        activeTopFilters.push(\`\${displayLabel}: \${displayValue}\`);
      }
    });
    
    if (activeTopFilters.length > 0) {
      activeTopFilters.forEach(filter => {
        worksheetData.push([filter]);
      });
    }
    
    // Add smart filter values if any
    const activeFilters = [];
    Object.keys(smartFilter.value).forEach((key) => {
      if (smartFilter.value[key] && String(smartFilter.value[key]).trim() !== '') {
        // Use smartFilterLabels for proper display label, fallback to fieldName
        const displayLabel = (typeof smartFilterLabels !== 'undefined' && smartFilterLabels[key]) ? smartFilterLabels[key] : key.replace(/_filter$/, "");
        // For dropdown/radio/checkbox/listbox fields, convert value to label using options
        let displayValue = String(smartFilter.value[key]).trim();
        if (smartFilterOptionsLookup[key]) {
          displayValue = getLookupLabel(smartFilterOptionsLookup[key], displayValue);
        }
        activeFilters.push(\`\${displayLabel}: \${displayValue}\`);
      }
    });
    
    if (activeFilters.length > 0) {
      activeFilters.forEach(filter => {
        worksheetData.push([filter]);
      });
    }
    
    // Add blank row for spacing
    if ((searchKeyword.value && searchKeyword.value.trim() !== '') || activeTopFilters.length > 0 || activeFilters.length > 0) {
      worksheetData.push([]);
    }
    
    // Add headers
    const exportColumns = ${JSON.stringify(columns)};
    const columnToOptionsMap = ${JSON.stringify(columnToOptionsMap)};
    const columnDateTypeMap = ${JSON.stringify(columnDateTypeMap)};
    worksheetData.push(['No.', ...exportColumns]);
    
    // Build options lookup object for dropdown/radio/checkbox/listbox columns
    const columnOptionsLookup = {};
    ${(() => {
      if (Object.keys(columnToOptionsMap).length === 0) return '';
      return Object.entries(columnToOptionsMap).map(([colName, varName]) => {
        return `columnOptionsLookup[${JSON.stringify(colName)}] = ${varName}.value;`;
      }).join('\n    ');
    })()}
    
    // Calculate header row index (0-based)
    let headerRowIndex = 2; // Start after date/time (0) and title (1), so headers are at index 2
    if (searchKeyword.value && searchKeyword.value.trim() !== '') {
      headerRowIndex++; // Add search row
    }
    headerRowIndex += activeTopFilters.length; // Add top filter rows
    headerRowIndex += activeFilters.length; // Add smart filter rows
    if ((searchKeyword.value && searchKeyword.value.trim() !== '') || activeTopFilters.length > 0 || activeFilters.length > 0) {
      headerRowIndex++; // Add blank row
    }
    
    // Add data rows
    dataToExport.forEach((item, index) => {
      const row = [(index + 1).toString()];
      exportColumns.forEach((col) => {
        // Check if this column has a lookup (dropdown/radio/checkbox/listbox)
        const options = columnOptionsLookup[col];
        // Check if this column is a date/datetime column
        const dateType = columnDateTypeMap[col];
        
        if (options) {
          // Use getLookupLabel to convert value to label
          const label = getLookupLabel(options, item[col]);
          row.push(label || '');
        } else if (dateType === 'datetime') {
          // Format as datetime: DD/MM/YYYY HH:MI:SS AM/PM
          row.push(formatDateTime(item[col]));
        } else if (dateType === 'date') {
          // Format as date: DD/MM/YYYY
          row.push(formatDate(item[col]));
        } else {
          row.push(item[col] || '');
        }
      });
      worksheetData.push(row);
    });
    
    // Create workbook and worksheet using ExcelJS
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("${pageTitle}");
    
    // Add all rows to worksheet
    worksheetData.forEach((row, rowIndex) => {
      const worksheetRow = worksheet.addRow(row);
      
      // Style header row with light grey background and bold text
      if (rowIndex === headerRowIndex) {
        worksheetRow.eachCell({ includeEmpty: false }, (cell, colNumber) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFD3D3D3' } // Light grey background
          };
          cell.font = {
            bold: true
          };
          // Center align for No. column (colNumber 1)
          if (colNumber === 1) {
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
          } else {
            cell.alignment = { horizontal: 'left', vertical: 'middle' };
          }
        });
      }
    });
    
    // Set column widths
    worksheet.getColumn(1).width = 8;  // No.
    exportColumns.forEach((col, index) => {
      worksheet.getColumn(index + 2).width = 20; // Data columns
    });
    
    // Generate Excel file and download
    const fileName = \`${pageTitle.replace(/\s+/g, '_')}_\${new Date().toISOString().split('T')[0]}.xlsx\`;
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object
    URL.revokeObjectURL(url);
    
    $swal.fire({
      title: "Success",
      text: "Excel file downloaded successfully",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error("Error generating Excel:", error);
    
    // Check if exceljs is not installed
    if (error.message && (error.message.includes('exceljs') || error.message.includes('Cannot find module'))) {
      $swal.fire({
        title: "Package Required",
        text: "Please install exceljs package: npm install exceljs or yarn add exceljs",
        icon: "warning",
      });
    } else {
      $swal.fire({
        title: "Error",
        text: "Failed to generate Excel file. Please try again.",
        icon: "error",
      });
    }
  }
};
`;
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
  }
  return "";
})()}

// View function
const handleView = (item) => {
  isViewMode.value = true;
  isEditMode.value = false;
  editingId.value = item.id || Object.values(item)[0];
  ${pageName}Form.value = { ...item };
  ${(() => {
    // Find date/datetime fields from popup modal form items and generate mapping code
    // Build a list of original dt_bi aliases for matching
    const dtBiAliases = [];
    if (datatableComponents.length > 0) {
      const dt = datatableComponents[0];
      try {
        const dtComponentData = dt?.componentData ? (typeof dt.componentData === 'string' ? JSON.parse(dt.componentData) : dt.componentData) : {};
        const aliases = dtComponentData.dt_bi || [];
        aliases.forEach((alias) => {
          if (alias && alias !== 'No' && alias !== 'Action') {
            dtBiAliases.push(alias);
          }
        });
      } catch (e) {
        // Ignore parse errors
      }
    }
    
    // Helper function to normalize field names for comparison (remove all non-alphanumeric and lowercase)
    const normalizeForMatch = (name) => name ? name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() : '';
    
    const dateFieldMappings = [];
    if (popupModalComponents.length > 0) {
      const popupComponent = popupModalComponents[0];
      const formItems = componentItems.filter((ci) => ci && ci.componentId === popupComponent.id && ci.type);
      formItems.forEach((formItem) => {
        if (formItem && formItem.type && (formItem.type === 'date' || formItem.type === 'datetime')) {
          const formFieldName = formItem.name ? formItem.name.replace(/[^a-zA-Z0-9]/g, "_") : '';
          const normalizedFormName = normalizeForMatch(formItem.name);
          
          // Find matching alias from dt_bi by comparing normalized names
          let originalAlias = formItem.name || '';
          for (const alias of dtBiAliases) {
            if (normalizeForMatch(alias) === normalizedFormName) {
              originalAlias = alias;
              break;
            }
          }
          
          if (formFieldName && originalAlias) {
            dateFieldMappings.push({ formFieldName, originalAlias });
          }
        }
      });
    }
    
    if (dateFieldMappings.length === 0) {
      return '';
    }
    
    // Generate code to map date fields
    let code = `// Map date fields and format for date input
`;
    dateFieldMappings.forEach(({ formFieldName, originalAlias }) => {
      // Check for original alias (with spaces like "Entry Date"), underscore version, and sanitized form field name
      const nameWithSpaces = originalAlias;
      const nameWithUnderscores = originalAlias.replace(/\s+/g, '_');
      code += `  if (item["${nameWithSpaces}"] !== undefined) {
    ${pageName}Form.value.${formFieldName} = formatDateForInput(item["${nameWithSpaces}"]);
  } else if (item["${nameWithUnderscores}"] !== undefined) {
    ${pageName}Form.value.${formFieldName} = formatDateForInput(item["${nameWithUnderscores}"]);
  } else if (item.${formFieldName} !== undefined) {
    ${pageName}Form.value.${formFieldName} = formatDateForInput(item.${formFieldName});
  }
`;
    });
    return code;
  })()}
  show${pageName.charAt(0).toUpperCase() + pageName.slice(1)}Modal.value = true;
};

// Edit function
const handleEdit = (item) => {
  isEditMode.value = true;
  isViewMode.value = false;
  editingId.value = item.id || Object.values(item)[0];
  // Copy only the aliased fields (form fields) to avoid sending stale original field values
  // This prevents original database fields (like lde_value) from overwriting edited alias values (like Code)
  // The PUT endpoint processes original fields LAST, so they would overwrite alias values if both are present
  ${(() => {
    // Build list of form field names (aliases) that should be copied
    const formFieldNames = new Set(['id']); // Always include id
    
    // Build a list of original dt_bi aliases for matching
    const dtBiAliases = [];
    
    // Get aliases from dt_bi (these are what the form actually uses)
    if (datatableComponents.length > 0) {
      const dt = datatableComponents[0];
      try {
        const componentData = dt?.componentData ? (typeof dt.componentData === 'string' ? JSON.parse(dt.componentData) : dt.componentData) : {};
        if (componentData && componentData.dt_bi && Array.isArray(componentData.dt_bi)) {
          componentData.dt_bi.forEach((alias) => {
            if (alias && alias !== 'No' && alias !== 'Action') {
              const fieldName = alias.replace(/[^a-zA-Z0-9]/g, "_");
              if (fieldName) {
                formFieldNames.add(fieldName);
              }
              dtBiAliases.push(alias);
            }
          });
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
    
    // Helper function to normalize field names for comparison (remove all non-alphanumeric and lowercase)
    const normalizeForMatch = (name) => name ? name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() : '';
    
    // Also get form field names from popup modal component items (in case they use different names)
    // Also collect date field mappings
    const dateFieldMappings = [];
    if (popupModalComponents.length > 0) {
      const popupComponent = popupModalComponents[0];
      const formItems = componentItems.filter((ci) => ci && ci.componentId === popupComponent.id && ci.type);
      formItems.forEach((formItem) => {
        if (formItem && formItem.name) {
          const fieldName = formItem.name.replace(/[^a-zA-Z0-9]/g, "_");
          if (fieldName) {
            formFieldNames.add(fieldName);
          }
          // Check if this is a date/datetime field
          if (formItem.type && (formItem.type === 'date' || formItem.type === 'datetime')) {
            const normalizedFormName = normalizeForMatch(formItem.name);
            
            // Find matching alias from dt_bi by comparing normalized names
            let originalAlias = formItem.name;
            for (const alias of dtBiAliases) {
              if (normalizeForMatch(alias) === normalizedFormName) {
                originalAlias = alias;
                break;
              }
            }
            dateFieldMappings.push({ formFieldName: fieldName, originalAlias });
          }
        }
      });
    }
    
    const fieldNamesArray = Array.from(formFieldNames);
    let code = `// Only copy aliased fields (form fields) - exclude original database fields to prevent stale values
  const formFields = ${JSON.stringify(fieldNamesArray)};
  ${pageName}Form.value = {};
  formFields.forEach((fieldName) => {
    if (item[fieldName] !== undefined) {
      ${pageName}Form.value[fieldName] = item[fieldName];
    }
  });`;
    
    // Add date field mapping code
    if (dateFieldMappings.length > 0) {
      code += `
  // Map date fields and format for date input`;
      dateFieldMappings.forEach(({ formFieldName, originalAlias }) => {
        const nameWithSpaces = originalAlias;
        const nameWithUnderscores = originalAlias.replace(/\s+/g, '_');
        code += `
  if (item["${nameWithSpaces}"] !== undefined) {
    ${pageName}Form.value.${formFieldName} = formatDateForInput(item["${nameWithSpaces}"]);
  } else if (item["${nameWithUnderscores}"] !== undefined) {
    ${pageName}Form.value.${formFieldName} = formatDateForInput(item["${nameWithUnderscores}"]);
  } else if (item.${formFieldName} !== undefined) {
    ${pageName}Form.value.${formFieldName} = formatDateForInput(item.${formFieldName});
  }`;
      });
    }
    
    return code;
  })()}
  show${pageName.charAt(0).toUpperCase() + pageName.slice(1)}Modal.value = true;
};

// Add function
const handleAdd = () => {
  isEditMode.value = false;
  isViewMode.value = false;
  editingId.value = null;
  ${pageName}Form.value = {};
  ${(() => {
    // Helper function to check if a date/datetime field is an audit field
    const isAuditDateField = (fieldName, fieldType) => {
      if (!fieldType || (fieldType !== 'date' && fieldType !== 'datetime')) {
        return false;
      }
      const normalizedName = fieldName ? fieldName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() : '';
      const auditPatterns = ['createddate', 'updateddate', 'createdat', 'updatedat', 'datecreated', 'dateupdated', 'entrydate', 'modifieddate', 'datemodified'];
      return auditPatterns.some(pattern => normalizedName.includes(pattern) || normalizedName === pattern);
    };
    
    // Find audit date fields and fields with special default values from popup modal form items
    const auditDateFields = [];
    const currentYearFields = [];
    const currentDateFields = [];
    const currentDateTimeFields = [];
    
    if (popupModalComponents.length > 0) {
      const popupComponent = popupModalComponents[0];
      const formItems = componentItems.filter((ci) => ci && ci.componentId === popupComponent.id && ci.type);
      formItems.forEach((formItem) => {
        const formFieldName = formItem.name ? formItem.name.replace(/[^a-zA-Z0-9]/g, "_") : '';
        if (!formFieldName) return;
        
        // Check for special default values
        const defaultVal = (formItem.defaultValue || '').trim().toLowerCase();
        if (defaultVal === 'currentyear') {
          currentYearFields.push(formFieldName);
        } else if (defaultVal === 'currentdate') {
          currentDateFields.push(formFieldName);
        } else if (defaultVal === 'currentdatetime') {
          currentDateTimeFields.push(formFieldName);
        }
        
        // Check for audit date fields (existing logic)
        if (formItem && formItem.type && isAuditDateField(formItem.name, formItem.type)) {
          auditDateFields.push({ formFieldName, fieldType: formItem.type });
        }
      });
    }
    
    let code = '';
    
    // Generate code for currentYear default values
    if (currentYearFields.length > 0) {
      code += `// Set default current year for fields with defaultValue='currentYear'
  const currentYear = new Date().getFullYear();
`;
      currentYearFields.forEach((fieldName) => {
        code += `  ${pageName}Form.value.${fieldName} = currentYear;
`;
      });
    }
    
    // Generate code for currentDate default values
    if (currentDateFields.length > 0) {
      code += `// Set default current date for fields with defaultValue='currentDate'
`;
      currentDateFields.forEach((fieldName) => {
        code += `  ${pageName}Form.value.${fieldName} = formatDateForInput(new Date());
`;
      });
    }
    
    // Generate code for currentDateTime default values
    if (currentDateTimeFields.length > 0) {
      code += `// Set default current datetime for fields with defaultValue='currentDateTime'
`;
      currentDateTimeFields.forEach((fieldName) => {
        code += `  ${pageName}Form.value.${fieldName} = new Date().toISOString().slice(0, 16);
`;
      });
    }
    
    // Generate code for audit date fields (existing logic)
    if (auditDateFields.length > 0) {
      code += `// Set default current date/datetime for audit date fields
`;
      auditDateFields.forEach(({ formFieldName, fieldType }) => {
        code += `  ${pageName}Form.value.${formFieldName} = formatDateForInput(new Date());
`;
      });
    }
    
    return code;
  })()}
  show${pageName.charAt(0).toUpperCase() + pageName.slice(1)}Modal.value = true;
};

// Delete function
const handleDelete = async (item) => {
  const result = await $swal.fire({
    title: "Are you sure?",
    text: \`Do you want to delete this record?\`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    try {
      loading.value = true;
      const apiPath = "${(() => {
        const dt = datatableComponents[0];
        if (dt?.componentData) {
          const compData = JSON.parse(dt.componentData);
          if (compData.dt_ajax) {
            return compData.dt_ajax.startsWith('/') ? compData.dt_ajax : '/' + compData.dt_ajax;
          }
        }
        // Fallback to computed path
        return "${fallbackApiPath}";
      })()}";
      const response = await useFetch(\`\${apiPath}/\${item.id || Object.values(item)[0]}\`, {
        method: "DELETE",
        initialCache: false,
      });

      if (response.data.value?.statusCode === 200) {
        $swal.fire({
          title: "Deleted!",
          text: "Record has been deleted.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        
        // Refresh data from API
        await fetchData();
      } else {
        $swal.fire({
          title: "Error",
          text: response.data.value?.message || "Failed to delete record",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      $swal.fire({
        title: "Error",
        text: "An error occurred while deleting record",
        icon: "error",
      });
    } finally {
      loading.value = false;
    }
  }
};

// Save function
const handleSave${pageName.charAt(0).toUpperCase() + pageName.slice(1)} = async () => {
  try {
    loading.value = true;
    const apiPath = "${(() => {
      const dt = datatableComponents[0];
      if (dt?.componentData) {
        const compData = JSON.parse(dt.componentData);
        if (compData.dt_ajax) {
          return compData.dt_ajax.startsWith('/') ? compData.dt_ajax : '/' + compData.dt_ajax;
        }
      }
      // Fallback to computed path
      return "${fallbackApiPath}";
    })()}";
    let response;

    if (isEditMode.value && editingId.value) {
      // Update existing record
      response = await useFetch(\`\${apiPath}/\${editingId.value}\`, {
        method: "PUT",
        body: ${pageName}Form.value,
        initialCache: false,
      });
    } else {
      // Add new record
      response = await useFetch(apiPath, {
        method: "POST",
        body: ${pageName}Form.value,
        initialCache: false,
      });
    }

    if (response.data.value?.statusCode === 200 || response.data.value?.statusCode === 201) {
      $swal.fire({
        title: "Success",
        text: isEditMode.value ? "Record updated successfully" : "Record created successfully",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      
      // Refresh data from API
      await fetchData();
      
      // Reset form and close modal
      show${pageName.charAt(0).toUpperCase() + pageName.slice(1)}Modal.value = false;
      ${pageName}Form.value = {};
    } else {
      $swal.fire({
        title: "Error",
        text: response.data.value?.message || "Failed to save record",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error saving record:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while saving record",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Cancel form
const handleCancel${pageName.charAt(0).toUpperCase() + pageName.slice(1)} = () => {
  show${pageName.charAt(0).toUpperCase() + pageName.slice(1)}Modal.value = false;
  isViewMode.value = false;
  ${pageName}Form.value = {};
};

${(() => {
  // Generate button click handlers for Button components
  let buttonHandlers = "";
  const buttonComponentItems = buttonComponents.flatMap(comp => 
    componentItems.filter(ci => ci.componentId === comp.id)
  );
  
  // Get unique button handlers (by name)
  const uniqueHandlers = new Set();
  buttonComponentItems.forEach(item => {
    let handlerName = item.name || item.title || "handleButtonClick";
    handlerName = handlerName.replace(/[^a-zA-Z0-9_]/g, "_");
    
    if (!uniqueHandlers.has(handlerName)) {
      uniqueHandlers.add(handlerName);
      
      // Parse additionalAttribute for custom handler code
      let handlerCode = "// Button click handler";
      if (item.additionalAttribute) {
        try {
          const parsed = typeof item.additionalAttribute === "string" 
            ? JSON.parse(item.additionalAttribute) 
            : item.additionalAttribute;
          if (parsed?.handlerCode) {
            handlerCode = parsed.handlerCode;
          } else if (typeof parsed === "string" && parsed.trim() !== "") {
            handlerCode = parsed;
          }
        } catch (error) {
          // If parsing fails, use additionalAttribute as-is if it looks like code
          if (item.additionalAttribute.includes("(") || item.additionalAttribute.includes("=>")) {
            handlerCode = item.additionalAttribute;
          }
        }
      }
      
      buttonHandlers += `// Button handler: ${item.title || item.name}
const ${handlerName} = () => {
  ${handlerCode}
};

`;
    }
  });
  
  return buttonHandlers;
})()}

// Initialize on mount
onMounted(() => {
${hasSqlBasedDropdowns ? "  fetchDropdownOptions();\n  " : ""}fetchData();
});
</script>`;

  return {
    scriptSection: script,
    dropdownOptionsMap,
  };
}

function generateTemplateSection(page, components, componentItems, dropdownOptionsMap = {}, pageId = null) {
  // Sort components by order
  const sortedComponents = [...components].sort((a, b) => (a.order || 0) - (b.order || 0));

  let template = `<template>
  <div class="space-y-6">
    <LayoutsBreadcrumb />`;

  // Generate Top Filter if exists
  // If no form_TopFilter component, fall back to using form_SmartFilter component items for top filter
  const topFilterComponent = sortedComponents.find((c) => c.type === "form_TopFilter");
  const smartFilterComponentForTop = sortedComponents.find((c) => c.type === "form_SmartFilter");
  const datatableForFilter = sortedComponents.find((c) => c.type === "datatable");
  const filterTypeForTop = datatableForFilter?.componentData 
    ? (JSON.parse(datatableForFilter.componentData).dt_filter || "none") 
    : "none";
  
  if (topFilterComponent) {
    // Use dedicated TopFilter component
    template += generateTopFilterSection(topFilterComponent, componentItems, dropdownOptionsMap);
  } else if (smartFilterComponentForTop && (filterTypeForTop === "top" || filterTypeForTop === "Top")) {
    // No TopFilter component defined, but filter type is "top" - use SmartFilter component items
    template += generateTopFilterSection(smartFilterComponentForTop, componentItems, dropdownOptionsMap);
  }

  // Generate Button components
  const buttonComponents = sortedComponents.filter((c) => c.type === "Button" || c.type === "button");
  buttonComponents.forEach((buttonComponent) => {
    template += generateButtonSection(buttonComponent, componentItems);
  });

  // Generate Smart Filter button and datatable
  const datatableComponent = sortedComponents.find((c) => c.type === "datatable");
  if (datatableComponent) {
    const componentData = datatableComponent.componentData
      ? JSON.parse(datatableComponent.componentData)
      : {};
    const filterType = componentData.dt_filter || "none";
    const pageName = page.pageTitle
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9]/g, "");
    
    // Parse queryMapping to get field mapping for slot names
    const queryMapping = datatableComponent.queryMapping || "";
    const tableInfo = parseQueryMapping(queryMapping);

    // Find popup modal component to get component items for lookup fields
    const popupModalComponent = sortedComponents.find((c) => c.type === "form_PopupModal");
    // Use popup modal component items if available, otherwise use all component items
    const itemsForLookup = popupModalComponent 
      ? componentItems.filter((ci) => ci.componentId === popupModalComponent.id)
      : componentItems;

      template += generateDatatableSection(datatableComponent, componentData, filterType, pageName, tableInfo, itemsForLookup, dropdownOptionsMap, pageId);
  }

  // Generate Smart Filter Modal
  const smartFilterComponent = sortedComponents.find((c) => c.type === "form_SmartFilter");
  if (smartFilterComponent && datatableComponent) {
    const componentData = datatableComponent.componentData
      ? JSON.parse(datatableComponent.componentData)
      : {};
    if (componentData.dt_filter === "smart" || componentData.dt_filter === "Smart") {
      // Parse queryMapping to get field mapping for Smart Filter
      const queryMapping = datatableComponent.queryMapping || "";
      const tableInfo = parseQueryMapping(queryMapping);
      template += generateSmartFilterModal(smartFilterComponent, componentItems, dropdownOptionsMap, componentData, tableInfo);
    }
  }

  // Generate Form Modal
  // Check if form_PopupModal component exists - use it if available, otherwise use datatable component
  const popupModalComponent = sortedComponents.find((c) => c.type === "form_PopupModal");
  if (datatableComponent) {
    const componentData = datatableComponent.componentData
      ? JSON.parse(datatableComponent.componentData)
      : {};
    if (
      componentData.dt_popup_add ||
      componentData.dt_popup_edit ||
      componentData.dt_popup_view
    ) {
      const pageName = page.pageTitle
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/[^a-z0-9]/g, "");
      // Use form_PopupModal component if it exists, otherwise use datatable component
      const componentToUse = popupModalComponent || datatableComponent;
      template += generateFormModal(componentToUse, componentItems, componentData, pageName, dropdownOptionsMap);
    }
  }

  template += `
  </div>
</template>

<style scoped>
/* Hide default table header since we're using custom header */
${datatableComponent ? (() => {
  const pageName = page.pageTitle
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9]/g, "");
  return `.${pageName}-table-wrapper :deep(.table-header) {
  display: none;
}

/* Left-align Action column header and cells */
.${pageName}-table-wrapper :deep(.rs-table thead th:last-child),
.${pageName}-table-wrapper :deep(.rs-table tbody td:last-child) {
  text-align: left !important;
}`;
})() : ''}
</style>

<style>
${datatableComponent ? (() => {
  const componentData = datatableComponent.componentData
    ? JSON.parse(datatableComponent.componentData)
    : {};
  const pageTitle = datatableComponent.title || datatableComponent.name;
  const pageName = page.pageTitle
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9]/g, "");
  return `/* Custom width for ${pageTitle} modal - 75% of lg size (800px * 0.75 = 600px) */
.${pageName}-modal-custom {
  width: 600px !important;
}

/* Hide default close icon when custom header is used */
.${pageName}-modal-custom .modal-header > :last-child:not(.${pageName}-modal-header) {
  display: none !important;
}

/* Ensure custom header matches modal content width exactly */
.${pageName}-modal-custom .modal-header {
  padding: 0 !important;
  position: relative;
  overflow: hidden;
}

.${pageName}-modal-custom .${pageName}-modal-header {
  width: 100% !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  box-sizing: border-box;
}

/* Hide default close icon for Smart Filter modal */
.smart-filter-modal-custom .modal-header > :last-child:not(.smart-filter-modal-header) {
  display: none !important;
}

/* Ensure Smart Filter modal header matches ${pageTitle} modal styling */
.smart-filter-modal-custom .modal-header {
  padding: 0 !important;
  position: relative;
  overflow: hidden;
}

.smart-filter-modal-custom .smart-filter-modal-header {
  width: 100% !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  box-sizing: border-box;
}`;
})() : ''}
</style>`;

  return template;
}

function generateTopFilterSection(component, componentItems, dropdownOptionsMap = {}) {
  const items = componentItems.filter((ci) => ci.componentId === component.id);
  let section = `
    <!-- Top Filter -->
    <rs-card>
      <template #body>
        <div class="grid grid-cols-1 md:grid-cols-${Math.min(items.length + 1, 5)} gap-4">
`;

  items.forEach((item) => {
    // Sanitize field name to be a valid JavaScript identifier (replace special chars with underscore)
    const fieldName = item.name.replace(/[^a-zA-Z0-9]/g, "_");
    const lookupKey = findDropdownOptionsKey(dropdownOptionsMap, item.name) || fieldName;
    const hasLookup = (item.type === "dropdown" || item.type === "v-select") && item.lookup_queryMapping && dropdownOptionsMap[lookupKey];
    const optionsRef = hasLookup ? dropdownOptionsMap[lookupKey].optionsVarName : "[]";
    const formKitType = mapToFormKitType(item.type);
    
    // Skip items that should not be rendered as FormKit inputs (label, heading, divider, etc.)
    if (formKitType === null) {
      return;
    }
    
    const isSelectType = formKitType === "select";
    const isVSelectType = formKitType === "v-select";
    
    // Determine the filter input type based on field type
    // For filters, complex types (rich text editors, code editors, media) use text input
    const complexTypes = ["quill", "ckeditor", "tinymce", "summernote", "rich-text-editor", "codemirror", "ace", "html", "iframe", "link", "image", "video", "audio", "map", "dropzone", "dropzonemini", "mask", "textarea"];
    const filterInputType = complexTypes.includes(formKitType) ? "text" : formKitType;
    
    // Handle v-select (searchable dropdown) separately
    if (isVSelectType) {
      section += `          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">${(item.title || item.name).replace(/"/g, '&quot;')}</label>
            <v-select
              v-model="topFilter.${fieldName}"
              :options="${optionsRef}"
              :reduce="option => option.value"
              label="label"
              placeholder="Search ${item.title || item.name}..."
              :clearable="true"
              class="formkit-vselect"
            />
          </div>
`;
    } else if (isSelectType) {
      // For select fields, add empty option for reset
      section += `          <div>
            <FormKit
              v-model="topFilter.${fieldName}"
              type="${filterInputType}"
              label="${(item.title || item.name).replace(/"/g, '&quot;')}"
              :options="[{ label: '-- All --', value: '' }, ...${optionsRef}]"
              outer-class="mb-0"
            />
          </div>
`;
    } else {
      // Text/other field with clear button
      section += `          <div>
            <FormKit
              v-model="topFilter.${fieldName}"
              type="${filterInputType}"
              label="${(item.title || item.name).replace(/"/g, '&quot;')}"
              outer-class="mb-0"
            >
              <template #suffix>
                <button
                  v-if="topFilter.${fieldName}"
                  type="button"
                  @click="topFilter.${fieldName} = ''"
                  class="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  title="Clear"
                >
                  <Icon
                    name="material-symbols:close"
                    class="!w-4 !h-4 text-gray-500"
                  />
                </button>
              </template>
            </FormKit>
          </div>
`;
    }
  });

  section += `          <div class="flex flex-col justify-end">
            <label class="block text-sm font-medium text-transparent select-none">&nbsp;</label>
            <rs-button variant="primary" @click="fetchData" style="height: 40px;">
              <Icon name="material-symbols:search" class="mr-1" size="1rem" />
              Filter
            </rs-button>
          </div>
        </div>
      </template>
    </rs-card>
`;

  return section;
}

function generateButtonSection(component, componentItems) {
  const items = componentItems.filter((ci) => ci.componentId === component.id);
  
  if (items.length === 0) {
    return ""; // No buttons to generate
  }

  let section = `
    <!-- Button Component: ${component.title || component.name} -->
    <div class="flex flex-wrap gap-2 ${component.cssClass || ""}">
`;

  items.forEach((item) => {
    // Parse additionalAttribute for button properties (variant, size, etc.)
    let buttonProps = {};
    if (item.additionalAttribute) {
      try {
        const parsed = typeof item.additionalAttribute === "string" 
          ? JSON.parse(item.additionalAttribute) 
          : item.additionalAttribute;
        buttonProps = parsed || {};
      } catch (error) {
        // If parsing fails, try to extract common properties from string
        console.warn("Error parsing additionalAttribute for button:", error);
      }
    }

    const variant = buttonProps.variant || item.defaultValue || "primary";
    const size = buttonProps.size || "md";
    const icon = buttonProps.icon || item.cssClass || "";
    const clickHandler = buttonProps.clickHandler || item.name || "handleButtonClick";
    const buttonLabel = item.title || item.name || "Button";
    
    // Generate click handler name (sanitize for JavaScript)
    const handlerName = clickHandler.replace(/[^a-zA-Z0-9_]/g, "_");

    section += `      <rs-button 
        variant="${variant}" 
        size="${size}"
        @click="${handlerName}"
        ${item.visible === 0 || item.visible === false ? ':disabled="true"' : ''}
      >
        ${icon ? `<Icon name="${icon}" class="mr-1" size="1rem" />` : ""}
        ${buttonLabel}
      </rs-button>
`;
  });

  section += `    </div>
`;

  return section;
}

function generateDatatableSection(component, componentData, filterType, pageName, tableInfo = null, componentItems = [], dropdownOptionsMap = {}, pageId = null) {
  const columns = componentData.dt_bi || [];
  const keys = componentData.dt_key || [];
  const js = componentData.dt_js || [];
  const classes = componentData.dt_class || [];
  const freezeLeft = parseInt(componentData.dt_freeze_left || "0");
  const freezeRight = parseInt(componentData.dt_freeze_right || "0");
  const popupModal = {
    view: componentData.dt_popup_view || false,
    edit: componentData.dt_popup_edit || false,
    add: componentData.dt_popup_add || false,
    delete: componentData.dt_popup_delete || false,
  };

  // Find popup modal component to get component items for lookup fields
  // Check if form_PopupModal exists, otherwise use datatable component items
  let popupModalComponent = null;
  // This will be passed from generateTemplateSection, but for now we'll search componentItems
  // We'll match by checking if component item has lookup_queryMapping

  // Build field array for rs-table using column headers (aliases) from dt_bi
  // This ensures the field names match what the API returns (aliased fields)
  // Check if 'Action' already exists in dt_bi to avoid duplicate columns
  const hasActionColumn = columns.some(col => col && col.trim().toLowerCase() === 'action');
  const filteredColumns = columns.filter((col, idx) => {
    const key = keys[idx] || "";
    return col && col.trim() !== "" && !col.includes("<input") && key.toLowerCase() !== 'no';
  });
  // Only add 'Action' if not already defined by user in dt_bi
  const tableFields = hasActionColumn 
    ? ['no', ...filteredColumns].filter(f => f)
    : ['no', ...filteredColumns, 'Action'].filter(f => f);

  // Generate slot templates for rs-table
  // Use column headers (aliases) for slot names to match the field array and API response
  let slotTemplates = "";
  columns.forEach((col, index) => {
    if (col && col.trim() !== "" && !col.includes("<input")) {
      const key = keys[index] || "";
      const columnHeader = col.trim(); // This is the alias (e.g., "Code", "Description", "Status")
      const columnHeaderLower = columnHeader.toLowerCase();
      
      // Use column header (alias) for slot name, convert to camelCase (spaces removed)
      const slotName = columnHeader.replace(/\s+/g, "").replace(/[^a-zA-Z0-9]/g, "");
      // Use column header (alias) for data access - use bracket notation if it has spaces or special chars
      const isValidIdentifier = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(columnHeader);
      const dataField = isValidIdentifier ? columnHeader : `[${JSON.stringify(columnHeader)}]`;
      const jsCode = js[index] || "";
      
      // Skip generating generic slot for 'no' and 'Action' columns; Action is handled separately
      if (key.toLowerCase() !== 'no' && key.toLowerCase() !== 'action' && columnHeaderLower !== 'action') {
        // Check if this field has a lookup (dropdown/radio/checkbox/listbox)
        // Match by key (original field name) or columnHeader (alias) to component item name
        // Also check if component item title matches columnHeader
        // Use case-insensitive matching that ignores spaces, hyphens, and underscores
        const matchingItem = componentItems.find((ci) => {
          // Match by: original field name (key), alias (columnHeader), item name, or item title
          const nameMatches = fieldNamesMatch(ci.name, key) || 
                             fieldNamesMatch(ci.name, columnHeader) ||
                             fieldNamesMatch(ci.title, key) ||
                             fieldNamesMatch(ci.title, columnHeader);
          
          return nameMatches &&
                 (ci.type === "dropdown" || ci.type === "radio" || ci.type === "checkbox" || ci.type === "listbox") &&
                 ci.lookup_queryMapping && ci.lookup_queryMapping.trim();
        });
        
        if (matchingItem && matchingItem.lookup_queryMapping) {
          // This field has a lookup - display label instead of value
          const itemFieldName = matchingItem.name.replace(/[^a-zA-Z0-9]/g, "_");
          const lookupKey = findDropdownOptionsKey(dropdownOptionsMap, matchingItem.name) || itemFieldName;
          const lookupInfo = dropdownOptionsMap[lookupKey];
          
          if (lookupInfo) {
            const optionsVarName = lookupInfo.optionsVarName || `${itemFieldName}Options`;
            
            // Generate helper function call to get label
            slotTemplates += `              <template v-slot:${slotName}="data">
                {{ getLookupLabel(${optionsVarName}, data.value${dataField.startsWith('[') ? dataField : '.' + dataField}) }}
              </template>
`;
          } else {
            // Lookup info not found, fall back to value
            slotTemplates += `              <template v-slot:${slotName}="data">
                {{ data.value${dataField.startsWith('[') ? dataField : '.' + dataField} }}
              </template>
`;
          }
        } else if (jsCode && jsCode.trim() !== "") {
          // For jsCode, replace row.field with data.value["Field Name"] or data.value.field
          const jsCodeFixed = jsCode.replace(/row\.(\w+)/g, (match, field) => {
            // Find the original column header that matches this field
            const matchingCol = columns.find((col, idx) => {
              const colKey = keys[idx] || "";
              return colKey === field || colKey.replace(/[^a-zA-Z0-9]/g, "") === field.replace(/[^a-zA-Z0-9]/g, "");
            });
            if (matchingCol) {
              const isValidId = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(matchingCol.trim());
              return isValidId ? `data.value.${matchingCol.trim()}` : `data.value[${JSON.stringify(matchingCol.trim())}]`;
            }
            return `data.value.${field}`;
          });
          slotTemplates += `              <template v-slot:${slotName}="data">
                <span v-html="${jsCodeFixed.replace(/return\s+/g, "")}"></span>
              </template>
`;
        } else {
          // Check if this is a date/datetime column based on column header or key name
          const keyLower = key.toLowerCase();
          const isDateTimeColumn = 
            columnHeaderLower.includes('datetime') || 
            keyLower.includes('datetime') ||
            columnHeaderLower.includes('timestamp') || 
            keyLower.includes('timestamp') ||
            keyLower.includes('createdat') ||
            keyLower.includes('updatedat') ||
            keyLower.includes('modifiedat') ||
            keyLower.includes('deletedat');
          
          const isDateOnlyColumn = !isDateTimeColumn && (
            columnHeaderLower.includes('date') || 
            keyLower.includes('date') ||
            keyLower.includes('createddate') ||
            keyLower.includes('updateddate') ||
            keyLower.includes('modifieddate') ||
            keyLower.includes('entrydate') ||
            keyLower.includes('birthdate') ||
            keyLower.includes('startdate') ||
            keyLower.includes('enddate') ||
            keyLower.includes('effectivedate') ||
            keyLower.includes('expirydate') ||
            keyLower.includes('duedate')
          );
          
          // Also check if there's a matching component item with type "date" or "datetime"
          const dateMatchingItem = componentItems.find((ci) => {
            const nameMatches = fieldNamesMatch(ci.name, key) || 
                               fieldNamesMatch(ci.name, columnHeader) ||
                               fieldNamesMatch(ci.title, key) ||
                               fieldNamesMatch(ci.title, columnHeader);
            return nameMatches && (ci.type === "date" || ci.type === "datetime");
          });
          
          const itemIsDateTime = dateMatchingItem?.type === "datetime";
          const itemIsDateOnly = dateMatchingItem?.type === "date";
          
          if (isDateTimeColumn || itemIsDateTime) {
            // DateTime column - format with time
            slotTemplates += `              <template v-slot:${slotName}="data">
                {{ formatDateTime(data.value${dataField.startsWith('[') ? dataField : '.' + dataField}) }}
              </template>
`;
          } else if (isDateOnlyColumn || itemIsDateOnly) {
            // Date only column - format without time
            slotTemplates += `              <template v-slot:${slotName}="data">
                {{ formatDate(data.value${dataField.startsWith('[') ? dataField : '.' + dataField}) }}
              </template>
`;
          } else {
            // Regular column - no formatting
            slotTemplates += `              <template v-slot:${slotName}="data">
                {{ data.value${dataField.startsWith('[') ? dataField : '.' + dataField} }}
              </template>
`;
          }
        }
      }
    }
  });

  // Generate action slot
  let actionSlot = "";
  if (popupModal.view || popupModal.edit || popupModal.delete) {
    actionSlot = `              <template v-slot:Action="data">
                <div class="flex gap-2 justify-start">
`;
    if (popupModal.view) {
      actionSlot += `                  <button
                    @click="handleView(data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="View"
                  >
                    <Icon
                      name="material-symbols:visibility"
                      class="text-gray-600 dark:text-gray-400"
                      size="20"
                    />
                  </button>
`;
    }
    if (popupModal.edit) {
      actionSlot += `                  <button
                    @click="handleEdit(data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Edit"
                  >
                    <Icon
                      name="material-symbols:edit"
                      class="text-gray-600 dark:text-gray-400"
                      size="20"
                    />
                  </button>
`;
    }
    if (popupModal.delete) {
      actionSlot += `                  <button
                    @click="handleDelete(data.value)"
                    class="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                    title="Delete"
                  >
                    <Icon
                      name="material-symbols:delete"
                      class="text-red-600 dark:text-red-400"
                      size="20"
                    />
                  </button>
`;
    }
    actionSlot += `                </div>
              </template>
`;
  }

  let section = `
    <!-- Datatable -->
    <rs-card>
      <template #header>
        <div class="flex justify-between items-center">
          <div class="text-lg font-semibold">${component.title || component.name}</div>
        </div>
      </template>
      <template #body>
        <div class="space-y-4">
          <!-- Custom Table Header: Display on left, Search on right -->
          <div class="flex justify-between items-center gap-4 mb-4">
            <!-- Display on Left -->
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300" for="${pageName}_pageSize">Display:</label>
              <FormKit
                id="${pageName}_pageSize"
                type="select"
                v-model="pageSize"
                :options="[
                  { label: '5', value: 5 },
                  { label: '10', value: 10 },
                  { label: '25', value: 25 },
                  { label: '50', value: 50 },
                  { label: '100', value: 100 },
                ]"
                outer-class="mb-0"
              />
            </div>

            <!-- Search on Right -->
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300" for="${pageName}_searchKeyword">Search:</label>
              <div class="flex gap-2">
                <FormKit
                  id="${pageName}_searchKeyword"
                  v-model="searchKeyword"
                  type="text"
                  placeholder="Search..."
                  outer-class="mb-0"
                >
                  <template #suffix>
                    <button
                      v-if="searchKeyword"
                      type="button"
                      @click="searchKeyword = ''"
                      class="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      <Icon
                        name="material-symbols:close"
                        class="!w-4 !h-4 text-gray-500"
                      />
                    </button>
                  </template>
                </FormKit>
                ${filterType === "smart" || filterType === "Smart" ? `<rs-button
                  :variant="hasActiveFilters ? 'danger' : 'secondary'"
                  class="!px-3"
                  style="height: 40px; min-height: 40px;"
                  @click="handleFilter"
                >
                  <Icon
                    name="ic:outline-filter-alt"
                    size="1rem"
                  />
                </rs-button>` : ''}
              </div>
            </div>
          </div>

          <!-- Table with built-in search and pagination -->
          <div class="${pageName}-table-wrapper">
            <div v-if="loading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
            <rs-table
              v-else
              :key="\`${pageName}-table-\${searchKeyword || 'all'}-\${pageSize}\`"
              :data="filtered${pageName.charAt(0).toUpperCase() + pageName.slice(1)}List"
              :field='${JSON.stringify(tableFields)}'
              :options="{
                variant: 'primary',
                striped: false,
                bordered: false,
                borderless: true,
              }"
              :optionsAdvanced="{
                sortable: true,
                filterable: false,
                responsive: false,
                outsideBorder: false,
              }"
              advanced
              :pageSize="pageSize"
            >
              <template v-slot:no="data">
                {{ data.value.no }}
              </template>
${slotTemplates}${actionSlot}
            </rs-table>
          </div>

          <!-- Custom Footer with Records Count and Buttons -->
          <div class="flex justify-between items-center pt-2">
            <div class="text-sm text-gray-600 dark:text-gray-400">
              {{ totalRecords }} records
            </div>
            <div class="flex items-center gap-2">
              ${(componentData.dt_download_pdf === true || componentData.dt_download_pdf === "true") ? `<rs-button variant="secondary" @click="handleDownloadPDF">
                <Icon name="material-symbols:picture-as-pdf" class="mr-2" size="1rem" />
                Download PDF
              </rs-button>` : ''}
              ${(componentData.dt_download_csv === true || componentData.dt_download_csv === "true") ? `<rs-button variant="secondary" @click="handleDownloadCSV">
                <Icon name="material-symbols:file-download" class="mr-2" size="1rem" />
                Download CSV
              </rs-button>` : ''}
              ${(componentData.dt_download_excel === true || componentData.dt_download_excel === "true") ? `<rs-button variant="secondary" @click="handleDownloadExcel">
                <Icon name="material-symbols:table-chart" class="mr-2" size="1rem" />
                Download Excel
              </rs-button>` : ''}
              ${popupModal.add ? `<rs-button variant="primary" @click="handleAdd">
                <Icon name="material-symbols:add" class="mr-2" size="1rem" />
                Add
              </rs-button>` : ''}
            </div>
          </div>
        </div>
      </template>
    </rs-card>
`;

  return section;
}

// Helper function to normalize field names for comparison (case-insensitive, ignore spaces, hyphens, underscores)
function normalizeFieldName(name) {
  if (!name) return "";
  return String(name)
    .toLowerCase()
    .replace(/[\s\-_]/g, "") // Remove spaces, hyphens, and underscores
    .trim();
}

// Helper function to check if two field names match (case-insensitive, ignoring spaces, hyphens, underscores)
function fieldNamesMatch(name1, name2) {
  if (!name1 || !name2) return false;
  return normalizeFieldName(name1) === normalizeFieldName(name2);
}

// Helper function to find matching key in dropdownOptionsMap using normalized matching
function findDropdownOptionsKey(dropdownOptionsMap, fieldName) {
  if (!fieldName || !dropdownOptionsMap) return null;
  // First try direct lookup with normalized key
  const normalizedKey = fieldName.replace(/[^a-zA-Z0-9]/g, "_");
  if (dropdownOptionsMap[normalizedKey]) {
    return normalizedKey;
  }
  // Try to find by normalized matching
  for (const key in dropdownOptionsMap) {
    if (fieldNamesMatch(key, fieldName)) {
      return key;
    }
  }
  return null;
}

// Helper function to map component item types to FormKit types
// Returns null for types that should not be rendered as FormKit inputs (e.g., label)
// Returns "v-select" for searchable dropdown fields
function mapToFormKitType(componentType) {
  const typeMap = {
    // Basic input types (id 1, 22)
    "textfield": "text",
    "text": "text",
    "password": "password",
    
    // Selection types (id 2, 3, 5, 21, 24)
    "radio": "radio",
    "checkbox": "checkbox",
    "dropdown": "select",
    "select": "select",
    "listbox": "select",
    "v-select": "v-select",
    
    // Date/Time types (id 4)
    "date": "date",
    "datepicker": "date",
    "datetime": "datetime-local",
    "time": "time",
    
    // Text area (id 6)
    "textarea": "textarea",
    
    // File upload types (id 7, 17, 18, 19)
    "fileupload": "file",
    "file": "file",
    "dropzone": "dropzone",
    "dropzonemini": "dropzonemini",
    
    // Rich text editors (id 26, 27, 28, 29, 30)
    "rich text editor": "rich-text-editor",
    "quill": "quill",
    "ckeditor": "ckeditor",
    "tinymce": "tinymce",
    "summernote": "summernote",
    
    // Code editors (id 31, 32)
    "codemirror": "codemirror",
    "ace": "ace",
    
    // Masked input (id 25)
    "mask": "mask",
    
    // Other input types
    "number": "number",
    "email": "email",
    "url": "url",
    "tel": "tel",
    "phone": "tel",
    "hidden": "hidden",
    "color": "color",
    "range": "range",
    "search": "search",
    
    // Display/Media types - render as special components (id 8, 9, 11, 12, 13, 14, 15)
    "html": "html",
    "iframe": "iframe",
    "link": "link",
    "image": "image",
    "video": "video",
    "audio": "audio",
    "map": "map",
    
    // Types to skip in form rendering (id 10, 20, 23)
    "label": null,
    "heading": null,
    "divider": null,
    "spacer": null,
    "button": null,
    
    // Custom type (id 16) - render as text by default
    "custom": "text",
  };
  
  // Return null if type should be skipped, otherwise return mapped type or default to "text"
  if (componentType && typeMap.hasOwnProperty(componentType)) {
    return typeMap[componentType];
  }
  return componentType || "text";
}

// Helper function to parse dropdown lookup query SQL to extract label and value fields
function parseLookupQueryFields(lookupQuery) {
  // Remove DISTINCT if present (we'll handle it but don't need it for field extraction)
  const cleanedQuery = lookupQuery.replace(/SELECT\s+DISTINCT\s+/i, "SELECT ");
  
  // Extract SELECT clause
  const selectMatch = cleanedQuery.match(/SELECT\s+(.+?)\s+FROM/i);
  if (!selectMatch) {
    return null;
  }
  
  const selectClause = selectMatch[1];
  const fields = selectClause.split(",").map(f => f.trim());
  
  if (fields.length === 0) {
    return null;
  }
  
  // Parse a single field to extract field name and alias
  const parseField = (fieldStr) => {
    // Remove table prefixes and backticks for processing
    let processedField = fieldStr.replace(/^\w+\./, "").replace(/`/g, "").trim();
    
    // Check for AS alias: "field AS alias" or "table.field AS alias"
    const asAliasMatch = processedField.match(/(.+?)\s+AS\s+(\w+)/i);
    if (asAliasMatch) {
      const originalField = asAliasMatch[1].trim();
      const alias = asAliasMatch[2];
      // Extract field name (first word or identifier, handle underscores)
      const fieldNameMatch = originalField.match(/^([\w_]+)/);
      const fieldName = fieldNameMatch ? fieldNameMatch[1] : originalField;
      return { fieldName, alias };
    }
    
    // Check for space-separated alias: "field alias" (exactly 2 words, no parentheses, no commas)
    // Examples: "description code", "bam_status_cd flc_id"
    if (!processedField.includes('(') && !processedField.includes(')') && !processedField.includes(',')) {
      const words = processedField.split(/\s+/).filter(w => w.trim() !== '');
      
      // If exactly 2 words, treat as "field alias"
      // This handles: "description code", "bam_status_cd flc_id"
      if (words.length === 2) {
        const fieldName = words[0];
        const alias = words[1];
        // Validate both are valid identifiers (alphanumeric + underscores)
        if (/^[\w_]+$/.test(fieldName) && /^[\w_]+$/.test(alias)) {
          return { fieldName, alias };
        }
      }
      
      // If more than 2 words, check if last word could be an alias
      // (This handles cases like "some long field name alias")
      if (words.length > 2) {
        const lastWord = words[words.length - 1];
        // Check if the last word looks like an alias (simple identifier)
        if (/^[\w_]+$/.test(lastWord)) {
          // Use first word as field name (or first few words if they form a valid field name)
          const fieldName = words[0];
          const alias = lastWord;
          return { fieldName, alias };
        }
      }
    }
    
    // No alias found - field name is used as both field and alias
    // Extract field name (handle underscores, e.g., "bam_status_cd")
    const fieldNameMatch = processedField.match(/^([\w_]+)/);
    const fieldName = fieldNameMatch ? fieldNameMatch[1] : processedField;
    return { fieldName, alias: fieldName };
  };
  
  // Parse all fields and check for explicit label/value aliases
  const parsedFields = fields.map(f => parseField(f));
  
  // Check if any field has explicit 'label' or 'value' alias
  const labelField = parsedFields.find(p => p.alias.toLowerCase() === 'label');
  const valueField = parsedFields.find(p => p.alias.toLowerCase() === 'value');
  
  // If explicit aliases found, use them
  if (labelField && valueField) {
    return {
      labelField: labelField.fieldName,
      labelAlias: labelField.alias,
      valueField: valueField.fieldName,
      valueAlias: valueField.alias,
    };
  }
  
  // Otherwise use convention: first column = value (code), second column = label (description)
  // This matches v-select convention where value is sent to API for filtering
  const firstParsed = parsedFields[0];
  const secondParsed = parsedFields.length > 1 ? parsedFields[1] : firstParsed;
  
  return {
    valueField: firstParsed.fieldName,
    valueAlias: firstParsed.alias,
    labelField: secondParsed.fieldName,
    labelAlias: secondParsed.alias,
  };
}

function generateSmartFilterModal(component, componentItems, dropdownOptionsMap = {}, componentData = {}, tableInfo = null) {
  const items = componentItems.filter((ci) => ci.componentId === component.id);
  
  // Build field name mapping: component item name -> API response field name (alias)
  // Use dt_bi (aliases) and dt_key (original field names) from componentData
  const fieldNameMap = {};
  if (componentData.dt_bi && componentData.dt_key) {
    const aliases = componentData.dt_bi || [];
    const keys = componentData.dt_key || [];
    keys.forEach((key, index) => {
      const alias = aliases[index];
      if (key && alias && key !== 'No' && key !== 'Action' && alias !== 'No' && alias !== 'Action') {
        fieldNameMap[key] = alias;
      }
    });
  }
  
  // Also use fieldMapping from queryMapping (aliases from SQL)
  if (tableInfo && tableInfo.fieldMapping) {
    Object.entries(tableInfo.fieldMapping).forEach(([alias, originalField]) => {
      fieldNameMap[originalField] = alias;
    });
  }
  
  let modal = `
    <!-- Smart Filter Modal -->
    <rs-modal
      v-model="showSmartFilter"
      title="Smart Filter"
      size="md"
      dialog-class="smart-filter-modal-custom"
      :overlay-close="true"
      :hide-footer="false"
      position="center"
    >
      <template #header>
        <div class="flex items-center justify-between w-full bg-primary text-white px-3 py-2 rounded-t-lg smart-filter-modal-header">
          <h4 class="text-base font-semibold text-white">Smart Filter</h4>
          <Icon
            @click="handleFilterClose"
            class="hover:text-gray-200 cursor-pointer text-white"
            name="ic:round-close"
            size="18"
          />
        </div>
      </template>
      <template #body>
        <FormKit type="form" :actions="false">
          <div class="space-y-4">
`;

  items.forEach((item) => {
    // Use mapped field name (alias) if available, otherwise use item name
    // Match using case-insensitive comparison that ignores spaces, hyphens, and underscores
    let apiFieldName = item.name;
    for (const [key, alias] of Object.entries(fieldNameMap)) {
      if (fieldNamesMatch(key, item.name) || fieldNamesMatch(alias, item.name) || 
          fieldNamesMatch(key, item.title) || fieldNamesMatch(alias, item.title)) {
        apiFieldName = alias;
        break;
      }
    }
    const originalFieldName = item.name.replace(/[^a-zA-Z0-9]/g, "_");
    const fieldName = apiFieldName.replace(/[^a-zA-Z0-9]/g, "_");
    
    const lookupKey = findDropdownOptionsKey(dropdownOptionsMap, item.name) || originalFieldName;
    const hasLookup = (item.type === "dropdown" || item.type === "v-select") && item.lookup_queryMapping && dropdownOptionsMap[lookupKey];
    const optionsRef = hasLookup ? dropdownOptionsMap[lookupKey].optionsVarName : "[]";
    const formKitType = mapToFormKitType(item.type);
    
    // Skip items that should not be rendered as FormKit inputs (label, heading, divider, etc.)
    if (formKitType === null) {
      return;
    }
    
    const isSelectType = formKitType === "select";
    const isVSelectType = formKitType === "v-select";
    
    const fieldId = 'smartFilter_' + fieldName;
    
    // Determine the filter input type based on field type
    // For filters, complex types (rich text editors, code editors, media) use text input
    const complexTypes = ["quill", "ckeditor", "tinymce", "summernote", "rich-text-editor", "codemirror", "ace", "html", "iframe", "link", "image", "video", "audio", "map", "dropzone", "dropzonemini", "mask"];
    const filterInputType = complexTypes.includes(formKitType) ? "text" : formKitType;
    
    // Handle v-select (searchable dropdown) separately
    if (isVSelectType) {
      modal += `            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium" for="${fieldId}">${item.title || item.name}:</label>
              <div class="flex-1">
                <v-select
                  v-model="smartFilter.${fieldName}_filter"
                  :options="${optionsRef}"
                  :reduce="option => option.value"
                  label="label"
                  placeholder="Search ${item.title || item.name}..."
                  :clearable="true"
                  class="formkit-vselect"
                />
              </div>
            </div>
`;
    } else if (filterInputType === "textarea") {
      // Textarea filter - use text input instead
      modal += `            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium" for="${fieldId}">${item.title || item.name}:</label>
              <div class="flex-1">
                <FormKit
                  id="${fieldId}"
                  v-model="smartFilter.${fieldName}_filter"
                  type="text"
                  placeholder="Enter ${item.title || item.name}"
                  outer-class="mb-0"
                />
              </div>
            </div>
`;
    } else {
      modal += `            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium" for="${fieldId}">${item.title || item.name}:</label>
              <div class="flex-1${isSelectType ? " relative" : ""}">
                <FormKit
                  id="${fieldId}"
                  v-model="smartFilter.${fieldName}_filter"
                  type="${filterInputType}"
                  ${isSelectType ? `:options="${optionsRef}"` : ""}
                  placeholder="${isSelectType ? `Select ${item.title || item.name}` : `Enter ${item.title || item.name}`}"
                  outer-class="mb-0"
                />
                ${item.type === "dropdown" || item.type === "select" ? `<button
                  v-if="smartFilter.${fieldName}_filter"
                  type="button"
                  @click="smartFilter.${fieldName}_filter = ''"
                  class="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <Icon
                    name="material-symbols:close"
                    class="!w-4 !h-4 text-gray-500"
                  />
                </button>` : ""}
              </div>
            </div>
`;
    }
  });

  modal += `          </div>
        </FormKit>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3">
          <rs-button variant="danger" @click="handleFilterReset">
            Reset
          </rs-button>
          <rs-button variant="primary" @click="handleFilterOk">
            Ok
          </rs-button>
        </div>
      </template>
    </rs-modal>
`;

  return modal;
}

function generateFormModal(component, componentItems, componentData, pageName, dropdownOptionsMap = {}) {
  const popupModal = {
    view: componentData.dt_popup_view || false,
    edit: componentData.dt_popup_edit || false,
    add: componentData.dt_popup_add || false,
  };

  // Get form fields from component items (preferred) or use dt_key fields
  const formItems = componentItems.filter((ci) => ci.componentId === component.id && ci.type);
  // Sort form items by order ascending (fallback to 0 if order is missing)
  formItems.sort((a, b) => {
    const orderA = a.order ?? 0;
    const orderB = b.order ?? 0;
    return Number(orderA) - Number(orderB);
  });
  const keys = componentData.dt_key || [];
  const fields = keys.filter((k) => k && k.trim() !== "" && k.toLowerCase() !== 'no' && k.toLowerCase() !== 'action');

  const pageTitle = component.title || component.name;
  const capitalizedPageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);

  let modal = `
    <!-- Add/Edit Modal -->
    <rs-modal
      v-model="show${capitalizedPageName}Modal"
      title="${pageTitle}"
      size="lg"
      dialog-class="${pageName}-modal-custom"
      :overlay-close="true"
      :hide-footer="false"
      position="center"
    >
      <template #header>
        <div class="flex items-center justify-between w-full bg-primary text-white px-3 py-2 rounded-t-lg ${pageName}-modal-header">
          <h4 class="text-base font-semibold text-white">
            {{ isViewMode ? 'View ${pageTitle}' : (isEditMode ? 'Edit ${pageTitle}' : 'Add ${pageTitle}') }}
          </h4>
          <Icon
            @click="handleCancel${capitalizedPageName}"
            class="hover:text-gray-200 cursor-pointer text-white"
            name="ic:round-close"
            size="18"
          />
        </div>
      </template>
      <template #body>
        <FormKit type="form" :actions="false" @submit="handleSave${capitalizedPageName}">
          <div class="space-y-2 py-2">
`;

  // Helper function to check if a date/datetime field should be read-only (audit fields like createddate, updateddate)
  const isAuditDateField = (fieldName, fieldType) => {
    if (!fieldType || (fieldType !== 'date' && fieldType !== 'datetime')) {
      return false;
    }
    // Normalize field name for comparison (remove non-alphanumeric and lowercase)
    const normalizedName = fieldName ? fieldName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() : '';
    // Check if the field name contains audit date patterns
    const auditPatterns = ['createddate', 'updateddate', 'createdat', 'updatedat', 'datecreated', 'dateupdated', 'entrydate', 'modifieddate', 'datemodified'];
    return auditPatterns.some(pattern => normalizedName.includes(pattern) || normalizedName === pattern);
  };

  // Helper function to check if a field is required based on additionalAttribute
  const isRequiredField = (additionalAttribute) => {
    if (!additionalAttribute) return false;
    const attrLower = additionalAttribute.toLowerCase();
    return attrLower.includes('required');
  };

  // Use component items if available (they have type information), otherwise use fields from dt_key
  if (formItems.length > 0) {
    formItems.forEach((item) => {
      if (item.name && item.name.trim() !== "") {
        const fieldName = item.name.replace(/[^a-zA-Z0-9]/g, "_");
        const formKitType = mapToFormKitType(item.type);
        
        // Check if field is required based on additionalAttribute
        const isRequired = isRequiredField(item.additionalAttribute);
        const requiredStar = isRequired ? '<span class="text-red-500">*</span>' : '';
        const validationAttr = isRequired ? '\n                  validation="required"\n                  validation-visibility="dirty"' : '';
        
        // Skip items that should not be rendered as FormKit inputs (label, heading, divider, etc.)
        if (formKitType === null) {
          // For label type, render as display-only text
          if (item.type === "label" || item.type === "heading") {
            modal += `            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">${item.title || item.name}:</label>
              <div class="flex-1">
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ ${pageName}Form.${fieldName} || '-' }}</span>
              </div>
            </div>
`;
          }
          return; // Skip other non-input types
        }
        
        const isSelectType = formKitType === "select";
        const isVSelectType = formKitType === "v-select";
        const lookupKey = findDropdownOptionsKey(dropdownOptionsMap, item.name) || fieldName;
        const hasLookup = (isSelectType || isVSelectType) && item.lookup_queryMapping && dropdownOptionsMap[lookupKey];
        const optionsRef = hasLookup ? dropdownOptionsMap[lookupKey].optionsVarName : "[]";
        
        // Check if this is an audit date field that should always be disabled in Add/Edit modes
        const isAuditField = isAuditDateField(item.name, item.type);
        const disabledCondition = isAuditField ? "true" : "isViewMode";
        
        const fieldId = pageName + 'Form_' + fieldName;
        
        // Handle different field types
        if (isVSelectType) {
          // v-select (searchable dropdown)
          modal += `            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium" for="${fieldId}">${item.title || item.name}${requiredStar}:</label>
              <div class="flex-1">
                <v-select
                  v-model="${pageName}Form.${fieldName}"
                  :options="${optionsRef}"
                  :reduce="option => option.value"
                  label="label"
                  :disabled="${disabledCondition}"
                  placeholder="Search ${item.title || item.name}..."
                  :clearable="!${disabledCondition}"
                  class="formkit-vselect${isRequired ? ' required' : ''}"
                />
              </div>
            </div>
`;
        } else if (formKitType === "textarea") {
          // Textarea
          modal += `            <div class="flex items-start gap-2">
              <label class="w-32 text-xs font-medium pt-2" for="${fieldId}">${item.title || item.name}${requiredStar}:</label>
              <div class="flex-1">
                <FormKit
                  id="${fieldId}"
                  v-model="${pageName}Form.${fieldName}"
                  type="textarea"
                  :disabled="${disabledCondition}"
                  placeholder="Enter ${item.title || item.name}"
                  rows="3"
                  outer-class="mb-0"${validationAttr}
                />
              </div>
            </div>
`;
        } else if (["quill", "ckeditor", "tinymce", "summernote", "rich-text-editor"].includes(formKitType)) {
          // Rich text editors - render as textarea with note (actual editor component would need to be implemented)
          modal += `            <div class="flex items-start gap-2">
              <label class="w-32 text-xs font-medium pt-2" for="${fieldId}">${item.title || item.name}${requiredStar}:</label>
              <div class="flex-1">
                <FormKit
                  id="${fieldId}"
                  v-model="${pageName}Form.${fieldName}"
                  type="textarea"
                  :disabled="${disabledCondition}"
                  placeholder="Enter ${item.title || item.name}"
                  rows="5"
                  outer-class="mb-0"${validationAttr}
                />
              </div>
            </div>
`;
        } else if (["codemirror", "ace"].includes(formKitType)) {
          // Code editors - render as textarea (actual editor component would need to be implemented)
          modal += `            <div class="flex items-start gap-2">
              <label class="w-32 text-xs font-medium pt-2" for="${fieldId}">${item.title || item.name}${requiredStar}:</label>
              <div class="flex-1">
                <FormKit
                  id="${fieldId}"
                  v-model="${pageName}Form.${fieldName}"
                  type="textarea"
                  :disabled="${disabledCondition}"
                  placeholder="Enter code..."
                  rows="8"
                  outer-class="mb-0 font-mono text-sm"${validationAttr}
                />
              </div>
            </div>
`;
        } else if (["dropzone", "dropzonemini"].includes(formKitType)) {
          // Dropzone file upload - render as file input
          modal += `            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium" for="${fieldId}">${item.title || item.name}${requiredStar}:</label>
              <div class="flex-1">
                <FormKit
                  id="${fieldId}"
                  v-model="${pageName}Form.${fieldName}"
                  type="file"
                  :disabled="${disabledCondition}"
                  outer-class="mb-0"${validationAttr}
                />
              </div>
            </div>
`;
        } else if (formKitType === "mask") {
          // Masked input - render as text with pattern (actual mask would need FormKit Pro or custom)
          modal += `            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium" for="${fieldId}">${item.title || item.name}${requiredStar}:</label>
              <div class="flex-1">
                <FormKit
                  id="${fieldId}"
                  v-model="${pageName}Form.${fieldName}"
                  type="text"
                  :disabled="${disabledCondition}"
                  placeholder="Enter ${item.title || item.name}"
                  outer-class="mb-0"${validationAttr}
                />
              </div>
            </div>
`;
        } else if (["html", "iframe"].includes(formKitType)) {
          // HTML/iframe - render as textarea for content
          modal += `            <div class="flex items-start gap-2">
              <label class="w-32 text-xs font-medium pt-2" for="${fieldId}">${item.title || item.name}${requiredStar}:</label>
              <div class="flex-1">
                <FormKit
                  id="${fieldId}"
                  v-model="${pageName}Form.${fieldName}"
                  type="textarea"
                  :disabled="${disabledCondition}"
                  placeholder="Enter HTML content or URL"
                  rows="3"
                  outer-class="mb-0"${validationAttr}
                />
              </div>
            </div>
`;
        } else if (formKitType === "link") {
          // Link - render as URL input
          modal += `            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium" for="${fieldId}">${item.title || item.name}${requiredStar}:</label>
              <div class="flex-1">
                <FormKit
                  id="${fieldId}"
                  v-model="${pageName}Form.${fieldName}"
                  type="url"
                  :disabled="${disabledCondition}"
                  placeholder="Enter URL"
                  outer-class="mb-0"${validationAttr}
                />
              </div>
            </div>
`;
        } else if (["image", "video", "audio"].includes(formKitType)) {
          // Media types - render as file input
          modal += `            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium" for="${fieldId}">${item.title || item.name}${requiredStar}:</label>
              <div class="flex-1">
                <FormKit
                  id="${fieldId}"
                  v-model="${pageName}Form.${fieldName}"
                  type="file"
                  :disabled="${disabledCondition}"
                  accept="${formKitType === 'image' ? 'image/*' : formKitType === 'video' ? 'video/*' : 'audio/*'}"
                  outer-class="mb-0"${validationAttr}
                />
              </div>
            </div>
`;
        } else if (formKitType === "map") {
          // Map - render as text for coordinates or address
          modal += `            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium" for="${fieldId}">${item.title || item.name}${requiredStar}:</label>
              <div class="flex-1">
                <FormKit
                  id="${fieldId}"
                  v-model="${pageName}Form.${fieldName}"
                  type="text"
                  :disabled="${disabledCondition}"
                  placeholder="Enter coordinates or address"
                  outer-class="mb-0"${validationAttr}
                />
              </div>
            </div>
`;
        } else {
          // Standard FormKit types (text, select, date, checkbox, radio, file, etc.)
          modal += `            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium" for="${fieldId}">${item.title || item.name}${requiredStar}:</label>
              <div class="flex-1">
                <FormKit
                  id="${fieldId}"
                  v-model="${pageName}Form.${fieldName}"
                  type="${formKitType}"
                  ${isSelectType ? `:options="${optionsRef}"` : ""}
                  :disabled="${disabledCondition}"
                  placeholder="${isSelectType ? `Select ${item.title || item.name}` : `Enter ${item.title || item.name}`}"
                  outer-class="mb-0"${validationAttr}
                />
              </div>
            </div>
`;
        }
      }
    });
  } else {
    // Fallback to dt_key fields (no type information, assume text)
    fields.forEach((field) => {
      if (field && field.trim() !== "") {
        const fieldName = field.replace(/[^a-zA-Z0-9]/g, "_");
        const fieldId = pageName + 'Form_' + fieldName;
        modal += `            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium" for="${fieldId}">${field}:</label>
              <div class="flex-1">
                <FormKit
                  id="${fieldId}"
                  v-model="${pageName}Form.${fieldName}"
                  type="text"
                  :disabled="isViewMode"
                  placeholder="Enter ${field}"
                  outer-class="mb-0"
                />
              </div>
            </div>
`;
      }
    });
  }

  modal += `          </div>
        </FormKit>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2 py-2">
          <rs-button variant="danger" size="sm" @click="handleCancel${capitalizedPageName}">
            {{ isViewMode ? 'Close' : 'Cancel' }}
          </rs-button>
          <rs-button v-if="!isViewMode" variant="primary" size="sm" @click="handleSave${capitalizedPageName}">
            Save
          </rs-button>
        </div>
      </template>
    </rs-modal>
`;

  return modal;
}

