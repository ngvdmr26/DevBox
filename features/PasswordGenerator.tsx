import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { RefreshCw, Copy, Check, Info } from 'lucide-react';

export const PasswordGenerator: React.FC = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [useUppercase, setUseUppercase] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  const generatePassword = useCallback(() => {
    let charset = 'abcdefghijklmnopqrstuvwxyz';
    if (useUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useNumbers) charset += '0123456789';
    if (useSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let retVal = '';
    for (let i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    setPassword(retVal);
  }, [length, useUppercase, useNumbers, useSymbols]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Card>
        {/* Info Block */}
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl mb-6 flex gap-3 backdrop-blur-md">
           <Info className="text-emerald-300 shrink-0 mt-0.5" size={20} />
           <div className="text-sm text-emerald-100">
             <p className="font-bold mb-1">Зачем нужен генератор?</p>
             <p>Использование одинаковых или простых паролей — главная причина взломов. Этот инструмент создает случайные последовательности символов с высокой энтропией, которые практически невозможно подобрать перебором (Brute-force).</p>
           </div>
        </div>

        <div className="relative mb-8 group">
          <div className="w-full bg-black/30 backdrop-blur-md p-6 rounded-2xl text-2xl md:text-3xl font-mono text-center text-white tracking-wider break-all border border-white/10 shadow-inner flex items-center justify-center min-h-[5rem]">
            {password}
          </div>
          <button 
            onClick={handleCopy}
            className="absolute right-3 top-3 p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all backdrop-blur-sm border border-white/5 opacity-0 group-hover:opacity-100 focus:opacity-100"
            title="Копировать"
          >
            {copied ? <Check size={20} className="text-emerald-400" /> : <Copy size={20} />}
          </button>
        </div>

        <div className="space-y-8">
          <div>
            <div className="flex justify-between text-sm font-medium text-slate-300 mb-4 px-1">
              <span>Длина пароля</span>
              <span className="bg-white/10 px-2 py-0.5 rounded text-white">{length}</span>
            </div>
            <input 
              type="range" 
              min="6" 
              max="32" 
              value={length} 
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-700/50 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Заглавные (A-Z)', val: useUppercase, set: setUseUppercase },
              { label: 'Цифры (0-9)', val: useNumbers, set: setUseNumbers },
              { label: 'Символы (!@#)', val: useSymbols, set: setUseSymbols },
            ].map((opt, idx) => (
              <label key={idx} className={`
                flex items-center space-x-3 cursor-pointer p-4 rounded-xl border transition-all duration-300
                ${opt.val ? 'bg-blue-600/20 border-blue-500/50' : 'bg-white/5 border-white/5 hover:bg-white/10'}
              `}>
                <div className={`
                    w-6 h-6 rounded-full border flex items-center justify-center transition-colors
                    ${opt.val ? 'bg-blue-500 border-blue-500' : 'border-slate-500'}
                `}>
                    {opt.val && <Check size={14} className="text-white" />}
                </div>
                <input 
                  type="checkbox" 
                  checked={opt.val} 
                  onChange={(e) => opt.set(e.target.checked)}
                  className="hidden"
                />
                <span className={opt.val ? 'text-white' : 'text-slate-400'}>{opt.label}</span>
              </label>
            ))}
          </div>

          <Button onClick={generatePassword} fullWidth className="mt-4 py-4 text-lg shadow-blue-500/20">
            <RefreshCw size={24} className="mr-2" /> Сгенерировать
          </Button>
        </div>
      </Card>
    </div>
  );
};