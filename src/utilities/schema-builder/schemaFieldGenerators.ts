import { 
  DIRTY_NAMES, 
  DIRTY_EMAILS, 
  DIRTY_ADDRESSES, 
  DIRTY_PHONES,
  DIRTY_URLS,
  NAUGHTY_STRINGS 
} from '../chaos-data/chaosDataEngine';

export type FieldTypeId = 
  | 'uuid'
  | 'name'
  | 'email'
  | 'address'
  | 'phone'
  | 'integer'
  | 'float'
  | 'boolean'
  | 'date'
  | 'enum'
  | 'naughty'
  | 'url'
  | 'json_blob';

export interface FieldTypeDefinition {
  id: FieldTypeId;
  label: string;
  category: 'Identity' | 'Contact' | 'Numeric' | 'System' | 'Complex';
  defaultName: string;
  description: string;
}

export const AVAILABLE_FIELD_TYPES: FieldTypeDefinition[] = [
  { id: 'uuid', label: 'UUID / ID', category: 'Identity', defaultName: 'id', description: 'v4 UUIDs, zero-UUIDs, null representations' },
  { id: 'name', label: 'Full Name', category: 'Identity', defaultName: 'full_name', description: 'Multilingual, diacritics, untrimmed, compound names' },
  { id: 'email', label: 'Email Address', category: 'Contact', defaultName: 'email', description: 'Nested tags, unicode domains, extreme length' },
  { id: 'address', label: 'Mailing Address', category: 'Contact', defaultName: 'address', description: 'Multiline street lines, international formats' },
  { id: 'phone', label: 'Phone Number', category: 'Contact', defaultName: 'phone', description: 'International country codes, extensions, bad formatting' },
  { id: 'integer', label: 'Integer', category: 'Numeric', defaultName: 'quantity', description: 'Min/max boundaries, negative, zero, overflows' },
  { id: 'float', label: 'Float / Currency', category: 'Numeric', defaultName: 'amount', description: '0.1+0.2 precision traps, 18-decimal fractions' },
  { id: 'boolean', label: 'Boolean Flag', category: 'System', defaultName: 'is_active', description: 'true/false with null and falsy string anomalies' },
  { id: 'date', label: 'Date / Timestamp', category: 'System', defaultName: 'created_at', description: 'Epoch 0, Y2038 bug, timezone offset traps' },
  { id: 'enum', label: 'Enum / Status', category: 'System', defaultName: 'status', description: 'Configurable options with stray values' },
  { id: 'url', label: 'Web URL', category: 'System', defaultName: 'website_url', description: 'Punycode, query param floods, localhost' },
  { id: 'naughty', label: 'Naughty String (BLNS)', category: 'Complex', defaultName: 'notes', description: 'Unicode zalgo, script injection fragments' },
  { id: 'json_blob', label: 'JSON Metadata', category: 'Complex', defaultName: 'metadata', description: 'Nested objects, recursive traps, null values' }
];

export interface SchemaFieldConfig {
  id: string;
  name: string;
  type: FieldTypeId;
  chaosLevel: number; // 0 - 100
  options?: string; // for enum options e.g. "pending, active, suspended"
}

export interface DomainTemplate {
  id: string;
  name: string;
  description: string;
  fields: SchemaFieldConfig[];
}

