// Every @1x/@2x pair generate-image-variants.mjs writes lives in sibling folders named after
// their own dimensions — /960x540/ + /480x270/, /400x400/ + /200x200/ — with the small one always
// exactly half. Deriving the small path from the large one's folder name this way means adding a
// new pair (a new ratio, or a new purpose at an existing one) needs no change here.
export function coverSrcSet(src: string): string {
    const match = src.match(/^\/(\d+)x(\d+)\//);
    if (!match) return src;
    const [full, width, height] = match;
    const smallWidth = Number(width) / 2;
    const small = src.replace(full, `/${smallWidth}x${Number(height) / 2}/`);
    return `${small} ${smallWidth}w, ${src} ${width}w`;
}
