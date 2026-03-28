import { debugSession } from './example-debug-session';
import { architectureSession } from './example-architecture';
import type { ThoughtStream } from '../core/types';

export const EXAMPLE_STREAMS: ThoughtStream[] = [
  debugSession,
  architectureSession,
];