export const DOMAIN_TEMPLATES: DomainTemplate[] = [
  {
    id: 'user-profile',
    name: 'User Profile & Auth',
    description: 'User accounts with names, emails, roles, phone, and MFA flags.',
    fields: [
      { id: 'f_1', name: 'user_id', type: 'uuid', chaosLevel: 50 },
      { id: 'f_2', name: 'full_name', type: 'name', chaosLevel: 75 },
      { id: 'f_3', name: 'email', type: 'email', chaosLevel: 70 },
      { id: 'f_4', name: 'phone_number', type: 'phone', chaosLevel: 60 },
      { id: 'f_5', name: 'role', type: 'enum', chaosLevel: 40, options: 'member, admin, auditor, suspended, guest' },
      { id: 'f_6', name: 'is_verified', type: 'boolean', chaosLevel: 30 },
      { id: 'f_7', name: 'registered_at', type: 'date', chaosLevel: 50 }
    ]
  },
  {
    id: 'ecommerce-item',
    name: 'E-Commerce Product',
    description: 'Products with SKUs, titles, inventory counts, and prices.',
    fields: [
      { id: 'f_1', name: 'product_id', type: 'uuid', chaosLevel: 30 },
      { id: 'f_2', name: 'sku', type: 'enum', chaosLevel: 50, options: 'SKU-001, SKU-002-TEST, SKU-PROMO-99' },
      { id: 'f_3', name: 'product_name', type: 'name', chaosLevel: 80 },
      { id: 'f_4', name: 'price', type: 'float', chaosLevel: 70 },
      { id: 'f_5', name: 'stock_quantity', type: 'integer', chaosLevel: 65 },
      { id: 'f_6', name: 'in_stock', type: 'boolean', chaosLevel: 40 },
      { id: 'f_7', name: 'product_url', type: 'url', chaosLevel: 50 }
    ]
  },
  {
    id: 'transaction-record',
    name: 'Billing Transaction',
    description: 'Ledger entries with amounts, currency codes, status, and notes.',
    fields: [
      { id: 'f_1', name: 'transaction_id', type: 'uuid', chaosLevel: 40 },
      { id: 'f_2', name: 'customer_email', type: 'email', chaosLevel: 60 },
      { id: 'f_3', name: 'amount', type: 'float', chaosLevel: 85 },
      { id: 'f_4', name: 'currency', type: 'enum', chaosLevel: 50, options: 'USD, EUR, GBP, JPY, BTC, KWD' },
      { id: 'f_5', name: 'status', type: 'enum', chaosLevel: 45, options: 'authorized, captured, failed, refunded, disputed' },
      { id: 'f_6', name: 'timestamp', type: 'date', chaosLevel: 60 },
      { id: 'f_7', name: 'notes', type: 'naughty', chaosLevel: 90 }
    ]
  },
  {
    id: 'api-response',
    name: 'API Telemetry & Logs',
    description: 'API request diagnostics, latency metrics, and payload metadata.',
    fields: [
      { id: 'f_1', name: 'request_id', type: 'uuid', chaosLevel: 30 },
      { id: 'f_2', name: 'status_code', type: 'integer', chaosLevel: 60 },
      { id: 'f_3', name: 'endpoint', type: 'url', chaosLevel: 55 },
      { id: 'f_4', name: 'latency_ms', type: 'float', chaosLevel: 75 },
      { id: 'f_5', name: 'timestamp', type: 'date', chaosLevel: 40 },
      { id: 'f_6', name: 'payload_metadata', type: 'json_blob', chaosLevel: 80 }
    ]
  }
];

