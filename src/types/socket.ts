import { z } from 'zod';

// ──────────────────────────────────────────────
// Socket Type ID (8-color protocol)
// ──────────────────────────────────────────────
export const SocketTypeId = z.enum([
  'Context',   // 🔵 Cyan  #00E5FF
  'Plan',      // 🟣 Purple #D500F9
  'Task',      // 🟡 Yellow #FFEA00
  'ToolCall',  // 🟠 Orange #FF9100
  'Result',    // 🟢 Green  #00E676
  'Control',   // 🔴 Red    #FF1744
  'Feedback',  // 🩷 Pink   #FF4081
  'Event',     // ⚪ White  #ECEFF1
]);
export type SocketTypeId = z.infer<typeof SocketTypeId>;

// ──────────────────────────────────────────────
// Socket Protocol Metadata (color, name, description)
// ──────────────────────────────────────────────
export const SocketProtocolSchema = z.object({
  name: z.string(),
  colorName: z.string(),
  colorHex: z.string(),
  description: z.string(),
});
export type SocketProtocol = z.infer<typeof SocketProtocolSchema>;

// ──────────────────────────────────────────────
// Socket Definition (a single port on a node)
// ──────────────────────────────────────────────
export const SocketDefinitionSchema = z.object({
  id: z.string(),
  label: z.string().optional().default(''),
  type: SocketTypeId.catch('Context'),
}).passthrough();
export type SocketDefinition = z.infer<typeof SocketDefinitionSchema>;

// ──────────────────────────────────────────────
// Socket Protocols Registry (the 8-color mapping)
// ──────────────────────────────────────────────
export const SOCKET_PROTOCOLS: Record<SocketTypeId, SocketProtocol> = {
  Context: {
    name: 'Context / Prompt',
    colorName: 'Cyan',
    colorHex: '#00E5FF',
    description: 'ユーザー入力、背景知識、記憶データ、指示',
  },
  Plan: {
    name: 'Plan',
    colorName: 'Purple',
    colorHex: '#D500F9',
    description: '戦略タスクグラフ、ゴール・依存関係（Planner ➔ Router）',
  },
  Task: {
    name: 'Task',
    colorName: 'Yellow',
    colorHex: '#FFEA00',
    description: 'ルーターから切り出された個別作業（Router ➔ Agent）',
  },
  ToolCall: {
    name: 'Tool Call',
    colorName: 'Orange',
    colorHex: '#FF9100',
    description: '外部ツール呼出命令（Agent/Router ➔ Tool）',
  },
  Result: {
    name: 'Result',
    colorName: 'Green',
    colorHex: '#00E676',
    description: '実行結果・成果物（Agent/Tool ➔ Router/Evaluator）',
  },
  Control: {
    name: 'Control',
    colorName: 'Red',
    colorHex: '#FF1744',
    description: '制約条件、エラー、システム制御',
  },
  Feedback: {
    name: 'Feedback',
    colorName: 'Pink',
    colorHex: '#FF4081',
    description: '評価判定、修正指示、リプラン要請（Evaluator ➔ Router/Planner）',
  },
  Event: {
    name: 'Event / State',
    colorName: 'White',
    colorHex: '#ECEFF1',
    description: '実行状態、セッションメタデータ',
  },
};
