#!/usr/bin/env node
import { run } from '../src/cli.js';

const cwdFlagIndex = process.argv.indexOf('--cwd');
const cwd = cwdFlagIndex !== -1 ? process.argv[cwdFlagIndex + 1] : process.cwd();

try {
	await run({ cwd });
} catch (error) {
	console.error(`\nastro-scaffold: ${error.message}`);
	process.exit(1);
}
