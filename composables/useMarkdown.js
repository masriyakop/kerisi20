import { marked } from "marked";

/**
 * Renders markdown to HTML for safe display in chat messages.
 * Converts **bold**, `code`, lists, etc. to proper HTML.
 */
export function useMarkdown() {
  const render = (text) => {
    if (!text || typeof text !== "string") return "";
    try {
      return marked.parse(text, {
        gfm: true,
        breaks: true,
      });
    } catch {
      return text;
    }
  };

  return { render };
}
