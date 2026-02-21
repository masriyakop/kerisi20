import { readComponents, writeComponents } from "./helpers";

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

    const components = readComponents();
    const componentIndex = components.findIndex((c) => parseInt(c.id) === id);

    if (componentIndex === -1) {
      return {
        statusCode: 404,
        message: "Component not found",
      };
    }

    // Check for duplicate name (excluding current component)
    const duplicateName = components.find(
      (c) =>
        c.name === body.name &&
        parseInt(c.pageId) === parseInt(body.pageId) &&
        parseInt(c.id) !== id
    );
    if (duplicateName) {
      return {
        statusCode: 400,
        message: "Component with this name already exists for this page",
      };
    }

    // Get current user ID (you may need to adjust this based on your auth system)
    const userId = event.context.user?.id || event.context.userId || "system";

    // Update component
    const updatedComponent = {
      ...components[componentIndex],
      title: body.title,
      name: body.name,
      cssClass: body.cssClass || "",
      type: body.type || "custom",
      collapseEnable: body.collapseEnable || 0,
      collapseByDefault: body.collapseByDefault || 0,
      visible: body.visible !== undefined ? body.visible : 1,
      useExistingOrmModel: body.useExistingOrmModel !== undefined ? body.useExistingOrmModel : 0,
      active: body.active !== undefined ? body.active : 1,
      order: body.order || 1,
      queryMapping: body.queryMapping || "",
      componentData: body.componentData || "",
      updateTimestamp: new Date().toISOString(),
      updatedBy: userId,
    };

    components[componentIndex] = updatedComponent;
    writeComponents(components);

    return {
      statusCode: 200,
      message: "Component updated successfully",
      data: updatedComponent,
    };
  } catch (error) {
    console.error("Error updating component:", error);
    return {
      statusCode: 500,
      message: "Failed to update component",
      error: error.message,
    };
  }
});
