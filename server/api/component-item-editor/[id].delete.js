import { readComponentItems, writeComponentItems } from "./helpers";

export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(getRouterParam(event, "id"));

    const componentItems = readComponentItems();
    const componentItemIndex = componentItems.findIndex((c) => parseInt(c.id) === id);

    if (componentItemIndex === -1) {
      return {
        statusCode: 404,
        message: "Component Item not found",
      };
    }

    // Remove component item
    componentItems.splice(componentItemIndex, 1);
    writeComponentItems(componentItems);

    return {
      statusCode: 200,
      message: "Component Item deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting component item:", error);
    return {
      statusCode: 500,
      message: "Failed to delete component item",
      error: error.message,
    };
  }
});
