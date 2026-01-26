import fs from "fs";
import path from "path";

const dbFilePath = path.join(process.cwd(), "database", "penyuntingmuka.json");

const ensureDatabaseFile = () => {
  if (!fs.existsSync(path.dirname(dbFilePath))) {
    fs.mkdirSync(path.dirname(dbFilePath), { recursive: true });
  }

  if (!fs.existsSync(dbFilePath)) {
    fs.writeFileSync(dbFilePath, "[]", "utf8");
  }
};

export const readPages = () => {
  ensureDatabaseFile();
  const raw = fs.readFileSync(dbFilePath, "utf8") || "[]";
  const pages = JSON.parse(raw);
  // Ensure pageId is integer
  return pages.map((item) => ({
    ...item,
    pageId: typeof item.pageId === "number" ? item.pageId : parseInt(item.pageId) || 0,
  }));
};

export const writePages = (data) => {
  ensureDatabaseFile();
  // Ensure pageId is stored as integer
  const normalizedData = data.map((item) => ({
    ...item,
    pageId: typeof item.pageId === "number" ? item.pageId : parseInt(item.pageId) || 0,
  }));
  fs.writeFileSync(dbFilePath, JSON.stringify(normalizedData, null, 2), "utf8");
};

export const getNextPageId = () => {
  const pages = readPages();
  if (pages.length === 0) {
    return 1;
  }
  const maxId = Math.max(...pages.map((item) => parseInt(item.pageId) || 0));
  return maxId + 1;
};

export const buildResponseData = (pages) =>
  pages.map((item, index) => ({
    no: index + 1,
    pageId: typeof item.pageId === "number" ? item.pageId : parseInt(item.pageId) || 0,
    pageTitle: item.pageTitle,
    action: "",
  }));

