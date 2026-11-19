import type { SocketDefinition } from '../types/socket';

export type LeafCategory =
  | 'model'
  | 'transform'
  | 'tool_storage'
  | 'flow_control'
  | 'guardrail'
  | 'rag'
  | 'core_engine';

export interface LeafDefinition {
  id: string;
  name: string;
  enName: string;
  category: LeafCategory;
  icon: string;
  colorHex: string;
  borderColor: string;
  glowClass: string;
  description: string;
  isContainer: false; // Leaves are atomic units (never containers)
  defaultInputs: SocketDefinition[];
  defaultOutputs: SocketDefinition[];
  defaultConfig?: Record<string, any>;
  craftLevel: 1 | 2 | 3 | 4;
  operationalStatus?: 'active' | 'paused' | 'maintenance';
}

export const LEAF_REGISTRY: Record<string, LeafDefinition> = {
  leaf_prompt_template: {
    id: 'leaf_prompt_template',
    craftLevel: 4,
    name: 'Prompt Template',
    enName: 'PROMPT TEMPLATE',
    category: 'transform',
    icon: 'FileCode',
    colorHex: '#00E5FF',
    borderColor: 'border-cyan-500/40',
    glowClass: 'shadow-[0_0_20px_rgba(0,229,255,0.3)]',
    description: '{{context}} などの変数展開で完成プロンプトを生成',
    isContainer: false,
    defaultInputs: [
      { id: 'context', label: 'context', type: 'Context' },
      { id: 'task', label: 'task', type: 'Task' },
    ],
    defaultOutputs: [
      { id: 'prompt', label: 'prompt', type: 'Context' },
    ],
    defaultConfig: {
      template: '以下の指示に従って実行してください:\nタスク: {{task}}\nコンテキスト: {{context}}',
    },
  },

  leaf_json_extractor: {
    id: 'leaf_json_extractor',
    craftLevel: 4,
    name: 'JSON Extractor',
    enName: 'JSON EXTRACTOR',
    category: 'transform',
    icon: 'FileJson',
    colorHex: '#00E676',
    borderColor: 'border-emerald-500/40',
    glowClass: 'shadow-[0_0_20px_rgba(0,230,118,0.3)]',
    description: 'LLMの出力からマークダウンJSONブロックのみを正確に抽出・パース',
    isContainer: false,
    defaultInputs: [
      { id: 'result', label: 'result', type: 'Result' },
    ],
    defaultOutputs: [
      { id: 'structured', label: 'data', type: 'Result' },
      { id: 'error', label: 'error', type: 'Control' },
    ],
    defaultConfig: {},
  },

  leaf_kvs_store: {
    id: 'leaf_kvs_store',
    craftLevel: 3,
    name: 'KVS Store',
    enName: 'STATE STORE',
    category: 'tool_storage',
    icon: 'Database',
    colorHex: '#ECEFF1',
    borderColor: 'border-slate-400/40',
    glowClass: 'shadow-[0_0_20px_rgba(236,239,241,0.2)]',
    description: 'セッション内での状態保持・変数カウンターの読み書き',
    isContainer: false,
    defaultInputs: [
      { id: 'write', label: 'write', type: 'Event' },
      { id: 'query', label: 'query', type: 'Context' },
    ],
    defaultOutputs: [
      { id: 'value', label: 'value', type: 'Context' },
    ],
    defaultConfig: {
      key: 'session_key',
      namespace: 'global',
    },
  },

  leaf_worker: {
    id: 'leaf_worker',
    craftLevel: 4,
    name: 'Worker 素体',
    enName: 'REACT WORKER',
    category: 'core_engine',
    icon: 'Bot',
    colorHex: '#FF9100',
    borderColor: 'border-orange-500/40',
    glowClass: 'shadow-[0_0_20px_rgba(255,145,0,0.3)]',
    description: 'ReAct (Reasoning + Acting) 思考・ツール呼出・解釈ループ',
    isContainer: false,
    defaultInputs: [
      { id: 'task', label: 'task', type: 'Task' },
      { id: 'context', label: 'context', type: 'Context' },
      { id: 'tool_result', label: 'tool res', type: 'Result' },
    ],
    defaultOutputs: [
      { id: 'result', label: 'result', type: 'Result' },
      { id: 'tool_call', label: 'tool call', type: 'ToolCall' },
    ],
    defaultConfig: {
      mode: 'react',
      model: 'gpt-4o-mini',
    },
  },

  leaf_evaluator: {
    id: 'leaf_evaluator',
    craftLevel: 4,
    name: 'Evaluator 素体',
    enName: 'LLM JUDGE',
    category: 'core_engine',
    icon: 'ShieldCheck',
    colorHex: '#D500F9',
    borderColor: 'border-purple-500/40',
    glowClass: 'shadow-[0_0_20px_rgba(213,0,249,0.3)]',
    description: 'LLM Judge による品質評価、合否判定、Feedback生成',
    isContainer: false,
    defaultInputs: [
      { id: 'result', label: 'result', type: 'Result' },
      { id: 'criteria', label: 'criteria', type: 'Context' },
    ],
    defaultOutputs: [
      { id: 'feedback', label: 'feedback', type: 'Feedback' },
      { id: 'approved', label: 'approved', type: 'Result' },
    ],
    defaultConfig: {
      threshold: 0.75,
      strictMode: false,
    },
  },

  leaf_condition_switch: {
    id: 'leaf_condition_switch',
    craftLevel: 4,
    name: 'Condition / Switch',
    enName: 'IF/ELSE SWITCH',
    category: 'flow_control',
    icon: 'Network',
    colorHex: '#00E676',
    borderColor: 'border-emerald-500/40',
    glowClass: 'shadow-[0_0_20px_rgba(0,230,118,0.3)]',
    description: 'ステータスやJSONパス評価による確定的IF/ELSE分岐',
    isContainer: false,
    defaultInputs: [
      { id: 'result', label: 'eval data', type: 'Result' },
    ],
    defaultOutputs: [
      { id: 'true_branch', label: 'true (OK)', type: 'Result' },
      { id: 'false_branch', label: 'false (NG)', type: 'Result' },
    ],
    defaultConfig: {
      path: 'status',
      operator: 'equals',
      value: 'success',
    },
  },

  leaf_rule_filter: {
    id: 'leaf_rule_filter',
    craftLevel: 3,
    name: 'Rule Filter',
    enName: 'RULE FILTER',
    category: 'flow_control',
    icon: 'Sliders',
    colorHex: '#00E5FF',
    borderColor: 'border-cyan-500/40',
    glowClass: 'shadow-[0_0_20px_rgba(0,229,255,0.3)]',
    description: '正規表現・キーワードでAI推論を即決バイパスする軽量フィルタ',
    isContainer: false,
    defaultInputs: [
      { id: 'prompt', label: 'input', type: 'Context' },
    ],
    defaultOutputs: [
      { id: 'matched', label: 'matched (Bypass)', type: 'Context' },
      { id: 'unmatched', label: 'unmatched (AI)', type: 'Context' },
    ],
    defaultConfig: {
      pattern: 'hello|こんにちは|ヘルプ|help',
      action: 'canned_response',
    },
  },

  leaf_retry_counter: {
    id: 'leaf_retry_counter',
    craftLevel: 4,
    name: 'Retry Counter',
    enName: 'LOOP GUARD',
    category: 'flow_control',
    icon: 'RotateCw',
    colorHex: '#FF1744',
    borderColor: 'border-red-500/40',
    glowClass: 'shadow-[0_0_20px_rgba(255,23,68,0.3)]',
    description: 'リトライ回数を管理し、上限超過時に非常停止(Control)を出力',
    isContainer: false,
    defaultInputs: [
      { id: 'feedback', label: 'feedback', type: 'Feedback' },
    ],
    defaultOutputs: [
      { id: 'retry', label: 'retry loop', type: 'Feedback' },
      { id: 'abort', label: 'abort signal', type: 'Control' },
    ],
    defaultConfig: {
      maxRetries: 3,
    },
  },

  leaf_fork_broadcast: {
    id: 'leaf_fork_broadcast',
    craftLevel: 4,
    name: 'Fork / Broadcast',
    enName: 'FORK BROADCAST',
    category: 'flow_control',
    icon: 'GitFork',
    colorHex: '#FFD600',
    borderColor: 'border-yellow-500/40',
    glowClass: 'shadow-[0_0_20px_rgba(255,214,0,0.3)]',
    description: '1つの入力を複製し、複数ワーカーへ同時に並列発火（並列化の起点）',
    isContainer: false,
    defaultInputs: [
      { id: 'input', label: 'input (any)', type: 'Context' },
    ],
    defaultOutputs: [
      { id: 'out_1', label: 'branch 1', type: 'Context' },
      { id: 'out_2', label: 'branch 2', type: 'Context' },
      { id: 'out_3', label: 'branch 3', type: 'Context' },
    ],
    defaultConfig: {
      mode: 'broadcast',
      branchCount: 3,
    },
  },

  leaf_join_aggregator: {
    id: 'leaf_join_aggregator',
    craftLevel: 4,
    name: 'Join / Aggregator',
    enName: 'JOIN AGGREGATOR',
    category: 'flow_control',
    icon: 'GitMerge',
    colorHex: '#00E676',
    borderColor: 'border-emerald-500/40',
    glowClass: 'shadow-[0_0_20px_rgba(0,230,118,0.3)]',
    description: '全員の結果が揃うまで待機し、1つの統合成果物に集計（並列化の終点）',
    isContainer: false,
    defaultInputs: [
      { id: 'in_1', label: 'in 1', type: 'Result' },
      { id: 'in_2', label: 'in 2', type: 'Result' },
      { id: 'in_3', label: 'in 3', type: 'Result' },
    ],
    defaultOutputs: [
      { id: 'result', label: 'merged result', type: 'Result' },
    ],
    defaultConfig: {
      mode: 'array',
    },
  },

  leaf_planner: {
    id: 'leaf_planner',
    craftLevel: 4,
    name: 'Planner 素体',
    enName: 'TASK PLANNER',
    category: 'core_engine',
    icon: 'Brain',
    colorHex: '#2979FF',
    borderColor: 'border-blue-500/40',
    glowClass: 'shadow-[0_0_20px_rgba(41,121,255,0.3)]',
    description: 'ゴール要求・文脈・フィードバックから依存関係付きタスクグラフ(Plan)とルールを策定',
    isContainer: false,
    defaultInputs: [
      { id: 'prompt', label: 'prompt', type: 'Context' },
      { id: 'context', label: 'context', type: 'Context' },
      { id: 'feedback', label: 'feedback', type: 'Feedback' },
    ],
    defaultOutputs: [
      { id: 'plan', label: 'plan', type: 'Plan' },
      { id: 'rules', label: 'rules', type: 'Control' },
    ],
    defaultConfig: {
      model: 'gpt-4o-mini',
      maxTasks: 3,
    },
  },

  leaf_router: {
    id: 'leaf_router',
    craftLevel: 4,
    name: 'Router 素体',
    enName: 'TASK ROUTER',
    category: 'core_engine',
    icon: 'Network',
    colorHex: '#00E5FF',
    borderColor: 'border-cyan-500/40',
    glowClass: 'shadow-[0_0_20px_rgba(0,229,255,0.3)]',
    description: 'Plan進捗・実行結果・フィードバックから次の一手を判定し担当ポートへ振り分け',
    isContainer: false,
    defaultInputs: [
      { id: 'plan', label: 'plan', type: 'Plan' },
      { id: 'result', label: 'result', type: 'Result' },
      { id: 'feedback', label: 'feedback', type: 'Feedback' },
    ],
    defaultOutputs: [
      { id: 'task_research', label: 'task (research)', type: 'Task' },
      { id: 'task_coding', label: 'task (coding)', type: 'Task' },
      { id: 'tool_call', label: 'tool call', type: 'ToolCall' },
      { id: 'replan_req', label: 're-plan', type: 'Feedback' },
      { id: 'final_result', label: 'final result', type: 'Result' },
    ],
    defaultConfig: {
      strategy: 'priority',
    },
  },

  // ──────────────────────────────────────────────
  // Phase 5: RAG & ナレッジ検索系リーフ (Retrieval)
  // ──────────────────────────────────────────────

  leaf_embedding_model: {
    id: 'leaf_embedding_model',
    craftLevel: 2,
    name: 'Embedding Model',
    enName: 'EMBEDDING MODEL',
    category: 'rag',
    icon: 'Cpu',
    colorHex: '#00E5FF',
    borderColor: 'border-cyan-500/40',
    glowClass: 'shadow-[0_0_20px_rgba(0,229,255,0.3)]',
    description: 'テキストから意味ベクトル(Embedding)を生成するアダプタ',
    isContainer: false,
    defaultInputs: [
      { id: 'text', label: 'text', type: 'Context' },
    ],
    defaultOutputs: [
      { id: 'embedding', label: 'vector', type: 'Context' },
    ],
    defaultConfig: {
      provider: 'local',
      model: 'nomic-embed-text',
    },
  },

  leaf_vector_retriever: {
    id: 'leaf_vector_retriever',
    craftLevel: 3,
    name: 'Vector DB Retriever',
    enName: 'VECTOR RETRIEVER',
    category: 'rag',
    icon: 'Database',
    colorHex: '#2979FF',
    borderColor: 'border-blue-500/40',
    glowClass: 'shadow-[0_0_20px_rgba(41,121,255,0.3)]',
    description: 'コサイン類似度による高速ローカルベクトル検索エンジン',
    isContainer: false,
    defaultInputs: [
      { id: 'query', label: 'query', type: 'Context' },
      { id: 'docs', label: 'documents', type: 'Context' },
    ],
    defaultOutputs: [
      { id: 'results', label: 'matches', type: 'Result' },
    ],
    defaultConfig: {
      topK: 3,
      minScore: 0.1,
    },
  },

  leaf_hybrid_search: {
    id: 'leaf_hybrid_search',
    craftLevel: 3,
    name: 'Hybrid Search',
    enName: 'HYBRID SEARCH',
    category: 'rag',
    icon: 'Search',
    colorHex: '#00E676',
    borderColor: 'border-emerald-500/40',
    glowClass: 'shadow-[0_0_20px_rgba(0,230,118,0.3)]',
    description: 'BM25キーワード一致 ＋ ベクトル類似度の統合高精度検索',
    isContainer: false,
    defaultInputs: [
      { id: 'query', label: 'query', type: 'Context' },
      { id: 'docs', label: 'documents', type: 'Context' },
    ],
    defaultOutputs: [
      { id: 'results', label: 'matches', type: 'Result' },
    ],
    defaultConfig: {
      alpha: 0.5,
      topK: 3,
    },
  },

  leaf_reranker: {
    id: 'leaf_reranker',
    craftLevel: 3,
    name: 'Reranker',
    enName: 'SEARCH RERANKER',
    category: 'rag',
    icon: 'Sliders',
    colorHex: '#D500F9',
    borderColor: 'border-purple-500/40',
    glowClass: 'shadow-[0_0_20px_rgba(213,0,249,0.3)]',
    description: '検索結果チャンクの関連度を再採点・濃縮し上位件数に選定',
    isContainer: false,
    defaultInputs: [
      { id: 'query', label: 'query', type: 'Context' },
      { id: 'results', label: 'raw results', type: 'Result' },
    ],
    defaultOutputs: [
      { id: 'reranked', label: 'top results', type: 'Result' },
    ],
    defaultConfig: {
      topN: 3,
      minScoreThreshold: 0.0,
    },
  },

  leaf_context_formatter: {
    id: 'leaf_context_formatter',
    craftLevel: 4,
    name: 'Context Formatter',
    enName: 'CONTEXT FORMATTER',
    category: 'rag',
    icon: 'FileText',
    colorHex: '#00E5FF',
    borderColor: 'border-cyan-500/40',
    glowClass: 'shadow-[0_0_20px_rgba(0,229,255,0.3)]',
    description: '検索チャンクを [出典: ○○] 形式のプロンプト用テキストに成形',
    isContainer: false,
    defaultInputs: [
      { id: 'results', label: 'results', type: 'Result' },
    ],
    defaultOutputs: [
      { id: 'context', label: 'formatted', type: 'Context' },
    ],
    defaultConfig: {
      header: '【参考ナレッジ・コンテキスト】',
      includeScore: true,
    },
  },

  leaf_context_truncator: {
    id: 'leaf_context_truncator',
    craftLevel: 4,
    name: 'Context Truncator',
    enName: 'CONTEXT TRUNCATOR',
    category: 'rag',
    icon: 'Scissors',
    colorHex: '#FF1744',
    borderColor: 'border-red-500/40',
    glowClass: 'shadow-[0_0_20px_rgba(255,23,68,0.3)]',
    description: 'トークン超過を防ぐための動的スライス・要約圧縮',
    isContainer: false,
    defaultInputs: [
      { id: 'context', label: 'text', type: 'Context' },
    ],
    defaultOutputs: [
      { id: 'truncated', label: 'safe text', type: 'Context' },
    ],
    defaultConfig: {
      maxCharacters: 2000,
      strategy: 'tail',
    },
  },

  // ──────────────────────────────────────────────
  // Phase 5: 外部ツール & サンドボックス系リーフ (Tooling & Sandbox)
  // ──────────────────────────────────────────────

  leaf_file_loader: {
    id: 'leaf_file_loader',
    craftLevel: 3,
    name: 'Local File Loader',
    enName: 'LOCAL FILE LOADER',
    category: 'tool_storage',
    icon: 'FolderOpen',
    colorHex: '#ECEFF1',
    borderColor: 'border-slate-400/40',
    glowClass: 'shadow-[0_0_20px_rgba(236,239,241,0.2)]',
    description: 'ローカルのファイルまたはディレクトリ配下のMD/JSONを一括読込してフローに供給',
    isContainer: false,
    defaultInputs: [
      { id: 'path', label: 'path (opt)', type: 'Context' },
    ],
    defaultOutputs: [
      { id: 'content', label: 'content', type: 'Context' },
      { id: 'data', label: 'json/chunks', type: 'Result' },
    ],
    defaultConfig: {
      filePath: 'docs/knowledge',
      autoChunk: true,
      chunkSize: 500,
    },
  },

  leaf_python_sandbox: {
    id: 'leaf_python_sandbox',
    craftLevel: 3,
    name: 'Python Sandbox',
    enName: 'PYTHON SANDBOX',
    category: 'tool_storage',
    icon: 'Terminal',
    colorHex: '#FFD600',
    borderColor: 'border-yellow-500/40',
    glowClass: 'shadow-[0_0_20px_rgba(255,214,0,0.3)]',
    description: 'Pythonスクリプトや分析コードを安全に実行しResultを出力',
    isContainer: false,
    defaultInputs: [
      { id: 'input_data', label: 'input', type: 'Result' },
      { id: 'code', label: 'code (opt)', type: 'Context' },
    ],
    defaultOutputs: [
      { id: 'result', label: 'stdout/data', type: 'Result' },
      { id: 'error', label: 'error', type: 'Control' },
    ],
    defaultConfig: {
      code: '# Python Code\nimport sys, json\n\nprint("Hello from Python Sandbox!")\n',
      timeoutMs: 15000,
    },
  },

  leaf_mcp_connector: {
    id: 'leaf_mcp_connector',
    craftLevel: 3,
    name: 'MCP Tool Connector',
    enName: 'MCP CONNECTOR',
    category: 'tool_storage',
    icon: 'Wrench',
    colorHex: '#FF9100',
    borderColor: 'border-orange-500/40',
    glowClass: 'shadow-[0_0_20px_rgba(255,145,0,0.3)]',
    description: 'Model Context Protocol (MCP) 準拠の外部ツール連携',
    isContainer: false,
    defaultInputs: [
      { id: 'tool_call', label: 'tool call', type: 'ToolCall' },
    ],
    defaultOutputs: [
      { id: 'result', label: 'tool res', type: 'Result' },
    ],
    defaultConfig: {
      serverName: 'builtin-tools',
      toolName: 'calculator',
    },
  },

  leaf_web_searcher: {
    id: 'leaf_web_searcher',
    craftLevel: 2,
    name: 'Web Searcher',
    enName: 'WEB SEARCHER',
    category: 'tool_storage',
    icon: 'Globe',
    colorHex: '#00E5FF',
    borderColor: 'border-cyan-500/40',
    glowClass: 'shadow-[0_0_20px_rgba(0,229,255,0.3)]',
    description: 'Web検索を実行し最新スニペットとURLリンクをContext化',
    isContainer: false,
    defaultInputs: [
      { id: 'query', label: 'query', type: 'Context' },
    ],
    defaultOutputs: [
      { id: 'results', label: 'web results', type: 'Result' },
      { id: 'context', label: 'summary text', type: 'Context' },
    ],
    defaultConfig: {
      provider: 'duckduckgo',
      maxResults: 3,
    },
  },

  // ──────────────────────────────────────────────
  // Phase 6: ガバナンス・安全・品質防御 (Guardrails)
  // ──────────────────────────────────────────────

  leaf_schema_guard: {
    id: 'leaf_schema_guard',
    craftLevel: 4,
    name: 'JSON Schema Guard',
    enName: 'SCHEMA GUARD',
    category: 'guardrail',
    icon: 'ShieldCheck',
    colorHex: '#00E676',
    borderColor: 'border-emerald-500/40',
    glowClass: 'shadow-[0_0_20px_rgba(0,230,118,0.3)]',
    description: '出力データ構造の検証と型キャスト・欠損値補完の自動修復',
    isContainer: false,
    defaultInputs: [
      { id: 'data', label: 'data', type: 'Result' },
    ],
    defaultOutputs: [
      { id: 'valid', label: 'valid', type: 'Result' },
      { id: 'invalid', label: 'invalid err', type: 'Control' },
    ],
    defaultConfig: {
      mode: 'auto_heal',
      properties: {
        status: { type: 'string', required: true, default: 'ok' },
        message: { type: 'string', required: false, default: '' },
      },
    },
  },

  leaf_pii_masker: {
    id: 'leaf_pii_masker',
    craftLevel: 4,
    name: 'PII Masker',
    enName: 'PII MASKER',
    category: 'guardrail',
    icon: 'EyeOff',
    colorHex: '#D500F9',
    borderColor: 'border-purple-500/40',
    glowClass: 'shadow-[0_0_20px_rgba(213,0,249,0.3)]',
    description: 'APIキー、秘密鍵、メール、電話番号を検知し安全に自動マスキング',
    isContainer: false,
    defaultInputs: [
      { id: 'input', label: 'raw text/json', type: 'Context' },
    ],
    defaultOutputs: [
      { id: 'masked', label: 'masked text', type: 'Context' },
      { id: 'stats', label: 'mask stats', type: 'Result' },
    ],
    defaultConfig: {
      maskApiKeys: true,
      maskEmails: true,
      maskPhones: true,
      maskCreditCards: true,
    },
  },

  leaf_safety_guard: {
    id: 'leaf_safety_guard',
    craftLevel: 4,
    name: 'Safety Guard',
    enName: 'SAFETY GUARD',
    category: 'guardrail',
    icon: 'Lock',
    colorHex: '#FF1744',
    borderColor: 'border-red-500/40',
    glowClass: 'shadow-[0_0_20px_rgba(255,23,68,0.3)]',
    description: 'プロンプトインジェクションや危険なOS破壊コマンドを事前検知・遮断',
    isContainer: false,
    defaultInputs: [
      { id: 'payload', label: 'inspect data', type: 'Context' },
    ],
    defaultOutputs: [
      { id: 'safe', label: 'safe content', type: 'Context' },
      { id: 'blocked', label: 'blocked err', type: 'Control' },
    ],
    defaultConfig: {
      sensitivity: 'balanced',
      blockPromptInjection: true,
      blockDangerousCommands: true,
    },
  },

  leaf_jev_decision: {
    id: 'leaf_jev_decision',
    craftLevel: 2,
    name: 'Jev Decision (System One)',
    enName: 'JEV SYSTEM ONE',
    category: 'model',
    icon: 'Target',
    colorHex: '#E551BA',
    borderColor: 'border-pink-500/40',
    glowClass: 'shadow-[0_0_20px_rgba(229,81,186,0.3)]',
    description: 'TypeSafe Jev で型付き質問(Choice/Score/Noul)を一括判定し確率とconfidenceを出力',
    isContainer: false,
    defaultInputs: [
      { id: 'state', label: 'state (text)', type: 'Context' },
      { id: 'state_data', label: 'state (data)', type: 'Result' },
    ],
    defaultOutputs: [
      { id: 'answers', label: 'answers', type: 'Result' },
      { id: 'confident', label: 'confident', type: 'Result' },
      { id: 'uncertain', label: 'uncertain', type: 'Result' },
      { id: 'summary', label: 'summary', type: 'Context' },
      { id: 'error', label: 'error', type: 'Control' },
    ],
    defaultConfig: {
      stackId: 'stack_typesafe_jev',
      model: 'jev-latest',
      gateQuestion: 'department',
      confidenceThreshold: 0.7,
      questions: {
        department: {
          type: 'choice',
          instructions: 'Which team should handle this request?',
          criteria: {
            billing: 'Payments, invoicing, refunds',
            technical: 'Bugs, outages, integrations',
            sales: 'Pricing, upgrades, new accounts',
          },
        },
        is_urgent: {
          type: 'noul',
          instructions: 'Does this convey urgency?',
          criteria: {
            true: 'Explicitly time-sensitive or critical',
            false: 'No urgency expressed',
          },
        },
        frustration: {
          type: 'score',
          instructions: 'How frustrated is the customer?',
          criteria: ['Calm', 'Frustrated', 'Very angry'],
        },
      },
    },
  },
};

