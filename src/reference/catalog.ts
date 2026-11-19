/**
 * Leaf Reference — shared catalog (client & server safe).
 *
 * Everything here is derived from the canonical sources:
 *   - LEAF_REGISTRY  (src/leaves/registry.ts)   → leaf metadata, sockets, config
 *   - FLOW_PRESETS   (src/constants/presets.ts) → usage examples (auto-indexed)
 *   - SOCKET_TYPES   (src/constants/actors.ts)  → payload colors
 */
import type { Node, Edge } from '@xyflow/react';
import { LEAF_REGISTRY, type LeafCategory, type LeafDefinition } from '../leaves/registry';
import { FLOW_PRESETS, type FlowPreset } from '../constants/presets';
import { SOCKET_TYPES } from '../constants/actors';

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

// ──────────────────────────────────────────────
// Categories
// ──────────────────────────────────────────────
export interface CategoryMeta {
  id: LeafCategory;
  label: string;
  enLabel: string;
  colorHex: string;
  blurb: string;
}

export const CATEGORY_ORDER: LeafCategory[] = [
  'core_engine',
  'tool_storage',
  'flow_control',
  'transform',
  'rag',
  'guardrail',
  'model',
];

export const CATEGORIES: Record<LeafCategory, CategoryMeta> = {
  core_engine: {
    id: 'core_engine', label: 'コア素体', enLabel: 'CORE ENGINE', colorHex: '#FF9100',
    blurb: 'AIモデルを頭脳に持つ自律役者。計画・振り分け・作業・審査の4素体。',
  },
  tool_storage: {
    id: 'tool_storage', label: 'ツール・外部連携', enLabel: 'TOOLS & STORAGE', colorHex: '#FFD600',
    blurb: '検索・ファイル・Python・MCP・KVSなど、外部環境と確定的にやり取りするパーツ。',
  },
  flow_control: {
    id: 'flow_control', label: 'フロー制御', enLabel: 'FLOW CONTROL', colorHex: '#00E676',
    blurb: '分岐・並列・集約・リトライ上限。AIの気まぐれを排し流れをプログラマブルに制御。',
  },
  transform: {
    id: 'transform', label: '成形・変換', enLabel: 'TRANSFORM', colorHex: '#00E5FF',
    blurb: 'プロンプトの組み立てやJSON抽出など、データの形を整えるパーツ。',
  },
  rag: {
    id: 'rag', label: 'ナレッジ・RAG', enLabel: 'KNOWLEDGE & RAG', colorHex: '#2979FF',
    blurb: 'ベクトル化・検索・再ランク・整形・圧縮。根拠付き回答のための検索パイプライン。',
  },
  guardrail: {
    id: 'guardrail', label: 'ガバナンス・安全', enLabel: 'GUARDRAILS', colorHex: '#D500F9',
    blurb: 'インジェクション遮断・個人情報マスキング・スキーマ修復で入出力を守る防御層。',
  },
  model: {
    id: 'model', label: 'モデル・判定', enLabel: 'AI MODELS & DECISION', colorHex: '#E551BA',
    blurb: 'TypeSafe Jev 等の高速判定専用AI（System One）やモデル連携アダプタ。',
  },
};

export const CRAFT_LEVELS: Record<number, { label: string; enName: string; color: string }> = {
  1: { label: 'テストデータ排出のみ', enName: 'MOCK', color: '#F97316' },
  2: { label: '機能実装済み (Alpha)', enName: 'IMPLEMENTED', color: '#FBBF24' },
  3: { label: '実リソースで結果排出可能 (Beta)', enName: 'FUNCTIONAL', color: '#22D3EE' },
  4: { label: '本環境で実績あり (Verified)', enName: 'PROVEN', color: '#34D399' },
};

export function payloadMeta(type: string) {
  return (SOCKET_TYPES as Record<string, { name: string; colorHex: string; description: string }>)[type]
    ?? SOCKET_TYPES.Context;
}

// ──────────────────────────────────────────────
// Leaves (ordered by category, then registry order)
// ──────────────────────────────────────────────
export const ALL_LEAVES: LeafDefinition[] = CATEGORY_ORDER.flatMap((cat) =>
  Object.values(LEAF_REGISTRY).filter((l) => l.category === cat),
);

export function getLeaf(id: string): LeafDefinition | undefined {
  return LEAF_REGISTRY[id];
}

// ──────────────────────────────────────────────
// Usage index: leaf → presets/levels that contain it
// ──────────────────────────────────────────────
export interface PresetLevelView {
  presetId: string;
  levelId: string; // 'root' or nested level id
  nodes: Node[];
  edges: Edge[];
}

