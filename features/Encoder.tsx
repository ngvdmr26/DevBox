import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Copy, Trash2, ArrowRightLeft, Info } from 'lucide-react';
import { EncodingType } from '../types';

export const Encoder: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [type, setType] = useState<EncodingType>('base64');
  const [error, setError] = useState<string | null>(null);

  // Radix specific state
  const [fromBase, setFromBase] = useState<number>(10);
  const [toBase, setToBase] = useState<number>(2);

  useEffect(() => {
    setError(null);
    if (!input) {
      setOutput('');
      return;
    }

    try {
      let result = '';

      if (type === 'radix') {
        const val = input.trim();
        // Validation for standard bases
        let isValid = false;
        if (fromBase === 2) isValid = /^[01]+$/.test(val);
        else if (fromBase === 8) isValid = /^[0-7]+$/.test(val);
        else if (fromBase === 10) isValid = /^[0-9]+$/.test(val);
        else if (fromBase === 16) isValid = /^[0-9a-fA-F]+$/.test(val);
        
        if (!isValid) throw new Error(`Недопустимые символы для системы счисления ${fromBase}`);

        const decimalValue = parseInt(val, fromBase);
        
        if (isNaN(decimalValue)) {
            throw new Error(`Ошибка преобразования числа`);
        }
        
        result = decimalValue.toString(toBase).toUpperCase();
      } else {
        // Standard Encodings
        if (mode === 'encode') {
          switch (type) {
            case 'base64':
              result = btoa(unescape(encodeURIComponent(input)));
              break;
            case 'url':
              result = encodeURIComponent(input);
              break;
            case 'hex':
              result = input.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
              break;
            case 'html':
               result = input.replace(/[\u00A0-\u9999<>&]/g, (i) => '&#'+i.charCodeAt(0)+';');
               break;
          }
        } else {
          switch (type) {
            case 'base64':
              result = decodeURIComponent(escape(atob(input)));
              break;
            case 'url':
              result = decodeURIComponent(input);
              break;
            case 'hex':
              if (!input.match(/^[0-9a-fA-F]*$/)) throw new Error('Неверный HEX формат');
              result = input.match(/.{1,2}/g)?.map(byte => String.fromCharCode(parseInt(byte, 16))).join('') || '';
              break;
            case 'html':
              const doc = new DOMParser().parseFromString(input, "text/html");
              result = doc.documentElement.textContent || "";
              break;
          }
        }
      }
      setOutput(result);
    } catch (e: any) {
      setError(e.message || "Ошибка преобразования");
      setOutput('');
    }
  }, [input, mode, type, fromBase, toBase]);

  const getDescription = () => {
    switch (type) {
      case 'base64': return 'Base64 используется для кодирования бинарных данных в текст ASCII.';
      case 'url': return 'URL кодирование заменяет спецсимволы в ссылках (пробел → %20).';
      case 'hex': return 'Hex представляет каждый символ в виде его шестнадцатеричного кода.';
      case 'html': return 'HTML сущности заменяют спецсимволы (как < >) на безопасный код.';
      case 'radix': return 'Перевод чисел между стандартными системами счисления: двоичной, восьмеричной, десятичной и шестнадцатеричной.';
      default: return '';
    }
  };
  
  const SYSTEM_OPTIONS = [
    { value: 2, label: 'Двоичная (2)' },
    { value: 8, label: 'Восьмеричная (8)' },
    { value: 10, label: 'Десятичная (10)' },
    { value: 16, label: 'HEX (16)' },
  ];

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Card>
        {/* Info Section */}
        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl mb-6 flex gap-3 backdrop-blur-md">
           <Info className="text-blue-300 shrink-0" />
           <p className="text-sm text-blue-100">{getDescription()}</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 p-1.5 bg-black/20 rounded-xl backdrop-blur-sm">
          {(['base64', 'url', 'hex', 'html', 'radix'] as EncodingType[]).map((t) => (
            <button
              key={t}
              onClick={() => {
                  setType(t);
                  setInput('');
                  setOutput('');
                  setError(null);
              }}
              className={`flex-1 py-2.5 px-2 rounded-lg text-xs md:text-sm font-bold transition-all duration-300 ${
                type === t 
                ? 'bg-white/20 text-white shadow-lg backdrop-blur-md border border-white/10' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {t === 'radix' ? 'СИСТЕМЫ' : t.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Controls */}
        {type !== 'radix' ? (
            <div className="flex justify-center mb-8">
            <button
                onClick={() => setMode(mode === 'encode' ? 'decode' : 'encode')}
                className="flex items-center space-x-3 bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 text-blue-200 shadow-lg hover:shadow-blue-500/20 active:scale-95"
            >
                <span className={mode === 'encode' ? 'text-white' : 'text-slate-500'}>Кодировать</span>
                <div className="p-1.5 bg-blue-500/20 rounded-full">
                    <ArrowRightLeft size={16} className="text-blue-400" />
                </div>
                <span className={mode === 'decode' ? 'text-white' : 'text-slate-500'}>Раскодировать</span>
            </button>
            </div>
        ) : (
            <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="space-y-2">
                    <label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Из системы</label>
                    <select 
                        value={fromBase}
                        onChange={(e) => setFromBase(Number(e.target.value))}
                        className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500 transition-all cursor-pointer hover:bg-black/40"
                    >
                        {SYSTEM_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-xs text-slate-400 uppercase font-bold tracking-wider">В систему</label>
                    <select 
                        value={toBase}
                        onChange={(e) => setToBase(Number(e.target.value))}
                        className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500 transition-all cursor-pointer hover:bg-black/40"
                    >
                         {SYSTEM_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-2 flex justify-between">
              <span>{type === 'radix' ? 'Число' : 'Входные данные'}</span>
              <button onClick={() => setInput('')} className="text-xs text-red-300 hover:text-red-200 flex items-center bg-red-500/10 px-2 py-1 rounded">
                <Trash2 size={12} className="mr-1" /> Очистить
              </button>
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-48 bg-black/20 border border-white/10 rounded-2xl p-4 text-slate-100 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none font-mono text-sm placeholder-slate-500 transition-all backdrop-blur-sm"
              placeholder={type === 'radix' ? `Введите число (${SYSTEM_OPTIONS.find(o => o.value === fromBase)?.label})` : "Введите текст здесь..."}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-2 flex justify-between">
              <span>Результат</span>
              <button 
                onClick={() => navigator.clipboard.writeText(output)}
                disabled={!output}
                className="text-xs text-blue-300 hover:text-blue-200 flex items-center disabled:opacity-50 bg-blue-500/10 px-2 py-1 rounded"
              >
                <Copy size={12} className="mr-1" /> Копировать
              </button>
            </label>
            <div className={`w-full h-48 bg-black/20 border border-white/10 rounded-2xl p-4 overflow-auto font-mono text-sm backdrop-blur-sm ${error ? 'text-red-300 bg-red-900/10' : 'text-emerald-300'}`}>
              {error || output || <span className="text-slate-500 italic">Ожидание ввода...</span>}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};