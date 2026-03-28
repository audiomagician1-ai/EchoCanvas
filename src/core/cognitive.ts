import type { ThoughtStream, ThoughtType } from './types';

/** A concept extracted from the thought stream */
export interface CognitiveNode {
  id: string;
  label: string;
  certainty: 'confirmed' | 'likely' | 'uncertain';
  sourceNodes: string[]; // IDs of ThoughtNodes that mention this
  category: ThoughtType;
}

/** A relationship between concepts */
export interface CognitiveEdge {
  id: string;
  source: string;
  target: string;
  label: string;
}

export interface CognitiveMap {
  concepts: CognitiveNode[];
  relations: CognitiveEdge[];
}

/**
 * Extract a cognitive map from a thought stream.
 * Groups related thoughts into concept clusters with certainty levels.
 */
export function extractCognitiveMap(stream: ThoughtStream): CognitiveMap {
  const concepts: CognitiveNode[] = [];
  const relations: CognitiveEdge[] = [];
  let conceptId = 0;

  // Group nodes by type to form concept clusters
  const groups: Record<ThoughtType, typeof stream.nodes> = {
    analysis: [],
    hypothesis: [],
    verification: [],
    decision: [],
    action: [],
  };

  for (const node of stream.nodes) {
    groups[node.type].push(node);
  }

  // Create concept nodes from groups
  for (const [type, nodes] of Object.entries(groups)) {
    if (nodes.length === 0) continue;

    // Extract key phrases (simplified: use first ~60 chars)
    for (const node of nodes) {
      const label =
        node.content.length > 60
          ? node.content.slice(0, 57) + '...'
          : node.content;

      const certainty: CognitiveNode['certainty'] =
        node.confidence > 0.7
          ? 'confirmed'
          : node.confidence > 0.4
            ? 'likely'
            : 'uncertain';

      concepts.push({
        id: `c${++conceptId}`,
        label,
        certainty,
        sourceNodes: [node.id],
        category: type as ThoughtType,
      });
    }
  }

  // Create relations based on edges in the original stream
  for (const edge of stream.edges) {
    const sourceConcept = concepts.find((c) =>
      c.sourceNodes.includes(edge.source)
    );
    const targetConcept = concepts.find((c) =>
      c.sourceNodes.includes(edge.target)
    );
    if (sourceConcept && targetConcept && sourceConcept.id !== targetConcept.id) {
      relations.push({
        id: `cr${relations.length + 1}`,
        source: sourceConcept.id,
        target: targetConcept.id,
        label: edge.type.replace('_', ' '),
      });
    }
  }

  return { concepts, relations };
}