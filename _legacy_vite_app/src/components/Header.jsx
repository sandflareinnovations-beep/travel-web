import React from 'react';
import { Plane, Building2, BookOpen, FileText, BarChart3, ChevronDown, User } from 'lucide-react';

const Header = ({ activeTab, setActiveTab, env, setEnv }) => {
  const navItems = [
    { id: 'flights', label: 'Flights', icon: Plane },
    { id: 'hotels', label: 'Hotels', icon: Building2 },
    { id: 'bookings', label: 'Bookings', icon: BookOpen },
    { id: 'logs', label: 'API Logs', icon: FileText },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  return (
    <header className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b" style={{ backgroundColor: 'rgba(255,255,255,0.85)' }}>
      <div className="flex items-center gap-12">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--primary)' }}>
            <Plane className="text-white" size={24} />
          </div>
          <span className="font-bold text-xl tracking-tight" style={{ color: 'var(--text-main)' }}>Flyinco</span>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === item.id 
                  ? 'bg-blue-50 text-primary font-medium' 
                  : 'text-muted hover:bg-slate-50'
              }`}
              style={{
                backgroundColor: activeTab === item.id ? 'var(--primary)' : 'transparent',
                color: activeTab === item.id ? 'white' : 'var(--text-muted)',
              }}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {/* Environment Switch */}
        <div className="flex items-center bg-slate-100 p-1" style={{ background: 'var(--bg-input)', padding: '4px', borderRadius: '8px' }}>
          <button
            onClick={() => setEnv('TEST')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all`}
            style={{ 
              background: env === 'TEST' ? 'white' : 'transparent',
              color: env === 'TEST' ? 'var(--warning)' : 'var(--text-muted)',
              border: 'none',
              boxShadow: env === 'TEST' ? 'var(--shadow-sm)' : 'none',
              borderRadius: '6px'
            }}
          >
            TEST
          </button>
          <button
            onClick={() => setEnv('LIVE')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all`}
            style={{ 
              background: env === 'LIVE' ? 'white' : 'transparent',
              color: env === 'LIVE' ? 'var(--danger)' : 'var(--text-muted)',
              border: 'none',
              boxShadow: env === 'LIVE' ? 'var(--shadow-sm)' : 'none',
              borderRadius: '6px'
            }}
          >
            LIVE
          </button>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4" style={{ borderLeft: '1px solid var(--border)' }}>
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium" style={{ color: 'var(--text-main)' }}>Agent Admin</p>
            <p className="text-xs text-muted">Ops Manager</p>
          </div>
          <button className="w-10 h-10 rounded-full flex items-center justify-center border" style={{ background: 'var(--bg-input)', borderColor: 'var(--border)' }}>
            <User size={20} className="text-secondary" />
          </button>
          <ChevronDown size={16} className="text-muted" />
        </div>
      </div>
    </header>
  );
};

export default Header;
