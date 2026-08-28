// Shared by local.config.ts and production.config.ts. Runs inside the ghcr.io/puppeteer/puppeteer
// image the Makefile pins (see PUPPETEER_IMAGE there). --no-sandbox lets Chrome run without the
// SYS_ADMIN capability that image otherwise needs, and executablePath points at the Chrome it
// ships with instead of letting whichever puppeteer version @unlighthouse/cli installs try to
// download its own. If the pinned image tag changes, this path (which is versioned) must be
// updated to match.
export default {
  // Every page carries an x-default hreflang alternate (Astro's i18n routing), which Unlighthouse
  // otherwise reads as "this page is a foreign-language alternate of x-default" and skips — true
  // whether the origin matches (production) or not (local, since hreflang always points at the
  // real https://omarlopesino.me origin from BASE_URL).
  scanner: {
    ignoreI18nPages: false,
  },
  puppeteerOptions: {
    headless: true,
    executablePath: '/home/pptruser/.cache/puppeteer/chrome/linux-152.0.7977.54/chrome-linux64/chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--ignore-certificate-errors'],
  },
};
