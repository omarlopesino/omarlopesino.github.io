// Post/category covers are generated in a @1x/@2x pair (see scripts/generate-image-variants.mjs)
// living in sibling folders named after their own dimensions — /960x540/ + /480x270/ — with the
// small one always exactly half. Deriving the small path from the large one's folder name this
// way, rather than a lookup table, means a future pair at a different ratio needs no change here.
export function coverSrcSet(src: string): string {
    const match = src.match(/^\/(\d+)x(\d+)\//);
    if (!match) return src;
    const [full, width, height] = match;
    const smallWidth = Number(width) / 2;
    const small = src.replace(full, `/${smallWidth}x${Number(height) / 2}/`);
    return `${small} ${smallWidth}w, ${src} ${width}w`;
}
