import fs from "fs";
import path from "path";
import { readComponentItems, writeComponentItems, getNextComponentItemId } from "./helpers";
import { readComponents } from "../component-editor/helpers";
import { readPages } from "../page-editor/helpers";

export default defineEventHandler(async (event) => {
  try {
    const migrationFolder = "C:\\KerisiAI\\Migration";
    const body = await readBody(event);
    const selectedFiles = body?.files || []; // Array of file names to import
    
    // Check if migration folder exists
    if (!fs.existsSync(migrationFolder)) {
      return {
        statusCode: 404,
        message: "Migration folder not found",
        error: `Folder ${migrationFolder} does not exist`,
      };
    }

    // If no files specified, read all JSON files from migration folder
    let files = [];
    if (selectedFiles.length === 0) {
      files = fs.readdirSync(migrationFolder).filter(
        (file) => file.toLowerCase().endsWith(".json")
      );
    } else {
      // Use only selected files
      files = selectedFiles.filter((file) => 
        file.toLowerCase().endsWith(".json") && 
        fs.existsSync(path.join(migrationFolder, file))
      );
    }

    if (files.length === 0) {
      return {
        statusCode: 404,
        message: "No JSON files found to import",
        error: selectedFiles.length > 0 
          ? "Selected files not found or invalid"
          : `No .json files found in ${migrationFolder}`,
      };
    }

    const existingComponentItems = readComponentItems();
    const existingPages = readPages();
    const existingPageIds = new Set(
      existingPages.map((p) => parseInt(p.pageId) || 0)
    );
    const existingComponents = readComponents();
    const existingComponentIds = new Set(
      existingComponents.map((c) => parseInt(c.id) || 0)
    );
    const existingComponentItemIds = new Set(
      existingComponentItems.map((ci) => parseInt(ci.id) || 0)
    );

    let importedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    const errors = [];
    const nextComponentItemId = getNextComponentItemId();
    let currentComponentItemId = nextComponentItemId;

    // Get current user ID (you may need to adjust this based on your auth system)
    const userId = event.context.user?.id || event.context.userId || "system";

    // Process each JSON file
    for (const file of files) {
      try {
        const filePath = path.join(migrationFolder, file);
        const fileContent = fs.readFileSync(filePath, "utf8");
        let jsonData;

        try {
          jsonData = JSON.parse(fileContent);
        } catch (parseError) {
          errors.push(`File ${file}: Invalid JSON format - ${parseError.message}`);
          errorCount++;
          continue;
        }

        // Handle both array and single object formats
        const componentItemsToImport = Array.isArray(jsonData) ? jsonData : [jsonData];

        for (const itemData of componentItemsToImport) {
          // Validate required fields
          if (!itemData.Name || !itemData.Name.toString().trim()) {
            errors.push(`File ${file}: Missing or empty Name`);
            skippedCount++;
            continue;
          }

          if (!itemData.Title || !itemData.Title.toString().trim()) {
            errors.push(`File ${file}: Missing or empty Title`);
            skippedCount++;
            continue;
          }

          // Validate pageId exists
          const pageId = itemData.pageId 
            ? parseInt(itemData.pageId) 
            : (itemData.PageId ? parseInt(itemData.PageId) : null);
          
          if (!pageId || !existingPageIds.has(pageId)) {
            errors.push(
              `File ${file}, Component Item "${itemData.Name}": Page ID ${pageId} does not exist, skipping`
            );
            skippedCount++;
            continue;
          }

          // Validate componentId exists
          const componentId = itemData.componentId 
            ? parseInt(itemData.componentId) 
            : (itemData.ComponentId ? parseInt(itemData.ComponentId) : null);
          
          if (!componentId || !existingComponentIds.has(componentId)) {
            errors.push(
              `File ${file}, Component Item "${itemData.Name}": Component ID ${componentId} does not exist, skipping`
            );
            skippedCount++;
            continue;
          }

          // Get component name from componentId
          const component = existingComponents.find((c) => parseInt(c.id) === componentId);
          const componentName = component ? component.name : "";

          const name = itemData.Name.toString().trim();
          const title = itemData.Title.toString().trim();

          // Check for duplicate name within the same component
          const duplicateComponentItem = existingComponentItems.find(
            (ci) => ci.name === name && parseInt(ci.componentId) === componentId
          );
          if (duplicateComponentItem) {
            errors.push(
              `File ${file}, Component Item "${name}": Component Item with this name already exists for component ${componentId}, skipping`
            );
            skippedCount++;
            continue;
          }

          // Handle component item ID - use existing if valid, otherwise assign new
          let componentItemId;
          if (itemData.ID !== undefined && itemData.ID !== null) {
            const providedId = parseInt(itemData.ID);
            if (providedId > 0 && !existingComponentItemIds.has(providedId)) {
              componentItemId = providedId;
              existingComponentItemIds.add(componentItemId);
            } else {
              // ID already exists or invalid, assign new one
              componentItemId = currentComponentItemId++;
              existingComponentItemIds.add(componentItemId);
            }
          } else {
            // No ID provided, assign new one
            componentItemId = currentComponentItemId++;
            existingComponentItemIds.add(componentItemId);
          }

          // Create new component item object
          const newComponentItem = {
            id: componentItemId,
            pageId: pageId,
            componentId: componentId,
            name: name,
            title: title,
            component: componentName,
            type: (itemData.Type || "").toString().trim(),
            cssClass: (itemData["CSS Class"] || itemData.cssClass || "").toString().trim(),
            additionalAttribute: (itemData["Additional Attribute"] || itemData.additionalAttribute || "").toString().trim(),
            defaultValue: (itemData["Default Value"] || itemData.defaultValue || "").toString().trim(),
            lookup_queryMapping: (itemData["lookup_queryMapping"] || itemData.lookup_queryMapping || "").toString().trim(),
            visible: itemData.Visible !== undefined ? (itemData.Visible === 1 || itemData.Visible === true ? 1 : 0) : 1,
            active: itemData.Status !== undefined ? (itemData.Status === 1 || itemData.Status === true ? 1 : 0) : (itemData.Active !== undefined ? (itemData.Active === 1 || itemData.Active === true ? 1 : 0) : 1),
            order: itemData.Order ? parseInt(itemData.Order) || 1 : 1,
            createdTimestamp: new Date().toISOString(),
            createdBy: userId,
            updateTimestamp: null,
            updatedBy: null,
          };

          existingComponentItems.push(newComponentItem);
          importedCount++;
        }
      } catch (fileError) {
        errors.push(`File ${file}: ${fileError.message}`);
        errorCount++;
      }
    }

    // Write all component items to database
    if (importedCount > 0) {
      writeComponentItems(existingComponentItems);
    }

    return {
      statusCode: 200,
      message: `Import completed: ${importedCount} component items imported, ${skippedCount} skipped, ${errorCount} files with errors`,
      data: {
        imported: importedCount,
        skipped: skippedCount,
        errors: errorCount,
        totalFiles: files.length,
        errorsList: errors,
      },
    };
  } catch (error) {
    console.error("Error importing component items:", error);
    return {
      statusCode: 500,
      message: "Failed to import component items",
      error: error.message,
    };
  }
});