// Helper to generate a clean v4 UUID
function generateCleanUuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Field value generator
export function generateFieldValue(
  field: SchemaFieldConfig, 
  globalEntropy: number, 
  rowIndex: number
): any {
  // Effective chaos is a combination of field-level and global entropy
  const effectiveChaos = Math.min(100, Math.max(0, (field.chaosLevel * 0.6) + (globalEntropy * 0.4)));
  const isDirty = Math.random() < (effectiveChaos / 100);

  switch (field.type) {
    case 'uuid':
      if (isDirty) {
        const roll = Math.random();
        if (roll < 0.25) return '00000000-0000-0000-0000-000000000000';
        if (roll < 0.5) return 'null';
        if (roll < 0.75) return generateCleanUuid().toUpperCase();
        return `uuid_${Math.random().toString(36).substring(2, 8)}_invalid_len`;
      }
      return generateCleanUuid();

    case 'name':
      if (isDirty) {
        return DIRTY_NAMES[Math.floor(Math.random() * DIRTY_NAMES.length)];
      }
      return `User ${rowIndex + 1}`;

    case 'email':
      if (isDirty) {
        return DIRTY_EMAILS[Math.floor(Math.random() * DIRTY_EMAILS.length)];
      }
      return `user${rowIndex + 1}@example.com`;

    case 'address':
      if (isDirty) {
        return DIRTY_ADDRESSES[Math.floor(Math.random() * DIRTY_ADDRESSES.length)];
      }
      return `${100 + rowIndex} Broadway Ave, Apt ${rowIndex + 1}`;

    case 'phone':
      if (isDirty) {
        return DIRTY_PHONES[Math.floor(Math.random() * DIRTY_PHONES.length)];
      }
      return `+1-202-555-01${rowIndex < 10 ? '0' + rowIndex : rowIndex}`;

    case 'integer':
      if (isDirty) {
        const roll = Math.random();
        if (roll < 0.25) return 0;
        if (roll < 0.5) return -1;
        if (roll < 0.75) return 999999999;
        return null;
      }
      return Math.floor(Math.random() * 100) + 1;

    case 'float':
      if (isDirty) {
        const roll = Math.random();
        if (roll < 0.3) return 0.1 + 0.2; // Javascript precision trap: 0.30000000000000004
        if (roll < 0.55) return -49.99; // Negative price
        if (roll < 0.75) return 0.00000001; // Tiny crypto fraction
        if (roll < 0.9) return 99999999.99;
        return null;
      }
      return parseFloat((Math.random() * 100 + 5).toFixed(2));

    case 'boolean':
      if (isDirty) {
        const roll = Math.random();
        if (roll < 0.35) return null;
        if (roll < 0.65) return (rowIndex % 2 === 0);
        return false;
      }
      return Math.random() > 0.5;

    case 'date':
      if (isDirty) {
        const roll = Math.random();
        if (roll < 0.3) return '1970-01-01T00:00:00.000Z'; // Unix epoch 0
        if (roll < 0.6) return '2038-01-19T03:14:07.000Z'; // 32-bit timestamp overflow
        if (roll < 0.8) return '9999-12-31T23:59:59.999Z'; // Far future
        return '0000-00-00T00:00:00Z'; // Invalid date format
      }
      return new Date(Date.now() - rowIndex * 86400000).toISOString();

    case 'enum': {
      const options = (field.options || 'active, pending, suspended')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
      const safeOptions = options.length > 0 ? options : ['default_1', 'default_2'];
      if (isDirty) {
        const roll = Math.random();
        if (roll < 0.35) return safeOptions[0].toUpperCase();
        if (roll < 0.6) return 'UNKNOWN_STATUS_CODE';
        if (roll < 0.8) return '';
        return null;
      }
      return safeOptions[rowIndex % safeOptions.length];
    }

    case 'url':
      if (isDirty) {
        return DIRTY_URLS[Math.floor(Math.random() * DIRTY_URLS.length)];
      }
      return `https://cdn.example.com/assets/${rowIndex + 1}.png`;

    case 'naughty':
      return NAUGHTY_STRINGS[(rowIndex + Math.floor(Math.random() * 5)) % NAUGHTY_STRINGS.length];

    case 'json_blob':
      if (isDirty) {
        const roll = Math.random();
        if (roll < 0.3) return { _error: "Unhandled circular or deep nest", depth: 99, keys: null };
        if (roll < 0.6) return {};
        if (roll < 0.8) return { tags: ["\u200Bzero_width", "🚀".repeat(10)] };
        return null;
      }
      return { tag: `item_${rowIndex + 1}`, active: true, retries: rowIndex };

    default:
      return `Val_${rowIndex + 1}`;
  }
}

// Generate data records from schema config
export function generateFromSchema(
  fields: SchemaFieldConfig[],
  count: number,
  globalEntropy: number
): Record<string, any>[] {
  if (!fields || fields.length === 0) return [];

  return Array.from({ length: count }, (_, rowIdx) => {
    const row: Record<string, any> = {};
    for (const field of fields) {
      const key = field.name.trim() || `field_${field.id}`;
      row[key] = generateFieldValue(field, globalEntropy, rowIdx);
    }
    return row;
  });
}

