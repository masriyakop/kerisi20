import { readComponentItems, buildResponseData } from "./helpers";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const pageId = query.pageId ? parseInt(query.pageId) : null;
    const componentId = query.componentId ? parseInt(query.componentId) : null;
    const id = query.id ? parseInt(query.id) : null;

    const componentItems = readComponentItems();

    // If id is provided, return single component item with all fields (for editing)
    if (id) {
      const componentItem = componentItems.find((c) => parseInt(c.id) === id);
      if (!componentItem) {
        return {
          statusCode: 404,
          message: "Component Item not found",
        };
      }
      return {
        statusCode: 200,
        message: "Component Item fetched successfully",
        data: componentItem,
      };
    }

    // Filter by pageId and/or componentId if provided
    let filteredComponentItems = componentItems;
    if (pageId) {
      filteredComponentItems = filteredComponentItems.filter((c) => parseInt(c.pageId) === pageId);
    }
    if (componentId) {
      filteredComponentItems = filteredComponentItems.filter((c) => parseInt(c.componentId) === componentId);
    }

    const responseData = buildResponseData(filteredComponentItems);

    return {
      statusCode: 200,
      message: "Component Items fetched successfully",
      data: responseData,
    };
  } catch (error) {
    console.error("Error fetching component items:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch component items",
      error: error.message,
    };
  }
});
