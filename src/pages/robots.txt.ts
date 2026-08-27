import type { APIContext } from 'astro';

// Crawling stays allowed while the site is noindex: a crawler has to be able to fetch a page to
// read the robots meta tag that keeps it out of the index. Disallow would hide it instead.
export const GET = ({ site, url }: APIContext) => {
  const origin = site ?? new URL(url.origin);

  return new Response(
    [
      'User-agent: *',
      'Allow: /',
      '',
      `Sitemap: ${new URL('sitemap-index.xml', origin).href}`,
      '',
    ].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
};
