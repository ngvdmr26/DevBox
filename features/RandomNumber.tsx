
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Dices, Info } from 'lucide-react';

export const RandomNumber: React.FC = () => {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [val, setVal] = useState<number>(0);
  const [isRolling, setIsRolling] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
      setVal(Math.floor(Math.random() * (max - min + 1)) + min);
  }, []);

  const generate = () => {
      setIsRolling(true);
      
      const duration = 600; // ms
      const startTime = Date.now();
      
      const roll = () => {
          const now = Date.now();
          const progress = now - startTime;
          
          if (progress < duration) {
              setVal(Math.floor(Math.random() * (max - min + 1)) + min);
              timeoutRef.current = requestAnimationFrame(roll);
          } else {
              setVal(Math.floor(Math.random() * (max - min + 1)) + min);
              setIsRolling(false);
          }
      };
      
      roll();
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <Card title="Рандомайзер">
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl mb-6 flex gap-3 text-sm text-emerald-100">
            <Info className="shrink-0 mt-0.5 text-emerald-400" size={20} />
            <p>Генератор псевдослучайных чисел. Используйте для жеребьевки, игр или принятия решений. Диапазон можно настроить ниже.</p>
          </div>

          <div className="flex justify-center mb-8">
              <div className={`w-40 h-40 bg-gradient-to-br from-emerald-500 to-teal-700 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/10 transition-transform ${isRolling ? 'scale-110 animate-pulse' : 'scale-100'}`}>
                  <span className="text-6xl font-bold text-white font-mono">{val}</span>
              </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                  <label className="text-xs text-slate-400 font-bold uppercase mb-1 block">Min</label>
                  <input type="number" value={min} onChange={e => setMin(Number(e.target.value))} className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white text-center" />
              </div>
              <div>
                  <label className="text-xs text-slate-400 font-bold uppercase mb-1 block">Max</label>
                  <input type="number" value={max} onChange={e => setMax(Number(e.target.value))} className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white text-center" />
              </div>
          </div>

          <Button onClick={generate} fullWidth className="bg-emerald-600 hover:bg-emerald-500" disabled={isRolling}>
              <Dices className={`mr-2 ${isRolling ? 'animate-spin' : ''}`} /> 
              {isRolling ? 'Генерирую...' : 'Сгенерировать'}
          </Button>
      </Card>
    </div>
  );
};