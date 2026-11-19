import type { Node, Edge } from '@xyflow/react';
import { LEAF_REGISTRY } from '../leaves/registry';
import { SOCKET_PROTOCOLS, type SocketDefinition, type SocketTypeId } from '../types/socket';

/**
 * Helpers for authoring flow presets concisely.
 * Leaf nodes are built from LEAF_REGISTRY so sockets, icon, color and config stay in sync
 * with the canonical leaf definitions.
 */

const CATEGORY_ACTOR_TYPE: Record<string, string> = {
  model: 'LEAF / MODEL',
  transform: 'LEAF / TRANSFORM',
  tool_storage: 'LEAF / TOOL',
  flow_control: 'LEAF / FLOW CONTROL',
  guardrail: 'LEAF / GUARDRAIL',
  rag: 'LEAF / RAG',
  core_engine: 'LEAF / CORE ENGINE',
};

export function leafNode(
  id: string,
  leafId: string,
  position: { x: number; y: number },
  customName: string,
  config?: Record<string, any>,
): Node {
  const def = LEAF_REGISTRY[leafId];
  if (!def) throw new Error(`[presetHelpers] Unknown leaf: ${leafId}`);
  return {
    id,
    type: 'customActor',
    position,
    data: {
      actorId: def.id,
      customName,
      actorType: CATEGORY_ACTOR_TYPE[def.category] ?? 'LEAF',
      label: def.name,
      sublabel: def.enName,
      icon: def.icon,
      colorHex: def.colorHex,
      inputs: def.defaultInputs.map((s) => ({ ...s })),
      outputs: def.defaultOutputs.map((s) => ({ ...s })),
      config: { ...(def.defaultConfig ?? {}), ...(config ?? {}) },
      craftLevel: def.craftLevel,
    },
  };
}

/** Unified Fractal I/O Boundary Port used as a flow entry point (IN Port) or terminal sink (OUT Port). */
export function paletteNode(
  id: string,
  position: { x: number; y: number },
  customName: string,
  opts: {
    actorType?: string;
    sublabel?: string;
    icon?: string;
    colorHex?: string;
    inputs?: SocketDefinition[];
    outputs?: SocketDefinition[];
    config?: Record<string, any>;
  } = {},
): Node {
  const isOutputPort =
    opts.actorType === 'OUTPUT' ||
    (Array.isArray(opts.outputs) && opts.outputs.length === 0 && (opts.inputs?.length ?? 0) > 0);

  if (isOutputPort) {
    const inSock = opts.inputs?.[0] ?? { id: 'result', label: 'result', type: 'Result' as SocketTypeId };
    const sType = (inSock.type || 'Result') as SocketTypeId;
    const protocol = SOCKET_PROTOCOLS[sType] || SOCKET_PROTOCOLS.Result;
    return {
      id,
      type: 'boundaryPort',
      deletable: true,
      position,
      data: {
        actorId: 'boundary_out',
        actorType: 'BOUNDARY',
        boundaryType: 'out',
        boundSocketId: inSock.id,
        boundSocketType: sType,
        socketId: inSock.id,
        protocolType: sType,
        customName,
        label: customName,
        sublabel: opts.sublabel ?? `Port: ${inSock.id}`,
        icon: opts.icon ?? 'Plug',
        colorHex: opts.colorHex ?? protocol.colorHex,
        inputs: opts.inputs ?? [inSock],
        outputs: [],
        config: opts.config ?? {},
      },
    };
  }

  const outSock = opts.outputs?.[0] ?? { id: 'prompt', label: 'prompt', type: 'Context' as SocketTypeId };
  const sType = (outSock.type || 'Context') as SocketTypeId;
  const protocol = SOCKET_PROTOCOLS[sType] || SOCKET_PROTOCOLS.Context;

  const defaultSamplePrompts = [
    { label: '標準実行プロンプト 1', prompt: '以下の要件に基づいて分析と提案を行ってください。' },
    { label: '標準実行プロンプト 2', prompt: 'システムの概要と主要な課題を整理して報告してください。' },
  ];
  const userSamplePrompts = opts.config?.samplePrompts;
  const samplePrompts =
    Array.isArray(userSamplePrompts) && userSamplePrompts.length > 0
      ? userSamplePrompts
      : defaultSamplePrompts;

  return {
    id,
    type: 'boundaryPort',
    deletable: true,
    position,
    data: {
      actorId: 'boundary_in',
      actorType: 'BOUNDARY',
      boundaryType: 'in',
      boundSocketId: outSock.id,
      boundSocketType: sType,
      socketId: outSock.id,
      protocolType: sType,
      customName,
      label: customName,
      sublabel: opts.sublabel ?? `Port: ${outSock.id}`,
      icon: opts.icon ?? 'Plug',
      colorHex: opts.colorHex ?? protocol.colorHex,
      inputs: [],
      outputs: opts.outputs ?? [outSock],
      config: {
        testInputEnabled: true,
        ...(opts.config ?? {}),
        samplePrompts,
      },
    },
  };
}

/** Glow edge whose color follows the payload type of the source socket. */
export function glowEdge(
  id: string,
  source: string,
  sourceHandle: string,
  target: string,
  targetHandle: string,
  socketType: string,
): Edge {
  return {
    id,
    source,
    sourceHandle,
    target,
    targetHandle,
    type: 'glow',
    animated: true,
    data: { socketType },
  };
}
