import { getNextPageId } from "./helpers";

export default defineEventHandler(async () => {
  try {
    const nextId = getNextPageId();
    return {
      statusCode: 200,
      message: "Next page id fetched successfully",
      data: { nextPageId: nextId },
    };
  } catch (error) {
    console.error("Error getting next page id:", error);
    return {
      statusCode: 500,
      message: "Failed to get next page id",
      error: error.message,
    };
  }
});

