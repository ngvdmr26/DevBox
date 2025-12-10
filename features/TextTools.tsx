import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Type, AlignLeft, ArrowDownAZ, CaseSensitive, Info } from 'lucide-react';

export const TextTools: React.FC = () => {
  const [text, setText] = useState('');

  const stats = {
    chars: text.length,
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    lines: text.trim() ? text.split(/\n/).length : 0,
  };

  const transform = (type: 'upper' | 'lower' | 'camel' | 'snake' | 'kebab') => {
    let res = '';
    switch (type) {
      case 'upper': res = text.toUpperCase(); break;
      case 'lower': res = text.toLowerCase(); break;
      case 'snake': 
        res = text.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
              ?.map(x => x.toLowerCase())
              .join('_') || text;
        break;
      case 'kebab':
        res = text.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
              ?.map(x => x.toLowerCase())
              .join('-') || text;
        break;
      case 'camel':
        res = text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
        break;
    }
    setText(res);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Card title="Текстовые утилиты">
        
        {/* Info Block */}
        <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-2xl mb-6 flex gap-3 backdrop-blur-md">
           <Info className="text-orange-300 shrink-0 mt-0.5" size={20} />
           <div className="text-sm text-orange-100">
             <p className="font-bold mb-1">Конвенции именования</p>
             <p>В коде важен регистр: <code>camelCase</code> используется в JS, <code>snake_case</code> в Python и базах данных, а <code>kebab-case</code> в CSS и URL. Этот инструмент быстро конвертирует текст между ними.</p>
           </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center backdrop-blur-md">
                <div className="text-2xl font-bold text-white">{stats.chars}</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Символов</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center backdrop-blur-md">
                <div className="text-2xl font-bold text-white">{stats.words}</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Слов</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center backdrop-blur-md">
                <div className="text-2xl font-bold text-white">{stats.lines}</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Строк</div>
            </div>
        </div>

        <div className="relative mb-6">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-48 bg-black/20 border border-white/10 rounded-2xl p-4 text-slate-100 focus:border-orange-500/50 outline-none resize-none placeholder-slate-500 backdrop-blur-sm transition-all"
              placeholder="Введите или вставьте текст..."
            />
            <div className="absolute top-4 right-4 text-slate-600">
                <AlignLeft size={20} />
            </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
             <Button onClick={() => transform('upper')} variant="secondary" className="text-xs">
                <ArrowDownAZ size={14} className="mr-2" /> UPPER
             </Button>
             <Button onClick={() => transform('lower')} variant="secondary" className="text-xs">
                <CaseSensitive size={14} className="mr-2" /> lower
             </Button>
             <Button onClick={() => transform('camel')} variant="secondary" className="text-xs">
                camelCase
             </Button>
             <Button onClick={() => transform('snake')} variant="secondary" className="text-xs">
                snake_case
             </Button>
             <Button onClick={() => transform('kebab')} variant="secondary" className="text-xs">
                kebab-case
             </Button>
             <Button onClick={() => setText('')} variant="danger" className="text-xs bg-red-500/20 text-red-300">
                Очистить
             </Button>
        </div>
      </Card>
    </div>
  );
};