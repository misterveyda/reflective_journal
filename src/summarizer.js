export function summarize(text, style = "bullets") {
  const sentences = text.split(".").map(s => s.trim()).filter(Boolean);
  const keyPoints = sentences.slice(0, 3);

  if (style === "narrative") {
    return keyPoints.join(". ") + ".";
  }

  return keyPoints.map(s => `• ${s}`);
}
