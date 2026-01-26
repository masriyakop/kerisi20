import fs from "fs";
import path from "path";

const dbFilePath = path.join(process.cwd(), "assets", "json", "component_editor.json");

const ensureDatabaseFile = () => {
  if (!fs.existsSync(path.dirname(dbFilePath))) {
    fs.mkdirSync(path.dirname(dbFilePath), { recursive: true });
  }

  if (!fs.existsSync(dbFilePath)) {
    fs.writeFileSync(dbFilePath, "[]", "utf8");
  }
};

export const readComponents = () => {
  ensureDatabaseFile();
  const raw = fs.readFileSync(dbFilePath, "utf8") || "[]";
  const components = JSON.parse(raw);
  // Ensure id is integer
  return components.map((item) => ({
    ...item,
    id: typeof item.id === "number" ? item.id : parseInt(item.id) || 0,
    pageId: typeof item.pageId === "number" ? item.pageId : parseInt(item.pageId) || 0,
  }));
};

export const writeComponents = (data) => {
  ensureDatabaseFile();
  // Ensure id is stored as integer
  const normalizedData = data.map((item) => ({
    ...item,
    id: typeof item.id === "number" ? item.id : parseInt(item.id) || 0,
    pageId: typeof item.pageId === "number" ? item.pageId : parseInt(item.pageId) || 0,
  }));
  fs.writeFileSync(dbFilePath, JSON.stringify(normalizedData, null, 2), "utf8");
};

export const getNextComponentId = () => {
  const components = readComponents();
  if (components.length === 0) {
    return 1;
  }
  const maxId = Math.max(...components.map((item) => parseInt(item.id) || 0));
  return maxId + 1;
};

export const buildResponseData = (components) =>
  components.map((item, index) => {
    const response = {
      no: index + 1,
      id: typeof item.id === "number" ? item.id : parseInt(item.id) || 0,
      // pageId, queryMapping, and componentData are excluded from response to hide them from the table
      title: item.title || "",
      name: item.name || "",
      cssClass: item.cssClass || "",
      type: item.type || "custom",
      collapseEnable: item.collapseEnable || 0,
      collapseByDefault: item.collapseByDefault || 0,
      visible: item.visible !== undefined ? item.visible : 1,
      active: item.active !== undefined ? item.active : 1,
      order: item.order || 1,
      action: "",
    };
    return response;
  });
