/**
 * AINA AI Engine - OpenAI when configured, otherwise Ollama.
 * Uses OpenAI if OPENAI_API_KEY and OPENAI_MODEL are set in .env.
 */

/**
 * @param {object} config - useRuntimeConfig()
 * @param {Array<{role: string, content: string}>} messages
 * @param {{ format?: 'json' }} [options]
 * @returns {Promise<{ content: string, model: string }>}
 */
export async function callAiEngine(config, messages, options = {}) {
  const openaiKey = config.openai?.apiKey?.trim?.();
  const openaiModel = config.openai?.model?.trim?.();

  if (openaiKey && openaiModel) {
    return callOpenAI(openaiKey, openaiModel, messages, options);
  }

  return callOllama(config, messages, options);
}

async function callOpenAI(apiKey, model, messages, options) {
  const body = {
    model,
    messages,
    stream: false,
  };
  if (options.format === "json") {
    body.response_format = { type: "json_object" };
  }

  const res = await $fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body,
    timeout: 120000,
  });

  const content = res?.choices?.[0]?.message?.content ?? "";
  return { content, model: res?.model ?? model };
}

async function callOllama(config, messages, options) {
  const ollamaUrl = config.ollama?.url || "http://localhost:11434";
  const ollamaModel = config.ollama?.model || "deepseek-v3.1:671b-cloud";

  const body = {
    model: ollamaModel,
    messages,
    stream: false,
  };
  if (options.format === "json") {
    body.format = "json";
  }

  const res = await $fetch(`${ollamaUrl}/api/chat`, {
    method: "POST",
    body,
    timeout: 120000,
  });

  const content = res?.message?.content ?? "";
  return { content, model: res?.model ?? ollamaModel };
}
