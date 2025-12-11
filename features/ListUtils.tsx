
import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ArrowDownAZ, ArrowUpAZ, Shuffle, XCircle, Copy, Info } from 'lucide-react';

export const ListUtils: React.FC = () => {
  const [input, setInput] = useState('');

  const process = (action: 'sortAsc' | 'sortDesc' | 'unique' | 'shuffle') => {
    if (!input.trim()) return;
    let lines = input.split('\n'); // Keep empty lines? Maybe filter them out
    
    switch (action) {
        case 'sortAsc':
            lines.sort((a, b) => a.localeCompare(b));
            break;
        case 'sortDesc':
            lines.sort((a, b) => b.localeCompare(a));
            break;
        case 'unique':
            lines = [...new Set(lines)];
            break;
        case 'shuffle':
            for (let i = lines.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [lines[i], lines[j]] = [lines[j], lines[i]];
            }
            break;
    }
    setInput(lines.join('\n'));
  };

  const lineCount = input.trim() ? input.split('\n').length : 0;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Card title="Операции со списком">
        
        {/* Info Block */}
        <div className="bg-violet-500/10 border border-violet-500/20 p-4 rounded-2xl mb-6 flex gap-3 backdrop-blur-md">
           <Info className="text-violet-300 shrink-0 mt-0.5" size={20} />
           <div className="text-sm text-violet-100">
             <p className="font-bold mb-1">Обработка данных</p>
             <p>Быстро отсортируйте список имен по алфавиту, удалите повторяющиеся email-адреса или перемешайте варианты ответов для викторины.</p>
           </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
             <Button onClick={() => process('sortAsc')} variant="secondary" className="text-xs">
                <ArrowDownAZ size={16} className="mr-2" /> А-Я
             </Button>
             <Button onClick={() => process('sortDesc')} variant="secondary" className="text-xs">
                <ArrowUpAZ size={16} className="mr-2" /> Я-А
             </Button>
             <Button onClick={() => process('unique')} variant="secondary" className="text-xs">
                <XCircle size={16} className="mr-2" /> Без дублей
             </Button>
             <Button onClick={() => process('shuffle')} variant="secondary" className="text-xs">
                <Shuffle size={16} className="mr-2" /> Перемешать
             </Button>
        </div>

        <div className="relative">
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-80 bg-black/20 border border-white/10 rounded-2xl p-4 text-slate-100 outline-none resize-none font-mono text-sm whitespace-pre"
                placeholder="Вставьте список (каждый элемент с новой строки)..."
            />
            <div className="absolute bottom-4 right-4 text-xs text-slate-500 bg-black/40 px-2 py-1 rounded-md backdrop-blur">
                Строк: {lineCount}
            </div>
             <button 
                onClick={() => navigator.clipboard.writeText(input)}
                className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg transition-colors backdrop-blur-md"
            >
                <Copy size={16} />
            </button>
        </div>
      </Card>
    </div>
  );
};