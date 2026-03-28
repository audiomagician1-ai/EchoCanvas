import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import {
  Search,
  Lightbulb,
  CheckCircle,
  Zap,
  Play,
} from 'lucide-react';
import type { ThoughtType } from '../../core/types';
import { NODE_STYLES, confidenceToBorder } from '../../core/theme';

export interface ThoughtNodeData {
  thoughtType: ThoughtType;
  content: string;
  confidence: number;
  rejected?: boolean;
  [key: string]: unknown;
}

const ICONS: Record<ThoughtType, React.ComponentType<{ size?: number }>> = {
  analysis: Search,
  hypothesis: Lightbulb,
  verification: CheckCircle,
  decision: Zap,
  action: Play,
};

/** SVG shape paths for each thought type */
function NodeShape({
  type,
  style: nodeStyle,
  border,
}: {
  type: ThoughtType;
  style: { bgColor: string; borderColor: string };
  border: { width: number; opacity: number; dashArray?: string };
}) {
  const common = {
    fill: nodeStyle.bgColor,
    stroke: nodeStyle.borderColor,
    strokeWidth: border.width,
    strokeDasharray: border.dashArray,
    opacity: border.opacity,
  };

  switch (type) {
    case 'analysis': // rounded rectangle
      return <rect x="2" y="2" width="196" height="76" rx="12" {...common} />;
    case 'hypothesis': // diamond
      return (
        <polygon points="100,2 198,40 100,78 2,40" {...common} />
      );
    case 'verification': // octagon
      return (
        <polygon
          points="60,2 140,2 198,30 198,50 140,78 60,78 2,50 2,30"
          {...common}
        />
      );
    case 'decision': // hexagon
      return (
        <polygon
          points="50,2 150,2 198,40 150,78 50,78 2,40"
          {...common}
        />
      );
    case 'action': // circle/ellipse
      return <ellipse cx="100" cy="40" rx="98" ry="38" {...common} />;
  }
}

function ThoughtNodeComponent({ data }: NodeProps) {
  const nodeData = data as unknown as ThoughtNodeData;
  const { thoughtType, content, confidence, rejected } = nodeData;
  const style = NODE_STYLES[thoughtType];
  const border = confidenceToBorder(confidence);
  const Icon = ICONS[thoughtType];

  return (
    <div
      className="relative"
      style={{
        opacity: rejected ? 0.4 : 1,
        filter: rejected ? 'grayscale(0.5)' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      {/* SVG shape background */}
      <svg
        width="200"
        height="80"
        viewBox="0 0 200 80"
        className="absolute inset-0"
      >
        <NodeShape type={thoughtType} style={style} border={border} />
      </svg>

      {/* Content overlay */}
      <div className="relative z-10 flex items-center gap-2 px-5 py-4 w-[200px] h-[80px]">
        <div
          className="flex-shrink-0 p-1.5 rounded-md"
          style={{ backgroundColor: `${style.color}22` }}
        >
          <Icon size={18} color={style.color} />
        </div>
        <div className="flex-1 min-w-0">
          <div
            className="text-[10px] font-semibold uppercase tracking-wider mb-0.5"
            style={{ color: style.color }}
          >
            {style.label}
          </div>
          <div className="text-xs text-slate-200 leading-tight line-clamp-2">
            {content}
          </div>
        </div>
      </div>

      {/* Confidence glow for high confidence */}
      {confidence > 0.7 && !rejected && (
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            boxShadow: `0 0 20px ${style.color}33`,
          }}
        />
      )}

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2 !h-2 !border-2"
        style={{
          backgroundColor: style.color,
          borderColor: style.bgColor,
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-2 !h-2 !border-2"
        style={{
          backgroundColor: style.color,
          borderColor: style.bgColor,
        }}
      />
    </div>
  );
}

export default memo(ThoughtNodeComponent);