import { readComponentItems, writeComponentItems, getNextComponentItemId } from "./helpers";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // Validation
    if (!body.title || !body.name || body.active === null || body.active === undefined) {
      return {
        statusCode: 400,
        message: "Title, Name, and Active are required fields",
      };
    }

    if (!body.pageId) {
      return {
        statusCode: 400,
        message: "Page ID is required",
      };
    }

    if (!body.componentId) {
      return {
        statusCode: 400,
        message: "Component ID is required",
      };
    }

    const componentItems = readComponentItems();

    // Get current user ID (you may need to adjust this based on your auth system)
    const userId = event.context.user?.id || event.context.userId || "system";

    // Create new component item
    const newComponentItem = {
      id: getNextComponentItemId(),
      pageId: parseInt(body.pageId),
      componentId: parseInt(body.componentId),
      name: body.name,
      title: body.title,
      component: body.component || "",
      type: body.type || "",
      cssClass: body.cssClass || "",
      additionalAttribute: body.additionalAttribute || "",
      defaultValue: body.defaultValue || "",
      lookup_queryMapping: body.lookup_queryMapping || "",
      crudColumn: body.crudColumn || "",
      visible: body.visible !== undefined ? body.visible : 0,
      active: body.active !== undefined ? body.active : 0,
      order: body.order || 1,
      createdTimestamp: new Date().toISOString(),
      createdBy: userId,
      updateTimestamp: null,
      updatedBy: null,
    };

    componentItems.push(newComponentItem);
    writeComponentItems(componentItems);

    return {
      statusCode: 200,
      message: "Component Item created successfully",
      data: newComponentItem,
    };
  } catch (error) {
    console.error("Error creating component item:", error);
    return {
      statusCode: 500,
      message: "Failed to create component item",
      error: error.message,
    };
  }
});
