const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

// Escape user-provided text before placing it into HTML
export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);
}

// Escape text and keep its line breaks
export function escapeMultilineHtml(value: string): string {
  return escapeHtml(value).replace(/\r?\n/g, "<br>");
}
