
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Play, Pause, RotateCcw, Flag, Info } from 'lucide-react';

export const Stopwatch: React.FC = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      const start = Date.now() - time;
      timerRef.current = window.setInterval(() => {
        setTime(Date.now() - start);
      }, 10);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const formatTime = (ms: number) => {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    const milli = Math.floor((ms % 1000) / 10);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}.${milli.toString().padStart(2, '0')}`;
  };

  const lap = () => {
      setLaps([time, ...laps]);
  };

  const reset = () => {
      setIsRunning(false);
      setTime(0);
      setLaps([]);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card title="Секундомер">
        <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl mb-6 flex gap-3 text-sm text-orange-100">
            <Info className="shrink-0 mt-0.5 text-orange-400" size={20} />
            <p>Абстрактный визуализатор времени. Форма меняется каждую секунду, символизируя текучесть момента.</p>
        </div>

        {/* Abstract Liquid Animation */}
        <div className="relative flex justify-center items-center py-8 mb-6 h-80 overflow-hidden">
             
             {/* Liquid Blob Background */}
             <div className="absolute inset-0 flex items-center justify-center">
                 {/* CSS morphing blob */}
                 <style>{`
                    @keyframes morph {
                        0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
                        50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
                        100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
                    }
                    @keyframes spin-slow {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                 `}</style>
                 <div 
                    className={`w-64 h-64 bg-gradient-to-br opacity-40 blur-xl transition-all duration-1000 ${
                        isRunning 
                        ? 'from-emerald-500 via-green-500 to-teal-500' // Green when running
                        : 'from-red-500 via-orange-500 to-rose-500' // Red/Orange when stopped
                    }`}
                    style={{
                        animation: 'morph 8s ease-in-out infinite, spin-slow 20s linear infinite',
                        borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%'
                    }}
                 ></div>
                 
                 <div 
                    className={`absolute w-56 h-56 border-2 transition-all duration-500 ${
                        isRunning ? 'border-emerald-500/30' : 'border-red-500/30'
                    }`}
                    style={{
                        animation: 'morph 6s ease-in-out infinite reverse',
                        borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%'
                    }}
                 ></div>
             </div>

             {/* Digital Time - Increased Size and Font */}
             <div className="z-10 text-center">
                 <div className={`text-6xl md:text-7xl font-mono font-bold text-white tracking-tighter drop-shadow-2xl transition-all duration-200 ${isRunning ? 'scale-105' : 'scale-100'}`}>
                    {formatTime(time)}
                 </div>
                 {isRunning && (
                     <div className="text-emerald-400 text-xs font-bold uppercase tracking-[0.5em] mt-2 animate-pulse">Running</div>
                 )}
                 {!isRunning && time > 0 && (
                     <div className="text-red-400 text-xs font-bold uppercase tracking-[0.5em] mt-2">Paused</div>
                 )}
             </div>
        </div>

        <div className="flex justify-center gap-4 mb-8">
            <Button onClick={() => setIsRunning(!isRunning)} className={`w-32 ${isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}>
                {isRunning ? <Pause className="mr-2" /> : <Play className="mr-2" />}
                {isRunning ? 'Стоп' : 'Старт'}
            </Button>
            <Button onClick={lap} disabled={!isRunning} variant="secondary">
                <Flag className="mr-2" /> Круг
            </Button>
            <Button onClick={reset} variant="ghost" className="text-red-400 hover:bg-red-500/10">
                <RotateCcw className="mr-2" /> Сброс
            </Button>
        </div>

        {laps.length > 0 && (
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden max-h-64 overflow-y-auto custom-scrollbar">
                <div className="flex p-3 bg-white/5 text-xs font-bold text-slate-500 uppercase sticky top-0 backdrop-blur-md">
                    <span className="w-16">#</span>
                    <span className="flex-1">Время круга</span>
                    <span className="flex-1 text-right">Общее время</span>
                </div>
                {laps.map((lapTime, i) => (
                    <div key={i} className="flex p-3 border-b border-white/5 last:border-0 font-mono text-sm animate-in fade-in slide-in-from-top-2">
                        <span className="w-16 text-slate-500">{(laps.length - i).toString().padStart(2, '0')}</span>
                        <span className="flex-1 text-orange-300">
                            {i < laps.length - 1 ? formatTime(lapTime - laps[i+1]) : formatTime(lapTime)}
                        </span>
                        <span className="flex-1 text-right text-white">{formatTime(lapTime)}</span>
                    </div>
                ))}
            </div>
        )}
      </Card>
    </div>
  );
};