import { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { StatusBar } from './components/StatusBar';
import { REGISTERED_UTILITIES, getUtilityById } from './registry/utilityRegistry';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('chaos-data');

  // Theme state with localStorage persistence
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('failstate-theme') as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
    }
    localStorage.setItem('failstate-theme', theme);
  }, [theme]);

  const activeUtility = useMemo(() => {
    return getUtilityById(activeTab) || REGISTERED_UTILITIES[0];
  }, [activeTab]);

  const ActiveComponent = activeUtility.component;

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[var(--bg-app)] text-[var(--text-primary)] selection:bg-rose-500 selection:text-white bg-dev-grid transition-colors">
      {/* Top Navigation & Tab Bar */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        theme={theme}
        onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
      />

      {/* Main Studio Workbench */}
      <main className="flex-1 h-full overflow-hidden p-3 flex flex-col min-w-0">
        <div className="h-full flex-1 overflow-hidden">
          <ActiveComponent />
        </div>
      </main>

      {/* Terminal Status Bar at Bottom */}
      <StatusBar
        activeUtilityName={activeUtility.name}
      />
    </div>
  );
}

export default App;
