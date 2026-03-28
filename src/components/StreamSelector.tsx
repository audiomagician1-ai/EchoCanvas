import { Brain } from 'lucide-react';
import { useCanvasStore } from '../store/useCanvasStore';

export default function StreamSelector() {
  const { streams, activeStream, setActiveStream } = useCanvasStore();

  return (
    <div className="absolute top-4 left-4 z-50 flex items-center gap-3">
      {/* Logo */}
      <div className="flex items-center gap-2 bg-slate-800/95 backdrop-blur border border-slate-700 rounded-xl px-4 py-2.5 shadow-lg">
        <Brain size={20} className="text-blue-400" />
        <span className="text-sm font-bold text-slate-200 tracking-tight">
          EchoCanvas
        </span>
      </div>

      {/* Stream selector */}
      <select
        value={activeStream?.id ?? ''}
        onChange={(e) => setActiveStream(e.target.value)}
        className="bg-slate-800/95 backdrop-blur border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 shadow-lg outline-none focus:border-blue-500 cursor-pointer"
      >
        {streams.map((s) => (
          <option key={s.id} value={s.id}>
            {s.title}
          </option>
        ))}
      </select>
    </div>
  );
}