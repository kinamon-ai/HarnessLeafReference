'use client';

import React, { useState, useMemo } from 'react';
import { ALL_LEAVES, CATEGORIES, CATEGORY_ORDER } from '../reference/catalog';
import { ReferenceHeader } from './components/ReferenceHeader';
import { LeafCard } from './components/LeafCard';
import { Search, Sparkles } from 'lucide-react';

export default function ReferenceIndexPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  // Stats
  const totalLeaves = ALL_LEAVES.length;
  const lv4Count = ALL_LEAVES.filter((l) => l.craftLevel === 4).length;
  const lv3Count = ALL_LEAVES.filter((l) => l.craftLevel === 3).length;

  // Filtered leaves
  const filteredLeaves = useMemo(() => {
    return ALL_LEAVES.filter((leaf) => {
      // Category filter
      if (selectedCategory !== 'all' && leaf.category !== selectedCategory) {
        return false;
      }
      // Craft level filter
      if (selectedLevel !== 'all' && String(leaf.craftLevel) !== selectedLevel) {
        return false;
      }
      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = leaf.name.toLowerCase().includes(q);
        const matchesEn = leaf.enName.toLowerCase().includes(q);
        const matchesDesc = leaf.description.toLowerCase().includes(q);
        const matchesId = leaf.id.toLowerCase().includes(q);
        return matchesName || matchesEn || matchesDesc || matchesId;
      }
      return true;
    });
  }, [searchQuery, selectedCategory, selectedLevel]);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans">
      <ReferenceHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 space-y-8">
        {/* Hero Section */}
        <div className="relative rounded-2xl bg-gradient-to-br from-[#0c152a] via-[#091021] to-[#070b14] border border-[#1e2c45] p-6 md:p-10 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Harness Block Encyclopedia</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white font-mono">
              Leaf Components
              <span className="block text-xl md:text-2xl text-cyan-400 font-sans font-semibold mt-1">
                全 {totalLeaves} 素体リーフ・ビジュアルカタログ
              </span>
            </h1>

            <p className="text-sm md:text-base text-slate-300 leading-relaxed font-sans">
              エージェントハーネスを構築するすべての素体（Leaf）の役割、I/Oソケット契約、内部思考ループ、および実動パレットでの使用例を網羅した公式リファレンスです。
            </p>

            {/* Quick Metrics */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-[#090e1c]/80 border border-[#1a2740]">
                <div className="text-2xl font-mono font-bold text-white">{totalLeaves}</div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">登録リーフ総数</div>
              </div>
              <div className="p-3 rounded-xl bg-[#090e1c]/80 border border-emerald-500/30">
                <div className="text-2xl font-mono font-bold text-emerald-400">{lv4Count}</div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">Lv.4 本環境実績 (PROVEN)</div>
              </div>
              <div className="p-3 rounded-xl bg-[#090e1c]/80 border border-cyan-500/30">
                <div className="text-2xl font-mono font-bold text-cyan-400">{lv3Count}</div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">Lv.3 実装完了 (FUNCTIONAL)</div>
              </div>
              <div className="p-3 rounded-xl bg-[#090e1c]/80 border border-purple-500/30">
                <div className="text-2xl font-mono font-bold text-purple-400">100%</div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">パレット使用例完備</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="rounded-xl bg-[#0c1322] border border-[#1e2c45] p-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="リーフ名、英語名、ID、説明文で検索..."
                className="w-full bg-[#080d1a] border border-[#1e2c45] text-white text-sm rounded-lg pl-10 pr-4 py-2.5 outline-none focus:border-cyan-400 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  クリア
                </button>
              )}
            </div>

            {/* Maturity Level Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400 shrink-0">成熟度:</span>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="bg-[#080d1a] border border-[#1e2c45] text-slate-200 text-xs font-mono rounded-lg px-3 py-2.5 outline-none focus:border-cyan-400"
              >
                <option value="all">全レベル (All)</option>
                <option value="4">Lv.4 実績あり (PROVEN)</option>
                <option value="3">Lv.3 実リソース疎通 (FUNCTIONAL)</option>
                <option value="2">Lv.2 実装済み (IMPLEMENTED)</option>
                <option value="1">Lv.1 モック (DRAFT)</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all shrink-0 border ${
                selectedCategory === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_12px_rgba(0,229,255,0.2)]'
                  : 'bg-[#080d1a] text-slate-400 border-[#1a2740] hover:text-white hover:border-slate-600'
              }`}
            >
              すべて ({totalLeaves})
            </button>

            {CATEGORY_ORDER.map((catKey) => {
              const cat = CATEGORIES[catKey];
              const count = ALL_LEAVES.filter((l) => l.category === catKey).length;
              const isSelected = selectedCategory === catKey;

              return (
                <button
                  key={catKey}
                  onClick={() => setSelectedCategory(catKey)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all shrink-0 border flex items-center gap-1.5 ${
                    isSelected
                      ? 'border-opacity-100 shadow-md'
                      : 'bg-[#080d1a] text-slate-400 border-[#1a2740] hover:text-white'
                  }`}
                  style={{
                    backgroundColor: isSelected ? `${cat.colorHex}25` : undefined,
                    color: isSelected ? cat.colorHex : undefined,
                    borderColor: isSelected ? `${cat.colorHex}80` : undefined,
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: cat.colorHex }}
                  />
                  <span>{cat.label}</span>
                  <span className="text-[10px] opacity-70">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-mono text-slate-400">
              該当リーフ: <span className="text-cyan-400 font-bold">{filteredLeaves.length}</span> 件
            </h2>
          </div>

          {filteredLeaves.length === 0 ? (
            <div className="rounded-xl bg-[#0c1322] border border-[#1e2c45] p-12 text-center text-slate-400">
              <p>条件に一致するリーフが見つかりませんでした。</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedLevel('all');
                }}
                className="mt-3 px-4 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-mono hover:bg-cyan-500/30"
              >
                フィルターをリセット
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredLeaves.map((leaf) => (
                <LeafCard key={leaf.id} leaf={leaf} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1e2c45] py-6 px-4 text-center text-xs text-slate-500 font-mono">
        Agent Harness Designer • {totalLeaves} Leaf Encyclopedia Reference
      </footer>
    </div>
  );
}
