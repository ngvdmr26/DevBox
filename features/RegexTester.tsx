import React, { useState, useMemo } from 'react';
import { Card } from '../components/ui/Card';
import { ScanSearch, Info } from 'lucide-react';

export const RegexTester: React.FC = () => {
  const [text, setText] = useState('Hello 123, test 456 example.');
  const [pattern, setPattern] = useState('[0-9]+');
  const [flags, setFlags] = useState('g');

  const matches = useMemo(() => {
    if (!pattern) return [];
    try {
      const regex = new RegExp(pattern, flags);
      return [...text.matchAll(regex)].map(m => m[0]);
    } catch (e) {
      return [];
    }
  }, [text, pattern, flags]);

  const isValidRegex = useMemo(() => {
    try {
        new RegExp(pattern, flags);
        return true;
    } catch {
        return false;
    }
  }, [pattern, flags]);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Card title="Regex Тестер">
        
        {/* Info Block */}
        <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-2xl mb-6 flex gap-3 backdrop-blur-md">
           <Info className="text-yellow-300 shrink-0" size={20} />
           <p className="text-sm text-yellow-100">
             Регулярные выражения (Regex) — это язык для "умного" поиска. Вместо конкретного слова вы задаете шаблон (например, <code>[0-9]+</code> ищет любые числа, а <code>^A</code> — строки начинающиеся на А).
           </p>
        </div>

        <div className="space-y-4 mb-6">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <span className="absolute left-3 top-3 text-slate-500 font-mono">/</span>
                    <input 
                        type="text" 
                        value={pattern}
                        onChange={(e) => setPattern(e.target.value)}
                        className={`w-full bg-black/30 border rounded-xl py-3 px-6 text-white outline-none font-mono ${isValidRegex ? 'border-white/10 focus:border-yellow-500' : 'border-red-500/50'}`}
                        placeholder="Паттерн..."
                    />
                    <span className="absolute right-3 top-3 text-slate-500 font-mono">/</span>
                </div>
                <input 
                     type="text" 
                     value={flags}
                     onChange={(e) => setFlags(e.target.value)}
                     className="w-20 bg-black/30 border border-white/10 rounded-xl py-3 px-3 text-yellow-500 outline-none font-mono text-center"
                     placeholder="flags"
                />
            </div>

            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-32 bg-black/20 border border-white/10 rounded-2xl p-4 text-slate-300 focus:border-yellow-500/50 outline-none resize-none font-mono text-sm placeholder-slate-600 backdrop-blur-sm"
                placeholder="Текст для проверки..."
            />
        </div>

        <div>
            <div className="flex items-center gap-2 mb-4 text-sm font-medium text-slate-300">
                <ScanSearch size={18} className="text-yellow-500" />
                <span>Совпадения ({matches.length})</span>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {matches.length > 0 ? matches.map((match, idx) => (
                    <div key={idx} className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-yellow-100 font-mono text-sm flex items-center gap-3 animate-in fade-in slide-in-from-left-2">
                        <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center text-xs text-yellow-500 font-bold shrink-0">
                            {idx + 1}
                        </div>
                        <span className="break-all">{match}</span>
                    </div>
                )) : (
                    <div className="text-slate-500 text-sm italic text-center py-8 border border-dashed border-white/10 rounded-xl">
                        Нет совпадений
                    </div>
                )}
            </div>
        </div>

      </Card>
    </div>
  );
};