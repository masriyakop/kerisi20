import { readComponentItems, writeComponentItems } from "./helpers";

export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(getRouterParam(event, "id"));
    const body = await readBody(event);

    // Validation
    if (!body.title || !body.name || body.active === null || body.active === undefined) {
      return {
        statusCode: 400,
        message: "Title, Name, and Active are required fields",
      };
    }

    const componentItems = readComponentItems();
    const componentItemIndex = componentItems.findIndex((c) => parseInt(c.id) === id);

    if (componentItemIndex === -1) {
      return {
        statusCode: 404,
        message: "Component Item not found",
      };
    }

    // Get current user ID (you may need to adjust this based on your auth system)
    const userId = event.context.user?.id || event.context.userId || "system";

    // Update component item
    const updatedComponentItem = {
      ...componentItems[componentItemIndex],
      name: body.name,
      title: body.title,
      component: body.component || "",
      componentId: body.componentId ? parseInt(body.componentId) : componentItems[componentItemIndex].componentId,
      type: body.type || "",
      cssClass: body.cssClass || "",
      additionalAttribute: body.additionalAttribute || "",
      defaultValue: body.defaultValue || "",
      lookup_queryMapping: body.lookup_queryMapping || "",
      crudColumn: body.crudColumn || "",
      visible: body.visible !== undefined ? body.visible : 0,
      active: body.active !== undefined ? body.active : 0,
      order: body.order || 1,
      updateTimestamp: new Date().toISOString(),
      updatedBy: userId,
    };

    componentItems[componentItemIndex] = updatedComponentItem;
    writeComponentItems(componentItems);

    return {
      statusCode: 200,
      message: "Component Item updated successfully",
      data: updatedComponentItem,
    };
  } catch (error) {
    console.error("Error updating component item:", error);
    return {
      statusCode: 500,
      message: "Failed to update component item",
      error: error.message,
    };
  }
});
