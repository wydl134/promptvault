import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { PromptCard } from './components/PromptCard';
import { PromptDetail } from './components/PromptDetail';
import { AuthModal } from './components/AuthModal';
import { CreatePromptForm } from './components/CreatePromptForm';
import { LoadingSpinner } from './components/LoadingSpinner';
import { EmptyState } from './components/EmptyState';
import { useAuth } from './hooks/useAuth';
import { usePrompts } from './hooks/usePrompts';
import { useLanguage } from './contexts/LanguageContext';
import { supabase } from './lib/supabase';
import type { Database } from './lib/database.types';

type Prompt = Database['public']['Tables']['prompts']['Row'] & {
  categories?: Database['public']['Tables']['categories']['Row'] | null;
  user_likes?: { user_id: string }[];
  user_favorites?: { user_id: string }[];
};

type ViewMode = 'home' | 'my-prompts' | 'favorites';

function App() {
  const { user, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);

  const { prompts, categories, loading, refetch } = usePrompts({
    categoryId: selectedCategory,
    searchQuery,
    userId: viewMode === 'my-prompts' ? user?.id : undefined,
    onlyFavorites: viewMode === 'favorites',
  });

  const handleLike = async (promptId: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    const prompt = prompts.find(p => p.id === promptId);
    const isLiked = prompt?.user_likes?.some(like => like.user_id === user.id);

    if (isLiked) {
      await supabase
        .from('user_likes')
        .delete()
        .match({ user_id: user.id, prompt_id: promptId });
    } else {
      await supabase
        .from('user_likes')
        .insert({ user_id: user.id, prompt_id: promptId } as any);
    }

    refetch();
  };

  const handleFavorite = async (promptId: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    const prompt = prompts.find(p => p.id === promptId);
    const isFavorited = prompt?.user_favorites?.some(fav => fav.user_id === user.id);

    if (isFavorited) {
      await supabase
        .from('user_favorites')
        .delete()
        .match({ user_id: user.id, prompt_id: promptId });
    } else {
      await supabase
        .from('user_favorites')
        .insert({ user_id: user.id, prompt_id: promptId } as any);
    }

    refetch();
  };

  const handlePromptClick = async (prompt: Prompt) => {
    supabase
      .from('prompts')
      // @ts-expect-error - Supabase type inference issue
      .update({ views_count: prompt.views_count + 1 })
      .eq('id', prompt.id)
      .then(() => {});
    setSelectedPrompt(prompt);
    setTimeout(refetch, 100);
  };

  const handleCreateClick = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setShowCreateForm(true);
  };

  const getTitle = () => {
    switch (viewMode) {
      case 'my-prompts':
        return t('home.myPromptsTitle');
      case 'favorites':
        return t('home.favoritesTitle');
      default:
        return t('home.title');
    }
  };

  const getEmptyMessage = () => {
    if (searchQuery) return t('empty.noResults');
    if (viewMode === 'my-prompts') return t('empty.noPrompts');
    if (viewMode === 'favorites') return t('empty.noFavorites');
    return t('empty.noData');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[rgb(var(--bg-primary))] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--bg-primary))]">
      <Navbar
        onSearchChange={setSearchQuery}
        onCreateClick={handleCreateClick}
        onAuthClick={() => setShowAuthModal(true)}
        onMyPromptsClick={() => {
          setViewMode('my-prompts');
          setSelectedCategory(null);
        }}
        onFavoritesClick={() => {
          setViewMode('favorites');
          setSelectedCategory(null);
        }}
        onHomeClick={() => {
          setViewMode('home');
          setSelectedCategory(null);
        }}
      />

      <div className="flex">
        <Sidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={(categoryId) => {
            setSelectedCategory(categoryId);
            setViewMode('home');
          }}
        />

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">{getTitle()}</h1>

            {loading ? (
              <LoadingSpinner />
            ) : prompts.length === 0 ? (
              <EmptyState
                message={getEmptyMessage()}
                action={
                  viewMode === 'my-prompts'
                    ? {
                        label: t('empty.createFirst'),
                        onClick: handleCreateClick,
                      }
                    : undefined
                }
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {prompts.map((prompt) => (
                  <PromptCard
                    key={prompt.id}
                    prompt={prompt}
                    currentUserId={user?.id}
                    onLike={handleLike}
                    onFavorite={handleFavorite}
                    onClick={handlePromptClick}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}

      {showCreateForm && user && (
        <CreatePromptForm
          onClose={() => setShowCreateForm(false)}
          onSuccess={refetch}
          categories={categories}
          userId={user.id}
        />
      )}

      {selectedPrompt && (
        <PromptDetail
          prompt={selectedPrompt}
          currentUserId={user?.id}
          onClose={() => setSelectedPrompt(null)}
          onLike={handleLike}
          onFavorite={handleFavorite}
        />
      )}
    </div>
  );
}

export default App;
