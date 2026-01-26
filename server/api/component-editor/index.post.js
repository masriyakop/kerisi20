import { readComponents, writeComponents, getNextComponentId } from "./helpers";

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

    const components = readComponents();

    // Check for duplicate name (optional - you can remove this if duplicates are allowed)
    const duplicateName = components.find(
      (c) => c.name === body.name && parseInt(c.pageId) === parseInt(body.pageId)
    );
    if (duplicateName) {
      return {
        statusCode: 400,
        message: "Component with this name already exists for this page",
      };
    }

    // Get current user ID (you may need to adjust this based on your auth system)
    const userId = event.context.user?.id || event.context.userId || "system";

    // Create new component
    const newComponent = {
      id: getNextComponentId(),
      pageId: parseInt(body.pageId),
      title: body.title,
      name: body.name,
      cssClass: body.cssClass || "",
      type: body.type || "custom",
      collapseEnable: body.collapseEnable || 0,
      collapseByDefault: body.collapseByDefault || 0,
      visible: body.visible !== undefined ? body.visible : 1,
      active: body.active !== undefined ? body.active : 1,
      order: body.order || 1,
      queryMapping: body.queryMapping || "",
      componentData: body.componentData || "",
      createdTimestamp: new Date().toISOString(),
      createdBy: userId,
      updateTimestamp: null,
      updatedBy: null,
    };

    components.push(newComponent);
    writeComponents(components);

    return {
      statusCode: 200,
      message: "Component created successfully",
      data: newComponent,
    };
  } catch (error) {
    console.error("Error creating component:", error);
    return {
      statusCode: 500,
      message: "Failed to create component",
      error: error.message,
    };
  }
});
