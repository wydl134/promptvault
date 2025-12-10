import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'zh' || saved === 'en') ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key;
      }
    }

    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}

const translations: Record<Language, any> = {
  en: {
    nav: {
      title: 'PromptVault',
      search: 'Search prompts...',
      newPrompt: 'New Prompt',
      signIn: 'Sign In',
      myPrompts: 'My Prompts',
      favorites: 'Favorites',
      signOut: 'Sign Out',
    },
    home: {
      title: 'Discover Prompts',
      myPromptsTitle: 'My Prompts',
      favoritesTitle: 'My Favorites',
      allPrompts: 'All Prompts',
    },
    sidebar: {
      categories: 'Categories',
    },
    prompt: {
      views: 'views',
      likes: 'Likes',
      like: 'Like',
      favorite: 'Favorite',
      favorites: 'Favorites',
      copy: 'Copy',
      copyPrompt: 'Copy Prompt',
      copied: 'Copied!',
    },
    auth: {
      signIn: 'Sign In',
      signUp: 'Create Account',
      email: 'Email',
      password: 'Password',
      emailPlaceholder: 'you@example.com',
      passwordPlaceholder: '••••••••',
      signInButton: 'Sign In',
      signUpButton: 'Sign Up',
      loading: 'Loading...',
      noAccount: "Don't have an account? Sign up",
      haveAccount: 'Already have an account? Sign in',
    },
    create: {
      title: 'Create New Prompt',
      promptTitle: 'Title',
      titlePlaceholder: 'Give your prompt a descriptive title',
      content: 'Prompt Content',
      contentPlaceholder: 'Enter your AI prompt here...',
      category: 'Category',
      tags: 'Tags (comma separated)',
      tagsPlaceholder: 'ai, chatgpt, coding',
      makePublic: 'Make this prompt public (others can view and use it)',
      cancel: 'Cancel',
      create: 'Create Prompt',
      creating: 'Creating...',
      required: '*',
    },
    empty: {
      noResults: 'No prompts found matching your search.',
      noPrompts: "You haven't created any prompts yet.",
      noFavorites: "You haven't favorited any prompts yet.",
      noData: 'No prompts available.',
      createFirst: 'Create Your First Prompt',
    },
    categories: {
      programming: 'Programming',
      writing: 'Writing',
      design: 'Design',
      marketing: 'Marketing',
      business: 'Business',
      education: 'Education',
      dataAnalysis: 'Data Analysis',
      general: 'General',
    },
  },
  zh: {
    nav: {
      title: '提示词宝库',
      search: '搜索提示词...',
      newPrompt: '新建提示词',
      signIn: '登录',
      myPrompts: '我的提示词',
      favorites: '我的收藏',
      signOut: '退出登录',
    },
    home: {
      title: '发现提示词',
      myPromptsTitle: '我的提示词',
      favoritesTitle: '我的收藏',
      allPrompts: '全部提示词',
    },
    sidebar: {
      categories: '分类',
    },
    prompt: {
      views: '次浏览',
      likes: '个赞',
      like: '点赞',
      favorite: '收藏',
      favorites: '个收藏',
      copy: '复制',
      copyPrompt: '复制提示词',
      copied: '已复制！',
    },
    auth: {
      signIn: '登录',
      signUp: '创建账户',
      email: '邮箱',
      password: '密码',
      emailPlaceholder: 'you@example.com',
      passwordPlaceholder: '••••••••',
      signInButton: '登录',
      signUpButton: '注册',
      loading: '加载中...',
      noAccount: '没有账户？立即注册',
      haveAccount: '已有账户？立即登录',
    },
    create: {
      title: '创建新提示词',
      promptTitle: '标题',
      titlePlaceholder: '为您的提示词起一个描述性的标题',
      content: '提示词内容',
      contentPlaceholder: '在此输入您的 AI 提示词...',
      category: '分类',
      tags: '标签（逗号分隔）',
      tagsPlaceholder: 'ai, chatgpt, 编程',
      makePublic: '公开此提示词（其他人可以查看和使用）',
      cancel: '取消',
      create: '创建提示词',
      creating: '创建中...',
      required: '*',
    },
    empty: {
      noResults: '没有找到符合搜索条件的提示词。',
      noPrompts: '您还没有创建任何提示词。',
      noFavorites: '您还没有收藏任何提示词。',
      noData: '暂无提示词。',
      createFirst: '创建第一个提示词',
    },
    categories: {
      programming: '编程开发',
      writing: '写作创作',
      design: '设计',
      marketing: '市场营销',
      business: '商业',
      education: '教育',
      dataAnalysis: '数据分析',
      general: '通用',
    },
  },
};
