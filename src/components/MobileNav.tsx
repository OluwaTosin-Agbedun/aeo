import React, { useState, useCallback } from 'react';
import { Menu, X, Settings } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from './ui/sheet';

interface MobileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isAdminDomain: boolean;
}

export const MobileNav = React.memo(function MobileNav({ activeTab, onTabChange, isAdminDomain }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = useCallback((tab: string) => {
    onTabChange(tab);
    setIsOpen(false);
  }, [onTabChange]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button
          className="md:hidden text-white hover:bg-white/10 p-2 rounded-md transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px] sm:w-[320px] bg-[#1e3a5f] text-white border-l border-white/10">
        <SheetHeader>
          <SheetTitle className="text-white text-left">Menu</SheetTitle>
          <SheetDescription className="text-white/70 text-left text-sm">
            Choose a section to navigate to
          </SheetDescription>
        </SheetHeader>
        <nav className="flex flex-col gap-2 mt-6">
          <button
            onClick={() => handleNavClick('about')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === 'about'
                ? 'bg-white/20 text-white'
                : 'text-white/90 hover:bg-white/10'
            }`}
          >
            About
          </button>
          <button
            onClick={() => handleNavClick('dashboard')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === 'dashboard'
                ? 'bg-white/20 text-white'
                : 'text-white/90 hover:bg-white/10'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => handleNavClick('diary')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === 'diary'
                ? 'bg-white/20 text-white'
                : 'text-white/90 hover:bg-white/10'
            }`}
          >
            Diary of Election
          </button>
          <button
            onClick={() => handleNavClick('aeo-updates')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === 'aeo-updates'
                ? 'bg-white/20 text-white'
                : 'text-white/90 hover:bg-white/10'
            }`}
          >
            AEO Updates
          </button>
          {isAdminDomain && (
            <button
              onClick={() => handleNavClick('admin')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'admin'
                  ? 'bg-red-600 text-white'
                  : 'bg-red-500/20 hover:bg-red-500/30 text-white/90'
              }`}
            >
              <Settings className="w-4 h-4" />
              Admin Center
            </button>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
});