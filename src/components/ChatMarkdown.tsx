import React from "react";
function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  // Match **bold**, `code`, and plain text segments
  const regex = /(\*\*(.+?)\*\*)|(`([^`]+)`)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Push text before match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[2]) {
      // Bold
      parts.push(<strong key={match.index} className="font-semibold">{match[2]}</strong>);
    } else if (match[4]) {
      // Inline code
      parts.push(
        <code key={match.index} className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">
          {match[4]}
        </code>
      );
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

function isTableBlock(lines: string[]): boolean {
  return lines.length >= 2 && lines[0].includes("|") && /^\|?[\s-:|]+\|?$/.test(lines[1]);
}

function renderTable(lines: string[]): React.ReactNode {
  const parseRow = (line: string) =>
    line.split("|").map(c => c.trim()).filter(c => c.length > 0);

  const headers = parseRow(lines[0]);
  const rows = lines.slice(2).filter(l => l.includes("|")).map(parseRow);

  return (
    <div className="overflow-x-auto my-2">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="border border-border/40 px-3 py-1.5 bg-muted/30 font-semibold text-left">
                {renderInline(h)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci} className="border border-border/40 px-3 py-1.5">
                  {renderInline(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ChatMarkdown({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Empty line → spacing
    if (line.trim() === "") {
      elements.push(<div key={i} className="h-2" />);
      i++;
      continue;
    }

    // Table detection
    if (i + 1 < lines.length && isTableBlock(lines.slice(i))) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].includes("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      elements.push(<React.Fragment key={i}>{renderTable(tableLines)}</React.Fragment>);
      continue;
    }

    // Heading (## or ###)
    const headingMatch = line.match(/^(#{1,3})\s+(.+)/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      const className = level === 1
        ? "text-base font-bold mt-2 mb-1"
        : level === 2
        ? "text-sm font-bold mt-2 mb-1"
        : "text-sm font-semibold mt-1.5 mb-0.5";
      elements.push(
        <div key={i} className={className}>{renderInline(text)}</div>
      );
      i++;
      continue;
    }

    // Numbered list (1. or 1) )
    const numberedMatch = line.match(/^(\d+)[.)]\s+(.+)/);
    if (numberedMatch) {
      elements.push(
        <div key={i} className="flex gap-2 ml-1 my-0.5">
          <span className="text-brand-blue font-bold min-w-[1.2rem] text-right">{numberedMatch[1]}.</span>
          <span>{renderInline(numberedMatch[2])}</span>
        </div>
      );
      i++;
      continue;
    }

    // Bullet point (•, -, or *)
    const bulletMatch = line.match(/^[\s]*[•\-*]\s+(.+)/);
    if (bulletMatch) {
      elements.push(
        <div key={i} className="flex gap-2 ml-3 my-0.5">
          <span className="text-brand-blue mt-0.5">•</span>
          <span>{renderInline(bulletMatch[1])}</span>
        </div>
      );
      i++;
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={i} className="my-0.5">{renderInline(line)}</p>
    );
    i++;
  }

  return <div className="space-y-0.5 whitespace-pre-wrap">{elements}</div>;
}
