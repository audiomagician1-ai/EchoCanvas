import { create } from 'zustand';
import type { ThoughtStream, ThoughtNode } from '../core/types';
import { EXAMPLE_STREAMS } from '../data';

interface CanvasState {
  /** All available streams */
  streams: ThoughtStream[];
  /** Currently active stream */
  activeStream: ThoughtStream | null;
  /** Currently selected node (for detail panel) */
  selectedNode: ThoughtNode | null;
  /** Timeline progress (0-1) for replay mode */
  timelineProgress: number;
  /** Whether replay mode is active */
  isReplaying: boolean;

  // Actions
  setActiveStream: (id: string) => void;
  setSelectedNode: (node: ThoughtNode | null) => void;
  setTimelineProgress: (progress: number) => void;
  toggleReplay: () => void;
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  streams: EXAMPLE_STREAMS,
  activeStream: EXAMPLE_STREAMS[0],
  selectedNode: null,
  timelineProgress: 1,
  isReplaying: false,

  setActiveStream: (id) => {
    const stream = get().streams.find((s) => s.id === id) ?? null;
    set({ activeStream: stream, selectedNode: null, timelineProgress: 1 });
  },

  setSelectedNode: (node) => set({ selectedNode: node }),

  setTimelineProgress: (progress) => set({ timelineProgress: progress }),

  toggleReplay: () => set((s) => ({ isReplaying: !s.isReplaying })),
}));