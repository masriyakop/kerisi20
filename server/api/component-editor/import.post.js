import fs from "fs";
import path from "path";
import { readComponents, writeComponents, getNextComponentId } from "./helpers";
import { readPages } from "../page-editor/helpers";

// Function to extract SQL from BL field
function extractSQL(blContent) {
  if (!blContent) {
    return "";
  }

  // Convert to string if it's not already
  if (typeof blContent !== "string") {
    if (typeof blContent === "object") {
      blContent = JSON.stringify(blContent);
    } else {
      blContent = String(blContent);
    }
  }

  if (blContent.trim() === "") {
    return "";
  }

  try {
    // Extract $sql, $common, and $filter variables using regex
    // Handle both single and double quotes, multiline strings, and PHP concatenation
    // The BL field contains PHP code, so we need to extract variable assignments
    
    // Pattern to match: $variable = "content" or $variable = 'content'
    // Handle multiline strings and escaped quotes
    // Use a more sophisticated approach: find the assignment and extract until matching quote
    
    function extractVariable(content, varName) {
      if (!content) return "";
      
      // Try to find $varName = "..." or $varName = '...'
      // Handle both single and double quotes, multiline, escaped quotes, and PHP variable interpolation
      // The content may contain PHP variable interpolation like $filter, $smartFilter within the string
      
      // First, try to find the assignment pattern
      // Pattern: $varName = "content" or $varName = 'content'
      // We need to handle:
      // 1. Simple strings: $var = "text";
      // 2. Multiline strings
      // 3. Strings with variable interpolation: $var = "text $otherVar text";
      // 4. Strings with escaped quotes: $var = "text \"quote\" text";
      
      // Strategy: Find $varName = " then match until the closing quote (handling escaped quotes)
      // But also need to handle variable interpolation which makes it more complex
      
      // Try multiple approaches:
      // 1. Simple pattern for strings without complex interpolation
      // 2. More complex pattern that handles variable interpolation
      
      const simplePatterns = [
        // Double quotes with semicolon
        new RegExp(`\\$${varName}\\s*=\\s*"([^"]*)"\\s*;`, 'i'),
        // Single quotes with semicolon  
        new RegExp(`\\$${varName}\\s*=\\s*'([^']*)'\\s*;`, 'i'),
        // Double quotes without semicolon
        new RegExp(`\\$${varName}\\s*=\\s*"([^"]*)"`, 'i'),
        // Single quotes without semicolon
        new RegExp(`\\$${varName}\\s*=\\s*'([^']*)'`, 'i'),
      ];
      
      for (const pattern of simplePatterns) {
        const match = content.match(pattern);
        if (match && match[1] && match[1].trim()) {
          return match[1];
        }
      }
      
      // If simple patterns don't work, try multiline patterns (non-greedy)
      const multilinePatterns = [
        new RegExp(`\\$${varName}\\s*=\\s*"([\\s\\S]*?)"\\s*;`, 'i'),
        new RegExp(`\\$${varName}\\s*=\\s*'([\\s\\S]*?)'\\s*;`, 'i'),
        new RegExp(`\\$${varName}\\s*=\\s*"([\\s\\S]*?)"`, 'i'),
        new RegExp(`\\$${varName}\\s*=\\s*'([\\s\\S]*?)'`, 'i'),
      ];
      
      for (const pattern of multilinePatterns) {
        const match = content.match(pattern);
        if (match && match[1] && match[1].trim()) {
          // Check if this looks like SQL content (for $sql) or FROM clause (for $common)
          const extracted = match[1].trim();
          if (varName === "sql" && extracted.toUpperCase().includes("SELECT")) {
            return extracted;
          }
          if (varName === "common" && extracted.toUpperCase().includes("FROM")) {
            return extracted;
          }
          if (varName === "filter" && (extracted.includes("WHERE") || extracted.includes("AND") || extracted.includes("OR"))) {
            return extracted;
          }
          // For other cases, return if it's not empty
          if (extracted.length > 0) {
            return extracted;
          }
        }
      }
      
      return "";
    }
    
    let sql = extractVariable(blContent, "sql");
    let common = extractVariable(blContent, "common");
    let filter = extractVariable(blContent, "filter");
    
    // Debug logging (can be removed in production)
    if (blContent && blContent.length > 0 && !sql && !common && !filter) {
      console.log("BL content found but no variables extracted. BL length:", blContent.length);
      console.log("BL preview:", blContent.substring(0, 500));
    }

    // Check if this is a COUNT query - skip it
    // Pattern: SELECT COUNT(...) C FROM or SELECT COUNT(*) C FROM
    const countPattern = /^\s*SELECT\s+COUNT\s*\([^)]*\)\s+C\s+FROM/gi;
    if (countPattern.test(sql.trim())) {
      return "";
    }

    // If no $sql found, return empty
    if (!sql || sql.trim() === "") {
      return "";
    }

    // First, replace $filter in $common (if $common contains $filter)
    if (common && filter) {
      common = common.replace(/\$filter/g, filter);
    }

    // Also handle $smartFilter if present (replace with empty string if not found)
    if (common && common.includes("$smartFilter")) {
      common = common.replace(/\$smartFilter/g, "");
    }

    // Then, replace $common in $sql with proper spacing
    if (sql && common) {
      // Replace $common with common, ensuring proper spacing
      const trimmedCommon = common.trim();
      sql = sql.replace(/\$common/g, " " + trimmedCommon + " ");
    }

    // If $sql still contains $filter, replace it
    if (sql && filter) {
      const trimmedFilter = filter.trim();
      sql = sql.replace(/\$filter/g, " " + trimmedFilter + " ");
    }

    let combinedSQL = sql.trim();

    // Remove ORDER BY clause (case insensitive, multiline)
    // Match ORDER BY ... up to the next line or semicolon or end of string
    combinedSQL = combinedSQL.replace(/ORDER\s+BY\s+[^\n;]+/gi, "");

    // Remove LIMIT clause (case insensitive, multiline)
    // Match LIMIT ... up to the next line or semicolon or end of string
    combinedSQL = combinedSQL.replace(/LIMIT\s+[^\n;]+/gi, "");

    // Remove .DB2. references (replace with empty string)
    // Also handle cases where it might be written as ".DB2." or " .DB2. " or just DB2.
    combinedSQL = combinedSQL.replace(/\.DB2\./g, "");
    combinedSQL = combinedSQL.replace(/\s*\.\s*DB2\s*\.\s*/g, "");
    combinedSQL = combinedSQL.replace(/DB2\./g, "");

    // Remove $_POST references and other PHP variables
    combinedSQL = combinedSQL.replace(/\$_POST\[['"][^'"]+['"]\]/g, "");
    combinedSQL = combinedSQL.replace(/\{?\$_POST\[['"][^'"]+['"]\]\}?/g, "");

    // Remove PHP concatenation patterns like ".$_POST['start']."
    combinedSQL = combinedSQL.replace(/\.\$_POST\[['"][^'"]+['"]\]\./g, "");

    // Clean up extra whitespace and newlines
    // First, normalize line breaks and preserve SQL structure
    combinedSQL = combinedSQL
      .replace(/\r\n/g, "\n") // Normalize line breaks
      .replace(/\r/g, "\n") // Normalize line breaks
      .replace(/\n\s*\n\s*\n+/g, "\n\n") // Multiple newlines to double newline
      .replace(/^\s+|\s+$/gm, ""); // Trim each line
    
    // Then replace multiple spaces with single space, but preserve newlines
    combinedSQL = combinedSQL
      .replace(/[ \t]+/g, " ") // Replace multiple spaces/tabs with single space
      .replace(/\n /g, "\n") // Remove space after newline
      .replace(/ \n/g, "\n") // Remove space before newline
      .trim();

    return combinedSQL;
  } catch (error) {
    console.error("Error extracting SQL:", error);
    return "";
  }
}

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

    const existingComponents = readComponents();
    const existingPageIds = new Set(
      readPages().map((p) => parseInt(p.pageId) || 0)
    );
    const existingComponentIds = new Set(
      existingComponents.map((c) => parseInt(c.id) || 0)
    );

    let importedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    const errors = [];
    const nextComponentId = getNextComponentId();
    let currentComponentId = nextComponentId;

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
        const componentsToImport = Array.isArray(jsonData) ? jsonData : [jsonData];

        for (const componentData of componentsToImport) {
          // Validate required fields
          if (!componentData.Name || !componentData.Name.toString().trim()) {
            errors.push(`File ${file}: Missing or empty Name`);
            skippedCount++;
            continue;
          }

          if (!componentData.Title || !componentData.Title.toString().trim()) {
            errors.push(`File ${file}: Missing or empty Title`);
            skippedCount++;
            continue;
          }

          // Validate pageId exists
          const pageId = componentData.pageId 
            ? parseInt(componentData.pageId) 
            : null;
          
          if (!pageId || !existingPageIds.has(pageId)) {
            errors.push(
              `File ${file}, Component "${componentData.Name}": Page ID ${pageId} does not exist, skipping`
            );
            skippedCount++;
            continue;
          }

          const name = componentData.Name.toString().trim();
          const title = componentData.Title.toString().trim();

          // Check for duplicate name within the same page
          const duplicateComponent = existingComponents.find(
            (c) => c.name === name && parseInt(c.pageId) === pageId
          );
          if (duplicateComponent) {
            errors.push(
              `File ${file}, Component "${name}": Component with this name already exists for page ${pageId}, skipping`
            );
            skippedCount++;
            continue;
          }

          // Extract SQL from BL field
          // Handle BL as string, object, or array
          let blContent = "";
          if (componentData.BL !== undefined && componentData.BL !== null) {
            if (typeof componentData.BL === "string") {
              blContent = componentData.BL;
            } else if (typeof componentData.BL === "object") {
              // If BL is an object or array, stringify it
              blContent = JSON.stringify(componentData.BL);
            } else {
              blContent = String(componentData.BL);
            }
          }
          const queryMapping = extractSQL(blContent);

          // Handle componentData field - store as JSON string if it's an object/array
          let componentDataField = "";
          if (componentData.componentData !== undefined && componentData.componentData !== null) {
            if (typeof componentData.componentData === "object") {
              componentDataField = JSON.stringify(componentData.componentData);
            } else {
              componentDataField = componentData.componentData.toString();
            }
          }

          // Handle component ID - use existing if valid, otherwise assign new
          let componentId;
          if (componentData.ID !== undefined && componentData.ID !== null) {
            const providedId = parseInt(componentData.ID);
            if (providedId > 0 && !existingComponentIds.has(providedId)) {
              componentId = providedId;
              existingComponentIds.add(componentId);
            } else {
              // ID already exists or invalid, assign new one
              componentId = currentComponentId++;
              existingComponentIds.add(componentId);
            }
          } else {
            // No ID provided, assign new one
            componentId = currentComponentId++;
            existingComponentIds.add(componentId);
          }

          // Create new component object
          const newComponent = {
            id: componentId,
            pageId: pageId,
            title: title,
            name: name,
            cssClass: (componentData["CSS Class"] || "").toString().trim(),
            type: (componentData.Type || "custom").toString().trim(),
            collapseEnable: componentData["Collapse Enable"] === 1 || componentData["Collapse Enable"] === true ? 1 : 0,
            collapseByDefault: componentData["Collapse By Default"] === 1 || componentData["Collapse By Default"] === true ? 1 : 0,
            visible: componentData.Visible !== undefined ? (componentData.Visible === 1 || componentData.Visible === true ? 1 : 0) : 1,
            active: componentData.Status === 1 || componentData.Status === true ? 1 : 0,
            order: componentData.Order ? parseInt(componentData.Order) || 1 : 1,
            queryMapping: queryMapping,
            componentData: componentDataField,
            createdTimestamp: new Date().toISOString(),
            createdBy: userId,
            updateTimestamp: null,
            updatedBy: null,
          };

          existingComponents.push(newComponent);
          importedCount++;
        }
      } catch (fileError) {
        errors.push(`File ${file}: ${fileError.message}`);
        errorCount++;
      }
    }

    // Write all components to database
    if (importedCount > 0) {
      writeComponents(existingComponents);
    }

    return {
      statusCode: 200,
      message: `Import completed: ${importedCount} components imported, ${skippedCount} skipped, ${errorCount} files with errors`,
      data: {
        imported: importedCount,
        skipped: skippedCount,
        errors: errorCount,
        totalFiles: files.length,
        errorsList: errors,
      },
    };
  } catch (error) {
    console.error("Error importing components:", error);
    return {
      statusCode: 500,
      message: "Failed to import components",
      error: error.message,
    };
  }
});
