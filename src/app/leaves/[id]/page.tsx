import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ALL_LEAVES,
  getLeaf,
  getUsages,
  getRelatedLeaves,
  CATEGORIES,
  CRAFT_LEVELS,
  leafImagePath,
} from '../../../reference/catalog';
import { getLeafDoc } from '../../../reference/leafDocs';
import { ReferenceHeader } from '../../components/ReferenceHeader';
import { SocketTable } from '../../components/SocketTable';
import { PaletteCarousel } from '../../components/PaletteCarousel';
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';

export async function generateStaticParams() {
  return ALL_LEAVES.map((l) => ({ id: l.id }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LeafDetailPage({ params }: PageProps) {
  const { id } = await params;
  const leaf = getLeaf(id);

  if (!leaf) {
    notFound();
  }

  const doc = getLeafDoc(id);
  const usages = getUsages(id);
  const related = getRelatedLeaves(id, 4);
  const cat = CATEGORIES[leaf.category];
  const craft = CRAFT_LEVELS[leaf.craftLevel];
  const imgSrc = leafImagePath(leaf.id);

  // Previous / Next navigation
  const currentIndex = ALL_LEAVES.findIndex((l) => l.id === id);
  const prevLeaf = currentIndex > 0 ? ALL_LEAVES[currentIndex - 1] : null;
  const nextLeaf = currentIndex < ALL_LEAVES.length - 1 ? ALL_LEAVES[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans">
      <ReferenceHeader currentTitle={leaf.name} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 md:px-8 py-8 space-y-10">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Link href="/" className="hover:text-cyan-300">
            Reference
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <span style={{ color: cat.colorHex }}>{cat.label}</span>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <span className="text-white font-semibold">{leaf.name}</span>
        </div>

        {/* Hero Card */}
        <div className="relative rounded-2xl bg-gradient-to-br from-[#0c152a] to-[#070b14] border border-[#1e2c45] p-6 md:p-8 overflow-hidden shadow-2xl">
          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20"
            style={{ backgroundColor: leaf.colorHex }}
          />

          <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-start justify-between">
            {/* Left: Info */}
            <div className="space-y-4 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                {/* Subdued monochromatic Category Badge */}
                <span className="text-xs font-mono font-medium tracking-wider uppercase px-2.5 py-0.5 rounded bg-[#10192d] border border-[#1f2f4e] text-slate-300">
                  {cat.label}
                </span>

                {/* Craft Level Badge */}
                <span
                  className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded border flex items-center gap-1.5"
                  style={{
                    color: craft.color,
                    borderColor: `${craft.color}40`,
                    backgroundColor: `${craft.color}15`,
                  }}
                  title={craft.label}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: craft.color }}
                  />
                  <span>Lv.{leaf.craftLevel} {craft.enName}</span>
                </span>
              </div>

              <div>
                <h1 className="text-2xl md:text-4xl font-extrabold text-white font-mono tracking-tight">
                  {leaf.name}
                </h1>
                <p className="text-xs font-mono text-cyan-400 tracking-wider mt-1">
                  ID: <code className="text-white">{leaf.id}</code> ({leaf.enName})
                </p>
              </div>

              <p className="text-base font-medium text-cyan-200/90 leading-snug">
                {doc.catchphrase}
              </p>

              <p className="text-sm text-slate-300 leading-relaxed">
                {doc.summary}
              </p>

              {/* Responsibilities */}
              <div className="pt-2 space-y-1.5">
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  責務 (Core Responsibilities)
                </h4>
                <ul className="space-y-1">
                  {doc.responsibilities.map((r, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-cyan-400 mt-0.5">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: Leaf Node Visual Preview */}
            <div className="w-full lg:w-auto shrink-0 flex flex-col items-center">
              <div className="relative w-full max-w-[340px] aspect-[4/3] rounded-xl bg-[#080d1a] border border-[#1e2c45] p-3 flex items-center justify-center overflow-hidden shadow-xl">
                <img
                  src={imgSrc}
                  alt={`${leaf.name} の外観`}
                  className="w-full h-full object-contain filter drop-shadow-md"
                />
                <div
                  className="absolute inset-0 pointer-events-none opacity-25"
                  style={{
                    background: `radial-gradient(circle at center, ${leaf.colorHex}50 0%, transparent 70%)`,
                  }}
                />
              </div>
              <span className="text-[10px] font-mono text-slate-500 mt-2">
                キャンバス上の実寸描画ノード
              </span>
            </div>
          </div>
        </div>

        {/* Section 1: Sockets & Protocol Contract */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 rounded bg-cyan-400" />
            <h2 className="text-lg font-bold font-mono text-white">
              ソケット契約 (Socket Specification)
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            配線可能なポートの仕様です。8色のペイロード型プロトコルによって、不正な型の接続が防止されます。
          </p>
          <SocketTable inputs={leaf.defaultInputs} outputs={leaf.defaultOutputs} />
        </section>

        {/* Section 2: Behavior & Internal Steps */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 rounded bg-cyan-400" />
            <h2 className="text-lg font-bold font-mono text-white">
              内部挙動と実行ステップ (Internal Execution Flow)
            </h2>
          </div>

          <div className="rounded-xl bg-[#0a1020] border border-[#1e2c45] p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {doc.behaviorSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="relative p-4 rounded-lg bg-[#0d1629] border border-[#182338] flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      STEP 0{idx + 1}
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {step}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Use Case Tips */}
            <div className="pt-3 border-t border-[#182338]">
              <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                設計の勘所 (Usage Tips)
              </h4>
              <ul className="space-y-1.5">
                {doc.useCaseTips.map((tip, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3: Default Configuration */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 rounded bg-cyan-400" />
            <h2 className="text-lg font-bold font-mono text-white">
              パラメータ設定 (Default Config)
            </h2>
          </div>

          <div className="rounded-xl bg-[#0a1020] border border-[#1e2c45] p-5 space-y-4">
            {leaf.defaultConfig && Object.keys(leaf.defaultConfig).length > 0 ? (
              <>
                <div className="rounded-lg bg-[#060a14] border border-[#182338] p-3 overflow-x-auto">
                  <pre className="text-xs font-mono text-cyan-300 leading-relaxed">
                    {JSON.stringify(leaf.defaultConfig, null, 2)}
                  </pre>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                    各パラメータの説明
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {Object.entries(doc.configDescriptions).map(([key, desc]) => (
                      <div
                        key={key}
                        className="p-2.5 rounded-lg bg-[#0d1629] border border-[#182338]"
                      >
                        <code className="text-xs font-mono text-white font-semibold">
                          {key}
                        </code>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-xs text-slate-500 italic py-2">
                追加の設定パラメータはありません（デフォルト状態で動作します）。
              </p>
            )}
          </div>
        </section>

        {/* Section 4: Palette Usage Examples (Screenshots) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 rounded bg-cyan-400" />
              <h2 className="text-lg font-bold font-mono text-white">
                使用例パレット (Usage Palettes & Screenshots)
              </h2>
            </div>
            <span className="text-xs font-mono text-cyan-400">
              {usages.length} 件の実動パレットで採用
            </span>
          </div>
          <p className="text-xs text-slate-400">
            実際に組み込まれたパレットのスクリーンショットです。フォーカス表示では本リーフ周辺がハイライトされます。
          </p>

          <PaletteCarousel leafId={leaf.id} usages={usages} />
        </section>

        {/* Section 5: Maturity Status */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 rounded bg-cyan-400" />
            <h2 className="text-lg font-bold font-mono text-white">
              成熟度管理 (Maturity & Roadmap)
            </h2>
          </div>

          <div className="rounded-xl bg-[#0a1020] border border-[#1e2c45] p-5 space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#0d1629] border border-[#1a2740]">
              <div className="flex items-center gap-3">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: craft.color }}
                />
                <div>
                  <div className="text-sm font-bold text-white font-mono">
                    Craft Level {leaf.craftLevel}: {craft.enName}
                  </div>
                  <div className="text-xs text-slate-400">
                    {craft.label}
                  </div>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-500">
                Docs Spec: v1.0
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-lg bg-[#0d1629] border border-[#182338]">
                <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider mb-1">
                  検証済み環境 (Proven Environment)
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {doc.maturity.provenEnv}
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-[#0d1629] border border-[#182338]">
                <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-1">
                  次の開発目標 (Next Milestone)
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {doc.maturity.nextMilestone}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Related Leaves */}
        {related.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 rounded bg-cyan-400" />
              <h2 className="text-lg font-bold font-mono text-white">
                関連リーフ (Frequently Paired Leaves)
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {related.map((rel) => {
                const relCat = CATEGORIES[rel.category];
                return (
                  <Link
                    key={rel.id}
                    href={`/leaves/${rel.id}`}
                    className="p-3.5 rounded-xl bg-[#0c1322] hover:bg-[#0f172a] border border-[#1e2c45] hover:border-cyan-500/50 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <span
                        className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border inline-block mb-2"
                        style={{
                          color: relCat.colorHex,
                          borderColor: `${relCat.colorHex}40`,
                        }}
                      >
                        {relCat.label}
                      </span>
                      <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {rel.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                        {rel.description}
                      </p>
                    </div>

                    <span className="text-[10px] font-mono text-cyan-400 mt-2 flex items-center gap-1">
                      <span>詳細を見る</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Prev / Next Pagination */}
        <div className="pt-6 border-t border-[#1e2c45] flex items-center justify-between">
          {prevLeaf ? (
            <Link
              href={`/leaves/${prevLeaf.id}`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0c1322] border border-[#1e2c45] hover:border-cyan-500/50 text-xs font-mono text-slate-300 hover:text-white transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
              <span>{prevLeaf.name}</span>
            </Link>
          ) : (
            <div />
          )}

          {nextLeaf ? (
            <Link
              href={`/leaves/${nextLeaf.id}`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0c1322] border border-[#1e2c45] hover:border-cyan-500/50 text-xs font-mono text-slate-300 hover:text-white transition-all"
            >
              <span>{nextLeaf.name}</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1e2c45] py-6 px-4 text-center text-xs text-slate-500 font-mono">
        Agent Harness Designer • {leaf.name} Reference Page
      </footer>
    </div>
  );
}
