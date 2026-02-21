export default defineEventHandler(async (event) => {
  try {
    // Static lookup data (parsed from SQL with literal values)
    // Original: SELECT 'ACTIVE' flc_id, 'ACTIVE' flc_name FROM dual UNION SELECT 'INACTIVE' flc_id, 'INACTIVE' flc_name FROM dual
    const mappedData = [
      {
            "label": "ACTIVE",
            "value": "ACTIVE",
            "flc_id": "ACTIVE",
            "flc_name": "ACTIVE"
      },
      {
            "label": "INACTIVE",
            "value": "INACTIVE",
            "flc_id": "INACTIVE",
            "flc_name": "INACTIVE"
      }
];

    return {
      statusCode: 200,
      message: "Lookup data fetched successfully",
      data: mappedData,
    };
  } catch (error) {
    console.error("Error fetching lookup data:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch lookup data",
      error: "development" === 'development' ? error.message : "An error occurred while fetching lookup data",
    };
  }
});
