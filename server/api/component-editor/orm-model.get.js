import fs from "fs";
import path from "path";

// Extract the Prisma ORM model name from a generated CRUD API endpoint file
export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const apiPath = query.apiPath; // e.g., "/api/setup/glstructure/fund-type"

    if (!apiPath) {
      return { statusCode: 400, message: "apiPath query parameter is required" };
    }

    // Normalize: remove leading "/api/" to get the relative path
    let relativePath = apiPath.replace(/^\/api\//, "").replace(/^api\//, "");
    
    // The GET endpoint file is at server/api/<relativePath>/index.get.js
    const serverApiDir = path.join(process.cwd(), "server", "api");
    const getFilePath = path.join(serverApiDir, ...relativePath.split("/"), "index.get.js");

    if (!fs.existsSync(getFilePath)) {
      return { statusCode: 404, message: "API GET endpoint not found", path: getFilePath };
    }

    const content = fs.readFileSync(getFilePath, "utf-8");

    // Extract model name from prisma.modelName.findMany or prisma.modelName.findFirst etc.
    const match = content.match(/prisma\.(\w+)\.(findMany|findFirst|findUnique|count|aggregate)/);
    if (match) {
      return { statusCode: 200, data: { modelName: match[1] } };
    }

    // Fallback: try to find prisma.$queryRaw with table name
    const rawMatch = content.match(/FROM\s+`?(\w+)`?/i);
    if (rawMatch) {
      return { statusCode: 200, data: { modelName: rawMatch[1] } };
    }

    return { statusCode: 200, data: { modelName: "" }, message: "Could not detect ORM model" };
  } catch (error) {
    console.error("Error reading ORM model:", error);
    return { statusCode: 500, message: "Failed to read ORM model", error: error.message };
  }
});