export interface LeafUsage {
  presetId: string;
  presetName: string;
  presetEnName: string;
  description: string;
  levelId: string;
  nodeIds: string[];
  nodeNames: string[];
  leafCountInLevel: number;
}

/** Display order of presets on the reference site. */
export const PRESET_ORDER = Object.keys(FLOW_PRESETS);

export function getPresetLevels(preset: FlowPreset): PresetLevelView[] {
  const levels = preset.levels && Object.keys(preset.levels).length > 0
    ? preset.levels
    : { root: { nodes: preset.nodes, edges: preset.edges } };
  return Object.entries(levels)
    .filter(([, lv]) => Array.isArray(lv?.nodes) && lv.nodes.length > 0)
    .map(([levelId, lv]) => ({ presetId: preset.id, levelId, nodes: lv.nodes, edges: lv.edges ?? [] }));
}

export function getPresetLevel(presetId: string, levelId = 'root'): PresetLevelView | undefined {
  const preset = FLOW_PRESETS[presetId];
  if (!preset) return undefined;
  return getPresetLevels(preset).find((l) => l.levelId === levelId);
}

const actorIdOf = (n: Node) => (n.data as any)?.actorId as string | undefined;

function buildUsageIndex(): Record<string, LeafUsage[]> {
  const index: Record<string, LeafUsage[]> = {};
  for (const presetId of PRESET_ORDER) {
    const preset = FLOW_PRESETS[presetId];
    for (const level of getPresetLevels(preset)) {
      const leafNodes = level.nodes.filter((n) => LEAF_REGISTRY[actorIdOf(n) ?? '']);
      const byLeaf = new Map<string, Node[]>();
      for (const n of leafNodes) {
        const id = actorIdOf(n)!;
        byLeaf.set(id, [...(byLeaf.get(id) ?? []), n]);
      }
      for (const [leafId, nodes] of byLeaf) {
        (index[leafId] ??= []).push({
          presetId,
          presetName: preset.name,
          presetEnName: preset.enName,
          description: preset.description,
          levelId: level.levelId,
          nodeIds: nodes.map((n) => n.id),
          nodeNames: nodes.map((n) => String((n.data as any)?.customName ?? (n.data as any)?.label ?? n.id)),
          leafCountInLevel: leafNodes.length,
        });
      }
    }
  }
  // Prefer compact, focused examples first (fewer leaves = clearer illustration).
  for (const list of Object.values(index)) {
    list.sort((a, b) => a.leafCountInLevel - b.leafCountInLevel);
  }
  return index;
}

export const USAGE_INDEX: Record<string, LeafUsage[]> = buildUsageIndex();

export function getUsages(leafId: string): LeafUsage[] {
  return USAGE_INDEX[leafId] ?? [];
}

/** Leaves most often wired in the same example levels (co-occurrence), then same category. */
export function getRelatedLeaves(leafId: string, limit = 4): LeafDefinition[] {
  const score = new Map<string, number>();
  for (const usage of getUsages(leafId)) {
    const level = getPresetLevel(usage.presetId, usage.levelId);
    if (!level) continue;
    const neighbors = new Set<string>();
    for (const e of level.edges) {
      const touches = usage.nodeIds.includes(e.source) ? e.target : usage.nodeIds.includes(e.target) ? e.source : null;
      if (!touches) continue;
      const other = level.nodes.find((n) => n.id === touches);
      const otherLeaf = other && actorIdOf(other);
      if (otherLeaf && otherLeaf !== leafId && LEAF_REGISTRY[otherLeaf]) neighbors.add(otherLeaf);
    }
    neighbors.forEach((id) => score.set(id, (score.get(id) ?? 0) + 2));
  }
  const self = LEAF_REGISTRY[leafId];
  for (const l of ALL_LEAVES) {
    if (l.id !== leafId && l.category === self?.category) score.set(l.id, (score.get(l.id) ?? 0) + 1);
  }
  return [...score.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => LEAF_REGISTRY[id]);
}

// ──────────────────────────────────────────────
// Image paths (generated by `npm run capture:reference`)
// ──────────────────────────────────────────────
export const leafImagePath = (leafId: string) =>
  `${BASE_PATH}/reference/leaves/${leafId}.png`;
export const paletteImagePath = (presetId: string, levelId = 'root') =>
  `${BASE_PATH}/reference/palettes/${presetId}${levelId === 'root' ? '' : `__${levelId.replace(/\//g, '-')}`}.png`;
export const paletteFocusImagePath = (presetId: string, leafId: string) =>
  `${BASE_PATH}/reference/palettes/${presetId}__focus__${leafId}.png`;
