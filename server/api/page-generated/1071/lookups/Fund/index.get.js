import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    // Base SQL query
    let rawQuery = `SELECT DISTINCT
    fty_fund_type value,
    CONCAT_WS(' - ', fty_fund_type, fty_fund_desc) label
FROM
    fund_type
WHERE
fty_status = 1;`;
    

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
