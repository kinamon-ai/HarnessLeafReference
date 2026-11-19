import React from 'react';
import { SocketDefinition } from '../../types/socket';
import { payloadMeta } from '../../reference/catalog';

export function SocketTable({
  inputs,
  outputs,
}: {
  inputs: SocketDefinition[];
  outputs: SocketDefinition[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Inputs */}
      <div className="rounded-xl bg-[#0a1020] border border-[#1e2c45] p-4 flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-[#182338] mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00E5FF]" />
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Input Sockets ({inputs.length})
            </h4>
          </div>
          <span className="text-[10px] font-mono text-slate-500">受信ポート</span>
        </div>

        {inputs.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-2">入力ポートなし (自律開始ノード)</p>
        ) : (
          <div className="space-y-2.5">
            {inputs.map((s) => {
              const meta = payloadMeta(s.type);
              return (
                <div
                  key={s.id}
                  className="p-2.5 rounded-lg bg-[#0d1629] border border-[#1a2740] flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono font-semibold text-white">
                        {s.id}
                      </code>
                      {s.label && s.label !== s.id && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          ({s.label})
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                      {meta.description}
                    </p>
                  </div>

                  <span
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase shrink-0 border"
                    style={{
                      color: meta.colorHex,
                      borderColor: `${meta.colorHex}40`,
                      backgroundColor: `${meta.colorHex}15`,
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: meta.colorHex }}
                    />
                    {s.type}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Outputs */}
      <div className="rounded-xl bg-[#0a1020] border border-[#1e2c45] p-4 flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-[#182338] mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#00E676]" />
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Output Sockets ({outputs.length})
            </h4>
          </div>
          <span className="text-[10px] font-mono text-slate-500">出力ポート</span>
        </div>

        {outputs.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-2">出力ポートなし (最終終端ノード)</p>
        ) : (
          <div className="space-y-2.5">
            {outputs.map((s) => {
              const meta = payloadMeta(s.type);
              return (
                <div
                  key={s.id}
                  className="p-2.5 rounded-lg bg-[#0d1629] border border-[#1a2740] flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono font-semibold text-white">
                        {s.id}
                      </code>
                      {s.label && s.label !== s.id && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          ({s.label})
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                      {meta.description}
                    </p>
                  </div>

                  <span
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase shrink-0 border"
                    style={{
                      color: meta.colorHex,
                      borderColor: `${meta.colorHex}40`,
                      backgroundColor: `${meta.colorHex}15`,
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: meta.colorHex }}
                    />
                    {s.type}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
