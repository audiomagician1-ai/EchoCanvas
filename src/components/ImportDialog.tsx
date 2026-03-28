import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { parseConversation } from '../parser';
import { useCanvasStore } from '../store/useCanvasStore';

export default function ImportDialog() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const store = useCanvasStore();

  const handleImport = () => {
    if (!text.trim()) return;
    const stream = parseConversation(
      text,
      title.trim() || 'Imported Conversation'
    );
    // Add to store and activate
    store.streams.push(stream);
    store.setActiveStream(stream.id);
    setText('');
    setTitle('');
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="absolute top-4 right-4 z-50 bg-slate-800/95 backdrop-blur border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-300 hover:text-white hover:border-blue-500 transition-colors shadow-lg flex items-center gap-2"
      >
        <Upload size={16} />
        Import
      </button>
    );
  }

  return (
    <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl w-[600px] max-h-[80vh] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-slate-200">
            Import Conversation
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="text-slate-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My debugging session..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">
              Paste conversation (Markdown format)
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`## Assistant\n\nI can see the error log shows a TypeError...\n\nThis might be caused by a null reference...\n\n## User\n\nCan you fix it?\n\n## Assistant\n\nLet me verify by checking the API response...\n\nConfirmed: the API returns null for deleted users.\n\nI'll add a null guard to fix this.`}
              rows={12}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 outline-none focus:border-blue-500 font-mono resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-slate-700 flex justify-end gap-3">
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!text.trim()}
            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg transition-colors"
          >
            Parse & Visualize
          </button>
        </div>
      </div>
    </div>
  );
}