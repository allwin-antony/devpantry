import { JsonToTsZodClient } from '@/components/clients/JsonToTsZodClient';

export default function JsonToTsZodPage({ slug = 'json-to-ts-zod' }: { slug?: string }) {
  const zodFirst = slug === 'json-to-zod';
  const name = zodFirst ? 'JSON to Zod Schema Generator' : 'JSON to TypeScript & Zod';
  const url = `https://devpantry.com/tools/${slug}`;
  const jsonLd = [
    { '@context': 'https://schema.org', '@type': 'WebApplication', name, url, applicationCategory: 'DeveloperApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://devpantry.com' },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://devpantry.com/tools' },
      { '@type': 'ListItem', position: 3, name, item: url },
    ] },
  ];

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <JsonToTsZodClient initialOutput={zodFirst ? 'zod' : 'typescript'}>
      <article className="tool-seo-content prose prose-sm max-w-none dark:prose-invert">
        <h2>{zodFirst ? 'From an API payload to a Zod validation schema' : 'Create TypeScript types from real JSON examples'}</h2>
        <ol>
          <li>Paste a JSON object, array, or primitive value into the input.</li>
          <li>{zodFirst ? 'Review the generated Zod schema. Add application-specific constraints such as email validation or minimum string lengths.' : 'Review the inferred TypeScript interface or type alias. Check optional properties and unions against your API contract.'}</li>
          <li>Copy the output into your project. Switch format to compare compile-time types and runtime validation.</li>
        </ol>
        {zodFirst ? <>
          <h3>Validate a response at runtime</h3>
          <pre><code>{`const result = rootSchema.safeParse(apiResponse);\n\nif (result.success) {\n  console.log(result.data);\n} else {\n  console.log(result.error.issues);\n}`}</code></pre>
          <p>Zod checks values when your application runs. Inferred schemas describe the examples you provide; they cannot discover business rules or field types missing from the sample.</p>
        </> : <>
          <h3>Interfaces, arrays, and primitive roots</h3>
          <p>Object samples generate an interface. An array, string, number, boolean, or null at the root generates a type alias. Use the Zod tab when the response also needs validation at runtime.</p>
          <pre><code>{`// JSON input: [1, "pending", null]\nexport type Root = Array<number | string | null>;`}</code></pre>
        </>}
        <h3>How arrays and optional fields are inferred</h3>
        <p>Every array element is inspected. For <code>{'[{"id":1},{"id":2,"name":"Ada"}]'}</code>, <code>name</code> is optional. Mixed value types become unions. An empty array uses an unknown element type until an example supplies more information.</p>
        <h3>Continue the workflow</h3>
        <p>Use <a href="/tools/api-templates">API response fixtures</a> as examples, then exercise your schema with the <a href="/tools/mock-data">mock data generator</a>. Read the <a href="/guides/json-to-zod-validation">JSON-to-Zod validation guide</a> for a complete example.</p>
      </article>
    </JsonToTsZodClient>
  </>;
}
