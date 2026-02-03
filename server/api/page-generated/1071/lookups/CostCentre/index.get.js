import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    // Base SQL query (contains variables: Fund, PTJ)
    let rawQuery = `SELECT DISTINCT
    ouc.ccr_costcentre value,
    CONCAT_WS(' - ', ouc.ccr_costcentre, cc.ccr_costcentre_desc) label
FROM
    org_unit_costcentre ouc,
    costcentre cc
WHERE
ouc.ccr_costcentre = cc.ccr_costcentre
    AND ouc.fty_fund_type = {Fund}
    AND ouc.oun_code = {PTJ}
ORDER BY
    1;`;
    
    // Replace variables with query parameter values (cascading dropdown support)
    // Replace ${Fund} or {Fund} with query.Fund value
    if (query.Fund !== undefined && query.Fund !== null && query.Fund !== '') {
      // Check if variable is already quoted in SQL, if not add quotes for string values
      const FundValue = query.Fund;
      // Replace ${var} patterns - quoted first (keep the quotes)
      rawQuery = rawQuery.replace(/'\$\{Fund\}'/g, "'" + FundValue + "'");
      rawQuery = rawQuery.replace(/"\$\{Fund\}"/g, '"' + FundValue + '"');
      rawQuery = rawQuery.replace(/\$\{Fund\}/g, "'" + FundValue + "'");
      // Replace {var} patterns (without $) - quoted first (keep the quotes)
      rawQuery = rawQuery.replace(/'\{Fund\}'/g, "'" + FundValue + "'");
      rawQuery = rawQuery.replace(/"\{Fund\}"/g, '"' + FundValue + '"');
      rawQuery = rawQuery.replace(/(?<!\$)\{Fund\}/g, "'" + FundValue + "'");
    } else {
      // If variable not provided, first try to remove simple AND/OR conditions
      rawQuery = rawQuery.replace(/AND\s+\w+\s*=\s*'\$\{Fund\}'/gi, "");
      rawQuery = rawQuery.replace(/AND\s+\w+\s*=\s*"\$\{Fund\}"/gi, "");
      rawQuery = rawQuery.replace(/AND\s+\w+\s*=\s*\$\{Fund\}/gi, "");
      rawQuery = rawQuery.replace(/AND\s+\w+\s*=\s*'\{Fund\}'/gi, "");
      rawQuery = rawQuery.replace(/AND\s+\w+\s*=\s*"\{Fund\}"/gi, "");
      rawQuery = rawQuery.replace(/AND\s+\w+\s*=\s*\{Fund\}/gi, "");
      // Then replace any remaining variables with NULL (for complex patterns like: or {var} is null)
      rawQuery = rawQuery.replace(/'\$\{Fund\}'/g, "NULL");
      rawQuery = rawQuery.replace(/"\$\{Fund\}"/g, "NULL");
      rawQuery = rawQuery.replace(/\$\{Fund\}/g, "NULL");
      rawQuery = rawQuery.replace(/'\{Fund\}'/g, "NULL");
      rawQuery = rawQuery.replace(/"\{Fund\}"/g, "NULL");
      rawQuery = rawQuery.replace(/(?<!\$)\{Fund\}/g, "NULL");
    }

    // Replace ${PTJ} or {PTJ} with query.PTJ value
    if (query.PTJ !== undefined && query.PTJ !== null && query.PTJ !== '') {
      // Check if variable is already quoted in SQL, if not add quotes for string values
      const PTJValue = query.PTJ;
      // Replace ${var} patterns - quoted first (keep the quotes)
      rawQuery = rawQuery.replace(/'\$\{PTJ\}'/g, "'" + PTJValue + "'");
      rawQuery = rawQuery.replace(/"\$\{PTJ\}"/g, '"' + PTJValue + '"');
      rawQuery = rawQuery.replace(/\$\{PTJ\}/g, "'" + PTJValue + "'");
      // Replace {var} patterns (without $) - quoted first (keep the quotes)
      rawQuery = rawQuery.replace(/'\{PTJ\}'/g, "'" + PTJValue + "'");
      rawQuery = rawQuery.replace(/"\{PTJ\}"/g, '"' + PTJValue + '"');
      rawQuery = rawQuery.replace(/(?<!\$)\{PTJ\}/g, "'" + PTJValue + "'");
    } else {
      // If variable not provided, first try to remove simple AND/OR conditions
      rawQuery = rawQuery.replace(/AND\s+\w+\s*=\s*'\$\{PTJ\}'/gi, "");
      rawQuery = rawQuery.replace(/AND\s+\w+\s*=\s*"\$\{PTJ\}"/gi, "");
      rawQuery = rawQuery.replace(/AND\s+\w+\s*=\s*\$\{PTJ\}/gi, "");
      rawQuery = rawQuery.replace(/AND\s+\w+\s*=\s*'\{PTJ\}'/gi, "");
      rawQuery = rawQuery.replace(/AND\s+\w+\s*=\s*"\{PTJ\}"/gi, "");
      rawQuery = rawQuery.replace(/AND\s+\w+\s*=\s*\{PTJ\}/gi, "");
      // Then replace any remaining variables with NULL (for complex patterns like: or {var} is null)
      rawQuery = rawQuery.replace(/'\$\{PTJ\}'/g, "NULL");
      rawQuery = rawQuery.replace(/"\$\{PTJ\}"/g, "NULL");
      rawQuery = rawQuery.replace(/\$\{PTJ\}/g, "NULL");
      rawQuery = rawQuery.replace(/'\{PTJ\}'/g, "NULL");
      rawQuery = rawQuery.replace(/"\{PTJ\}"/g, "NULL");
      rawQuery = rawQuery.replace(/(?<!\$)\{PTJ\}/g, "NULL");
    }

    const data = await prisma.$queryRawUnsafe(rawQuery);
    
    // Map to standard label/value format
    // Convention: value = code (for filtering), label = description (for display)
    const mappedData = data.map((item) => {
      const keys = Object.keys(item);
      const values = Object.values(item);
      
      // Check if SQL used 'label' and 'value' aliases
      if (item.value !== undefined && item.label !== undefined) {
        // Detect if aliases are swapped: if 'label' is shorter/simpler than 'value', they're correct
        // If 'label' contains separator like ' - ' or is longer, they're swapped
        const labelStr = String(item.label || "");
        const valueStr = String(item.value || "");
        const labelLooksLikeDescription = labelStr.includes(' - ') || labelStr.includes(' : ') || labelStr.length > valueStr.length + 10;
        
        if (labelLooksLikeDescription) {
          // Swapped: label is actually description, value is actually code
          return { label: item.label || "", value: item.value || "" };
        } else {
          // User has label=code, value=description - need to swap
          return { label: item.value || "", value: item.label || "" };
        }
      }
      
      // Fallback: assume first column is value (code), second is label (description)
      return {
        label: values[1] || values[0] || "",
        value: values[0] || "",
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
