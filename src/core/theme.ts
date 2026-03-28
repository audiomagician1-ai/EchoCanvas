import type { ThoughtType, EdgeRelation } from './types';

export interface NodeStyle {
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string; // lucide icon name
  label: string;
}

export const NODE_STYLES: Record<ThoughtType, NodeStyle> = {
  analysis: {
    color: '#3B82F6',
    bgColor: '#1E3A5F',
    borderColor: '#3B82F6',
    icon: 'Search',
    label: 'Analysis',
  },
  hypothesis: {
    color: '#8B5CF6',
    bgColor: '#3B1F6E',
    borderColor: '#8B5CF6',
    icon: 'Lightbulb',
    label: 'Hypothesis',
  },
  verification: {
    color: '#10B981',
    bgColor: '#134E3A',
    borderColor: '#10B981',
    icon: 'CheckCircle',
    label: 'Verification',
  },
  decision: {
    color: '#F59E0B',
    bgColor: '#533B10',
    borderColor: '#F59E0B',
    icon: 'Zap',
    label: 'Decision',
  },
  action: {
    color: '#EF4444',
    bgColor: '#5C1D1D',
    borderColor: '#EF4444',
    icon: 'Play',
    label: 'Action',
  },
};

export interface EdgeStyle {
  stroke: string;
  strokeDasharray?: string;
  animated: boolean;
  label: string;
}

export const EDGE_STYLES: Record<EdgeRelation, EdgeStyle> = {
  leads_to: {
    stroke: '#64748B',
    animated: false,
    label: '',
  },
  supports: {
    stroke: '#10B981',
    animated: false,
    label: 'supports',
  },
  contradicts: {
    stroke: '#EF4444',
    strokeDasharray: '5 5',
    animated: false,
    label: 'contradicts',
  },
  branches: {
    stroke: '#F59E0B',
    strokeDasharray: '8 4',
    animated: true,
    label: 'branch',
  },
};

/** Confidence → border width mapping */
export function confidenceToBorder(confidence: number): {
  width: number;
  opacity: number;
  dashArray?: string;
} {
  if (confidence < 0.3) {
    return { width: 1, opacity: 0.5, dashArray: '4 4' };
  }
  if (confidence <= 0.7) {
    return { width: 2, opacity: 0.8 };
  }
  return { width: 3, opacity: 1 };
}