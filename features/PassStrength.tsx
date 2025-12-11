
import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { ShieldCheck, ShieldAlert, Check } from 'lucide-react';

export const PassStrength: React.FC = () => {
  const [pass, setPass] = useState('');

  const checks = [
      { l: 'Длина > 8', v: pass.length >= 8 },
      { l: 'Заглавные буквы', v: /[A-Z]/.test(pass) },
      { l: 'Цифры', v: /[0-9]/.test(pass) },
      { l: 'Спецсимволы', v: /[^A-Za-z0-9]/.test(pass) },
  ];

  const score = checks.filter(c => c.v).length;
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card title="Анализ Пароля">
         <input 
            type="text"
            value={pass}
            onChange={e => setPass(e.target.value)}
            className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-xl text-white outline-none focus:border-rose-500 mb-6"
            placeholder="Введите пароль..."
         />

         <div className="h-2 bg-slate-800 rounded-full mb-6 overflow-hidden">
             <div 
                className={`h-full transition-all duration-500 ${colors[score]}`} 
                style={{ width: `${(score / 4) * 100}%` }}
             ></div>
         </div>

         <div className="grid grid-cols-2 gap-4">
             {checks.map(c => (
                 <div key={c.l} className={`flex items-center gap-2 p-3 rounded-xl border ${c.v ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-white/5 bg-white/5 text-slate-500'}`}>
                     {c.v ? <Check size={18} /> : <div className="w-4 h-4 rounded-full border border-slate-600" />}
                     <span className="text-sm font-medium">{c.l}</span>
                 </div>
             ))}
         </div>
      </Card>
    </div>
  );
};