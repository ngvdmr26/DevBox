import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Braces, Minimize2, Maximize2, Copy, Trash2, CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const JsonTools: React.FC = () => {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const formatJson = () => {
    setError(null);
    setSuccessMsg(null);
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed, null, 2));
      setSuccessMsg("JSON отформатирован и валиден");
    } catch (e: any) {
      setError("Невалидный JSON: " + e.message);
    }
  };

  const minifyJson = () => {
    setError(null);
    setSuccessMsg(null);
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed));
      setSuccessMsg("JSON сжат и валиден");
    } catch (e: any) {
      setError("Невалидный JSON: " + e.message);
    }
  };

  const clear = () => {
    setInput('');
    setError(null);
    setSuccessMsg(null);
  };

  const copy = () => {
    navigator.clipboard.writeText(input);
    setSuccessMsg("Скопировано в буфер");
    setTimeout(() => setSuccessMsg(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card title="JSON Редактор" className="min-h-[60vh]">
        
        {/* Info Block */}
        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl mb-6 flex gap-3 backdrop-blur-md">
           <Info className="text-blue-300 shrink-0 mt-0.5" size={20} />
           <div className="text-sm text-blue-100">
             <p className="font-bold mb-1">Что такое JSON?</p>
             <p>JSON (JavaScript Object Notation) — это основной формат обмена данными в вебе. Этот инструмент помогает найти ошибки в синтаксисе (например, лишнюю запятую) и сделать код читаемым ("Pretty Print").</p>
           </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-4">
          <Button onClick={formatJson} className="flex-1 bg-white/10 hover:bg-white/20">
            <Maximize2 size={18} className="mr-2" /> Красиво
          </Button>
          <Button onClick={minifyJson} className="flex-1 bg-white/10 hover:bg-white/20">
            <Minimize2 size={18} className="mr-2" /> Сжать
          </Button>
        </div>

        <div className="relative group">
          <textarea
            value={input}
            onChange={(e) => {
                setInput(e.target.value);
                setError(null);
                setSuccessMsg(null);
            }}
            className={`
                w-full h-96 bg-black/20 border rounded-2xl p-4 font-mono text-sm text-slate-200 
                focus:ring-2 focus:ring-blue-500/50 outline-none resize-none transition-all
                placeholder-white/20 backdrop-blur-sm
                ${error ? 'border-red-500/50' : 'border-white/10'}
            `}
            placeholder='Вставьте ваш JSON здесь: {"key": "value"}'
          />
          
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
                onClick={copy}
                className="p-2 bg-slate-800/80 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 backdrop-blur-md"
                title="Копировать"
            >
                <Copy size={16} />
            </button>
            <button 
                onClick={clear}
                className="p-2 bg-slate-800/80 rounded-lg text-red-400 hover:text-red-300 hover:bg-slate-700 backdrop-blur-md"
                title="Очистить"
            >
                <Trash2 size={16} />
            </button>
          </div>
        </div>

        {error && (
            <div className="mt-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-200 flex items-start gap-2 animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <span className="font-mono text-xs md:text-sm">{error}</span>
            </div>
        )}

        {successMsg && (
            <div className="mt-4 p-3 rounded-xl bg-green-500/20 border border-green-500/30 text-green-200 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                <CheckCircle2 size={18} />
                <span>{successMsg}</span>
            </div>
        )}
      </Card>
    </div>
  );
};