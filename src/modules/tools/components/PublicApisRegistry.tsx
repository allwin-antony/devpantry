import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import publicApisData from '@/data/public-apis.json';
import { Search, ExternalLink, ShieldCheck, ShieldAlert, Globe, Lock, ChevronLeft, ChevronRight, ChevronDown, ArrowRight, Blocks } from 'lucide-react';
import { triggerFeedbackNudge } from '@/lib/feedbackNudge';

interface PublicApiEntry {
  API: string;
  Description: string;
  Auth: string;
  HTTPS: boolean;
  CORS: string;
  Link: string;
  Category: string;
}

const typedPublicApisData = publicApisData as PublicApiEntry[];

function CustomSelect({ value, onChange, options, icon: Icon, minWidth = '140px' }: { value: string, onChange: (v: string) => void, options: {value: string, label: string}[], icon?: any, minWidth?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const selectedLabel = options.find(o => o.value === value)?.label || value;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2 bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--text-primary)] hover:border-[var(--text-tertiary)] transition-colors text-left focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        style={{ minWidth }}
      >
        <div className="flex items-center gap-2 truncate">
          {Icon && <Icon className="w-4 h-4 text-[var(--text-tertiary)] shrink-0" />}
          <span className="truncate">{selectedLabel}</span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-[var(--text-tertiary)] shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute z-20 top-full left-0 mt-1.5 w-full min-w-[max-content] bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-lg shadow-xl overflow-hidden py-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="max-h-[300px] overflow-y-auto">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-3.5 py-1.5 text-sm transition-colors ${
                  opt.value === value 
                    ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium' 
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-sidebar)] hover:text-[var(--text-primary)]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PublicApisRegistry() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [authFilter, setAuthFilter] = useState<string>('All');
  const [corsFilter, setCorsFilter] = useState<string>('All');
  const [httpsFilter, setHttpsFilter] = useState<boolean>(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(typedPublicApisData.map(api => api.Category));
    return ['All', ...Array.from(cats)].sort();
  }, []);

  const categoryOptions = useMemo(() => categories.map(cat => ({ value: cat, label: cat === 'All' ? 'All Categories' : cat })), [categories]);

  // Filter data
  const filteredData = useMemo(() => {
    setCurrentPage(1); // Reset to page 1 when filters change
    return typedPublicApisData.filter(api => {
      const matchesSearch = 
        api.API.toLowerCase().includes(searchTerm.toLowerCase()) || 
        api.Description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || api.Category === selectedCategory;
      
      const authVal = api.Auth ? api.Auth.toLowerCase().replace(/`/g, '') : 'none';
      const matchesAuth = 
        authFilter === 'All' || 
        (authFilter === 'None' && authVal === 'none') ||
        (authFilter === 'API Key' && authVal.includes('apikey')) ||
        (authFilter === 'OAuth' && authVal.includes('oauth'));

      const matchesCors = corsFilter === 'All' || api.CORS === corsFilter;
      const matchesHttps = !httpsFilter || api.HTTPS === true;

      return matchesSearch && matchesCategory && matchesAuth && matchesCors && matchesHttps;
    });
  }, [searchTerm, selectedCategory, authFilter, corsFilter, httpsFilter]);

  // Paginate data
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  // Prepare structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Public APIs Registry',
    description: 'A massive collective list of 3,000+ free APIs for use in software and web development. Data is sourced from community-driven repositories.',
    url: 'https://devpantry.com/tools/public-apis',
    creator: {
      '@type': 'Organization',
      name: 'DevPantry Community'
    },
    license: 'https://creativecommons.org/licenses/by-sa/3.0/',
    isAccessibleForFree: true,
    keywords: ['public apis', 'free apis', 'developer tools', ...categories.slice(1, 10)]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Public APIs Registry</h1>
          <p className="text-[var(--text-secondary)]">
            A collective list of 3,000+ free APIs for use in software and web development.
            Data is sourced from community-driven repositories.
          </p>
        </div>
        <Link
          href="/tools/mcp-registry"
          className="inline-flex items-center gap-2.5 px-4 py-2 text-sm font-medium rounded-xl border border-[var(--border-dev)] bg-[var(--bg-panel)] hover:bg-[var(--bg-sidebar)] text-[var(--text-primary)] hover:border-cyan-500/40 shadow-sm transition-all group shrink-0"
        >
          <div className="w-2 h-2 rounded-full bg-cyan-500 group-hover:scale-125 transition-transform" />
          <span>Browse 4,000+ AI MCP Servers</span>
          <ArrowRight className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-cyan-500 group-hover:translate-x-0.5 transition-all" />
        </Link>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
            <input
              type="text"
              placeholder="Search 3,000+ APIs by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
          </div>
          <CustomSelect
            value={selectedCategory}
            onChange={setSelectedCategory}
            options={categoryOptions}
            minWidth="200px"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 p-3 bg-[var(--bg-sidebar)] border border-[var(--border-dev)] rounded-xl shadow-sm">
          <CustomSelect
            value={authFilter}
            onChange={setAuthFilter}
            icon={Lock}
            options={[
              { value: 'All', label: 'Any Auth' },
              { value: 'None', label: 'No Auth Required' },
              { value: 'API Key', label: 'API Key' },
              { value: 'OAuth', label: 'OAuth' }
            ]}
          />

          <CustomSelect
            value={corsFilter}
            onChange={setCorsFilter}
            icon={Globe}
            options={[
              { value: 'All', label: 'CORS: Any' },
              { value: 'Yes', label: 'CORS: Yes' },
              { value: 'No', label: 'CORS: No' },
              { value: 'Unknown', label: 'CORS: Unknown' }
            ]}
          />

          <button
            onClick={() => setHttpsFilter(!httpsFilter)}
            className={`ml-auto flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium border transition-all duration-200 ${
              httpsFilter 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400 shadow-sm' 
                : 'bg-[var(--bg-panel)] border-[var(--border-dev)] text-[var(--text-secondary)] hover:bg-[var(--bg-body)]'
            }`}
          >
            <ShieldCheck className={`w-4 h-4 transition-transform ${httpsFilter ? 'scale-110 text-emerald-500 dark:text-emerald-400' : 'text-[var(--text-tertiary)] grayscale opacity-70'}`} />
            HTTPS Only
          </button>
        </div>
      </div>

      <div className="bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-dev)] bg-[var(--bg-sidebar)]">
                <th className="py-3 px-4 text-sm font-semibold text-[var(--text-secondary)]">API</th>
                <th className="py-3 px-4 text-sm font-semibold text-[var(--text-secondary)]">Description</th>
                <th className="py-3 px-4 text-sm font-semibold text-[var(--text-secondary)]">Auth</th>
                <th className="py-3 px-4 text-sm font-semibold text-[var(--text-secondary)]">HTTPS</th>
                <th className="py-3 px-4 text-sm font-semibold text-[var(--text-secondary)]">CORS</th>
                <th className="py-3 px-4 text-sm font-semibold text-[var(--text-secondary)]">Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-dev)] text-sm">
              {currentData.length > 0 ? (
                currentData.map((api, index) => (
                  <tr key={index} className="hover:bg-[var(--bg-sidebar)] transition-colors">
                    <td className="py-3 px-4">
                      <a
                        href={api.Link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => triggerFeedbackNudge('public-apis-visit')}
                        className="font-medium text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1.5"
                      >
                        {api.API}
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </td>
                    <td className="py-3 px-4 text-[var(--text-secondary)]">{api.Description}</td>
                    <td className="py-3 px-4">
                      {api.Auth ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[var(--bg-body)] text-xs font-medium text-[var(--text-secondary)] border border-[var(--border-dev)]">
                          <Lock className="w-3 h-3" />
                          {api.Auth.replace(/`/g, '')}
                        </span>
                      ) : (
                        <span className="text-[var(--text-tertiary)] italic">None</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {api.HTTPS ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                          <ShieldCheck className="w-4 h-4" /> Yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
                          <ShieldAlert className="w-4 h-4" /> No
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        api.CORS === 'Yes' 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                          : api.CORS === 'No'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'
                            : 'bg-[var(--bg-body)] text-[var(--text-secondary)]'
                      }`}>
                        {api.CORS}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[var(--bg-body)] text-[var(--text-secondary)] border border-[var(--border-dev)]">
                        {api.Category}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[var(--text-tertiary)]">
                    No APIs found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between text-sm text-[var(--text-tertiary)] gap-4">
        <div>
          Showing {Math.min(filteredData.length, (currentPage - 1) * itemsPerPage + 1)} to {Math.min(filteredData.length, currentPage * itemsPerPage)} of {filteredData.length} APIs
        </div>
        
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1 rounded hover:bg-[var(--bg-panel)] disabled:opacity-50 disabled:cursor-not-allowed border border-[var(--border-dev)] bg-[var(--bg-body)]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1 rounded hover:bg-[var(--bg-panel)] disabled:opacity-50 disabled:cursor-not-allowed border border-[var(--border-dev)] bg-[var(--bg-body)]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <article className="mt-12 tool-seo-content prose prose-sm max-w-none dark:prose-invert">
        <h2>Free Public APIs for Web Development</h2>
        <p>
          Discover over 3,000 free, public APIs for your next side project, hackathon, or startup. We've aggregated data from multiple community-driven repositories to provide a single, searchable interface for finding APIs across categories like Finance, Weather, Sports, and Machine Learning.
        </p>
        
        <h3>Build with Public APIs</h3>
        <p>
          Once you find an API you want to build with, use our suite of free developer tools to accelerate your workflow:
        </p>
        <ul>
          <li><Link href="/tools/mcp-registry" className="text-blue-500 hover:underline font-medium">AI MCP & Tools Registry</Link> — Want to expose or consume APIs through AI agents? Explore 4,000+ open-source Model Context Protocol servers for Claude Desktop, Cursor, and custom agents.</li>
          <li><Link href="/tools/json-to-ts-zod" className="text-blue-500 hover:underline">JSON to TS & Zod</Link> — Paste the API's JSON response to instantly generate TypeScript interfaces and Zod validation schemas.</li>
          <li><Link href="/tools/mock-data" className="text-blue-500 hover:underline">Mock Data Generator</Link> — Build your own mock endpoints based on the schemas of these public APIs.</li>
          <li><Link href="/tools/jwt-decoder" className="text-blue-500 hover:underline">JWT Decoder</Link> — If the API requires OAuth or JWT authentication, use this tool to inspect the token claims.</li>
        </ul>
      </article>

      <div className="mt-12 pt-6 border-t border-[var(--border-dev)] flex flex-col items-center justify-center text-center gap-2">
        <span className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-widest">Data Sources & Credits</span>
        <div className="flex flex-wrap justify-center items-center gap-2 text-xs text-[var(--text-tertiary)]">
          <span>This registry is compiled at build-time from the following open-source GitHub repositories:</span>
          <a href="https://github.com/public-apis/public-apis" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">public-apis/public-apis</a>
          <span>•</span>
          <a href="https://github.com/public-api-lists/public-api-lists" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">public-api-lists/public-api-lists</a>
          <span>•</span>
          <a href="https://github.com/marcelscruz/public-apis" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">marcelscruz/public-apis</a>
        </div>
      </div>
    </div>
  );
}
