export type BreadcrumbItem = { id: string; name: string };

export function parseBreadcrumbs(raw: string | undefined): BreadcrumbItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (i): i is BreadcrumbItem =>
        i != null &&
        typeof i === 'object' &&
        typeof i.id === 'string' &&
        typeof i.name === 'string',
    );
  } catch {
    return [];
  }
}

export function encodeBreadcrumbs(items: BreadcrumbItem[]): string {
  return JSON.stringify(items);
}
