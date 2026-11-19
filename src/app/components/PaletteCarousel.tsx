'use client';

import React, { useState } from 'react';
import { LeafUsage, paletteImagePath, paletteFocusImagePath } from '../../reference/catalog';
import { ExternalLink, ZoomIn, Eye, Sparkles } from 'lucide-react';

export function PaletteCarousel({
  leafId,
  usages,
}: {
  leafId: string;
  usages: LeafUsage[];
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'overview' | 'focus'>('focus');
  const editorUrl = process.env.NEXT_PUBLIC_EDITOR_URL;

  if (usages.length === 0) {
    return (
      <div className="rounded-xl bg-[#0a1020] border border-[#1e2c45] p-6 text-center text-slate-500">
        使用例パレットは現在作成中です。
      </div>
    );
  }

  const currentUsage = usages[selectedIndex] || usages[0];
  const overviewImg = paletteImagePath(currentUsage.presetId, currentUsage.levelId);
  const focusImg = paletteFocusImagePath(currentUsage.presetId, leafId);
  const activeImg = viewMode === 'focus' ? focusImg : overviewImg;

  return (
    <div className="rounded-xl bg-[#0a1020] border border-[#1e2c45] overflow-hidden flex flex-col">
      {/* Sub-header with Tabs and Controls */}
      <div className="p-3 bg-[#0d1527] border-b border-[#182338] flex flex-wrap items-center justify-between gap-3">
        {/* Presets Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full">
          {usages.map((u, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={`${u.presetId}-${u.levelId}`}
                onClick={() => setSelectedIndex(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all shrink-0 border ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_12px_rgba(0,229,255,0.2)]'
                    : 'bg-[#090f1d] text-slate-400 border-[#1a2740] hover:text-white hover:border-slate-600'
                }`}
              >
                {u.presetName.split(' ')[0]} ({idx + 1}/{usages.length})
              </button>
            );
          })}
        </div>

        {/* View mode toggle & Open in Editor */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg bg-[#090f1d] p-0.5 border border-[#1a2740]">
            <button
              onClick={() => setViewMode('focus')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                viewMode === 'focus'
                  ? 'bg-cyan-500/20 text-cyan-300'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="このリーフをハイライト表示"
            >
              <Eye className="w-3 h-3" />
              <span>フォーカス</span>
            </button>
            <button
              onClick={() => setViewMode('overview')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                viewMode === 'overview'
                  ? 'bg-cyan-500/20 text-cyan-300'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="パレット全体図を表示"
            >
              <ZoomIn className="w-3 h-3" />
              <span>全体図</span>
            </button>
          </div>

          {editorUrl && (
            <a
              href={`${editorUrl.replace(/\/$/, '')}/?preset=${currentUsage.presetId}`}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono transition-colors"
              title="エディタにこのパレットを読み込んで動かす"
            >
              <Sparkles className="w-3 h-3" />
              <span>エディタで開く</span>
              <ExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
            </a>
          )}
        </div>
      </div>

      {/* Screenshot Frame */}
      <div className="relative w-full aspect-[16/9] bg-[#070b14] border-b border-[#182338] overflow-hidden group">
        <img
          src={activeImg}
          alt={`${currentUsage.presetName} での ${leafId} 使用例`}
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.01]"
          onError={(e) => {
            // Fallback to overview or placeholder if focus image is not generated yet
            const target = e.currentTarget;
            if (viewMode === 'focus') {
              target.src = overviewImg;
            }
          }}
        />

        <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-[#070b14]/85 backdrop-blur-md border border-white/10 text-[11px] font-mono text-slate-300">
          <span className="text-cyan-400 font-semibold">{currentUsage.presetName}</span>
          {currentUsage.levelId !== 'root' && (
            <span className="text-slate-500 ml-1.5">[{currentUsage.levelId}]</span>
          )}
        </div>
      </div>

      {/* Description & Configured Role in this Palette */}
      <div className="p-4 bg-[#0a1020] space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-white">
            {currentUsage.presetName}
          </h4>
          <span className="text-xs font-mono text-cyan-400/80">
            {currentUsage.presetEnName}
          </span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          {currentUsage.description}
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono text-slate-500">
            このパレットでの役割名:
          </span>
          {currentUsage.nodeNames.map((name, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded bg-[#0d1629] border border-cyan-500/30 text-cyan-300 text-xs font-mono"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
