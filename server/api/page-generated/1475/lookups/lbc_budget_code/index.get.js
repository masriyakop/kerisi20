import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    // Base SQL query
    let rawQuery = `SELECT DISTINCT
    acm_acct_code id,
    CONCAT_WS(' - ', acm_acct_code, acm_acct_desc) text,
    acm_acct_desc \`Description\`
FROM
    account_main am
WHERE
    acm_flag_budget = 'Y'
    AND NOT EXISTS (
        SELECT
            lbc_budget_code
        FROM
           lkp_budget_code lbc
        WHERE
            lbc.lbc_budget_code = am.acm_acct_code
    )
ORDER BY
    text`;
    

    const data = await prisma.$queryRawUnsafe(rawQuery);
    
    // Map to standard label/value format
    // Convention: value = code/id (for filtering), label = description/text/name (for display)
    // Recognize common alias patterns:
    //   Value aliases: value, id, flc_id, code
    //   Label aliases: label, text, flc_name, name, description, desc
    const VALUE_ALIASES = ['value', 'id', 'flc_id', 'code'];
    const LABEL_ALIASES = ['label', 'text', 'flc_name', 'name', 'description', 'desc'];
    
    const mappedData = data.map((item) => {
      const keys = Object.keys(item);
      const keysLower = keys.map(k => k.toLowerCase());
      
      // 1. Check for explicit 'label' and 'value' aliases first
      if (item.value !== undefined && item.label !== undefined) {
        return { label: String(item.label || ""), value: String(item.value || "") };
      }
      
      // 2. Detect value and label fields using common alias patterns (case-insensitive)
      let valueKey = null;
      let labelKey = null;
      
      for (const alias of VALUE_ALIASES) {
        const idx = keysLower.indexOf(alias);
        if (idx !== -1) { valueKey = keys[idx]; break; }
      }
      for (const alias of LABEL_ALIASES) {
        const idx = keysLower.indexOf(alias);
        if (idx !== -1) { labelKey = keys[idx]; break; }
      }
      
      if (valueKey && labelKey) {
        return { label: String(item[labelKey] || ""), value: String(item[valueKey] || "") };
      }
      
      // 3. If only value alias found, use next available field as label
      if (valueKey) {
        const otherKey = keys.find(k => k !== valueKey);
        return { label: String(item[otherKey] || item[valueKey] || ""), value: String(item[valueKey] || "") };
      }
      
      // 4. Fallback: first column = value, second column = label
      const values = Object.values(item);
      return {
        label: String(values[1] || values[0] || ""),
        value: String(values[0] || ""),
      };
    });
    
    return {
      statusCode: 200,
      message: "Lookup data retrieved successfully",
      data: mappedData,
    };
  } catch (error) {
    console.error("Error fetching lookup data:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch lookup data",
      error: error.message,
    };
  }
});
