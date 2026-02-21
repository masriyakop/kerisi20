/**
 * Validates that SQL is read-only (SELECT only) for safe execution.
 * Blocks: INSERT, UPDATE, DELETE, DROP, TRUNCATE, ALTER, CREATE, etc.
 */
const FORBIDDEN_PATTERNS = [
  /\bINSERT\b/i,
  /\bUPDATE\b/i,
  /\bDELETE\b/i,
  /\bDROP\b/i,
  /\bTRUNCATE\b/i,
  /\bALTER\b/i,
  /\bCREATE\b/i,
  /\bEXEC(UTE)?\b/i,
  /\bGRANT\b/i,
  /\bREVOKE\b/i,
  /\bINTO\s+OUTFILE\b/i,
  /\bLOAD_FILE\b/i,
  /\bINFORMATION_SCHEMA\b/i,
];

function hasMultipleStatements(query) {
  const semicolons = query.split(";").filter((s) => s.trim().length > 0);
  return semicolons.length > 1;
}

export function isSafeSql(query) {
  if (!query || typeof query !== "string") return false;

  const trimmed = query.trim();
  if (!trimmed) return false;

  // Must start with SELECT (allow WITH for CTEs)
  const normalized = trimmed.replace(/^\s*\/\*[\s\S]*?\*\//, "").trim();
  if (!/^\s*(SELECT|WITH)\b/i.test(normalized)) {
    return false;
  }

  // Block multiple statements
  if (hasMultipleStatements(query)) return false;

  // Check for forbidden patterns
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(query)) return false;
  }

  return true;
}
