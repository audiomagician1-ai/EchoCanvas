import type { Node, Edge } from '@xyflow/react';
import type { ThoughtStream } from '../core/types';
import type { ThoughtNodeData } from './nodes/ThoughtNodeComponent';
import type { ThoughtEdgeData } from './edges/ThoughtEdgeComponent';

/**
 * Convert a ThoughtStream to React Flow nodes and edges.
 * Optionally filter by timeline progress (0-1) for replay.
 */
export function streamToFlow(
  stream: ThoughtStream,
  timelineProgress = 1
): { nodes: Node[]; edges: Edge[] } {
  const visibleCount = Math.max(
    1,
    Math.ceil(stream.nodes.length * timelineProgress)
  );
  const visibleNodeIds = new Set(
    stream.nodes.slice(0, visibleCount).map((n) => n.id)
  );

  const nodes: Node[] = stream.nodes
    .filter((n) => visibleNodeIds.has(n.id))
    .map((n) => ({
      id: n.id,
      type: 'thought',
      position: { x: 0, y: 0 }, // will be set by dagre layout
      data: {
        thoughtType: n.type,
        content: n.content,
        confidence: n.confidence,
        rejected: n.metadata.rejected,
      } satisfies ThoughtNodeData,
    }));

  const edges: Edge[] = stream.edges
    .filter(
      (e) => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target)
    )
    .map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      type: 'thought',
      data: { relation: e.type } satisfies ThoughtEdgeData,
    }));

  return { nodes, edges };
}