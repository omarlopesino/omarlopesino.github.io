// Runs inside the ghcr.io/puppeteer/puppeteer image the Makefile pins (see PUPPETEER_IMAGE
// there). --no-sandbox lets Chrome run without the SYS_ADMIN capability that image otherwise
// needs, and executablePath points at the Chrome it ships with instead of letting whichever
// puppeteer version @unlighthouse/cli installs try to download its own. If the pinned image tag
// changes, this path (which is versioned) must be updated to match.
export default {
  outputPath: 'report',
  // Pages carry hreflang links back to the real https://omarlopesino.me origin (BASE_URL), which
  // otherwise makes Unlighthouse treat every page as a foreign-language alternate and skip it.
  scanner: {
    ignoreI18nPages: false,
  },
  puppeteerOptions: {
    headless: true,
    executablePath: '/home/pptruser/.cache/puppeteer/chrome/linux-152.0.7977.54/chrome-linux64/chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--ignore-certificate-errors'],
  },
};
