import fs from "fs";
import path from "path";

const dbFilePath = path.join(process.cwd(), "assets", "json", "componentItem_editor.json");

const ensureDatabaseFile = () => {
  if (!fs.existsSync(path.dirname(dbFilePath))) {
    fs.mkdirSync(path.dirname(dbFilePath), { recursive: true });
  }

  if (!fs.existsSync(dbFilePath)) {
    fs.writeFileSync(dbFilePath, "[]", "utf8");
  }
};

export const readComponentItems = () => {
  ensureDatabaseFile();
  const raw = fs.readFileSync(dbFilePath, "utf8") || "[]";
  const componentItems = JSON.parse(raw);
  // Ensure id is integer
  return componentItems.map((item) => ({
    ...item,
    id: typeof item.id === "number" ? item.id : parseInt(item.id) || 0,
    pageId: typeof item.pageId === "number" ? item.pageId : parseInt(item.pageId) || 0,
    componentId: typeof item.componentId === "number" ? item.componentId : parseInt(item.componentId) || 0,
    order: typeof item.order === "number" ? item.order : parseInt(item.order) || 1,
  }));
};

export const writeComponentItems = (data) => {
  ensureDatabaseFile();
  // Ensure id is stored as integer
  const normalizedData = data.map((item) => ({
    ...item,
    id: typeof item.id === "number" ? item.id : parseInt(item.id) || 0,
    pageId: typeof item.pageId === "number" ? item.pageId : parseInt(item.pageId) || 0,
    componentId: typeof item.componentId === "number" ? item.componentId : parseInt(item.componentId) || 0,
    order: typeof item.order === "number" ? item.order : parseInt(item.order) || 1,
  }));
  fs.writeFileSync(dbFilePath, JSON.stringify(normalizedData, null, 2), "utf8");
};

export const getNextComponentItemId = () => {
  const componentItems = readComponentItems();
  if (componentItems.length === 0) {
    return 1;
  }
  const maxId = Math.max(...componentItems.map((item) => parseInt(item.id) || 0));
  return maxId + 1;
};

export const buildResponseData = (componentItems) =>
  componentItems.map((item, index) => {
    const response = {
      no: index + 1,
      id: typeof item.id === "number" ? item.id : parseInt(item.id) || 0,
      name: item.name || "",
      title: item.title || "",
      component: item.component || "",
      componentId: typeof item.componentId === "number" ? item.componentId : parseInt(item.componentId) || 0,
      type: item.type || "",
      cssClass: item.cssClass || "",
      additionalAttribute: item.additionalAttribute || "",
      defaultValue: item.defaultValue || "",
      lookup_queryMapping: item.lookup_queryMapping !== undefined ? item.lookup_queryMapping : "",
      crudColumn: item.crudColumn || "",
      visible: item.visible !== undefined ? item.visible : 0,
      active: item.active !== undefined ? item.active : 0,
      order: item.order || 1,
      action: "",
    };
    return response;
  });
