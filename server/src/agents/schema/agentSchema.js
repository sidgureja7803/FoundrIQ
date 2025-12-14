import { z } from 'zod';

/**
 * Zod schema for agent events
 */
export const AgentEventSchema = z.object({
  taskId: z.string(),
  agentId: z.string().optional(),
  step: z.string(),
  status: z.enum(['started', 'processing', 'completed', 'error']).optional(),
  message: z.string().optional(),
  data: z.any().optional(),
  timestamp: z.string().optional(),
  progress: z.number().min(0).max(100).optional(),
});

/**
 * TypeScript-style type export for AgentEvent
 * @typedef {z.infer<typeof AgentEventSchema>} AgentEvent
 */
