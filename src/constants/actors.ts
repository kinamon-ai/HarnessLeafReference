import type { SocketTypeId, SocketProtocol } from '../types/socket';
import { SOCKET_PROTOCOLS } from '../types/socket';
import type { ActorDefinition } from '../types/node';

// Re-export types for backward compatibility
export type { SocketTypeId } from '../types/socket';
export type { ActorDefinition } from '../types/node';
export type { SocketProtocol as SocketType } from '../types/socket';

// Re-export SOCKET_PROTOCOLS as SOCKET_TYPES for backward compatibility
export const SOCKET_TYPES = SOCKET_PROTOCOLS;

export const ACTORS: Record<string, ActorDefinition> = {
  palette: {
    id: "palette",
    name: "パレット",
    enName: "PALETTE (CONTAINER)",
    category: "Structural",
    role: "境界線とフラクタルカプセル化。外側は固定のIN/OUTソケットを持ち、内部は自由に同一構造を入れ子で組める。",
    timeScale: "可変（内部構造依存）",
    isContainer: true,
    colorHex: "#00E5FF",
    borderColor: "border-cyan-500",
    glowClass: "shadow-glow-cyan",
    icon: "Boxes",
    defaultInputs: [
      { id: "in_prompt", label: "input", type: "Context" },
    ],
    defaultOutputs: [
      { id: "out_result", label: "output", type: "Result" },
    ],
  },
  planner: {
    id: "planner",
    name: "プランナー",
    enName: "PLANNER",
    category: "Strategy",
    role: "戦略的判断（粗い時間軸）。ゴールから逆算して「何をするか」のタスクグラフ（Plan）を組み立てる。最初とリプラン時のみ稼働。",
    timeScale: "粗い時間軸 (Coarse)",
    isContainer: true,
    colorHex: "#2979FF",
    borderColor: "border-blue-500",
    glowClass: "shadow-[0_0_20px_rgba(41,121,255,0.4)]",
    icon: "Brain",
    defaultInputs: [
      { id: "prompt", label: "prompt", type: "Context" },
      { id: "context", label: "context", type: "Context" },
      { id: "feedback", label: "feedback", type: "Feedback" },
    ],
    defaultOutputs: [
      { id: "plan", label: "plan", type: "Plan" },
      { id: "rules", label: "rules", type: "Control" },
    ],
  },
  router: {
    id: "router",
    name: "ルーター",
    enName: "ROUTER",
    category: "Strategy",
    role: "実行時判断（細かい時間軸・神経系）。「今どこへ仕事を渡すか」を常時判断し、AgentやToolに振り分ける交通整理AI。",
    timeScale: "細かい時間軸 (Fine)",
    isContainer: true,
    colorHex: "#00E5FF",
    borderColor: "border-cyan-400",
    glowClass: "shadow-glow-cyan",
    icon: "Network",
    defaultInputs: [
      { id: "plan", label: "plan", type: "Plan" },
      { id: "result", label: "result", type: "Result" },
      { id: "feedback", label: "feedback", type: "Feedback" },
    ],
    defaultOutputs: [
      { id: "task_research", label: "task (research)", type: "Task" },
      { id: "task_coding", label: "task (coding)", type: "Task" },
      { id: "tool_call", label: "tool call", type: "ToolCall" },
      { id: "replan_req", label: "re-plan", type: "Feedback" },
      { id: "final_result", label: "final result", type: "Result" },
    ],
  },
  evaluator: {
    id: "evaluator",
    name: "エバリュエーター",
    enName: "EVALUATOR",
    category: "Governance",
    role: "品質評価・合否判定。成果物が基準を満たしているかを判定し、合否および修正フィードバックをRouter/Plannerへ返す。",
    timeScale: "チェックポイント",
    isContainer: true,
    colorHex: "#D500F9",
    borderColor: "border-purple-500",
    glowClass: "shadow-glow-purple",
    icon: "ShieldCheck",
    defaultInputs: [
      { id: "result", label: "result", type: "Result" },
      { id: "criteria", label: "criteria", type: "Context" },
    ],
    defaultOutputs: [
      { id: "approved", label: "approved", type: "Result" },
      { id: "feedback", label: "feedback", type: "Feedback" },
    ],
  },
  agent: {
    id: "agent",
    name: "エージェント",
    enName: "AGENT (WORKER)",
    category: "Execution",
    role: "個別タスクの専門実行者。Routerから渡された単一タスクを遂行し成果物を返す。内部にパレットを持つことも可能。",
    timeScale: "タスク単位",
    isContainer: true,
    colorHex: "#FF9100",
    borderColor: "border-amber-500",
    glowClass: "shadow-glow-orange",
    icon: "Bot",
    defaultInputs: [
      { id: "task", label: "task", type: "Task" },
      { id: "context", label: "context", type: "Context" },
      { id: "tool_result", label: "tool res", type: "Result" },
    ],
    defaultOutputs: [
      { id: "result", label: "result", type: "Result" },
      { id: "tool_call", label: "tool", type: "ToolCall" },
    ],
  },
  tool: {
    id: "tool",
    name: "ツール",
    enName: "TOOL / SANDBOX",
    category: "Environment",
    role: "外部環境に対する決定論的な副作用の実行（コード実行、Web検索、ファイル読み書き、API連携）。",
    timeScale: "同期 / 非同期",
    isContainer: false,
    colorHex: "#2979FF",
    borderColor: "border-blue-400",
    glowClass: "shadow-[0_0_15px_rgba(41,121,255,0.4)]",
    icon: "Wrench",
    defaultInputs: [
      { id: "tool_call", label: "call", type: "ToolCall" },
    ],
    defaultOutputs: [
      { id: "result", label: "result", type: "Result" },
    ],
  },
  memory: {
    id: "memory",
    name: "メモリ",
    enName: "MEMORY / CONTEXT",
    category: "Environment",
    role: "文脈と記憶の保持・検索。対話履歴やナレッジを保持し、要求に応じてコンテキストを提供する。",
    timeScale: "永続",
    isContainer: false,
    colorHex: "#00E5FF",
    borderColor: "border-cyan-500",
    glowClass: "shadow-glow-cyan",
    icon: "Database",
    defaultInputs: [
      { id: "query", label: "query", type: "Context" },
      { id: "write", label: "write", type: "Event" },
    ],
    defaultOutputs: [
      { id: "context", label: "context", type: "Context" },
    ],
  },
  model_harness: {
    id: "model_harness",
    name: "モデルハーネス",
    enName: "MODEL HARNESS",
    category: "Environment",
    role: "モデル接続アダプタ（ローカル: Ollama/vLLM等、API: OpenAI/Anthropic/Gemini等）。差異を吸収し統一的に推論を呼び出す。",
    timeScale: "実行時呼出",
    isContainer: false,
    colorHex: "#00E676",
    borderColor: "border-emerald-500",
    glowClass: "shadow-glow-green",
    icon: "Cpu",
    defaultInputs: [
      { id: "prompt", label: "prompt", type: "Context" },
    ],
    defaultOutputs: [
      { id: "output", label: "completion", type: "Result" },
    ],
  },
};
