import { readComponents, writeComponents } from "./helpers";

export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(getRouterParam(event, "id"));

    const components = readComponents();
    const componentIndex = components.findIndex((c) => parseInt(c.id) === id);

    if (componentIndex === -1) {
      return {
        statusCode: 404,
        message: "Component not found",
      };
    }

    // Remove component
    components.splice(componentIndex, 1);
    writeComponents(components);

    return {
      statusCode: 200,
      message: "Component deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting component:", error);
    return {
      statusCode: 500,
      message: "Failed to delete component",
      error: error.message,
    };
  }
});
