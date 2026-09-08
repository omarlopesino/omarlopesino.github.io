import type { APIContext } from 'astro';

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
