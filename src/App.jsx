import { useState } from 'react';
import { LayoutDashboard, Mic, Languages, Newspaper } from 'lucide-react';
import Dashboard from './components/Dashboard';
import TopVoices from './components/TopVoices';
import LanguageNormalization from './components/LanguageNormalization';
import AINews from './components/AINews';

const tabs = [
  { id: 'dashboard',     label: 'Competitor Dashboard',   icon: LayoutDashboard },
  { id: 'voices',        label: 'Top Voices',             icon: Mic },
  { id: 'normalization', label: 'Language Normalization', icon: Languages },
  { id: 'news',          label: 'AI News',                icon: Newspaper },
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="App">
      <nav className="bg-secondary border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-14 gap-4">
            {/* Brand — visible on every screen */}
            <div className="flex items-center gap-2.5 flex-shrink-0">
              <img
                src="/rezo-logo.svg"
                alt="Rezo.ai"
                className="w-9 h-9 object-contain"
              />
              <div className="hidden sm:block leading-tight">
                <p className="text-sm font-bold text-white">Rezo.ai</p>
                <p className="text-xs text-gray-400">Intelligence Hub</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === id
                      ? 'bg-accent text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Icon size={15} />
                  <span className="hidden md:inline">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {activeTab === 'dashboard'     && <Dashboard />}
      {activeTab === 'voices'        && <TopVoices />}
      {activeTab === 'normalization' && <LanguageNormalization />}
      {activeTab === 'news'          && <AINews />}
    </div>
  );
}

export default App;
