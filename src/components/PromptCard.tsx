import { Heart, Star, Copy, Eye, Calendar } from 'lucide-react';
import { useState } from 'react';
import type { Database } from '../lib/database.types';

type Prompt = Database['public']['Tables']['prompts']['Row'] & {
  categories?: Database['public']['Tables']['categories']['Row'] | null;
  user_likes?: { user_id: string }[];
  user_favorites?: { user_id: string }[];
};

interface PromptCardProps {
  prompt: Prompt;
  currentUserId?: string;
  onLike: (promptId: string) => void;
  onFavorite: (promptId: string) => void;
  onClick: (prompt: Prompt) => void;
}

export function PromptCard({ prompt, currentUserId, onLike, onFavorite, onClick }: PromptCardProps) {
  const [copied, setCopied] = useState(false);

  const isLiked = currentUserId
    ? prompt.user_likes?.some(like => like.user_id === currentUserId)
    : false;

  const isFavorited = currentUserId
    ? prompt.user_favorites?.some(fav => fav.user_id === currentUserId)
    : false;

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(prompt.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLike(prompt.id);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavorite(prompt.id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div
      onClick={() => onClick(prompt)}
      className="bento-card cursor-pointer group fade-in"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-[rgb(var(--text-primary))] group-hover:text-blue-500 transition-colors mb-2">
            {prompt.title}
          </h3>
          {prompt.categories && (
            <span
              className="inline-block px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{
                backgroundColor: `${prompt.categories.color}20`,
                color: prompt.categories.color,
              }}
            >
              {prompt.categories.name}
            </span>
          )}
        </div>

        <button
          onClick={handleCopy}
          className={`p-2.5 rounded-xl transition-all ${
            copied
              ? 'bg-green-500 text-white scale-110'
              : 'bg-[rgb(var(--bg-tertiary))] text-[rgb(var(--text-secondary))] hover:bg-blue-500 hover:text-white hover:scale-110'
          }`}
          title="Copy to clipboard"
        >
          <Copy className="w-4 h-4" />
        </button>
      </div>

      <p className="text-[rgb(var(--text-secondary))] text-sm mb-4 line-clamp-3">
        {truncateContent(prompt.content)}
      </p>

      {prompt.tags && prompt.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {prompt.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-[rgb(var(--bg-tertiary))] text-[rgb(var(--text-secondary))] rounded-lg text-xs font-medium"
            >
              #{tag}
            </span>
          ))}
          {prompt.tags.length > 3 && (
            <span className="px-3 py-1 text-[rgb(var(--text-tertiary))] text-xs">
              +{prompt.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-[rgb(var(--border-color))]">
        <div className="flex items-center gap-4 text-sm text-[rgb(var(--text-tertiary))]">
          <div className="flex items-center gap-1.5">
            <Eye className="w-4 h-4" />
            <span>{prompt.views_count}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(prompt.created_at)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLike}
            disabled={!currentUserId}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              isLiked
                ? 'bg-red-500 text-white scale-105'
                : 'bg-[rgb(var(--bg-tertiary))] text-[rgb(var(--text-secondary))] hover:bg-red-500 hover:text-white hover:scale-105'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">{prompt.likes_count}</span>
          </button>

          <button
            onClick={handleFavorite}
            disabled={!currentUserId}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              isFavorited
                ? 'bg-yellow-500 text-white scale-105'
                : 'bg-[rgb(var(--bg-tertiary))] text-[rgb(var(--text-secondary))] hover:bg-yellow-500 hover:text-white hover:scale-105'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Star className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">{prompt.favorites_count}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
