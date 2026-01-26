import { readComponents, buildResponseData } from "./helpers";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const pageId = query.pageId ? parseInt(query.pageId) : null;
    const id = query.id ? parseInt(query.id) : null;

    const components = readComponents();

    // If id is provided, return single component with all fields (for editing)
    if (id) {
      const component = components.find((c) => parseInt(c.id) === id);
      if (!component) {
        return {
          statusCode: 404,
          message: "Component not found",
        };
      }
      return {
        statusCode: 200,
        message: "Component fetched successfully",
        data: component,
      };
    }

    // Filter by pageId if provided
    let filteredComponents = components;
    if (pageId) {
      filteredComponents = components.filter((c) => parseInt(c.pageId) === pageId);
    }

    // Check if raw data is requested (for dropdowns)
    const raw = query.raw === "true" || query.raw === true;
    if (raw) {
      // Return raw data with pageId included
      return {
        statusCode: 200,
        message: "Components fetched successfully",
        data: filteredComponents,
      };
    }

    const responseData = buildResponseData(filteredComponents);

    return {
      statusCode: 200,
      message: "Components fetched successfully",
      data: responseData,
    };
  } catch (error) {
    console.error("Error fetching components:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch components",
      error: error.message,
    };
  }
});
