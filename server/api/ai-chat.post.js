export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const ollamaUrl = config.ollama?.url || "http://localhost:11434";
  const ollamaModel = config.ollama?.model || "deepseek-v3.1:671b-cloud";

  try {
    const body = await readBody(event);
    const { messages } = body || {};

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      setResponseStatus(event, 400);
      return {
        statusCode: 400,
        error: "messages array is required",
      };
    }

    const response = await $fetch(`${ollamaUrl}/api/chat`, {
      method: "POST",
      body: {
        model: ollamaModel,
        messages,
        stream: false,
      },
      timeout: 120000, // 2 min for large models
    });

    return {
      statusCode: 200,
      message: response.message?.content ?? "",
      model: response.model,
      done: response.done,
    };
  } catch (error) {
    console.error("[ai-chat] Ollama proxy error:", error?.message || error);

    const status = error?.statusCode || error?.response?.status || 500;
    const message =
      error?.data?.error ||
      error?.message ||
      "Failed to get response from AI. Ensure Ollama is running and the model is available.";

    setResponseStatus(event, status);
    return {
      statusCode: status,
      error: message,
    };
  }
});
