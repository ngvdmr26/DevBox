
import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { CreditCard, CheckCircle, XCircle, Info } from 'lucide-react';

export const LuhnAlgo: React.FC = () => {
  const [num, setNum] = useState('');

  const isValid = (value: string) => {
      if (/[^0-9-\s]+/.test(value)) return false;
      let nCheck = 0, nDigit = 0, bEven = false;
      const val = value.replace(/\D/g, "");
      if(val.length < 13) return false;

      for (let n = val.length - 1; n >= 0; n--) {
          let cDigit = val.charAt(n), nDigit = parseInt(cDigit, 10);
          if (bEven) {
              if ((nDigit *= 2) > 9) nDigit -= 9;
          }
          nCheck += nDigit;
          bEven = !bEven;
      }
      return (nCheck % 10) === 0;
  };

  const valid = isValid(num);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card title="Валидатор Карт (Luhn)">
         <div className="bg-sky-500/10 border border-sky-500/20 p-4 rounded-xl mb-6 flex gap-3 text-sm text-sky-100">
            <Info className="shrink-0 mt-0.5 text-sky-400" size={20} />
            <p>Проверка корректности номера банковской карты с помощью алгоритма Луна (вычисление контрольной суммы). Этот метод не проверяет баланс, только правильность ввода номера.</p>
         </div>

         <div className="relative">
             <input 
                value={num}
                onChange={e => setNum(e.target.value)}
                placeholder="0000 0000 0000 0000"
                className={`w-full bg-black/30 border-2 rounded-xl p-4 pl-12 text-xl outline-none transition-colors ${num.length > 12 ? (valid ? 'border-green-500 text-green-400' : 'border-red-500 text-red-400') : 'border-white/10 text-white'}`}
             />
             <CreditCard className="absolute left-4 top-4 text-slate-500" />
             {num.length > 12 && (
                 <div className="absolute right-4 top-4">
                     {valid ? <CheckCircle className="text-green-500" /> : <XCircle className="text-red-500" />}
                 </div>
             )}
         </div>
      </Card>
    </div>
  );
};