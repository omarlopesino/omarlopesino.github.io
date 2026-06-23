import { promises as fs } from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const gzip = promisify(zlib.gzip);
const brotli = promisify(zlib.brotliCompress);

/**
 * Astro integration: writes .gz and .br siblings for static assets at build end,
 * so the host can serve pre-compressed files instead of compressing on the fly.
 */
export function precompress({ extensions = ['.css', '.js', '.html', '.svg'] } = {}) {
  return {
    name: 'precompress',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        let count = 0;

        const walk = async (current) => {
          for (const entry of await fs.readdir(current, { withFileTypes: true })) {
            const full = path.join(current, entry.name);
            if (entry.isDirectory()) {
              await walk(full);
            } else if (extensions.includes(path.extname(entry.name))) {
              const buf = await fs.readFile(full);
              const [gz, br] = await Promise.all([
                gzip(buf, { level: 9 }),
                brotli(buf),
              ]);
              await fs.writeFile(`${full}.gz`, gz);
              await fs.writeFile(`${full}.br`, br);
              count++;
            }
          }
        };

        await walk(root);
        logger.info(`precompressed ${count} asset(s) (.gz, .br)`);
      },
    },
  };
}
