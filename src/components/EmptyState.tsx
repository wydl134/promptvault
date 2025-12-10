import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
      <Inbox className="w-16 h-16 mb-4" />
      <p className="text-lg">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
