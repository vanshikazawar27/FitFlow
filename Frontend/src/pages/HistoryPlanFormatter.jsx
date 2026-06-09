export function cleanAndFormatHistoryText(text, renderers) {
  if (!text) return null;

  const { renderHeading, renderBullet, renderParagraph } = renderers;

  const rawLines = String(text).split("\n");

  // Remove Note/Disclaimer sections and divider lines
  let inSkipBlock = false;
  const cleanedLines = rawLines.filter((line) => {
    const t = (line ?? "").trim();
    if (!t) return false;
    if (/^[*\-\s]{3,}$/.test(t)) return false;

    const lower = t.toLowerCase();
    if (/^#+\s*(note|disclaimer|important note|please note)/i.test(t) || /^\*\*(note|disclaimer)/i.test(t)) {
      inSkipBlock = true;
      return false;
    }
    if (inSkipBlock) {
      if (/^#+\s/.test(t) && !/^#+\s*(note|disclaimer)/i.test(t)) {
        inSkipBlock = false;
        return true;
      }
      return false;
    }
    return true;
  });

  if (cleanedLines.length === 0) return null;

  return (
    <div className="space-y-2 text-slate-700 font-sans leading-relaxed text-sm">
      {cleanedLines.map((line, idx) => {
        let cleanLine = line.trim();

        const isBullet = /^(?:\*|\-)\s+/.test(cleanLine);
        if (isBullet) {
          cleanLine = cleanLine.replace(/^(?:\*|\-)\s+/, "");
        }

        if (cleanLine.startsWith("###")) {
          return renderHeading("###", idx, cleanLine);
        }
        if (cleanLine.startsWith("##")) {
          return renderHeading("##", idx, cleanLine);
        }
        if (cleanLine.startsWith("#")) {
          return renderHeading("#", idx, cleanLine);
        }

        // Render bold sections from **text**.
        const parts = cleanLine.split(/\*\*([^*]+)\*\*/g);
        const renderedText = parts.map((part, i) => {
          if (i % 2 === 1) {
            return (
              <strong key={i} className="text-slate-900 font-bold">
                {part}
              </strong>
            );
          }
          return part;
        });

        if (isBullet) {
          return renderBullet(idx, renderedText);
        }

        return renderParagraph(idx, renderedText);
      })}
    </div>
  );
}

