import base from './base.config';

export default {
  ...base,
  outputPath: '../reports/unlighthouse-production',
  scanner: {
    ...base.scanner,
    // Cloudflare's injected email-obfuscation redirect: 404s when fetched out of the page context
    // that generated it, and following it hangs Unlighthouse's crawler rather than skipping it.
    exclude: ['/cdn-cgi/*'],
  },
};
