import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Sparkles } from 'lucide-react';

export function ReferenceHeader({ currentTitle }: { currentTitle?: string }) {
  const editorUrl = process.env.NEXT_PUBLIC_EDITOR_URL;

  return (
    <header className="h-14 bg-[#090e1c]/90 backdrop-blur-md border-b border-[#1e2c45] px-4 md:px-8 flex items-center justify-between sticky top-0 z-40 select-none">
      <div className="flex items-center gap-4">
        {editorUrl && (
          <>
            <a
              href={editorUrl}
              className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors px-2 py-1 rounded bg-[#0d1527] border border-[#1e2c45] hover:border-cyan-500/50"
              title="エディタに戻る"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Editor</span>
            </a>

            <div className="h-4 w-px bg-[#1e2c45]" />
          </>
        )}

        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <span className="text-sm font-bold tracking-wide text-white font-mono group-hover:text-cyan-300 transition-colors">
              Leaf Reference
            </span>
            <span className="text-[10px] text-slate-400 font-mono ml-2 hidden sm:inline">
              Harness Block Encyclopedia
            </span>
          </div>
        </Link>

        {currentTitle && (
          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="text-slate-600">/</span>
            <span className="text-cyan-400">{currentTitle}</span>
          </div>
        )}
      </div>

      {editorUrl && (
        <div className="flex items-center gap-3">
          <a
            href={editorUrl}
            className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 transition-all shadow-[0_0_12px_rgba(0,229,255,0.15)]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>キャンバスを開く</span>
          </a>
        </div>
      )}
    </header>
  );
}
