"use client";
import { useState } from "react";
import { X, Check, Loader2 } from "lucide-react";

export default function EditComment({ comment, onSave, onCancel }) {
  const [content, setContent] = useState(comment.content);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!content.trim()) return;

    setLoading(true);
    await onSave(comment._id, content);
    setLoading(false);
  };

  return (
    <div className="space-y-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        className="w-full dark:placeholder-background/30 dark:bg-background/10 dark:text-background dark:border-0 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        placeholder="Edit your comment..."
        autoFocus
      />
      <div className="flex gap-2 justify-end">
        <button
          onClick={onCancel}
          disabled={loading}
          className="px-3 py-1.5 text-sm border border-gray-300 dark:border-background/20 text-gray-700 dark:text-paragraph rounded-lg hover:bg-gray-50 dark:hover:bg-background/20 transition-colors disabled:opacity-50"
        >
          <X className="w-4 h-4" />
        </button>
        <button
          onClick={handleSave}
          disabled={loading || !content.trim()}
          className="px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Check className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}
