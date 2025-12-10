import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Copy, ShieldCheck, Fingerprint, Info } from 'lucide-react';

type Algo = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512';

export const Hasher: React.FC = () => {
  const [input, setInput] = useState('');
  const [hash, setHash] = useState('');
  const [algo, setAlgo] = useState<Algo>('SHA-256');

  useEffect(() => {
    const generateHash = async () => {
      if (!input) {
        setHash('');
        return;
      }
      try {
        const msgBuffer = new TextEncoder().encode(input);
        const hashBuffer = await crypto.subtle.digest(algo, msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        setHash(hashHex);
      } catch (e) {
        console.error(e);
        setHash('Ошибка генерации хеша');
      }
    };

    generateHash();
  }, [input, algo]);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Card title="Крипто Хеш">
        {/* Info Block */}
        <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-2xl mb-6 flex gap-3 backdrop-blur-md">
           <Info className="text-indigo-300 shrink-0" size={20} />
           <p className="text-sm text-indigo-100">
             Хеширование превращает данные в уникальный "цифровой отпечаток". Даже малейшее изменение текста полностью меняет хеш. Это используется для проверки паролей и целостности файлов.
           </p>
        </div>

        <div className="space-y-6">
          
          <div className="flex flex-wrap gap-2 p-1.5 bg-black/20 rounded-xl backdrop-blur-sm">
            {(['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'] as Algo[]).map((t) => (
              <button
                key={t}
                onClick={() => setAlgo(t)}
                className={`flex-1 py-2 px-4 rounded-lg text-xs md:text-sm font-bold transition-all duration-300 ${
                  algo === t 
                  ? 'bg-white/20 text-white shadow-lg backdrop-blur-md border border-white/10' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-2">Входные данные</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-32 bg-black/20 border border-white/10 rounded-2xl p-4 text-slate-100 focus:border-indigo-500/50 outline-none resize-none font-mono text-sm placeholder-slate-500 backdrop-blur-sm transition-all"
              placeholder="Введите текст для хеширования..."
            />
          </div>

          <div className="space-y-2 relative group">
            <label className="text-sm font-medium text-slate-300 ml-2 flex items-center gap-2">
                <Fingerprint size={16} className="text-indigo-400" />
                Результат ({algo})
            </label>
            <div className="w-full bg-indigo-900/10 border border-indigo-500/20 rounded-2xl p-6 font-mono text-xs md:text-sm text-indigo-100 break-all backdrop-blur-sm min-h-[5rem] flex items-center">
               {hash || <span className="text-slate-500 italic">Ожидание ввода...</span>}
            </div>
            {hash && (
                <button 
                    onClick={() => navigator.clipboard.writeText(hash)}
                    className="absolute bottom-4 right-4 p-2 bg-indigo-500/20 hover:bg-indigo-500/40 rounded-lg text-indigo-300 transition-colors"
                >
                    <Copy size={16} />
                </button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};