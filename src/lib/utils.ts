export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ')
}

// Minutes to read a markdown body at 200 words per minute, never below one. Counting the raw
// source is close enough at this length and keeps the page free of a remark plugin.
export function readingTime(body: string) {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
