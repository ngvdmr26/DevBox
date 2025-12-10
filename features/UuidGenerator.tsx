import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { RefreshCw, Copy, Layers, Dna, Info } from 'lucide-react';

export const UuidGenerator: React.FC = () => {
  const [uuids, setUuids] = useState<string[]>([crypto.randomUUID()]);
  const [count, setCount] = useState(1);

  const generate = () => {
    const newUuids = Array.from({ length: count }, () => crypto.randomUUID());
    setUuids(newUuids);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(uuids.join('\n'));
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Card title="UUID Генератор (v4)">
        {/* Info Block */}
        <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl mb-6 flex gap-3 backdrop-blur-md">
           <Info className="text-rose-300 shrink-0" size={20} />
           <p className="text-sm text-rose-100">
             UUID — это стандарт идентификации. Он генерирует настолько уникальную случайную строку, что вероятность совпадения двух таких ID в мире практически равна нулю. Используется для ключей в базах данных.
           </p>
        </div>

        <div className="flex items-end gap-4 mb-6">
            <div className="flex-1 space-y-2">
                <label className="text-sm text-slate-400 ml-1">Количество</label>
                <input 
                    type="number" 
                    min="1" 
                    max="50" 
                    value={count}
                    onChange={(e) => setCount(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-pink-500"
                />
            </div>
            <Button onClick={generate} className="h-[50px] px-6">
                <RefreshCw size={20} className="mr-2" />
                Обновить
            </Button>
        </div>

        <div className="space-y-3">
            {uuids.map((uuid, i) => (
                <div key={i} className="relative group animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${i * 50}ms` }}>
                    <div className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 font-mono text-sm text-pink-100 transition-all flex items-center justify-between">
                        <span className="truncate mr-4">{uuid}</span>
                        <div className="flex items-center gap-2">
                           <Dna size={14} className="text-pink-500/50" />
                        </div>
                    </div>
                    <button 
                        onClick={() => navigator.clipboard.writeText(uuid)}
                        className="absolute right-2 top-2 bottom-2 px-3 bg-black/40 hover:bg-pink-600 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md flex items-center"
                    >
                        <Copy size={16} />
                    </button>
                </div>
            ))}
        </div>

        {uuids.length > 1 && (
            <div className="mt-6 pt-6 border-t border-white/10">
                <Button onClick={copyAll} variant="secondary" fullWidth>
                    <Layers size={18} className="mr-2" />
                    Копировать все
                </Button>
            </div>
        )}
      </Card>
    </div>
  );
};