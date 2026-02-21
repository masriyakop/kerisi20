export default defineEventHandler(async (event) => {
  try {
    // Static lookup data (parsed from SQL with literal values)
    // Original: SELECT '3' flc_id, '3' flc_name FROM dual
    const mappedData = [
      {
            "label": "3",
            "value": "3",
            "flc_id": "3",
            "flc_name": "3"
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
