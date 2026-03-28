import { useMemo } from 'react';
import { Map, ChevronRight, Circle } from 'lucide-react';
import { extractCognitiveMap, type CognitiveNode } from '../core/cognitive';
import { NODE_STYLES } from '../core/theme';
import { useCanvasStore } from '../store/useCanvasStore';

const CERTAINTY_COLORS: Record<CognitiveNode['certainty'], string> = {
  confirmed: '#10B981',
  likely: '#F59E0B',
  uncertain: '#EF4444',
};

const CERTAINTY_LABELS: Record<CognitiveNode['certainty'], string> = {
  confirmed: 'Confirmed',
  likely: 'Likely',
  uncertain: 'Uncertain',
};

export default function CognitiveMapView({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { activeStream } = useCanvasStore();

  const cogMap = useMemo(() => {
    if (!activeStream) return null;
    return extractCognitiveMap(activeStream);
  }, [activeStream]);

  if (!open || !cogMap) return null;

  // Group concepts by category
  const grouped = new globalThis.Map<string, CognitiveNode[]>();
  for (const c of cogMap.concepts) {
    const list = grouped.get(c.category) ?? [];
    list.push(c);
    grouped.set(c.category, list);
  }

  return (
    <div className="absolute inset-0 z-[90] bg-slate-950/95 backdrop-blur-sm overflow-auto">
      {/* Header */}
      <div className="sticky top-0 bg-slate-950/90 backdrop-blur border-b border-slate-800 px-6 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <Map size={20} className="text-blue-400" />
          <h2 className="text-lg font-semibold text-slate-200">
            Cognitive Map
          </h2>
          <span className="text-xs text-slate-500">
            {cogMap.concepts.length} concepts, {cogMap.relations.length}{' '}
            relations
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white text-sm px-3 py-1.5 border border-slate-700 rounded-lg hover:border-slate-500 transition-colors"
        >
          Back to Canvas
        </button>
      </div>

      {/* Legend */}
      <div className="px-6 py-3 flex items-center gap-6 border-b border-slate-800/50">
        <span className="text-xs text-slate-500">Certainty:</span>
        {(['confirmed', 'likely', 'uncertain'] as const).map((level) => (
          <div key={level} className="flex items-center gap-1.5">
            <Circle
              size={8}
              fill={CERTAINTY_COLORS[level]}
              color={CERTAINTY_COLORS[level]}
            />
            <span className="text-xs text-slate-400">
              {CERTAINTY_LABELS[level]}
            </span>
          </div>
        ))}
      </div>

      {/* Concept groups */}
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        {Array.from(grouped.entries()).map(([category, concepts]) => {
          const style = NODE_STYLES[category as keyof typeof NODE_STYLES];
          return (
            <div key={category}>
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: style.color }}
                />
                <h3
                  className="text-sm font-semibold uppercase tracking-wider"
                  style={{ color: style.color }}
                >
                  {style.label}
                </h3>
                <span className="text-xs text-slate-600">
                  ({concepts.length})
                </span>
              </div>

              <div className="space-y-2">
                {concepts.map((concept) => (
                  <div
                    key={concept.id}
                    className="flex items-start gap-3 bg-slate-900/50 border border-slate-800 rounded-lg px-4 py-3 hover:border-slate-700 transition-colors"
                  >
                    <Circle
                      size={10}
                      fill={CERTAINTY_COLORS[concept.certainty]}
                      color={CERTAINTY_COLORS[concept.certainty]}
                      className="mt-1 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {concept.label}
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-600 flex-shrink-0">
                      {concept.certainty}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Relations summary */}
        {cogMap.relations.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Relations
            </h3>
            <div className="space-y-1">
              {cogMap.relations.map((rel) => {
                const src = cogMap.concepts.find(
                  (c) => c.id === rel.source
                );
                const tgt = cogMap.concepts.find(
                  (c) => c.id === rel.target
                );
                if (!src || !tgt) return null;
                return (
                  <div
                    key={rel.id}
                    className="flex items-center gap-2 text-xs text-slate-500"
                  >
                    <span className="truncate max-w-[200px]">
                      {src.label.slice(0, 40)}
                    </span>
                    <ChevronRight size={12} className="text-slate-600" />
                    <span className="text-slate-600 italic">{rel.label}</span>
                    <ChevronRight size={12} className="text-slate-600" />
                    <span className="truncate max-w-[200px]">
                      {tgt.label.slice(0, 40)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}