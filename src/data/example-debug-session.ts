import type { ThoughtStream } from '../core/types';

/** Example: An AI agent debugging a null pointer crash */
export const debugSession: ThoughtStream = {
  id: 'debug-null-pointer-001',
  title: 'Debugging: App crashes on user profile load',
  description:
    'A real-world debugging session showing how an AI agent traces a null pointer exception from symptom to root cause.',
  createdAt: '2026-03-28T10:00:00Z',
  nodes: [
    {
      id: 'n1',
      type: 'analysis',
      content: 'User reports crash when opening profile page. Error log shows TypeError: Cannot read property "avatar" of null',
      confidence: 0.95,
      timestamp: '2026-03-28T10:00:01Z',
      metadata: { source: 'error-log' },
    },
    {
      id: 'n2',
      type: 'analysis',
      content: 'Stack trace points to ProfileCard.tsx line 42: user.avatar.url — the user object itself is null',
      confidence: 0.9,
      timestamp: '2026-03-28T10:00:02Z',
      metadata: { source: 'stack-trace' },
    },
    {
      id: 'n3',
      type: 'hypothesis',
      content: 'Hypothesis A: The API returns null for deleted/deactivated users instead of a proper error',
      confidence: 0.6,
      timestamp: '2026-03-28T10:00:03Z',
      metadata: { reasoning: 'API might not handle edge cases for deleted users' },
    },
    {
      id: 'n4',
      type: 'hypothesis',
      content: 'Hypothesis B: Race condition — component renders before user data fetch completes',
      confidence: 0.4,
      timestamp: '2026-03-28T10:00:04Z',
      metadata: { reasoning: 'useEffect fetch might not have loading guard' },
    },
    {
      id: 'n5',
      type: 'verification',
      content: 'Check API response for the failing user ID → API returns { user: null, error: "USER_DELETED" }. Hypothesis A confirmed!',
      confidence: 0.95,
      timestamp: '2026-03-28T10:00:05Z',
      metadata: { source: 'api-test' },
    },
    {
      id: 'n6',
      type: 'verification',
      content: 'Check component code: useEffect has loading state but no null-user guard. Both issues exist but A is the trigger.',
      confidence: 0.85,
      timestamp: '2026-03-28T10:00:06Z',
      metadata: { source: 'code-review' },
    },
    {
      id: 'n7',
      type: 'decision',
      content: 'Fix: Add null check with graceful "User Not Found" fallback UI, plus loading skeleton',
      confidence: 0.9,
      timestamp: '2026-03-28T10:00:07Z',
      metadata: {
        alternatives: [
          'Fix API to return 404 instead of null (too risky, changes API contract)',
          'Add global error boundary (too broad, hides specific issue)',
        ],
        reasoning: 'Defensive UI is safest — handles both null user and loading state',
      },
    },
    {
      id: 'n8',
      type: 'hypothesis',
      content: 'Alternative: Refactor API to return 404 status code for deleted users',
      confidence: 0.3,
      timestamp: '2026-03-28T10:00:08Z',
      metadata: { rejected: true, reasoning: 'Risky: other clients depend on current API shape' },
    },
    {
      id: 'n9',
      type: 'action',
      content: 'Implemented null guard in ProfileCard + UserNotFound component + loading skeleton. All 3 test cases pass.',
      confidence: 0.95,
      timestamp: '2026-03-28T10:00:09Z',
      metadata: { source: 'commit abc1234' },
    },
    {
      id: 'n10',
      type: 'action',
      content: 'Committed, pushed, CI green. Deployed to staging. Verified: deleted user profile now shows friendly message.',
      confidence: 1.0,
      timestamp: '2026-03-28T10:00:10Z',
      metadata: { source: 'deploy' },
    },
  ],
  edges: [
    { id: 'e1-2', source: 'n1', target: 'n2', type: 'leads_to' },
    { id: 'e2-3', source: 'n2', target: 'n3', type: 'leads_to' },
    { id: 'e2-4', source: 'n2', target: 'n4', type: 'branches' },
    { id: 'e3-5', source: 'n3', target: 'n5', type: 'leads_to' },
    { id: 'e4-6', source: 'n4', target: 'n6', type: 'leads_to' },
    { id: 'e5-7', source: 'n5', target: 'n7', type: 'supports' },
    { id: 'e6-7', source: 'n6', target: 'n7', type: 'supports' },
    { id: 'e7-8', source: 'n7', target: 'n8', type: 'branches' },
    { id: 'e7-9', source: 'n7', target: 'n9', type: 'leads_to' },
    { id: 'e9-10', source: 'n9', target: 'n10', type: 'leads_to' },
  ],
  decisions: [
    {
      nodeId: 'n7',
      chosen: 'Defensive UI with null guard + loading skeleton',
      alternatives: [
        {
          label: 'Fix API to return 404',
          reason: 'Too risky — changes API contract, other clients may break',
        },
        {
          label: 'Global error boundary',
          reason: 'Too broad — hides specific issue, poor UX',
        },
      ],
    },
  ],
};