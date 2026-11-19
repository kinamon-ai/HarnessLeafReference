/**
 * Leaf Detailed Documentation & Maturity Data
 * Derived from docs/reference/leaf_components.md & docs/leaf_maturity_management.md
 */

export interface LeafDocDetail {
  id: string;
  catchphrase: string;
  summary: string;
  responsibilities: string[];
  behaviorSteps: string[];
  useCaseTips: string[];
  configDescriptions: Record<string, string>;
  maturity: {
    level: 1 | 2 | 3 | 4;
    provenEnv: string;
    nextMilestone: string;
  };
}

export const LEAF_DOCS: Record<string, LeafDocDetail> = {
  leaf_planner: {
    id: 'leaf_planner',
    catchphrase: 'ゴールから逆算して実行計画（Plan）を策定する戦略司令塔',
    summary: 'タスクの依存関係と実行順序を整理したDAG（有向非巡回グラフ）形式の計画を策定。初期策定と破綻時のリプランを担当。',
    responsibilities: [
      'ユーザー要求やゴールプロンプトの因数分解',
      '依存関係グラフ（DAG）および完了条件の定義',
      'Evaluatorからのリプラン要請（Feedback）を受けた戦略再構築',
    ],
    behaviorSteps: [
      '入力プロンプトとナレッジを解析し、サブゴールへ分解',
      'タスク間の前提条件（依存関係）をトポロジカルソート可能な形式で構造化',
      'Planソケットへ確定グラフを出力し、下流のRouterへハンドオフ',
    ],
    useCaseTips: [
      '複雑な長文指示や多段階の外部調査が必要なシナリオの先頭に配置',
      'Router・Evaluatorと組み合わせることで自己修復ループ（Orchestrator-Workers）を構築可能',
    ],
    configDescriptions: {
      model: '推論に使用するLLMモデル名（デフォルト: gpt-4o-mini、Tech Stack連携で上書き可）',
      maxTasks: '分解生成する最大タスク数（1〜8、デフォルト: 3）',
      systemPrompt: 'プランナーへの追加指針・計画立案方針を指定するカスタムシステム指示（任意）',
    },
    maturity: {
      level: 4,
      provenEnv: 'Routing / Orchestrator-Workers / 001 WebSearcher で正常動作確認済み',
      nextMilestone: '動的サブタスク追加および動的依存解消ロジックの強化',
    },
  },

  leaf_router: {
    id: 'leaf_router',
    catchphrase: '計画グラフを読み解き、ワーカーへタスクを動的ディスパッチする進行係',
    summary: 'Plan内のタスク依存状態や実行結果・フィードバックを監視し、各専門ワーカー（task_research / task_coding等）へのTask発火、リプラン要求（replan_req）、または最終統合出力（final_result）へ振り分けます。',
    responsibilities: [
      'Plan内タスクの進行状況確認と各専門ポートへのTask割り当て',
      'task_research / task_coding 等の専門ワーカーや tool_call へのディスパッチ',
      'Evaluatorのフィードバック判定に応じた再実行指示または replan_req 出力',
      '完了済み Result 受信時の final_result 出力',
    ],
    behaviorSteps: [
      'Planを受信し、分解されたタスクを task_research / task_coding 等（互換エイリアス task_a / task_b 含む）へTaskとして発行',
      'Feedbackを受信した際、action: replan なら replan_req へ、修正指示なら全体ゴールを保持した再実行Taskをワーカーへ再配分',
      '下流からのResult（status: success）を受信したら成果物を final_result として出力',
    ],
    useCaseTips: [
      '並行して複数ワーカーを動かしたい大規模オーケストレーション（Routing / Orchestrator-Workers）の中心として使用',
      '差し戻し発生時は全体ゴールを保持したまま修正指示のみを再配分する安全なループ制御が可能',
    ],
    configDescriptions: {
      strategy: 'タスク配分戦略（priority: 優先度順, dependency_first: 依存関係充足順、デフォルト: priority）',
    },
    maturity: {
      level: 4,
      provenEnv: 'Routing / Orchestrator-Workers / 001 WebSearcher で実稼働実証済み',
      nextMilestone: 'ワーカー負荷に応じた動的キューイングとタイムアウト制御',
    },
  },

  leaf_worker: {
    id: 'leaf_worker',
    catchphrase: '自律思考とツール呼出（ReAct）ループを実行する専門作業ユニット',
    summary: 'Model Harnessの思考力と外部ツール呼び出しを組み合わせ、割り当てられた個別タスクの解決と成果物生成を担当します。',
    responsibilities: [
      '個別タスク指示に対するReAct推論ループまたは1パス推論の自律実行',
      '必要に応じた外部ツールリクエスト（tool_call）の生成と待機',
      'ツール実行結果（tool_result）を反映した最終成果物（result）の作成',
    ],
    behaviorSteps: [
      'TaskとContextを受け取り、ツール実行結果の有無や実行モードに応じてプロンプトを構築',
      'tool_result 到達時はツール出力とタスク指示を統合して最終回答を生成',
      'AIモデル推論完了時に構造化メタデータ付きの成果物を result ポートへ出力',
    ],
    useCaseTips: [
      '調査・執筆・分析・顧客応答など、あらゆる実作業ノードのコアとして多用',
      'Evaluatorからのfeedback入力やSafety/RAG前段と組み合わせることで自己改善・根拠付きパイプラインを実現',
    ],
    configDescriptions: {
      mode: '実行モード（react: ツール呼出ループ, direct: 1パス即時推論、デフォルト: react）',
      model: '使用するLLMモデル名（デフォルト: gpt-4o-mini、Tech Stack連携で上書き可）',
      temperature: '推論のランダム性（0.0〜1.0、通常推論デフォルト: 0.7 / ツール結果統合時: 0.5）',
      systemPrompt: 'ワーカーの専門性・ペルソナ・出力フォーマットを指定するシステム指示',
    },
    maturity: {
      level: 4,
      provenEnv: 'Chaining / Parallelization / Evaluator-Optimizer / Routing / Orchestrator-Workers / 001〜005 / Jev 連携全プリセットで主軸稼働',
      nextMilestone: '複数ツール連続呼び出し時のコンテキスト圧縮最適化',
    },
  },

  leaf_evaluator: {
    id: 'leaf_evaluator',
    catchphrase: '成果物が達成基準を満たしているかを客観審査する品質検査官',
    summary: 'LLM Judgeとして成果物を基準と照らし合わせて0.0〜1.0でスコアリング。合格ならapproved、不合格なら修正指示（feedback）を出力します。',
    responsibilities: [
      '達成基準（criteria / judgePrompt）に対する客観的ルーブリック採点',
      '不合格時の具体的理由・改善案（suggestions）・再要求対象（targetRetry）の生成',
      '品質担保ゲートとしての合格品（approved）のみの通過制御',
    ],
    behaviorSteps: [
      'resultと判定基準（criteria入力またはjudgePrompt/systemPrompt）を受け取り、採点プロンプトを構築',
      'スコアが閾値（threshold）以上かつverdictがpassなら approved と合格 feedback（action: continue）を出力',
      '閾値未満なら verdict: needs_revision と修正要求（action: retry）を feedback へ出力',
    ],
    useCaseTips: [
      'WorkerとRetry Counterを組み合わせて自己改善ループ（Evaluator-Optimizer）を構築',
      '009 Jev Score のように Jev の確信度ゲート通過後の最終監査ゲートとしても活用可能',
    ],
    configDescriptions: {
      threshold: '合格判定の最小品質スコア（0.0〜1.0、デフォルト: 0.75）',
      strictMode: '厳格モード（基準未達を厳密に判定、デフォルト: false）',
      judgePrompt: '審査基準・判定指針のプロンプト（criteriaポート未接続時の基準として使用）',
      systemPrompt: '評価規範・ペルソナのカスタムシステム指示（Inspector上でjudgePromptと同期）',
    },
    maturity: {
      level: 4,
      provenEnv: 'Evaluator-Optimizer / 001 WebSearcher / 002 Builtin MCP Test / 009 Jev Score で検証済み',
      nextMilestone: '複数評価軸（正確性・網羅性・安全性）の重み付け評価のサポート',
    },
  },

  leaf_prompt_template: {
    id: 'leaf_prompt_template',
    catchphrase: '変数バインドで再現性の高い完成プロンプトを成形するテンプレート',
    summary: '{{context}} や {{task}} などのマスタッシュ変数を上流データで動的置換し、LLMに最適化されたプロンプトを構築します。',
    responsibilities: [
      'マスタッシュ構文（{{variable}}）の安全な展開',
      '文脈・指示・制約事項の構造化統合',
    ],
    behaviorSteps: [
      '入力ポート（context, task等）のペイロードを抽出',
      'テンプレート文字列内の変数を対応データで置換',
      '成形後の完成文字列をpromptポートへ出力',
    ],
    useCaseTips: [
      'ユーザー入力をいきなりLLMに渡さず、前後に指示枠や出力スキーマ指定を固定付与する際に必須',
    ],
    configDescriptions: {
      template: '置換元テンプレート文字列（{{variable}} 記法対応）',
    },
    maturity: {
      level: 4,
      provenEnv: 'Chaining プリセットおよび Phase 7 E2E で完全動作実証済み',
      nextMilestone: '条件分岐テンプレート（{{#if}}構文）のネイティブサポート',
    },
  },

  leaf_json_extractor: {
    id: 'leaf_json_extractor',
    catchphrase: 'LLMの回答からMarkdownフェンスを除去し純粋なJSONを救出するパーサー',
    summary: '前後におしゃべり文や ```json フェンス、末尾カンマが含まれていても、正規表現・自動修復・フォールバック解析で純粋なJSONオブジェクトを確実に抽出します。',
    responsibilities: [
      'Markdownコードブロックの剥離除去と最外周JSONの抽出',
      '末尾カンマ・コメントの簡易修復およびパース処理',
      'パース成功時のstructured出力と失敗時のerror制御シグナル送出',
    ],
    behaviorSteps: [
      'result入力（テキストまたはdata.synthesis等）から ```json フェンスや最外周の { ... } / [ ... ] を探索',
      'JSON.parse および末尾カンマ・コメント除去による修復パースを実行',
      '成功時は structured へ、失敗時は structured (status: error) と error ポートへ出力',
    ],
    useCaseTips: [
      'ワーカー直後に配置し、後続のSchema Guardやプログラム処理ノードへのデータ受け渡しを安全化',
    ],
    configDescriptions: {},
    maturity: {
      level: 4,
      provenEnv: 'Chaining / 005 Code Analyst で完全動作実証済み',
      nextMilestone: '不完全なJSONに対する自動キー補正・修復エンジンの拡充',
    },
  },

  leaf_fork_broadcast: {
    id: 'leaf_fork_broadcast',
    catchphrase: '単一入力を複数ブランチへ複製して同時並列発火する分岐器',
    summary: '受け取ったペイロードを複製し、接続されているすべての出力ポート（out_1〜out_3）へ同時に送出して並列処理を開始します。',
    responsibilities: [
      '単一トリガーからの複数並列処理の同時キック',
      '出力ブランチ（out_1〜out_3）への一括並列ディスパッチ',
    ],
    behaviorSteps: [
      'inputポートでデータを受信',
      '各ブランチ（out_1, out_2, out_3）用の出力ペイロードを構築',
      '全ブランチへ同時にメッセージエミット',
    ],
    useCaseTips: [
      '1つの質問に対して複数の異なる視点を持つWorkerを同時並行で走らせるParallelizationパターンの起点に配置',
    ],
    configDescriptions: {
      mode: '分配モード（broadcast: 全ブランチへ同一複製, shard: 分散モード、デフォルト: broadcast）',
      branchCount: '有効なブランチ出力数（デフォルト: 3）',
    },
    maturity: {
      level: 4,
      provenEnv: 'Parallelization プリセットおよび Phase 7 E2E で完全動作実証済み',
      nextMilestone: '動的ポート追加（4分岐以上）のUI同期対応',
    },
  },

  leaf_join_aggregator: {
    id: 'leaf_join_aggregator',
    catchphrase: '並列処理の非同期完了を待ち合わせ、全結果を統合データにマージする集約器',
    summary: '複数の入力ポート（in_1〜in_3）から非同期に返ってくるResultの到着を監視し、全員揃った段階で配列（items）と結合テキスト（formattedText）を含む統合成果物として下流へ受け渡します。',
    responsibilities: [
      '複数入力ポートの同期バリア（非同期待ち合わせ）',
      '配列（items）および整形テキスト（formattedText）への統合マージ',
    ],
    behaviorSteps: [
      '各inポート（in_1〜in_3）からのデータ到着を待ち合わせて収集',
      '収集した各ブランチのデータから配列 items と結合テキスト formattedText を構築',
      'resultポートへ { summary, items, formattedText, totalBranches, aggregatedAt } を出力',
    ],
    useCaseTips: [
      'Fork Broadcastとペアで使い、調査結果のマージや複数回答・検索結果の統合に使用',
    ],
    configDescriptions: {
      mode: '集約モード（array: 全成果物をリスト配列化, concat_text: テキスト結合サマリー, voting: 合意形成、デフォルト: array）',
    },
    maturity: {
      level: 4,
      provenEnv: 'Parallelization / Orchestrator-Workers / 003 RAG Q&A で完全動作実証済み',
      nextMilestone: 'タイムアウト発生時の部分成功（Partial Success）ポリシーの追加',
    },
  },

  leaf_condition_switch: {
    id: 'leaf_condition_switch',
    catchphrase: 'ステータスやJSONパス評価による確定的IF/ELSE分岐スイッチ',
    summary: '上流データ（またはLLM回答内の埋め込みJSON）の指定パス（statusなど）を演算子で評価し、true_branch / false_branch の2系統へ排他的に振り分けます。',
    responsibilities: [
      'JSONパス評価（equals, not_equals, greater_than, less_than, contains, is_truthy）による判定',
      'LLM出力テキスト内の埋め込みJSON自動抽出とペイロード補完',
      '条件合致ブランチへの排他的エミット',
    ],
    behaviorSteps: [
      'eval dataを受信し、埋め込みJSONまたはデータ本体から指定pathの値を抽出',
      'operator（equals / not_equals / greater_than / less_than / contains / is_truthy）とvalueで真偽を判定',
      '合致時は true_branch、不合致時は false_branch のみへ出力',
    ],
    useCaseTips: [
      '004 Safety Gateway でのエスカレーション判定、成功/失敗の後続処理分岐に最適',
    ],
    configDescriptions: {
      path: '検査対象のプロパティパス（例: status, data.score、デフォルト: status）',
      operator: '比較演算子（equals, not_equals, greater_than, less_than, contains, is_truthy）',
      value: '期待される比較値（is_truthy 以外で使用、デフォルト: success）',
    },
    maturity: {
      level: 4,
      provenEnv: '004 Safety Gateway および Phase 7 E2E で実証',
      nextMilestone: '3分岐以上のマルチステートSwitch-Caseサポート',
    },
  },

  leaf_rule_filter: {
    id: 'leaf_rule_filter',
    catchphrase: '正規表現・キーワードでAI推論を即決バイパスする決定論的フィルタ',
    summary: '「こんにちは」「営業時間」などの定型質問を正規表現で検知し、重いLLM推論を呼ばずに定型回答（cannedResponse）またはパススルーで matched ポートへ短絡バイパスします。',
    responsibilities: [
      '正規表現・キーワードによる即時マッチング判定',
      'canned_response によるコスト0・ミリ秒の即答バイパス',
      '不要なLLM推論コスト・レイテンシの削減',
    ],
    behaviorSteps: [
      '入力文字列に対してpattern正規表現（大文字小文字無視）で検査',
      'マッチ時は action に応じて cannedResponse 定型文または入力そのものを matched（Bypass）へ即時出力',
      'マッチしない場合のみ unmatched（AI）へ通して通常のAI推論ワーカーへ流す',
    ],
    useCaseTips: [
      'カスタマーサポートAIのフロントに置き、定型挨拶や営業時間案内を低コストに即答させる構成に便利',
    ],
    configDescriptions: {
      pattern: '検査正規表現パターン（例: hello|こんにちは|ヘルプ|help）',
      action: 'マッチ時の動作（canned_response: 定型文で即答, pass_through: 入力をそのままmatchedへ転送）',
      cannedResponse: 'action が canned_response の場合に返却する定型応答メッセージ',
    },
    maturity: {
      level: 3,
      provenEnv: '004 Safety Gateway で定型質問のAIバイパス即答を実証済み',
      nextMilestone: '動的外部辞書ファイル（CSV/JSON）からのパターン自動ロード',
    },
  },

  leaf_retry_counter: {
    id: 'leaf_retry_counter',
    catchphrase: 'フィードバック回数を監視し、無限ループを物理的に遮断する安全装置',
    summary: '不合格ループが延々と回るのを防ぐため、試行回数をカウントして上限に達した場合は非常停止（abort）シグナルを発火します。',
    responsibilities: [
      'ループ回数の安全なインクリメント管理',
      '規定回数超過時の強制遮断シグナル送出',
    ],
    behaviorSteps: [
      'feedbackを受信するたびにカウンタを1加算',
      'maxRetries以内であればretryポートへそのまま通過',
      '上限を超過した瞬間にretryを止め、abortポートへControlシグナルを送出して停止',
    ],
    useCaseTips: [
      'EvaluatorのfeedbackからWorkerへの戻り配線の中間に必ず挟むことで無限課金を防止',
    ],
    configDescriptions: {
      maxRetries: '最大許容再試行回数（デフォルト: 3）',
    },
    maturity: {
      level: 4,
      provenEnv: 'Evaluator-Optimizer プリセットおよび Phase 7 E2E で無限ループ遮断に完全成功',
      nextMilestone: '指数バックオフ（リトライ間隔の徐変ディレイ）機能の追加',
    },
  },

  leaf_kvs_store: {
    id: 'leaf_kvs_store',
    catchphrase: 'セッション間やノード間で中間データ・キャッシュを保持するメモリ',
    summary: 'インメモリおよびLocalStorageと同期するKey-Valueストア。指定した namespace と key に対してデータの書き込み・読み出しを担当します。',
    responsibilities: [
      'キーに基づくデータの書き込み・読み出し',
      'パイプラインを跨ぐ状態管理と成果物アーカイブ',
    ],
    behaviorSteps: [
      'writeポートにデータが届いたら指定された namespace と key でストレージに保存',
      '保存データ（未書き込み時は既存データ）を読み出して value（Context）ポートへ出力',
    ],
    useCaseTips: [
      '最終成果物の保存先、または前段処理で取得したメタデータ・データセットの共有メモリとして使用',
    ],
    configDescriptions: {
      key: '保存・参照対象のキー名（デフォルト: session_key）',
      namespace: 'ストレージのネームスペース（スコープ分離用、デフォルト: global）',
    },
    maturity: {
      level: 3,
      provenEnv: '001 WebSearcher / 002 Builtin MCP Test でインメモリ・LocalStorage保持を実証',
      nextMilestone: 'IndexedDBバックエンドによるブラウザリロード耐性の強化',
    },
  },

  leaf_embedding_model: {
    id: 'leaf_embedding_model',
    catchphrase: 'テキスト文字列を高次元ベクトル配列へ変換するEmbeddingアダプタ',
    summary: '自然言語テキストを受け取り、コサイン類似度計算が可能な高次元ベクトル（float配列）を生成します。',
    responsibilities: [
      'テキストのトークナイズとEmbeddingベクトルの生成',
      '検索パイプラインへのクエリベクトルの供給',
    ],
    behaviorSteps: [
      'textポートで自然言語文字列を受信',
      'Embedding APIまたはローカルモデルを呼び出してベクトル化',
      'embedding（Context）ポートへベクトルメタデータ付きで出力',
    ],
    useCaseTips: [
      'RAGパイプラインで質問テキストをベクトル化し、Vector Retrieverの入力に接続',
    ],
    configDescriptions: {
      provider: 'プロバイダ（local, openai, ollama等）',
      model: '埋め込みモデル名（例: text-embedding-3-small, nomic-embed-text）',
    },
    maturity: {
      level: 2,
      provenEnv: '高次元ベクトル生成コード完備、003 RAG Q&A プリセットに統合',
      nextMilestone: 'サーバーサイドEmbedding APIとの完全自動バインディング',
    },
  },

  leaf_vector_retriever: {
    id: 'leaf_vector_retriever',
    catchphrase: 'コサイン類似度で関連文書チャンクを高速抽出するベクトル検索機',
    summary: 'クエリベクトルと文書リストの類似度を計算し、類似度スコアの高いトップK件のチャンクを抽出します。',
    responsibilities: [
      '高速なコサイン類似度の計算',
      'Top-K件のフィルタリングと類似度スコア付与',
    ],
    behaviorSteps: [
      'query（ベクトルまたはクエリ文）とdocs（対象文書群）を受信',
      '各チャンクとのコサイン類似度を算出',
      'minScore以上のものをスコア降順で並べ、上位topK件をresultsへ出力',
    ],
    useCaseTips: [
      'ファイルローダーから読み込んだ社内文書から、質問に意味的に近い箇所を探し出す用途に最適',
    ],
    configDescriptions: {
      topK: '取得する最大チャンク数（デフォルト: 3）',
      minScore: '類似度の足切り閾値（デフォルト: 0.1）',
    },
    maturity: {
      level: 3,
      provenEnv: 'Phase 5 テストで類似度・Top-K正常動作確認済み、003 RAGフローに統合',
      nextMilestone: '大規模コレクションに対するANNインデックス（HNSW）の導入',
    },
  },

  leaf_hybrid_search: {
    id: 'leaf_hybrid_search',
    catchphrase: 'BM25キーワード一致とベクトル類似度を加重平均で統合するハイブリッド検索',
    summary: 'キーワードの完全一致（型番や固有名詞に強い）と意味ベクトルの近さ（文脈に強い）の双方を重み付け統合し、精度の高い検索結果を出します。',
    responsibilities: [
      'BM25スコアとベクトル類似度スコアの同時算出',
      'アルファ値（alpha）に基づくスコアの加重平均統合',
    ],
    behaviorSteps: [
      'クエリと文書群を受信',
      '単語一致度（疎ベクトル）と意味類似度（密ベクトル）を並行計算',
      '加重平均スコアでソートし、上位結果をresultsへ出力',
    ],
    useCaseTips: [
      '商品コードや専門用語など完全一致が重要なドキュメント検索において、通常のベクトル検索単体より劇的に高いヒット率を実現',
    ],
    configDescriptions: {
      alpha: '密ベクトル（意味検索）の重み付け割合（0.0〜1.0）',
      topK: '取得件数',
    },
    maturity: {
      level: 3,
      provenEnv: 'Phase 5 テストでBM25＋ベクトル加重平均（スコア0.789）成功、003 RAGに統合',
      nextMilestone: '日本語形態素解析（形態素トークナイザー）の精度向上',
    },
  },

  leaf_reranker: {
    id: 'leaf_reranker',
    catchphrase: '検索結果候補をクエリとの深い意味的関連度順に再スコアリングするリランカー',
    summary: '1次検索で荒く集めた候補チャンク群を、クエリとの高精度な関連度モデルで再度精密に採点・並び替えて最重要チャンクを選定します。',
    responsibilities: [
      '検索候補チャンク群の精密な関連度再計算',
      '上位N件への濃縮選定',
    ],
    behaviorSteps: [
      'queryと粗い検索結果（raw results）を受信',
      '各チャンクとクエリのペアに対して高精度関連度を推論',
      'スコア順にソートし、上位topN件のみをrerankedへ出力',
    ],
    useCaseTips: [
      'Vector RetrieverやHybrid Searchの直後に挟むことで、コンテキストウィンドウに入れる文書の質を最大化',
    ],
    configDescriptions: {
      topN: '再ランク後に残す最終件数（デフォルト: 3）',
      minScoreThreshold: '採用する最低関連度スコア',
    },
    maturity: {
      level: 3,
      provenEnv: 'Phase 5 テストで再計算・並び替え（スコア0.696）成功、003 RAGに統合',
      nextMilestone: 'Cohere / bge-reranker API との外部連携サポート',
    },
  },

  leaf_context_formatter: {
    id: 'leaf_context_formatter',
    catchphrase: '検索チャンクを出典付きMarkdown/XMLプロンプト用テキストに成形するフォーマッター',
    summary: '取得された複数のドキュメントチャンクを、[出典: ○○] などの引用メタデータ付きの見やすい整形テキストに変換します。',
    responsibilities: [
      '複数チャンクのヘッダー・出典メタデータ付き結合',
      'LLMが引用・参照しやすいMarkdown/XML形式への変換',
    ],
    behaviorSteps: [
      'results配列を受信',
      '各チャンクの本文、出典、スコアをテンプレートに従ってレイアウト',
      '完成した参照ブロックをcontextポートへ出力',
    ],
    useCaseTips: [
      '検索結果を直接Workerのcontextに流す直前に配置し、ハルシネーションを防ぐ正確な根拠提示を支援',
    ],
    configDescriptions: {
      header: 'ナレッジブロックの先頭見出し文字列',
      includeScore: '類似度スコアをテキスト内に併記するかどうか',
    },
    maturity: {
      level: 4,
      provenEnv: 'Phase 5 テストで完全動作確認済み、003 RAG に統合',
      nextMilestone: '表形式（Markdown Table）やJSON形式など出力バリエーションの追加',
    },
  },

  leaf_context_truncator: {
    id: 'leaf_context_truncator',
    catchphrase: 'トークン超過を防ぐため長文テキストを安全にトリム・圧縮するトランケーター',
    summary: 'コンテキストが肥大化してLLMの最大トークン長を超過しないよう、指定文字数・トークン数上限に収まるように安全にスライスします。',
    responsibilities: [
      '長文テキストの安全な長さ制限',
      '先頭残し・末尾残しなどトリム戦略の制御',
    ],
    behaviorSteps: [
      'textコンテキストを受信',
      'maxCharactersを超える場合に指定strategy（tail/head/middle）に従って切断',
      'トリム後の安全な文字列をtruncatedポートへ出力',
    ],
    useCaseTips: [
      '巨大なドキュメントや大量の検索結果をLLMに渡す手前に置き、Context Length Exceededエラーを物理的に遮断',
    ],
    configDescriptions: {
      maxCharacters: '許容する最大文字数（デフォルト: 2000）',
      strategy: 'トリム戦略（tail: 先頭優先・末尾カット, head: 末尾優先・先頭カット, middle: 両端保持・中間省略）',
    },
    maturity: {
      level: 4,
      provenEnv: '003 RAG Q&A および Phase 5 テストでトークン制限トリム完全動作確認済み',
      nextMilestone: 'tiktoken準拠の正確なBPEトークンカウント対応',
    },
  },

  leaf_file_loader: {
    id: 'leaf_file_loader',
    catchphrase: 'ローカルのMarkdown/JSONファイルまたはディレクトリを一括読込して供給するローダー',
    summary: 'プロジェクト内の仕様書、ナレッジファイル、またはディレクトリ（docs/knowledge等）を再帰的に読み込み、全文テキストまたは段落ごとに自動分割されたチャンク配列として供給します。',
    responsibilities: [
      '安全なファイルシステム読み出し（単一ファイルおよびディレクトリ一括）',
      '見出し・段落に基づく自動チャンク分割（autoChunk）',
    ],
    behaviorSteps: [
      '指定されたfilePathの存在と安全性をチェック（ディレクトリの場合は配下のMD/テキストを再帰収集）',
      'テキスト全文を読み込みcontentポートへ出力',
      'autoChunk有効時はchunkSizeごとに分割した配列をdataポートへ出力',
    ],
    useCaseTips: [
      'RAGパイプラインのドキュメント供給元（docs/knowledgeの一括読込等）、またはデータ分析パイプラインのソースデータ入力として使用',
    ],
    configDescriptions: {
      filePath: '対象ファイルまたはディレクトリパス（例: docs/knowledge または docs/concept/PROJECT_CONCEPT.md）',
      autoChunk: '見出しや段落で自動分割するかどうか',
      chunkSize: '目標チャンク文字数（デフォルト: 500）',
    },
    maturity: {
      level: 3,
      provenEnv: '単体読み出し疎通確認済み、003 RAG / 005 Code Analyst に統合',
      nextMilestone: 'PDF / CSV / Docx などのマルチフォーマット対応パーサー',
    },
  },

  leaf_python_sandbox: {
    id: 'leaf_python_sandbox',
    catchphrase: 'Pythonスクリプトや集計コードを安全に実行しResultを出力するサンドボックス',
    summary: 'LLMが苦手な数値計算や統計処理、データ抽出を決定論的（1円・1文字の狂いもなく）に実行できる隔離実行環境です。',
    responsibilities: [
      'Pythonプロセスの安全なスポーンと標準入出力（stdin/stdout）連携',
      'タイムアウトによる無限ループ・高負荷プロセスの安全強制終了',
      '構造化JSONデータの直接出力',
    ],
    behaviorSteps: [
      'input_dataをJSON文字列化してPythonのstdinに流し込み',
      'codeで定義されたスクリプトを実行',
      'stdoutをパースしてresultポートへ出力、異常終了時はerrorポートへ分岐',
    ],
    useCaseTips: [
      '売上集計、テキスト文字数・トークン統計、正規化処理など確実性が求められる分析ノードに最適',
    ],
    configDescriptions: {
      code: '実行するPythonスクリプトコード',
      timeoutMs: '最大許容実行時間ミリ秒（デフォルト: 15000）',
    },
    maturity: {
      level: 3,
      provenEnv: 'ホストPython 3実行、JSONパイプライン疎通確認済み、005 Code Analyst に統合',
      nextMilestone: 'numpy / pandas 等のデータ分析ライブラリプリセット連携',
    },
  },

  leaf_mcp_connector: {
    id: 'leaf_mcp_connector',
    catchphrase: 'Model Context Protocol (MCP) 準拠の外部ツール・APIと通信するコネクタ',
    summary: '内蔵ツール（datetime, calculator等）や外部MCPサーバーと通信し、LLMに決定論的なツール実行能力を提供します。',
    responsibilities: [
      'MCPプロトコル準拠のJSON-RPCリクエスト送受信',
      'ツール呼び出し引数のバリデーションと実行結果のResult化',
    ],
    behaviorSteps: [
      'tool_callポートで{ serverName, toolName, arguments }を受信',
      '該当MCPサーバーへリクエストをディスパッチして関数を実行',
      '返却データをresultポートへ出力',
    ],
    useCaseTips: [
      '002 Builtin MCP Test のように、正確な現在時刻の取得や1円単位の厳密計算をWorkerに供給する際に使用',
    ],
    configDescriptions: {
      serverName: '接続先MCPサーバー識別子（例: builtin-tools）',
      toolName: '呼び出すツール関数名（例: datetime, calculator）',
    },
    maturity: {
      level: 3,
      provenEnv: '内蔵MCPツール (datetime, calculator) 疎通、002 MCP Testフローで実証',
      nextMilestone: '外部SSE/Stdio MCPサーバーとの動的ディスカバリ連携',
    },
  },

  leaf_web_searcher: {
    id: 'leaf_web_searcher',
    catchphrase: 'Web検索を実行し最新スニペットとURLリンクをContext化する検索ノード',
    summary: '外部検索API（Tavily / DuckDuckGo）を呼び出し、最新のウェブ情報や参考URLを構造化してパイプラインへ供給します。',
    responsibilities: [
      '検索クエリに対する最新Web情報の収集',
      '構造化された検索結果（title, url, snippet）の出力',
      'オフライン時やエラー時の安全なフォールバック',
    ],
    behaviorSteps: [
      'queryポートで検索キーワードを受信',
      '検索プロバイダを呼び出して最新スニペットを取得',
      '構造化配列をresultsへ、整形要約テキストをcontextへ出力',
    ],
    useCaseTips: [
      '001 WebSearcher のように、最新ニュースの収集や社外競合の自動リサーチエージェントに不可欠',
    ],
    configDescriptions: {
      provider: '検索プロバイダ（duckduckgo, tavily）',
      maxResults: '取得する最大検索件数（デフォルト: 3）',
    },
    maturity: {
      level: 2,
      provenEnv: 'DuckDuckGo / Tavily 呼び出し実装済み、001 WebSearcher サンプルに統合',
      nextMilestone: 'Workerからのtool_call動的発火との完全双方向ハンドシェイク',
    },
  },

  leaf_schema_guard: {
    id: 'leaf_schema_guard',
    catchphrase: '出力データ構造の検証と型キャスト・欠損値補完を行う自動修復ガード',
    summary: 'LLMが出力したJSONが必要なプロパティを持っているかを検証し、欠損プロパティがあればデフォルト値で自動補完（Auto-Heal）して安全に出力します。',
    responsibilities: [
      'スキーマ仕様に基づくプロパティ存在・型チェック',
      '型キャストおよび欠損値の自動補完（auto_heal）',
      '修復不能な不正データに対するinvalidシグナル送出',
    ],
    behaviorSteps: [
      'dataポートでオブジェクトを受信',
      'properties定義に従って各フィールドを検証',
      '補完修復を完了した健全なオブジェクトをvalidポートへ出力',
    ],
    useCaseTips: [
      'パイプラインの最終出力直前に配置し、後続システムやフロントエンドが要求する型契約を100%保証',
    ],
    configDescriptions: {
      mode: 'ガードモード（auto_heal: 自動修復, strict: 不正時即エラー）',
      properties: '要求するプロパティ仕様定義',
    },
    maturity: {
      level: 4,
      provenEnv: '001 WebSearcher / 005 Code Analyst および Phase 6 テストで型キャスト・補完・フェンス除去の自動修復に成功',
      nextMilestone: 'Zodスキーマからの動的バリデーションビルダーとの連携',
    },
  },

  leaf_pii_masker: {
    id: 'leaf_pii_masker',
    catchphrase: 'APIキー・クレカ・メール・電話番号を検知し安全に自動マスキングする防御壁',
    summary: '外部LLMやログに個人情報・秘密情報が流出するのを防ぐため、正規表現スキャンで検知された機密文字列を伏字化します。',
    responsibilities: [
      '機密情報（APIキー, メール, 電話, クレジットカード）の高精度検知',
      '安全な置換文字列（[REDACTED_EMAIL] 等）への自動マスキング',
      'マスキング統計（検出件数内訳）の出力',
    ],
    behaviorSteps: [
      'テキストまたはJSONを受信',
      '有効化された各機密情報パターンでスキャン',
      '伏字化したテキストをmaskedへ、検知統計をstatsへ出力',
    ],
    useCaseTips: [
      'ユーザーからの生入力を外部クラウドLLMに送信する直前のゲートウェイとして配置',
    ],
    configDescriptions: {
      maskApiKeys: 'APIキー・シークレットトークンのマスキング',
      maskEmails: 'メールアドレスのマスキング',
      maskPhones: '電話番号のマスキング',
      maskCreditCards: 'クレジットカード番号のマスキング',
    },
    maturity: {
      level: 4,
      provenEnv: '004 Safety Gateway および Phase 6 テストでメール・電話・クレカ・トークン検知マスキング成功',
      nextMilestone: '可逆暗号化トークナイズ（マスキング解除）オプションの追加',
    },
  },

  leaf_safety_guard: {
    id: 'leaf_safety_guard',
    catchphrase: 'プロンプトインジェクションや危険なOS破壊コマンドを事前検知・遮断するセキュリティゲート',
    summary: '悪意あるシステムプロンプト上書き攻撃（「以前の指示を無視して...」等）や、破壊的シェルコマンドをパターンマッチングで検知し即時遮断します。',
    responsibilities: [
      '日英プロンプトインジェクションパターンの検知',
      '危険なOSコマンド（rm -rf, DROP TABLE 等）の検知',
      '攻撃検知時の処理中断とControlエラー送出',
    ],
    behaviorSteps: [
      'inspect dataを受信',
      '既知の攻撃シグネチャおよびカスタムブロックパターンと照合',
      '安全ならsafeポートへ通過、検知時はblockedポートへ緊急シグナルを出力',
    ],
    useCaseTips: [
      '004 Safety Gateway のように外部公開サービスの入力直後に最前線の防壁として配置',
    ],
    configDescriptions: {
      sensitivity: '感度レベル（strict: 厳格, balanced: 標準, permissive: 寛容、デフォルト: balanced）',
      blockPromptInjection: 'プロンプトインジェクション検知を有効化（デフォルト: true）',
      blockDangerousCommands: '危険コマンド検知を有効化（デフォルト: true）',
      customBlockedPatterns: '追加で遮断するカスタムNGワード正規表現（任意）',
    },
    maturity: {
      level: 4,
      provenEnv: '004 Safety Gateway および Phase 6 テストで日英インジェクション・危険コマンドの完全遮断に成功',
      nextMilestone: 'リアルタイムブラックリストの動的更新UI連携',
    },
  },

  leaf_jev_decision: {
    id: 'leaf_jev_decision',
    catchphrase: '型付き質問と確率・確信度（Confidence）で即座に確定的判断を下す System One リーフ',
    summary: 'TypeSafe の判定特化モデル Jev を呼び出し、入力データ（state）に対して定義した型付き質問群（Choice / Score / Noul）を並列評価。テキスト生成やパースの手間なく、確定値・確率分布・確信度スコアを出力し確信度ゲート分岐を行います。',
    responsibilities: [
      'ユーザー入力や構造化データ（state / state_data）に対する型付き質問の並列一括評価',
      'Choice（多肢選択＋確率分布）、Score（段階評価＋平均スコア）、Noul（連続真偽確率）の算出',
      '確信度ゲート（gateQuestion / confidenceThreshold）による confident / uncertain の振り分け',
      '全質問回答（answers）および人間・後続LLM向け要約テキスト（summary）の生成',
    ],
    behaviorSteps: [
      'state / state_data と定義済みの questions マップを受信して質問スキーマを検証',
      'TypeSafe /api/jev プロキシ経由で Jev モデルへ送信し、Choice / Score / Noul を並列評価',
      'gateQuestion の確信度が閾値以上なら confident、未満なら uncertain へ分岐し、answers と summary を出力',
    ],
    useCaseTips: [
      '008 Jev Choice / 009 Jev Score / 010 Jev Noul のように単一質問型に特化した分類・重大度採点・離脱確率推論として活用',
      '011 問い合わせトリアージ（triage_jev）のように Choice・Noul・Score を1リクエストで同時判定する複合ゲートに最適',
      '確信度が高い場合は自動応答ワーカーへ、低い（uncertain）場合は有人レビューや再審査キューへ流す Confidence-Gated Routing を構築可能',
    ],
    configDescriptions: {
      stackId: '技術スタックラックに登録された TypeSafe Jev プロファイルID（デフォルト: stack_typesafe_jev）',
      model: '利用する Jev モデル（jev-latest, jev-preview, jev-1.13.0 等、デフォルト: jev-latest）',
      gateQuestion: '確信度ゲートの判定対象とする質問ID（デフォルト: department）',
      confidenceThreshold: '確信度ゲートの閾値（0.0〜1.0、デフォルト: 0.7）',
      questions: '判定させたい型付き質問マップ（Choice / Score / Noul の混在定義が可能）',
    },
    maturity: {
      level: 2,
      provenEnv: 'jev_choice (008) / jev_score (009) / jev_noul (010) / triage_jev (011) の4プリセットで採用・動作確認済み',
      nextMilestone: 'Jev 複数モデルの並列A/B比較および動的プロンプト注入',
    },
  },
};

export function getLeafDoc(leafId: string): LeafDocDetail {
  return LEAF_DOCS[leafId] ?? {
    id: leafId,
    catchphrase: '自律ハーネスの構成コンポーネント',
    summary: 'エージェントパイプラインを構成するリーフノードです。',
    responsibilities: ['データの変換および入出力制御'],
    behaviorSteps: ['入力ポートからデータを受信し、処理後に結果を出力ポートへ送出'],
    useCaseTips: ['パイプラインの適切な位置に配置して使用'],
    configDescriptions: {},
    maturity: {
      level: 3,
      provenEnv: '稼働中',
      nextMilestone: '機能拡張',
    },
  };
}
