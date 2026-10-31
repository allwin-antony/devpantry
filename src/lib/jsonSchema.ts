type Property = { node: SchemaNode; optional: boolean };
type SchemaNode =
  | { kind: 'string' | 'number' | 'boolean' | 'null' | 'unknown' }
  | { kind: 'array'; items: SchemaNode }
  | { kind: 'object'; properties: Record<string, Property> }
  | { kind: 'union'; variants: SchemaNode[] };

function merge(nodes: SchemaNode[]): SchemaNode {
  const flattened = nodes.flatMap(node => node.kind === 'union' ? node.variants : [node]);
  const known = flattened.filter(node => node.kind !== 'unknown');
  if (!known.length) return { kind: 'unknown' };
  const groups = new Map<string, SchemaNode[]>();
  for (const node of known) {
    const group = groups.get(node.kind);
    if (group) group.push(node);
    else groups.set(node.kind, [node]);
  }
  const variants: SchemaNode[] = [];
  for (const [kind, group] of groups) {
    if (kind === 'object') {
      const objects = group as Extract<SchemaNode, { kind: 'object' }>[];
      const keys = new Set(objects.flatMap(node => Object.keys(node.properties)));
      const properties: Record<string, Property> = Object.create(null);
      for (const key of keys) {
        const present = objects.filter(node => Object.hasOwn(node.properties, key)).map(node => node.properties[key]);
        properties[key] = { node: merge(present.map(property => property.node)), optional: present.length < objects.length || present.some(property => property.optional) };
      }
      variants.push({ kind: 'object', properties });
    } else if (kind === 'array') {
      variants.push({ kind: 'array', items: merge((group as Extract<SchemaNode, { kind: 'array' }>[]).map(node => node.items)) });
    } else {
      variants.push(group[0]);
    }
  }
  return variants.length === 1 ? variants[0] : { kind: 'union', variants };
}

function infer(value: unknown): SchemaNode {
  if (value === null) return { kind: 'null' };
  if (typeof value === 'string') return { kind: 'string' };
  if (typeof value === 'number') return { kind: 'number' };
  if (typeof value === 'boolean') return { kind: 'boolean' };
  if (Array.isArray(value)) return { kind: 'array', items: merge(value.map(infer)) };
  if (typeof value === 'object') {
    const properties: Record<string, Property> = Object.create(null);
    for (const [key, child] of Object.entries(value)) properties[key] = { node: infer(child), optional: false };
    return { kind: 'object', properties };
  }
  return { kind: 'unknown' };
}

function propertyName(key: string) {
  if (key === '__proto__') return `[${JSON.stringify(key)}]`;
  return /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(key) ? key : JSON.stringify(key);
}

function typescript(node: SchemaNode, indent = ''): string {
  if (node.kind === 'array') return `Array<${typescript(node.items, indent)}>`;
  if (node.kind === 'union') return node.variants.map(member => typescript(member, indent)).join(' | ');
  if (node.kind === 'object') {
    const entries = Object.entries(node.properties);
    if (!entries.length) return 'Record<string, never>';
    return `{\n${entries.map(([key, property]) => `${indent}  ${propertyName(key)}${property.optional ? '?' : ''}: ${typescript(property.node, `${indent}  `)};`).join('\n')}\n${indent}}`;
  }
  return node.kind;
}

function zod(node: SchemaNode, indent = ''): string {
  if (node.kind === 'array') return `z.array(${zod(node.items, indent)})`;
  if (node.kind === 'union') return `z.union([${node.variants.map(member => zod(member, indent)).join(', ')}])`;
  if (node.kind === 'object') {
    const entries = Object.entries(node.properties);
    if (!entries.length) return 'z.object({})';
    return `z.object({\n${entries.map(([key, property]) => `${indent}  ${propertyName(key)}: ${zod(property.node, `${indent}  `)}${property.optional ? '.optional()' : ''},`).join('\n')}\n${indent}})`;
  }
  return `z.${node.kind}()`;
}

export function generateJsonSchemas(input: string) {
  const node = infer(JSON.parse(input));
  const shape = typescript(node);
  return {
    typescript: node.kind === 'object' && Object.keys(node.properties).length
      ? `export interface Root ${shape}`
      : `export type Root = ${shape};`,
    zod: `import { z } from "zod";\n\nexport const rootSchema = ${zod(node)};\n\nexport type Root = z.infer<typeof rootSchema>;`,
  };
}
