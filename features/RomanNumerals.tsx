
import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { ArrowRightLeft, Info } from 'lucide-react';

export const RomanNumerals: React.FC = () => {
  const [num, setNum] = useState<number | string>(2026);
  const [roman, setRoman] = useState('MMXXVI');

  const toRoman = (n: number) => {
      const map: any = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1};
      let r = '';
      for (let i in map) {
          while ( n >= map[i] ) { r += i; n -= map[i]; }
      }
      return r;
  };

  const fromRoman = (str: string) => {
      const map: any = {I:1,V:5,X:10,L:50,C:100,D:500,M:1000};
      let res = 0;
      let s = str.toUpperCase();
      for (let i = 0; i < s.length; i++) {
          const val = map[s[i]];
          if (i + 1 < s.length && map[s[i+1]] > val) res -= val;
          else res += val;
      }
      return res;
  };

  const handleNum = (v: string) => {
      setNum(v);
      if(v) setRoman(toRoman(parseInt(v)));
      else setRoman('');
  };

  const handleRoman = (v: string) => {
      setRoman(v);
      if(v) setNum(fromRoman(v));
      else setNum('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card title="Римские Цифры">
         <div className="bg-pink-500/10 border border-pink-500/20 p-4 rounded-xl mb-6 flex gap-3 text-sm text-pink-100">
            <Info className="shrink-0 mt-0.5 text-pink-400" size={20} />
            <p>Древняя система счисления, использующая буквы латинского алфавита. Часто применяется для обозначения веков, годов в титрах фильмов или на циферблатах часов.</p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 w-full">
                <label className="text-xs text-pink-400 font-bold uppercase mb-2 block">Число</label>
                <input 
                    type="number" 
                    value={num} 
                    onChange={e => handleNum(e.target.value)} 
                    className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-2xl text-white outline-none focus:border-pink-500"
                />
            </div>
            <ArrowRightLeft className="text-slate-500 rotate-90 md:rotate-0" />
            <div className="flex-1 w-full">
                <label className="text-xs text-pink-400 font-bold uppercase mb-2 block">Римское</label>
                <input 
                    type="text" 
                    value={roman} 
                    onChange={e => handleRoman(e.target.value)} 
                    className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-2xl text-white outline-none focus:border-pink-500 uppercase"
                />
            </div>
        </div>
      </Card>
    </div>
  );
};