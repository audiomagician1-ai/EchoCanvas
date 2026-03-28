import type {
  ThoughtStream,
  ThoughtNode,
  ThoughtEdge,
  ThoughtType,
  EdgeRelation,
} from '../core/types';
import { THOUGHT_SIGNALS, EDGE_SIGNALS, CONFIDENCE_BOOST } from './patterns';

/** Split markdown into assistant message blocks */
function extractAssistantBlocks(markdown: string): string[] {
  const blocks: string[] = [];
  const lines = markdown.split('\n');
  let current: string[] = [];
  let inAssistant = false;

  for (const line of lines) {
    // Detect assistant turn markers (various formats)
    if (/^#{1,3}\s*(?:assistant|claude|ai|echo)/i.test(line)) {
      if (current.length > 0 && inAssistant) {
        blocks.push(current.join('\n').trim());
      }
      current = [];
      inAssistant = true;
      continue;
    }
    // Detect user turn → end assistant block
    if (/^#{1,3}\s*(?:user|human)/i.test(line)) {
      if (current.length > 0 && inAssistant) {
        blocks.push(current.join('\n').trim());
      }
      current = [];
      inAssistant = false;
      continue;
    }
    if (inAssistant) {
      current.push(line);
    }
  }
  // Flush
  if (current.length > 0 && inAssistant) {
    blocks.push(current.join('\n').trim());
  }

  // If no turn markers found, treat entire text as one block
  if (blocks.length === 0 && markdown.trim()) {
    blocks.push(markdown.trim());
  }

  return blocks;
}

/** Split a block into logical paragraphs (thought units) */
function splitIntoParagraphs(block: string): string[] {
  return block
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 20); // skip tiny fragments
}

/** Classify a paragraph's thought type */
function classifyThought(text: string): ThoughtType {
  const scores: Record<ThoughtType, number> = {
    analysis: 0,
    hypothesis: 0,
    verification: 0,
    decision: 0,
    action: 0,
  };

  for (const [type, patterns] of Object.entries(THOUGHT_SIGNALS)) {
    for (const pattern of patterns) {
      if (pattern.test(text)) {
        scores[type as ThoughtType] += 1;
      }
    }
  }

  // Find highest scoring type
  let best: ThoughtType = 'analysis';
  let bestScore = 0;
  for (const [type, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      best = type as ThoughtType;
    }
  }

  return best;
}

/** Estimate confidence from text content */
function estimateConfidence(text: string): number {
  let confidence = 0.6; // baseline
  for (const mod of CONFIDENCE_BOOST) {
    if (mod.pattern.test(text)) {
      confidence += mod.delta;
    }
  }
  return Math.max(0.1, Math.min(1.0, confidence));
}

/** Detect edge type between two consecutive thoughts */
function detectEdgeType(
  _source: ThoughtNode,
  target: ThoughtNode
): EdgeRelation {
  for (const [relation, patterns] of Object.entries(EDGE_SIGNALS)) {
    for (const pattern of patterns) {
      if (pattern.test(target.content)) {
        return relation as EdgeRelation;
      }
    }
  }
  return 'leads_to'; // default
}

/**
 * Parse a markdown conversation into a ThoughtStream.
 * This is the core intelligence of EchoCanvas.
 */
export function parseConversation(
  markdown: string,
  title = 'Parsed Thought Stream'
): ThoughtStream {
  const blocks = extractAssistantBlocks(markdown);
  const allParagraphs: string[] = [];

  for (const block of blocks) {
    allParagraphs.push(...splitIntoParagraphs(block));
  }

  // Create nodes
  const nodes: ThoughtNode[] = allParagraphs.map((text, i) => ({
    id: `p${i + 1}`,
    type: classifyThought(text),
    content: text.length > 200 ? text.slice(0, 197) + '...' : text,
    confidence: estimateConfidence(text),
    timestamp: new Date(Date.now() + i * 1000).toISOString(),
    metadata: {},
  }));

  // Create edges (sequential + detected relationships)
  const edges: ThoughtEdge[] = [];
  for (let i = 1; i < nodes.length; i++) {
    const edgeType = detectEdgeType(nodes[i - 1], nodes[i]);
    edges.push({
      id: `e${i}-${i + 1}`,
      source: nodes[i - 1].id,
      target: nodes[i].id,
      type: edgeType,
    });
  }

  return {
    id: `parsed-${Date.now()}`,
    title,
    description: `Parsed from ${blocks.length} assistant message(s), ${nodes.length} thought units`,
    nodes,
    edges,
    decisions: [],
    createdAt: new Date().toISOString(),
  };
}