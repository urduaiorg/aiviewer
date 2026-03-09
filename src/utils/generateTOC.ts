export interface TOCItem {
  depth: number;
  slug: string;
  text: string;
}

export function generateTOC(headings: TOCItem[]): TOCItem[] {
  return headings.filter((h) => h.depth >= 2 && h.depth <= 3);
}
