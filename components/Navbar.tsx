import React from 'react';
import { AppView } from '../types';
import { UserPlus, Gift, Users } from 'lucide-react';
import clsx from 'clsx';

interface NavbarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  participantCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, participantCount }) => {
  const navItems = [
    { id: AppView.INPUT, label: '名單輸入', icon: UserPlus },
    { id: AppView.LUCKY_DRAW, label: '幸運抽獎', icon: Gift },
    { id: AppView.GROUPING, label: '自動分組', icon: Users },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                TS
              </div>
              <span className="font-bold text-xl text-slate-800 tracking-tight hidden md:block">HR TeamSpirit</span>
            </div>
            
            <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setView(item.id)}
                    className={clsx(
                      'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 h-full',
                      isActive
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    )}
                  >
                    <Icon size={18} className="mr-2" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center">
            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold">
              目前人數: {participantCount}
            </span>
          </div>
        </div>
      </div>
      
      {/* Mobile menu (simplified for this context) */}
      <div className="sm:hidden flex justify-around border-t border-slate-100 bg-white p-2">
        {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={clsx(
                  'flex flex-col items-center p-2 rounded-lg text-xs font-medium',
                  isActive ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500'
                )}
              >
                <Icon size={20} className="mb-1" />
                {item.label}
              </button>
            );
          })}
      </div>
    </nav>
  );
};

export default Navbar;
