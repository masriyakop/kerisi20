import fs from "fs";
import path from "path";

export default defineEventHandler(async (event) => {
  try {
    const migrationFolder = "C:\\KerisiAI\\Migration";
    
    // Check if migration folder exists
    if (!fs.existsSync(migrationFolder)) {
      return {
        statusCode: 404,
        message: "Migration folder not found",
        error: `Folder ${migrationFolder} does not exist`,
        data: [],
      };
    }

    // Read all JSON files from migration folder
    const files = fs.readdirSync(migrationFolder)
      .filter((file) => file.toLowerCase().endsWith(".json"))
      .map((file) => {
        const filePath = path.join(migrationFolder, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          size: stats.size,
          modified: stats.mtime.toISOString(),
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    return {
      statusCode: 200,
      message: "Migration files fetched successfully",
      data: files,
    };
  } catch (error) {
    console.error("Error fetching migration files:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch migration files",
      error: error.message,
      data: [],
    };
  }
});
