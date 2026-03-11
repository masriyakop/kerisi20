import { callAiEngine } from "~/server/utils/aiEngine";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

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

    const { content, model } = await callAiEngine(config, messages);

    return {
      statusCode: 200,
      message: content ?? "",
      model,
      done: true,
    };
  } catch (error) {
    const engine = config.openai?.apiKey?.trim?.() && config.openai?.model?.trim?.() ? "OpenAI" : "Ollama";
    console.error(`[ai-chat] ${engine} error:`, error?.message || error);

    const status = error?.statusCode || error?.response?.status || 500;
    const message =
      error?.data?.error ||
      error?.message ||
      (config.openai?.apiKey?.trim?.() && config.openai?.model?.trim?.()
        ? "Failed to get response from OpenAI. Check your API key and model."
        : "Failed to get response from AI. Ensure Ollama is running and the model is available.");

    setResponseStatus(event, status);
    return {
      statusCode: status,
      error: message,
    };
  }
});
