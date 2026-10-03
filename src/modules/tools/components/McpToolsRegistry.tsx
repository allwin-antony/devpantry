import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import mcpToolsData from '@/data/mcp-tools.json';
import { Search, ExternalLink, ShieldCheck, Code, Globe, ChevronLeft, ChevronRight, ChevronDown, ArrowRight, Blocks } from 'lucide-react';
import { triggerFeedbackNudge } from '@/lib/feedbackNudge';

interface McpToolEntry {
  API: string;
  Description: string;
  Language: string;
  Link: string;
  Category: string;
}

const typedMcpToolsData = mcpToolsData as McpToolEntry[];

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

export default function McpToolsRegistry() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [languageFilter, setLanguageFilter] = useState<string>('All');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(typedMcpToolsData.map(api => api.Category));
    return ['All', ...Array.from(cats).sort()];
  }, []);

  const categoryOptions = useMemo(() => categories.map(cat => ({ value: cat, label: cat === 'All' ? 'All Categories' : cat })), [categories]);

  // Extract unique languages
  const languages = useMemo(() => {
    const langs = new Set(typedMcpToolsData.map(api => api.Language));
    return ['All', ...Array.from(langs).sort()];
  }, []);

  const languageOptions = useMemo(() => languages.map(lang => ({ value: lang, label: lang === 'All' ? 'All Languages' : lang })), [languages]);

  // Filter data
  const filteredData = useMemo(() => {
    setCurrentPage(1); // Reset to page 1 when filters change
    return typedMcpToolsData.filter(api => {
      const matchesSearch = 
        api.API.toLowerCase().includes(searchTerm.toLowerCase()) || 
        api.Description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || api.Category === selectedCategory;
      const matchesLanguage = languageFilter === 'All' || api.Language === languageFilter;

      return matchesSearch && matchesCategory && matchesLanguage;
    });
  }, [searchTerm, selectedCategory, languageFilter]);

  // Paginate data
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const handleCopyInstall = (link: string) => {
    navigator.clipboard.writeText(link);
    triggerFeedbackNudge('mcp-registry-copy');
  };

  // Prepare structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'MCP Tools Registry',
    description: 'A massive collective list of free Model Context Protocol (MCP) servers for AI agents.',
    url: 'https://devpantry.com/tools/mcp-registry',
    creator: {
      '@type': 'Organization',
      name: 'DevPantry Community'
    },
    isAccessibleForFree: true,
    keywords: ['mcp servers', 'ai agents', 'model context protocol', 'ai tools', ...categories.slice(1, 10)]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">AI MCP & Tools Registry</h1>
          <p className="text-[var(--text-secondary)]">
            A collective list of open-source Model Context Protocol (MCP) servers and tools for AI agents.
            Data is sourced from community-driven repositories and the official MCP server registry.
          </p>
        </div>
        <Link
          href="/tools/public-apis"
          className="inline-flex items-center gap-2.5 px-4 py-2 text-sm font-medium rounded-xl border border-[var(--border-dev)] bg-[var(--bg-panel)] hover:bg-[var(--bg-sidebar)] text-[var(--text-primary)] hover:border-emerald-500/40 shadow-sm transition-all group shrink-0"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform" />
          <span>Browse 3,000+ Public APIs</span>
          <ArrowRight className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
        </Link>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
            <input
              type="text"
              placeholder={`Search ${typedMcpToolsData.length}+ MCP servers by name or description...`}
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
            value={languageFilter}
            onChange={setLanguageFilter}
            icon={Code}
            options={languageOptions}
          />
        </div>
      </div>

      <div className="bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-dev)] bg-[var(--bg-sidebar)]">
                <th className="py-3 px-4 text-sm font-semibold text-[var(--text-secondary)] w-1/4">Server</th>
                <th className="py-3 px-4 text-sm font-semibold text-[var(--text-secondary)] w-1/2">Description</th>
                <th className="py-3 px-4 text-sm font-semibold text-[var(--text-secondary)]">Language</th>
                <th className="py-3 px-4 text-sm font-semibold text-[var(--text-secondary)]">Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-dev)] text-sm">
              {currentData.length > 0 ? (
                currentData.map((api, index) => (
                  <tr key={index} className="hover:bg-[var(--bg-sidebar)] transition-colors">
                    <td className="py-3 px-4 align-top">
                      <a
                        href={api.Link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleCopyInstall(api.Link)}
                        className="font-medium text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 flex flex-wrap items-center gap-1.5 break-all"
                      >
                        {api.API}
                        <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                      </a>
                    </td>
                    <td className="py-3 px-4 text-[var(--text-secondary)]">
                      {api.Description.split(/(\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
                        const match = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
                        if (match) {
                          return (
                            <a 
                              key={i} 
                              href={match[2]} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-blue-500 hover:underline inline-flex items-center gap-0.5"
                            >
                              {match[1]}
                            </a>
                          );
                        }
                        return <span key={i}>{part}</span>;
                      })}
                    </td>
                    <td className="py-3 px-4 align-top">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        api.Language === 'TypeScript' 
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'
                          : api.Language === 'Python'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-400'
                            : api.Language === 'Go'
                              ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-500/10 dark:text-cyan-400'
                              : api.Language === 'Rust'
                                ? 'bg-orange-100 text-orange-800 dark:bg-orange-500/10 dark:text-orange-400'
                                : 'bg-[var(--bg-body)] text-[var(--text-secondary)]'
                      }`}>
                        {api.Language}
                      </span>
                    </td>
                    <td className="py-3 px-4 align-top">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[var(--bg-body)] text-[var(--text-secondary)] border border-[var(--border-dev)] whitespace-nowrap">
                        {api.Category}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-[var(--text-tertiary)]">
                    No MCP servers found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between text-sm text-[var(--text-tertiary)] gap-4">
        <div>
          Showing {Math.min(filteredData.length, (currentPage - 1) * itemsPerPage + 1)} to {Math.min(filteredData.length, currentPage * itemsPerPage)} of {filteredData.length} MCP Servers
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
        <h2>Free Model Context Protocol (MCP) Servers for AI Agents</h2>
        <p>
          Discover thousands of open-source MCP servers for your AI agents (like Claude Desktop, Cursor, or custom agents). We've aggregated data from multiple community-driven repositories to provide a single, searchable interface for finding MCP servers across categories like Databases, APIs, Filesystem, and more.
        </p>
        
        <h3>Build with MCP</h3>
        <p>
          Once you find an MCP server, you can integrate it into your AI agent seamlessly. This protocol allows your AI to securely connect to external APIs and local tools:
        </p>
        <ul>
          <li><Link href="/tools/public-apis" className="text-blue-500 hover:underline font-medium">Public APIs Registry</Link> — Need live web data, financial feeds, or authentication endpoints to integrate into your MCP servers? Search 3,000+ free public APIs.</li>
          <li><Link href="/tools/json-to-ts-zod" className="text-blue-500 hover:underline">JSON to TS & Zod</Link> — Convert MCP tool schemas and JSON payloads directly into TypeScript interfaces and Zod schemas.</li>
          <li><Link href="/tools/jwt-decoder" className="text-blue-500 hover:underline">JWT Decoder</Link> — Decode and inspect JSON Web Tokens when authenticating with protected MCP servers and APIs.</li>
        </ul>
      </article>

      <div className="mt-12 pt-6 border-t border-[var(--border-dev)] flex flex-col items-center justify-center text-center gap-2">
        <span className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-widest">Data Sources & Credits</span>
        <div className="flex flex-wrap justify-center items-center gap-2 text-xs text-[var(--text-tertiary)]">
          <span>This registry is compiled at build-time from the following open-source GitHub repositories:</span>
          <a href="https://github.com/punkpeye/awesome-mcp-servers" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">punkpeye/awesome-mcp-servers</a>
          <span>•</span>
          <a href="https://github.com/wong2/awesome-mcp-servers" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">wong2/awesome-mcp-servers</a>
          <span>•</span>
          <a href="https://github.com/habitoai/awesome-mcp-servers" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">habitoai/awesome-mcp-servers</a>
          <span>•</span>
          <a href="https://github.com/modelcontextprotocol/servers" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">modelcontextprotocol/servers</a>
        </div>
      </div>
    </div>
  );
}
