import { X, Copy, Heart, Star, Eye, Calendar } from 'lucide-react';
import { useState } from 'react';
import type { Database } from '../lib/database.types';

type Prompt = Database['public']['Tables']['prompts']['Row'] & {
  categories?: Database['public']['Tables']['categories']['Row'] | null;
  user_likes?: { user_id: string }[];
  user_favorites?: { user_id: string }[];
};

interface PromptDetailProps {
  prompt: Prompt;
  currentUserId?: string;
  onClose: () => void;
  onLike: (promptId: string) => void;
  onFavorite: (promptId: string) => void;
}

export function PromptDetail({ prompt, currentUserId, onClose, onLike, onFavorite }: PromptDetailProps) {
  const [copied, setCopied] = useState(false);

  const isLiked = currentUserId
    ? prompt.user_likes?.some(like => like.user_id === currentUserId)
    : false;

  const isFavorited = currentUserId
    ? prompt.user_favorites?.some(fav => fav.user_id === currentUserId)
    : false;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-start justify-between p-6 border-b border-gray-700">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-2">{prompt.title}</h2>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              {prompt.categories && (
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: `${prompt.categories.color}20`,
                    color: prompt.categories.color,
                  }}
                >
                  {prompt.categories.name}
                </span>
              )}
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{prompt.views_count} views</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(prompt.created_at)}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-gray-900 rounded-lg p-6 mb-6">
            <pre className="whitespace-pre-wrap text-gray-300 font-mono text-sm leading-relaxed">
              {prompt.content}
            </pre>
          </div>

          {prompt.tags && prompt.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {prompt.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-6 border-t border-gray-700 bg-gray-900">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onLike(prompt.id)}
              disabled={!currentUserId}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isLiked
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span>{prompt.likes_count} Likes</span>
            </button>

            <button
              onClick={() => onFavorite(prompt.id)}
              disabled={!currentUserId}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isFavorited
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Star className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
              <span>{prompt.favorites_count} Favorites</span>
            </button>
          </div>

          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all font-medium ${
              copied
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Copy className="w-5 h-5" />
            <span>{copied ? 'Copied!' : 'Copy Prompt'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
