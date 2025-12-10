import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Percent, Info } from 'lucide-react';

export const PercentageCalc: React.FC = () => {
  const [val1, setVal1] = useState<string>('');
  const [val2, setVal2] = useState<string>('');
  const [val3, setVal3] = useState<string>('');
  const [val4, setVal4] = useState<string>('');

  const calc1 = () => {
     const v1 = parseFloat(val1);
     const v2 = parseFloat(val2);
     if(isNaN(v1) || isNaN(v2)) return '---';
     return ((v1 / 100) * v2).toFixed(2);
  }

  const calc2 = () => {
     const v3 = parseFloat(val3);
     const v4 = parseFloat(val4);
     if(isNaN(v3) || isNaN(v4) || v4 === 0) return '---';
     return ((v3 / v4) * 100).toFixed(2) + '%';
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Card title="Калькулятор процентов">
        
        {/* Info Block */}
        <div className="bg-green-600/10 border border-green-600/20 p-4 rounded-2xl mb-6 flex gap-3 backdrop-blur-md">
           <Info className="text-green-300 shrink-0 mt-0.5" size={20} />
           <div className="text-sm text-green-100">
             <p className="font-bold mb-1">Зачем это нужно?</p>
             <p>Быстро посчитать размер скидки, налог (НДС) или долю одного числа в другом без составления пропорций в уме.</p>
           </div>
        </div>

        {/* Calc 1 */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
             <div className="flex flex-wrap items-center gap-3 text-lg md:text-xl text-slate-300">
                <span>Сколько будет</span>
                <input 
                    type="number" 
                    value={val1}
                    onChange={(e) => setVal1(e.target.value)}
                    className="w-20 bg-black/30 border border-white/10 rounded-lg p-2 text-center text-white outline-none focus:border-green-500"
                    placeholder="%"
                />
                <span>% от</span>
                <input 
                    type="number" 
                    value={val2}
                    onChange={(e) => setVal2(e.target.value)}
                    className="w-24 bg-black/30 border border-white/10 rounded-lg p-2 text-center text-white outline-none focus:border-green-500"
                    placeholder="Число"
                />
                <span>?</span>
             </div>
             <div className="mt-4 pt-4 border-t border-white/10 text-right">
                <span className="text-3xl font-bold text-green-400">{calc1()}</span>
             </div>
        </div>

        {/* Calc 2 */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
             <div className="flex flex-wrap items-center gap-3 text-lg md:text-xl text-slate-300">
                <span>Число</span>
                <input 
                    type="number" 
                    value={val3}
                    onChange={(e) => setVal3(e.target.value)}
                    className="w-20 bg-black/30 border border-white/10 rounded-lg p-2 text-center text-white outline-none focus:border-green-500"
                    placeholder="A"
                />
                <span>составляет какой % от</span>
                <input 
                    type="number" 
                    value={val4}
                    onChange={(e) => setVal4(e.target.value)}
                    className="w-24 bg-black/30 border border-white/10 rounded-lg p-2 text-center text-white outline-none focus:border-green-500"
                    placeholder="B"
                />
                <span>?</span>
             </div>
             <div className="mt-4 pt-4 border-t border-white/10 text-right">
                <span className="text-3xl font-bold text-green-400">{calc2()}</span>
             </div>
        </div>

      </Card>
    </div>
  );
};