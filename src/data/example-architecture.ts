import type { ThoughtStream } from '../core/types';

/** Example: AI agent designing a caching strategy */
export const architectureSession: ThoughtStream = {
  id: 'arch-cache-001',
  title: 'Designing: API Response Caching Strategy',
  description:
    'An AI agent weighing different caching approaches for a high-traffic API endpoint.',
  createdAt: '2026-03-28T11:00:00Z',
  nodes: [
    {
      id: 'a1',
      type: 'analysis',
      content: 'Product listing API has 2000 req/s. Average response time 800ms. Database is the bottleneck — 70% of time spent in DB queries.',
      confidence: 0.95,
      timestamp: '2026-03-28T11:00:01Z',
      metadata: { source: 'performance-metrics' },
    },
    {
      id: 'a2',
      type: 'analysis',
      content: 'Data changes infrequently: products update ~50 times/day. Most reads serve the same data. Cache hit ratio could be >95%.',
      confidence: 0.85,
      timestamp: '2026-03-28T11:00:02Z',
      metadata: { source: 'data-analysis' },
    },
    {
      id: 'a3',
      type: 'hypothesis',
      content: 'Option A: Redis cache with TTL. Simple, proven. But TTL means stale data window.',
      confidence: 0.7,
      timestamp: '2026-03-28T11:00:03Z',
      metadata: {},
    },
    {
      id: 'a4',
      type: 'hypothesis',
      content: 'Option B: CDN edge caching with cache-control headers. Lowest latency but harder invalidation.',
      confidence: 0.5,
      timestamp: '2026-03-28T11:00:04Z',
      metadata: {},
    },
    {
      id: 'a5',
      type: 'hypothesis',
      content: 'Option C: In-memory LRU cache + event-driven invalidation. Zero stale data but complex.',
      confidence: 0.6,
      timestamp: '2026-03-28T11:00:05Z',
      metadata: {},
    },
    {
      id: 'a6',
      type: 'verification',
      content: 'Benchmarked Redis approach: response time drops to 15ms. 98% hit ratio. Stale window = TTL (60s max).',
      confidence: 0.9,
      timestamp: '2026-03-28T11:00:06Z',
      metadata: { source: 'benchmark' },
    },
    {
      id: 'a7',
      type: 'decision',
      content: 'Chose: Redis + event-driven invalidation hybrid. Best of A+C: Redis simplicity + zero stale data via pub/sub invalidation.',
      confidence: 0.85,
      timestamp: '2026-03-28T11:00:07Z',
      metadata: {
        alternatives: ['Pure CDN (rejected: invalidation too slow)', 'Pure in-memory (rejected: no persistence across restarts)'],
        reasoning: 'Redis already in stack. Adding pub/sub invalidation is ~2 days work. Eliminates stale window completely.',
      },
    },
    {
      id: 'a8',
      type: 'action',
      content: 'Implemented Redis cache layer with pub/sub. Product update events trigger immediate cache invalidation. Deployed to staging.',
      confidence: 0.95,
      timestamp: '2026-03-28T11:00:08Z',
      metadata: { source: 'implementation' },
    },
  ],
  edges: [
    { id: 'ae1-2', source: 'a1', target: 'a2', type: 'leads_to' },
    { id: 'ae2-3', source: 'a2', target: 'a3', type: 'leads_to' },
    { id: 'ae2-4', source: 'a2', target: 'a4', type: 'branches' },
    { id: 'ae2-5', source: 'a2', target: 'a5', type: 'branches' },
    { id: 'ae3-6', source: 'a3', target: 'a6', type: 'leads_to' },
    { id: 'ae5-7', source: 'a5', target: 'a7', type: 'supports' },
    { id: 'ae6-7', source: 'a6', target: 'a7', type: 'supports' },
    { id: 'ae4-7', source: 'a4', target: 'a7', type: 'contradicts' },
    { id: 'ae7-8', source: 'a7', target: 'a8', type: 'leads_to' },
  ],
  decisions: [
    {
      nodeId: 'a7',
      chosen: 'Redis + event-driven invalidation hybrid',
      alternatives: [
        { label: 'Pure CDN caching', reason: 'Invalidation latency too high for product updates' },
        { label: 'Pure in-memory LRU', reason: 'No persistence across restarts, complex to scale' },
      ],
    },
  ],
};