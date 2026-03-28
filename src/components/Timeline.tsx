import { Play, Pause, RotateCcw } from 'lucide-react';
import { useCanvasStore } from '../store/useCanvasStore';
import { useEffect, useRef } from 'react';

export default function Timeline() {
  const {
    activeStream,
    timelineProgress,
    isReplaying,
    setTimelineProgress,
    toggleReplay,
  } = useCanvasStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const nodeCount = activeStream?.nodes.length ?? 0;
  const visibleCount = Math.max(
    1,
    Math.ceil(nodeCount * timelineProgress)
  );

  // Auto-advance during replay
  useEffect(() => {
    if (isReplaying) {
      intervalRef.current = setInterval(() => {
        const store = useCanvasStore.getState();
        const next = store.timelineProgress + 1 / nodeCount;
        if (next > 1) {
          store.setTimelineProgress(1);
          store.toggleReplay();
        } else {
          store.setTimelineProgress(next);
        }
      }, 800);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isReplaying, nodeCount]);

  if (!activeStream) return null;

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-800/95 backdrop-blur border border-slate-700 rounded-xl px-4 py-3 flex items-center gap-4 shadow-2xl z-50">
      {/* Play/Pause */}
      <button
        onClick={toggleReplay}
        className="text-slate-300 hover:text-white transition-colors"
        title={isReplaying ? 'Pause' : 'Play'}
      >
        {isReplaying ? <Pause size={18} /> : <Play size={18} />}
      </button>

      {/* Reset */}
      <button
        onClick={() => {
          setTimelineProgress(0.05);
          if (!isReplaying) toggleReplay();
        }}
        className="text-slate-400 hover:text-white transition-colors"
        title="Replay from start"
      >
        <RotateCcw size={16} />
      </button>

      {/* Slider */}
      <input
        type="range"
        min={0}
        max={100}
        value={Math.round(timelineProgress * 100)}
        onChange={(e) => setTimelineProgress(Number(e.target.value) / 100)}
        className="w-48 accent-blue-500"
      />

      {/* Counter */}
      <span className="text-xs text-slate-400 tabular-nums min-w-[60px]">
        {visibleCount} / {nodeCount} nodes
      </span>
    </div>
  );
}