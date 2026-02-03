import fs from "fs";
import path from "path";
import { readPages, writePages, getNextPageId } from "./helpers";

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

    const existingPages = readPages();
    const existingPageIds = new Set(existingPages.map((p) => parseInt(p.pageId) || 0));
    const existingMenus = new Set(
      existingPages.filter((p) => p.menu && p.menu.trim() !== "").map((p) => p.menu)
    );

    let importedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    const errors = [];
    const nextPageId = getNextPageId();
    let currentPageId = nextPageId;

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
        const pagesToImport = Array.isArray(jsonData) ? jsonData : [jsonData];

        for (const pageData of pagesToImport) {
          // Validate required fields
          if (!pageData.pageTitle || !pageData.pageTitle.toString().trim()) {
            errors.push(`File ${file}: Missing or empty pageTitle`);
            skippedCount++;
            continue;
          }

          const pageTitle = pageData.pageTitle.toString().trim();
          const menu = pageData.menu ? pageData.menu.toString().trim() : "";
          const status = pageData.status?.toString().trim() || "ACTIVE";

          // Validate status
          if (status !== "ACTIVE" && status !== "INACTIVE") {
            errors.push(`File ${file}, Page "${pageTitle}": Invalid status "${status}", defaulting to ACTIVE`);
          }

          // Handle pageId - use existing if valid, otherwise assign new
          let pageId;
          if (pageData.pageId !== undefined && pageData.pageId !== null) {
            const providedPageId = parseInt(pageData.pageId);
            if (providedPageId > 0 && !existingPageIds.has(providedPageId)) {
              pageId = providedPageId;
              existingPageIds.add(pageId);
            } else {
              // PageId already exists or invalid, assign new one
              pageId = currentPageId++;
              existingPageIds.add(pageId);
            }
          } else {
            // No pageId provided, assign new one
            pageId = currentPageId++;
            existingPageIds.add(pageId);
          }

          // Check if menu is already attached to another page
          if (menu && existingMenus.has(menu)) {
            errors.push(`File ${file}, Page "${pageTitle}": Menu "${menu}" is already attached to another page, skipping menu assignment`);
            // Continue without menu assignment
          } else if (menu) {
            existingMenus.add(menu);
          }

          // Create new page object
          const newPage = {
            pageId,
            pageTitle,
            menu: menu || "",
            status: status === "ACTIVE" || status === "INACTIVE" ? status : "ACTIVE",
            customized: pageData.customized === true || pageData.customized === 1 ? 1 : 0,
            createdTimestamp: pageData.createdTimestamp || new Date().toISOString(),
            updateTimestamp: pageData.updateTimestamp || null,
          };

          existingPages.push(newPage);
          importedCount++;
        }
      } catch (fileError) {
        errors.push(`File ${file}: ${fileError.message}`);
        errorCount++;
      }
    }

    // Write all pages to database
    if (importedCount > 0) {
      writePages(existingPages);
    }

    return {
      statusCode: 200,
      message: `Import completed: ${importedCount} pages imported, ${skippedCount} skipped, ${errorCount} files with errors`,
      data: {
        imported: importedCount,
        skipped: skippedCount,
        errors: errorCount,
        totalFiles: files.length,
        errorsList: errors,
      },
    };
  } catch (error) {
    console.error("Error importing pages:", error);
    return {
      statusCode: 500,
      message: "Failed to import pages",
      error: error.message,
    };
  }
});
