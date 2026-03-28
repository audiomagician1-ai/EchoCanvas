/** Thought node types */
export type ThoughtType =
  | 'analysis'
  | 'hypothesis'
  | 'verification'
  | 'decision'
  | 'action';

/** Edge relationship types */
export type EdgeRelation =
  | 'leads_to'
  | 'contradicts'
  | 'supports'
  | 'branches';

/** A single thought node */
export interface ThoughtNode {
  id: string;
  type: ThoughtType;
  content: string;
  confidence: number; // 0-1
  timestamp: string;
  metadata: {
    source?: string;
    alternatives?: string[];
    reasoning?: string;
    rejected?: boolean; // true if this path was considered but not chosen
  };
}

/** A connection between thoughts */
export interface ThoughtEdge {
  id: string;
  source: string;
  target: string;
  type: EdgeRelation;
  label?: string;
}

/** A decision point with alternatives */
export interface DecisionPoint {
  nodeId: string;
  chosen: string;
  alternatives: Array<{
    label: string;
    reason: string;
  }>;
}

/** A complete thought stream */
export interface ThoughtStream {
  id: string;
  title: string;
  description?: string;
  nodes: ThoughtNode[];
  edges: ThoughtEdge[];
  decisions: DecisionPoint[];
  createdAt: string;
}