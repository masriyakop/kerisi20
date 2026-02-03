import fs from "fs";
import path from "path";

export default defineEventHandler(async (event) => {
  try {
    // Read the Prisma schema file
    const schemaPath = path.join(process.cwd(), "prisma", "schema.prisma");
    const schemaContent = fs.readFileSync(schemaPath, "utf8");

    // Parse models and their fields from the schema
    const models = [];
    const modelRegex = /model\s+(\w+)\s*\{([^}]+)\}/g;
    let match;

    while ((match = modelRegex.exec(schemaContent)) !== null) {
      const modelName = match[1];
      const modelBody = match[2];

      // Parse fields from model body
      const fields = [];
      const lines = modelBody.split("\n");

      for (const line of lines) {
        const trimmedLine = line.trim();

        // Skip empty lines, comments, and relation definitions (@@)
        if (
          !trimmedLine ||
          trimmedLine.startsWith("//") ||
          trimmedLine.startsWith("@@")
        ) {
          continue;
        }

        // Parse field definition: fieldName Type ...
        const fieldMatch = trimmedLine.match(/^(\w+)\s+(\w+)(\?)?/);
        if (fieldMatch) {
          const fieldName = fieldMatch[1];
          const fieldType = fieldMatch[2];
          const isOptional = !!fieldMatch[3];

          // Skip relation fields (types that start with uppercase and are model names)
          // Also skip common Prisma types that aren't actual data fields
          const skipTypes = [
            "DateTime",
            "Json",
            "Bytes",
            "Decimal",
            "BigInt",
            "Unsupported",
          ];
          const isRelation =
            fieldType[0] === fieldType[0].toUpperCase() &&
            !["String", "Int", "Float", "Boolean", ...skipTypes].includes(
              fieldType
            );

          if (!isRelation) {
            fields.push({
              name: fieldName,
              type: fieldType,
              optional: isOptional,
            });
          }
        }
      }

      // Only include models that have fields
      if (fields.length > 0) {
        models.push({
          name: modelName,
          fields: fields,
        });
      }
    }

    // Sort models alphabetically
    models.sort((a, b) => a.name.localeCompare(b.name));

    // Generate options for dropdown in format model.fieldName
    const options = [];
    for (const model of models) {
      for (const field of model.fields) {
        options.push({
          label: `${model.name}.${field.name}`,
          value: `${model.name}.${field.name}`,
          model: model.name,
          field: field.name,
          type: field.type,
        });
      }
    }

    return {
      statusCode: 200,
      data: {
        models,
        options,
      },
    };
  } catch (error) {
    console.error("Error reading Prisma schema:", error);
    return {
      statusCode: 500,
      message: "Failed to read Prisma schema",
      error: error.message,
    };
  }
});
