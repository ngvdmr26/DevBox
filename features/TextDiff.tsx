import React, { useState, useMemo } from 'react';
import { Card } from '../components/ui/Card';
import { Info, GitCompare, ArrowRightLeft } from 'lucide-react';

export const TextDiff: React.FC = () => {
  const [text1, setText1] = useState('Line 1\nLine 2\nLine 3');
  const [text2, setText2] = useState('Line 1\nLine 2 changed\nLine 3\nLine 4');

  // Simple line-by-line comparison (not a full Myers diff algo for simplicity, but good enough for visual check)
  const diff = useMemo(() => {
    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    const maxLines = Math.max(lines1.length, lines2.length);
    const result = [];

    for (let i = 0; i < maxLines; i++) {
        const l1 = lines1[i] || '';
        const l2 = lines2[i] || '';
        
        let type: 'same' | 'diff' = 'same';
        if (l1 !== l2) type = 'diff';
        
        // Very basic heuristic
        if (!lines1[i] && lines2[i]) type = 'diff'; 
        if (lines1[i] && !lines2[i]) type = 'diff';

        result.push({ l1, l2, type });
    }
    return result;
  }, [text1, text2]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card title="Сравнение текста (Diff)">
        
        {/* Info Block */}
        <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-2xl mb-6 flex gap-3 backdrop-blur-md">
           <Info className="text-indigo-300 shrink-0 mt-0.5" size={20} />
           <div className="text-sm text-indigo-100">
             <p className="font-bold mb-1">Поиск отличий</p>
             <p>Вставьте два фрагмента текста (например, старый и новый конфиг), чтобы увидеть, какие строки были изменены, добавлены или удалены.</p>
           </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
             <div className="space-y-2">
                 <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Оригинал</label>
                 <textarea 
                    value={text1}
                    onChange={(e) => setText1(e.target.value)}
                    className="w-full h-32 bg-black/20 border border-white/10 rounded-xl p-3 text-xs font-mono text-slate-300 outline-none resize-none focus:border-indigo-500"
                    placeholder="Текст 1"
                 />
             </div>
             <div className="space-y-2">
                 <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Измененный</label>
                 <textarea 
                    value={text2}
                    onChange={(e) => setText2(e.target.value)}
                    className="w-full h-32 bg-black/20 border border-white/10 rounded-xl p-3 text-xs font-mono text-slate-300 outline-none resize-none focus:border-indigo-500"
                    placeholder="Текст 2"
                 />
             </div>
        </div>

        <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
            <div className="flex bg-white/5 border-b border-white/5 p-2 text-xs font-bold text-slate-500 uppercase">
                <div className="w-10 text-center shrink-0">#</div>
                <div className="flex-1 px-2 border-r border-white/5">Оригинал</div>
                <div className="flex-1 px-2 pl-4">Измененный</div>
            </div>
            <div className="overflow-x-auto">
                <div className="min-w-[600px]">
                    {diff.map((row, i) => (
                        <div key={i} className={`flex text-xs md:text-sm font-mono border-b border-white/5 last:border-0 ${row.type === 'diff' ? 'bg-yellow-500/10' : ''}`}>
                            <div className="w-10 py-2 text-center text-slate-600 border-r border-white/5 shrink-0 select-none bg-black/20">
                                {i + 1}
                            </div>
                            <div className={`flex-1 py-2 px-3 border-r border-white/5 break-all ${row.type === 'diff' && row.l1 ? 'bg-red-500/10 text-red-200' : 'text-slate-300'}`}>
                                {row.l1}
                            </div>
                            <div className={`flex-1 py-2 px-3 break-all ${row.type === 'diff' && row.l2 ? 'bg-green-500/10 text-green-200' : 'text-slate-300'}`}>
                                {row.l2}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </Card>
    </div>
  );
};