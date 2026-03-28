import { useCallback, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  useNodesState,
  useEdgesState,
  type NodeTypes,
  type EdgeTypes,
  type NodeMouseHandler,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import ThoughtNodeComponent from './nodes/ThoughtNodeComponent';
import ThoughtEdgeComponent from './edges/ThoughtEdgeComponent';
import { streamToFlow } from './streamToFlow';
import { getLayoutedElements } from './layout/dagre';
import { useCanvasStore } from '../store/useCanvasStore';

const nodeTypes: NodeTypes = {
  thought: ThoughtNodeComponent,
};

const edgeTypes: EdgeTypes = {
  thought: ThoughtEdgeComponent,
};

export default function Canvas() {
  const { activeStream, timelineProgress, setSelectedNode } =
    useCanvasStore();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Convert stream → flow nodes/edges → layout
  const layouted = useMemo(() => {
    if (!activeStream) return { nodes: [], edges: [] };
    const raw = streamToFlow(activeStream, timelineProgress);
    return getLayoutedElements(raw.nodes, raw.edges, 'LR');
  }, [activeStream, timelineProgress]);

  useEffect(() => {
    setNodes(layouted.nodes);
    setEdges(layouted.edges);
  }, [layouted, setNodes, setEdges]);

  // Click node → show detail panel
  const onNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      if (!activeStream) return;
      const thought = activeStream.nodes.find((n) => n.id === node.id);
      if (thought) setSelectedNode(thought);
    },
    [activeStream, setSelectedNode]
  );

  // Click background → deselect
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={onNodeClick}
      onPaneClick={onPaneClick}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      fitView
      fitViewOptions={{ padding: 0.3 }}
      nodesDraggable={false}
      nodesConnectable={false}
      proOptions={{ hideAttribution: true }}
      className="bg-slate-950"
    >
      <Background
        variant={BackgroundVariant.Dots}
        gap={20}
        size={1}
        color="#1E293B"
      />
      <Controls
        className="!bg-slate-800 !border-slate-700 !shadow-lg [&>button]:!bg-slate-800 [&>button]:!border-slate-700 [&>button]:!text-slate-300 [&>button:hover]:!bg-slate-700"
        showInteractive={false}
      />
    </ReactFlow>
  );
}