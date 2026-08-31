import { build } from 'esbuild';
import { access, mkdir, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { astroContentShimSource } from './astro-content-shim.js';

// Global symbol registry key so a loader tagged inside the dynamically-bundled/imported temp
// module can be read back here without sharing a module instance.
const LOADER_META = Symbol.for('astro-scaffold.loaderMeta');

const CONTENT_SHIM_NAMESPACE = 'astro-scaffold-content-shim';
const LOADERS_WRAPPER_NAMESPACE = 'astro-scaffold-loaders-wrapper';

const CANDIDATE_CONFIG_PATHS = ['src/content.config.ts', 'src/content/config.ts'];

async function findConfigPath(projectRoot) {
	for (const candidate of CANDIDATE_CONFIG_PATHS) {
		const full = path.join(projectRoot, candidate);
		try {
			await access(full);
			return full;
		} catch {
			continue;
		}
	}
	throw new Error(`No content config found. Looked for: ${CANDIDATE_CONFIG_PATHS.join(', ')}`);
}

// Replaces the virtual `astro:content` module (only resolvable inside Astro's own Vite pipeline)
// with our own minimal, plain-Node-importable equivalent.
function astroContentShimPlugin() {
	return {
		name: 'astro-content-shim',
		setup(pluginBuild) {
			pluginBuild.onResolve({ filter: /^astro:content$/ }, () => ({
				path: 'astro:content',
				namespace: CONTENT_SHIM_NAMESPACE,
			}));
			pluginBuild.onLoad({ filter: /.*/, namespace: CONTENT_SHIM_NAMESPACE }, () => ({
				contents: astroContentShimSource,
				loader: 'js',
				resolveDir: pluginBuild.initialOptions.absWorkingDir,
			}));
		},
	};
}

function loaderWrapperSource(realAbsolutePath) {
	const realSpecifier = JSON.stringify(pathToFileURL(realAbsolutePath).href);
	return `
import * as real from ${realSpecifier};

const TAG = Symbol.for('astro-scaffold.loaderMeta');

function tag(loader, meta) {
	loader[TAG] = meta;
	return loader;
}

export function glob(options) {
	return tag(real.glob(options), { kind: 'glob', options });
}

export function file(fileName, options) {
	return tag(real.file(fileName, options), { kind: 'file', fileName, options });
}

export * from ${realSpecifier};
`;
}

// Intercepts calls to glob()/file() from the real, non-virtual `astro/loaders` package: the
// loader objects they return don't expose their base/pattern/generateId options afterward (they're
// closed over internally), so the only way to capture them is at the call site itself. The real
// module's path is resolved once via plain Node resolution (createRequire against the target
// project's own package.json) rather than esbuild's build.resolve(), because calling
// build.resolve() for "astro/loaders" from inside this same plugin's onResolve handler for
// "astro/loaders" would recurse into itself and resolve back to this wrapper.
function astroLoadersInterceptPlugin(projectRoot) {
	const require = createRequire(path.join(projectRoot, 'package.json'));
	const realAbsolutePath = require.resolve('astro/loaders');
	const realFileUrl = pathToFileURL(realAbsolutePath).href;

	return {
		name: 'astro-loaders-intercept',
		setup(pluginBuild) {
			pluginBuild.onResolve({ filter: /^astro\/loaders$/ }, () => ({
				path: 'astro-scaffold-loaders-wrapper',
				namespace: LOADERS_WRAPPER_NAMESPACE,
			}));
			pluginBuild.onLoad({ filter: /.*/, namespace: LOADERS_WRAPPER_NAMESPACE }, () => ({
				contents: loaderWrapperSource(realAbsolutePath),
				loader: 'js',
				resolveDir: pluginBuild.initialOptions.absWorkingDir,
			}));
			// Leave astro's own loader internals (and their nested, possibly non-hoisted
			// dependencies like tinyglobby/picomatch) to be resolved natively by Node at import
			// time, from their real on-disk location, rather than statically bundled by esbuild.
			pluginBuild.onResolve({ filter: /^file:/ }, (args) => {
				if (args.path === realFileUrl) {
					return { path: realFileUrl, external: true };
				}
				return null;
			});
		},
	};
}

// Bundles the target project's content.config.ts with astro:content/astro/loaders intercepted,
// writes it to a temp file inside the project's own node_modules (so bare specifiers like
// "astro/zod" resolve against the project's real dependencies), imports it, then cleans up.
export async function loadContentConfig(projectRoot) {
	const configPath = await findConfigPath(projectRoot);

	const result = await build({
		entryPoints: [configPath],
		bundle: true,
		packages: 'external',
		platform: 'node',
		format: 'esm',
		write: false,
		absWorkingDir: projectRoot,
		logLevel: 'silent',
		plugins: [astroContentShimPlugin(), astroLoadersInterceptPlugin(projectRoot)],
	});

	const tmpDir = path.join(projectRoot, 'node_modules', '.astro-scaffold-tmp');
	const tmpFile = path.join(tmpDir, `content.config.${Date.now()}.${process.pid}.mjs`);

	await mkdir(tmpDir, { recursive: true });
	await writeFile(tmpFile, result.outputFiles[0].text, 'utf8');

	try {
		const mod = await import(pathToFileURL(tmpFile).href);
		if (!mod.collections || typeof mod.collections !== 'object') {
			throw new Error(
				`${path.relative(projectRoot, configPath)} does not export a "collections" object.`,
			);
		}
		return { collections: mod.collections, configPath };
	} finally {
		await rm(tmpFile, { force: true });
		await rm(tmpDir, { recursive: true, force: true }).catch(() => {});
	}
}

export function getLoaderMeta(loader) {
	return loader?.[LOADER_META] ?? null;
}
