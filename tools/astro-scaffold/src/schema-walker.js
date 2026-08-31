// Walks a Zod v4 schema by its `def.type` discriminator (not by field names) into a flat list of
// PromptField descriptors. Dispatching on type structure rather than known field names is what
// keeps this generic across arbitrary collections/projects.
//
// PromptField shape: { path: string[], label: string, kind: string, optional: boolean,
//   hasDefault: boolean, defaultValue?: unknown, element?: PromptField, options?: unknown[] }

function label(path) {
	return path.join('.');
}

function walkNode(schema, path, optional, hasDefault, defaultValue, warn) {
	const type = schema?.def?.type;

	switch (type) {
		case 'pipe':
			// Unwraps `.transform()`: def.in is the real input schema, def.out is the derived/
			// computed side (e.g. blog's `url`) — never prompted for.
			return walkNode(schema.def.in, path, optional, hasDefault, defaultValue, warn);

		case 'optional':
		case 'nullable':
			return walkNode(schema.def.innerType, path, true, hasDefault, defaultValue, warn);

		case 'default':
			return walkNode(schema.def.innerType, path, true, true, schema.def.defaultValue, warn);

		case 'object': {
			const children = [];
			for (const [key, child] of Object.entries(schema.def.shape)) {
				children.push(...walkNode(child, [...path, key], false, false, undefined, warn));
			}
			// A required nested object (or the top-level schema itself) has nothing to skip, so it
			// flattens directly. An optional/defaulted nested object groups its children behind one
			// skip decision — otherwise a required leaf several levels down (e.g. seo.image.src)
			// would force input even when the user wants to omit the whole optional block.
			if (optional && path.length > 0) {
				return [
					{ path, label: label(path), kind: 'object', optional: true, hasDefault, defaultValue, children },
				];
			}
			return children;
		}

		case 'array': {
			const elementFields = walkNode(schema.def.element, path, false, false, undefined, warn);
			const element = elementFields.length === 1 ? elementFields[0] : null;
			return [
				{
					path,
					label: label(path),
					kind: 'array',
					optional,
					hasDefault,
					defaultValue,
					element,
				},
			];
		}

		case 'enum':
			return [
				{
					path,
					label: label(path),
					kind: 'enum',
					optional,
					hasDefault,
					defaultValue,
					options: Object.values(schema.def.entries),
				},
			];

		case 'union': {
			// A union of only literals (e.g. z.literal('a').or(z.literal('b'))) is effectively an
			// enum with a finite, selectable set of values. Any other union — a mix of full types,
			// or object shapes like reference()'s id-or-object union — has no fixed choice list to
			// select from, so it degrades to a single raw-text prompt in v1.
			const allLiteral = schema.def.options.every((option) => option?.def?.type === 'literal');
			if (allLiteral) {
				const options = schema.def.options.map((option) => option.def.values[0]);
				return [{ path, label: label(path), kind: 'enum', optional, hasDefault, defaultValue, options }];
			}
			return [{ path, label: label(path), kind: 'string', optional, hasDefault, defaultValue }];
		}

		case 'string':
		case 'number':
		case 'boolean':
		case 'date':
		case 'literal':
			return [{ path, label: label(path), kind: type, optional, hasDefault, defaultValue }];

		case 'record':
			return [{ path, label: label(path), kind: 'record', optional, hasDefault, defaultValue }];

		default:
			warn?.(path, type);
			return [{ path, label: label(path), kind: 'string', optional, hasDefault, defaultValue }];
	}
}

export function walkSchema(schema, warn) {
	return walkNode(schema, [], false, false, undefined, warn);
}
