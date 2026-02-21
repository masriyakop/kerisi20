import fs from "fs";
import path from "path";

/** Parse a Prisma schema string and return { models, options } */
function parseSchemaContent(schemaContent) {
  const models = [];
  const modelRegex = /model\s+(\w+)\s*\{([^}]+)\}/g;
  let match;

  while ((match = modelRegex.exec(schemaContent)) !== null) {
    const modelName = match[1];
    const modelBody = match[2];

    const fields = [];
    const lines = modelBody.split("\n");

    for (const line of lines) {
      const trimmedLine = line.trim();

      if (
        !trimmedLine ||
        trimmedLine.startsWith("//") ||
        trimmedLine.startsWith("@@")
      ) {
        continue;
      }

      const fieldMatch = trimmedLine.match(/^(\w+)\s+(\w+)(\?)?/);
      if (fieldMatch) {
        const fieldName = fieldMatch[1];
        const fieldType = fieldMatch[2];
        const isOptional = !!fieldMatch[3];

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

    if (fields.length > 0) {
      models.push({
        name: modelName,
        fields: fields,
      });
    }
  }

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

  return { models, options };
}

export default defineEventHandler(async (event) => {
  try {
    const prismaDir = path.join(process.cwd(), "prisma");
    const allModels = [];
    const allOptions = [];
    const seenOptionValues = new Set();

    // Read schema.prisma
    const schemaPath = path.join(prismaDir, "schema.prisma");
    if (fs.existsSync(schemaPath)) {
      const schemaContent = fs.readFileSync(schemaPath, "utf8");
      const { models, options } = parseSchemaContent(schemaContent);
      allModels.push(...models);
      options.forEach((opt) => {
        if (!seenOptionValues.has(opt.value)) {
          seenOptionValues.add(opt.value);
          allOptions.push(opt);
        }
      });
    }

    // Read schema2.prisma and merge (so CRUD Column dropdown includes schema2 models/fields)
    const schema2Path = path.join(prismaDir, "schema2.prisma");
    if (fs.existsSync(schema2Path)) {
      const schema2Content = fs.readFileSync(schema2Path, "utf8");
      const { models: models2, options: options2 } = parseSchemaContent(schema2Content);
      allModels.push(...models2);
      options2.forEach((opt) => {
        if (!seenOptionValues.has(opt.value)) {
          seenOptionValues.add(opt.value);
          allOptions.push(opt);
        }
      });
    }

    // Sort options by label for consistent dropdown order
    allOptions.sort((a, b) => a.label.localeCompare(b.label));
    allModels.sort((a, b) => a.name.localeCompare(b.name));

    return {
      statusCode: 200,
      data: {
        models: allModels,
        options: allOptions,
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
