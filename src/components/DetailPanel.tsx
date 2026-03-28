import { X } from 'lucide-react';
import { NODE_STYLES } from '../core/theme';
import { useCanvasStore } from '../store/useCanvasStore';

export default function DetailPanel() {
  const { selectedNode, activeStream, setSelectedNode } = useCanvasStore();

  if (!selectedNode) return null;

  const style = NODE_STYLES[selectedNode.type];
  const decision = activeStream?.decisions.find(
    (d) => d.nodeId === selectedNode.id
  );

  return (
    <div className="absolute right-4 top-4 w-80 bg-slate-800/95 backdrop-blur border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: `2px solid ${style.color}` }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: style.color }}
          />
          <span className="text-sm font-semibold text-slate-200">
            {style.label}
          </span>
        </div>
        <button
          onClick={() => setSelectedNode(null)}
          className="text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <p className="text-sm text-slate-300 leading-relaxed">
          {selectedNode.content}
        </p>

        {/* Confidence bar */}
        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Confidence</span>
            <span>{Math.round(selectedNode.confidence * 100)}%</span>
          </div>
          <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${selectedNode.confidence * 100}%`,
                backgroundColor: style.color,
              }}
            />
          </div>
        </div>

        {/* Reasoning */}
        {selectedNode.metadata.reasoning && (
          <div className="bg-slate-900/50 rounded-lg p-3">
            <div className="text-xs font-semibold text-slate-400 mb-1">
              Reasoning
            </div>
            <p className="text-xs text-slate-300">
              {selectedNode.metadata.reasoning}
            </p>
          </div>
        )}

        {/* Decision alternatives */}
        {decision && (
          <div className="space-y-2">
            <div className="text-xs font-semibold text-amber-400">
              Decision Point
            </div>
            <div className="bg-green-900/20 border border-green-800/30 rounded-lg p-2">
              <div className="text-xs text-green-400 font-medium">
                ✓ Chosen
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {decision.chosen}
              </p>
            </div>
            {decision.alternatives.map((alt, i) => (
              <div
                key={i}
                className="bg-red-900/10 border border-red-800/20 rounded-lg p-2"
              >
                <div className="text-xs text-red-400 font-medium">
                  ✗ {alt.label}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{alt.reason}</p>
              </div>
            ))}
          </div>
        )}

        {/* Source */}
        {selectedNode.metadata.source && (
          <div className="text-xs text-slate-500">
            Source: {selectedNode.metadata.source}
          </div>
        )}
      </div>
    </div>
  );
}