// Multi-format exporter supporting JSON, CSV, TypeScript, Zod, SQL Insert, MSW v2, and Prisma Seed
export function exportSchemaData(
  data: Record<string, any>[],
  format: 'json' | 'csv' | 'typescript' | 'zod' | 'sql' | 'msw' | 'prisma'
): string {
  if (!data || data.length === 0) return '';

  switch (format) {
    case 'json':
      return JSON.stringify(data, null, 2);

    case 'csv': {
      const headers = Object.keys(data[0]);
      const csvRows = [
        headers.map(h => `"${h.replace(/"/g, '""')}"`).join(',')
      ];
      for (const row of data) {
        const values = headers.map(header => {
          const val = row[header];
          if (val === null || val === undefined) return '""';
          const stringVal = typeof val === 'object' ? JSON.stringify(val) : String(val);
          return `"${stringVal.replace(/"/g, '""')}"`;
        });
        csvRows.push(values.join(','));
      }
      return csvRows.join('\n');
    }

    case 'typescript': {
      const sample = data[0];
      const inferType = (val: any): string => {
        if (val === null) return 'string | null';
        if (typeof val === 'number') return 'number';
        if (typeof val === 'boolean') return 'boolean';
        if (Array.isArray(val)) return 'any[]';
        if (typeof val === 'object') return 'Record<string, any>';
        return 'string';
      };

      const fields = Object.entries(sample)
        .map(([key, val]) => `  ${key}: ${inferType(val)};`)
        .join('\n');

      return `export interface CustomDataRecord {\n${fields}\n}\n\nexport const MOCK_RECORDS: CustomDataRecord[] = ${JSON.stringify(data, null, 2)};`;
    }

    case 'zod': {
      const sample = data[0];
      const inferZod = (val: any): string => {
        if (val === null) return 'z.string().nullable()';
        if (typeof val === 'number') return 'z.number().nullable()';
        if (typeof val === 'boolean') return 'z.boolean().nullable()';
        if (Array.isArray(val)) return 'z.array(z.any())';
        if (typeof val === 'object') return 'z.record(z.any()).nullable()';
        return 'z.string()';
      };

      const fields = Object.entries(sample)
        .map(([key, val]) => `  ${key}: ${inferZod(val)},`)
        .join('\n');

      return `import { z } from 'zod';\n\nexport const CustomRecordSchema = z.object({\n${fields}\n});\n\nexport type CustomRecord = z.infer<typeof CustomRecordSchema>;`;
    }

    case 'sql': {
      const tableName = 'custom_mock_data';
      const headers = Object.keys(data[0]);
      const columnsList = headers.map(h => `"${h}"`).join(', ');

      const valuesLines = data.map(row => {
        const vals = headers.map(header => {
          const val = row[header];
          if (val === null || val === undefined) return 'NULL';
          if (typeof val === 'number') return isNaN(val) ? 'NULL' : String(val);
          if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
          const str = typeof val === 'object' ? JSON.stringify(val) : String(val);
          return `'${str.replace(/'/g, "''")}'`;
        });
        return `  (${vals.join(', ')})`;
      });

      return `INSERT INTO ${tableName} (${columnsList})\nVALUES\n${valuesLines.join(',\n')};`;
    }

    case 'msw': {
      return `import { http, HttpResponse } from 'msw';\n\nexport const handlers = [\n  http.get('/api/mock-data', () => {\n    return HttpResponse.json(${JSON.stringify(data, null, 2)});\n  }),\n];`;
    }

    case 'prisma': {
      return `import { PrismaClient } from '@prisma/client';\n\nconst prisma = new PrismaClient();\n\nasync function main() {\n  const records = ${JSON.stringify(data, null, 2)};\n\n  console.log('Seeding custom mock records...');\n  await prisma.mockRecord.createMany({\n    data: records,\n    skipDuplicates: true,\n  });\n  console.log(\`Successfully seeded \${records.length} records!\`);\n}\n\nmain()\n  .catch((e) => {\n    console.error(e);\n    process.exit(1);\n  })\n  .finally(async () => {\n    await prisma.$disconnect();\n  });`;
    }

    default:
      return JSON.stringify(data, null, 2);
  }
}
