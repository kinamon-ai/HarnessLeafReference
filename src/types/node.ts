import { z } from 'zod';
import { SocketDefinitionSchema } from './socket';
export type { SocketDefinition } from './socket';

// ──────────────────────────────────────────────
// Actor Category
// ──────────────────────────────────────────────
export const ActorCategorySchema = z.enum([
  'Strategy',
  'Execution',
  'Governance',
  'Environment',
  'Structural',
]);
export type ActorCategory = z.infer<typeof ActorCategorySchema>;

// ──────────────────────────────────────────────
// Actor Node Data (the `data` field of a React Flow Node)
// ──────────────────────────────────────────────
export const ActorNodeDataSchema = z.object({
  actorId: z.string(),
  customName: z.string().optional(),
  actorType: z.string().optional().default('ACTOR'),
  label: z.string().optional().default(''),
  sublabel: z.string().optional(),
  icon: z.string().optional().default('Boxes'),
  colorHex: z.string().optional().default('#00E5FF'),
  inputs: z.array(SocketDefinitionSchema).optional().default([]),
  outputs: z.array(SocketDefinitionSchema).optional().default([]),
  config: z.record(z.string(), z.any()).optional().default({}),
  // Maturity / Operation fields
  craftLevel: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).optional(),
  operationalStatus: z.enum(['active', 'paused', 'maintenance']).optional(),
  // Boundary port fields
  boundaryType: z.enum(['in', 'out']).optional(),
  boundSocketId: z.string().optional(),
  boundSocketType: z.string().optional(),
}).passthrough();
export type ActorNodeData = z.infer<typeof ActorNodeDataSchema>;

export interface BoundaryPortData {
  portType: 'in' | 'out';
  boundSocketId: string;
  boundSocketType: string;
  label: string;
  sublabel?: string;
  icon?: string;
  colorHex?: string;
  connected?: boolean;
}

// ──────────────────────────────────────────────
// Actor Definition (palette template, used in constants/actors.ts)
// ──────────────────────────────────────────────
export const ActorDefinitionSchema = z.object({
  id: z.string(),
  name: z.string(),
  enName: z.string(),
  category: ActorCategorySchema,
  role: z.string(),
  timeScale: z.string(),
  isContainer: z.boolean(),
  colorHex: z.string(),
  borderColor: z.string(),
  glowClass: z.string(),
  icon: z.string(),
  defaultInputs: z.array(SocketDefinitionSchema),
  defaultOutputs: z.array(SocketDefinitionSchema),
});
export type ActorDefinition = z.infer<typeof ActorDefinitionSchema>;
