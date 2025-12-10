import { useState } from 'react';
import { Search, Plus, User, LogOut, LogIn, Sparkles, Languages, Sun, Moon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

interface NavbarProps {
  onSearchChange: (query: string) => void;
  onCreateClick: () => void;
  onAuthClick: () => void;
  onMyPromptsClick: () => void;
  onFavoritesClick: () => void;
  onHomeClick: () => void;
}

export function Navbar({
  onSearchChange,
  onCreateClick,
  onAuthClick,
  onMyPromptsClick,
  onFavoritesClick,
  onHomeClick,
}: NavbarProps) {
  const { user, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearchChange(query);
  };

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
  };

  return (
    <nav className="glass-effect sticky top-0 z-50 border-b border-[rgb(var(--border-color))]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8 flex-1">
            <button
              onClick={onHomeClick}
              className="flex items-center gap-2 text-xl font-bold text-[rgb(var(--text-primary))] hover:text-blue-500 transition-all duration-300 hover:scale-105"
            >
              <Sparkles className="w-6 h-6" />
              <span>{t('nav.title')}</span>
            </button>

            <div className="hidden md:flex flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--text-tertiary))]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder={t('nav.search')}
                  className="w-full pl-10 pr-4 py-2 bg-[rgb(var(--bg-tertiary))] border border-[rgb(var(--border-color))] rounded-xl text-[rgb(var(--text-primary))] placeholder-[rgb(var(--text-tertiary))] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-[rgb(var(--bg-tertiary))] hover:bg-[rgb(var(--bg-secondary))] transition-all duration-300 hover:scale-110"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-[rgb(var(--text-primary))]" />
              ) : (
                <Moon className="w-5 h-5 text-[rgb(var(--text-primary))]" />
              )}
            </button>

            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-2 px-3 py-2 bg-[rgb(var(--bg-tertiary))] hover:bg-[rgb(var(--bg-secondary))] text-[rgb(var(--text-primary))] rounded-xl transition-all duration-300"
              >
                <Languages className="w-5 h-5" />
                <span className="text-sm font-medium">{language === 'zh' ? '中文' : 'EN'}</span>
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-32 glass-strong rounded-xl shadow-lg py-2">
                  <button
                    onClick={() => {
                      setLanguage('en');
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 transition-colors rounded-lg ${
                      language === 'en' ? 'bg-blue-500 text-white' : 'text-[rgb(var(--text-secondary))] hover:bg-[rgb(var(--bg-tertiary))]'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('zh');
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 transition-colors rounded-lg ${
                      language === 'zh' ? 'bg-blue-500 text-white' : 'text-[rgb(var(--text-secondary))] hover:bg-[rgb(var(--bg-tertiary))]'
                    }`}
                  >
                    中文
                  </button>
                </div>
              )}
            </div>
            {user ? (
              <>
                <button
                  onClick={onCreateClick}
                  className="btn-primary text-white flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  <span className="hidden sm:inline">{t('nav.newPrompt')}</span>
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-4 py-2 bg-[rgb(var(--bg-tertiary))] hover:bg-[rgb(var(--bg-secondary))] text-[rgb(var(--text-primary))] rounded-xl transition-all duration-300"
                  >
                    <User className="w-5 h-5" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 glass-strong rounded-xl shadow-lg py-2">
                      <button
                        onClick={() => {
                          onMyPromptsClick();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-[rgb(var(--text-secondary))] hover:bg-[rgb(var(--bg-tertiary))] transition-colors rounded-lg"
                      >
                        {t('nav.myPrompts')}
                      </button>
                      <button
                        onClick={() => {
                          onFavoritesClick();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-[rgb(var(--text-secondary))] hover:bg-[rgb(var(--bg-tertiary))] transition-colors rounded-lg"
                      >
                        {t('nav.favorites')}
                      </button>
                      <div className="border-t border-[rgb(var(--border-color))] my-2"></div>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-red-500 hover:bg-[rgb(var(--bg-tertiary))] transition-colors flex items-center gap-2 rounded-lg"
                      >
                        <LogOut className="w-4 h-4" />
                        {t('nav.signOut')}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button
                onClick={onAuthClick}
                className="btn-primary text-white flex items-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                <span>{t('nav.signIn')}</span>
              </button>
            )}
          </div>
        </div>

        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--text-tertiary))]" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={t('nav.search')}
              className="w-full pl-10 pr-4 py-2 bg-[rgb(var(--bg-tertiary))] border border-[rgb(var(--border-color))] rounded-xl text-[rgb(var(--text-primary))] placeholder-[rgb(var(--text-tertiary))] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
