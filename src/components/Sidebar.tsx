import * as Icons from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import type { Database } from '../lib/database.types';

type Category = Database['public']['Tables']['categories']['Row'];

interface SidebarProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

export function Sidebar({ categories, selectedCategory, onCategorySelect }: SidebarProps) {
  const { t } = useLanguage();

  const getIcon = (iconName: string) => {
    const Icon = Icons[iconName as keyof typeof Icons] as any;
    return Icon ? <Icon className="w-5 h-5" /> : <Icons.Folder className="w-5 h-5" />;
  };

  return (
    <aside className="w-64 glass-effect border-r border-[rgb(var(--border-color))] h-[calc(100vh-4rem)] overflow-y-auto hidden lg:block">
      <div className="p-6">
        <h2 className="text-sm font-bold text-[rgb(var(--text-tertiary))] uppercase tracking-wider mb-6">
          {t('sidebar.categories')}
        </h2>

        <button
          onClick={() => onCategorySelect(null)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 mb-2 ${
            selectedCategory === null
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white scale-105 shadow-lg'
              : 'text-[rgb(var(--text-secondary))] hover:bg-[rgb(var(--bg-tertiary))] hover:scale-105'
          }`}
        >
          <Icons.LayoutGrid className="w-5 h-5" />
          <span className="font-semibold">{t('home.allPrompts')}</span>
        </button>

        <div className="mt-2 space-y-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white scale-105 shadow-lg'
                  : 'text-[rgb(var(--text-secondary))] hover:bg-[rgb(var(--bg-tertiary))] hover:scale-105'
              }`}
            >
              <span style={{ color: selectedCategory === category.id ? 'white' : category.color }}>
                {getIcon(category.icon)}
              </span>
              <span className="font-semibold">{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
