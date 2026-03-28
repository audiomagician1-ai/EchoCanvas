import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from '@xyflow/react';
import type { EdgeRelation } from '../../core/types';
import { EDGE_STYLES } from '../../core/theme';

export interface ThoughtEdgeData {
  relation: EdgeRelation;
  [key: string]: unknown;
}

export default function ThoughtEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps) {
  const edgeData = data as unknown as ThoughtEdgeData;
  const relation = edgeData?.relation ?? 'leads_to';
  const style = EDGE_STYLES[relation];

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: style.stroke,
          strokeWidth: 2,
          strokeDasharray: style.strokeDasharray,
        }}
      />
      {style.animated && (
        <circle r="3" fill={style.stroke}>
          <animateMotion dur="3s" repeatCount="indefinite" path={edgePath} />
        </circle>
      )}
      {style.label && (
        <EdgeLabelRenderer>
          <div
            className="absolute text-[10px] px-1.5 py-0.5 rounded"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              color: style.stroke,
              backgroundColor: '#0F172A',
              border: `1px solid ${style.stroke}44`,
              pointerEvents: 'all',
            }}
          >
            {style.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}