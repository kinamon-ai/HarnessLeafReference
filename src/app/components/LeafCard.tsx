'use client';

import React from 'react';
import Link from 'next/link';
import { LeafDefinition } from '../../leaves/registry';
import { CATEGORIES, CRAFT_LEVELS, getUsages, leafImagePath } from '../../reference/catalog';
import { ArrowRight } from 'lucide-react';

export function LeafCard({ leaf }: { leaf: LeafDefinition }) {
  const cat = CATEGORIES[leaf.category];
  const craft = CRAFT_LEVELS[leaf.craftLevel];
  const usages = getUsages(leaf.id);
  const imgSrc = leafImagePath(leaf.id);

  return (
    <Link
      href={`/leaves/${leaf.id}`}
      className="group relative rounded-xl bg-[#0c1322]/90 hover:bg-[#0f172a] border border-[#1e2c45] p-4 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg hover:-translate-y-1"
      style={{
        // Dynamic hover border and glow matching the leaf's specific frame color
        ['--hover-color' as any]: leaf.colorHex,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${leaf.colorHex}99`;
        e.currentTarget.style.boxShadow = `0 0 25px ${leaf.colorHex}33`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#1e2c45';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      {/* Top Accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-1 transition-all group-hover:h-1.5"
        style={{
          backgroundColor: leaf.colorHex,
          boxShadow: `0 0 10px ${leaf.colorHex}`,
        }}
      />

      {/* Top row: Leaf Name (left) & Category tag (right) */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <h3 className="text-sm font-bold text-white transition-colors truncate">
            {leaf.name}
          </h3>

          {/* Subdued monochromatic category tag aligned to right */}
          <span className="text-[10px] font-mono font-medium tracking-wider uppercase px-2 py-0.5 rounded bg-[#10192d] border border-[#1f2f4e] text-slate-300 shrink-0">
            {cat.label}
          </span>
        </div>

        {/* Thumbnail Preview of Leaf Node */}
        <div
          className="relative w-full aspect-[4/3] rounded-lg bg-[#070b14] border border-[#182338] mb-2.5 overflow-hidden flex items-center justify-center p-2 transition-colors"
        >
          <img
            src={imgSrc}
            alt={leaf.name}
            className="w-full h-full object-contain filter group-hover:brightness-110 transition-all"
            onError={(e) => {
              // Fallback placeholder if not captured yet
              e.currentTarget.style.display = 'none';
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-35 transition-opacity"
            style={{
              background: `radial-gradient(circle at center, ${leaf.colorHex}45 0%, transparent 70%)`,
            }}
          />
        </div>

        {/* ID (left) and Craft Level LED (right) row */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <code className="text-[11px] font-mono text-slate-400 truncate" title={leaf.id}>
            {leaf.id}
          </code>

          {/* 4-level LED indicator */}
          <div
            className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#060a14] border border-white/10 shrink-0"
            title={`成熟度: Lv.${leaf.craftLevel} (${craft.label})`}
          >
            <span className="text-[9px] font-mono text-slate-400 font-semibold mr-0.5">
              Lv.{leaf.craftLevel}
            </span>
            {[1, 2, 3, 4].map((lvl) => (
              <span
                key={lvl}
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: lvl <= leaf.craftLevel ? craft.color : '#1e293b',
                  boxShadow: lvl <= leaf.craftLevel ? `0 0 6px ${craft.color}` : 'none',
                }}
              />
            ))}
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
          {leaf.description}
        </p>
      </div>

      {/* Footer Info: Sockets count & Usages */}
      <div className="pt-3 border-t border-[#182338] flex items-center justify-between text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <span title="入力 / 出力ポート数">
            {leaf.defaultInputs.length} in / {leaf.defaultOutputs.length} out
          </span>
          <span className="text-slate-600">•</span>
          <span className="font-semibold text-slate-300" title="使用例パレット数">
            {usages.length} パレット
          </span>
        </div>

        <span
          className="flex items-center gap-0.5 group-hover:translate-x-0.5 transition-all text-xs font-mono font-medium"
          style={{ color: leaf.colorHex }}
        >
          <span>詳細</span>
          <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </Link>
  );
}
