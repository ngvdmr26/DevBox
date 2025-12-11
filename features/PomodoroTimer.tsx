
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Play, Pause, RotateCcw, Coffee, Brain, Info } from 'lucide-react';

export const PomodoroTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'short' | 'long'>('work');
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    switch (mode) {
      case 'work': setTimeLeft(25 * 60); break;
      case 'short': setTimeLeft(5 * 60); break;
      case 'long': setTimeLeft(15 * 60); break;
    }
  };

  const setTimerMode = (m: 'work' | 'short' | 'long') => {
    setMode(m);
    setIsActive(false);
    switch (m) {
      case 'work': setTimeLeft(25 * 60); break;
      case 'short': setTimeLeft(5 * 60); break;
      case 'long': setTimeLeft(15 * 60); break;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Ring Calculation
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const totalTime = mode === 'work' ? 25 * 60 : (mode === 'short' ? 5 * 60 : 15 * 60);
  
  // Logic for Clockwise Depletion:
  // We start at full (offset 0). 
  // As time decreases (progress 1 -> 0), we want the line to "retract" clockwise.
  // Standard SVG dashes draw counter-clockwise usually if we offset positively? 
  // Let's use the standard "dasharray" trick.
  // To make it deplete clockwise starting from top (-90deg):
  // We increase offset from 0 to circumference in a negative direction or flip the circle.
  // Actually, easiest way: strokeDashoffset = -1 * (total - time) / total * circumference
  // This makes the "gap" grow clockwise.
  const progress = (totalTime - timeLeft) / totalTime;
  const dashOffset = -1 * progress * circumference;
  
  const getColor = () => {
      if (mode === 'work') return 'text-red-500';
      if (mode === 'short') return 'text-green-500';
      return 'text-blue-500';
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <Card title="Pomodoro Timer" className="text-center">
        
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl mb-6 flex gap-3 text-sm text-red-100 text-left">
            <Info className="shrink-0 mt-0.5 text-red-400" size={20} />
            <p>Техника управления временем, чередующая интервалы работы (25 мин) и короткого отдыха (5 мин). Помогает сохранять концентрацию и избегать переутомления.</p>
        </div>

        <div className="flex justify-center gap-2 mb-8">
            <button onClick={() => setTimerMode('work')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${mode === 'work' ? 'bg-red-500 text-white shadow-lg' : 'bg-white/5 text-slate-400'}`}>
                <Brain size={16} className="inline mr-2" /> Работа
            </button>
            <button onClick={() => setTimerMode('short')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${mode === 'short' ? 'bg-green-500 text-white shadow-lg' : 'bg-white/5 text-slate-400'}`}>
                <Coffee size={16} className="inline mr-2" /> Пауза
            </button>
            <button onClick={() => setTimerMode('long')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${mode === 'long' ? 'bg-blue-500 text-white shadow-lg' : 'bg-white/5 text-slate-400'}`}>
                Long Break
            </button>
        </div>

        <div className="relative w-64 h-64 mx-auto mb-8 flex items-center justify-center">
             <svg className="absolute inset-0 w-full h-full -rotate-90 transform" viewBox="0 0 250 250">
                 {/* Track Circle */}
                 <circle 
                    cx="125" cy="125" r={radius} 
                    fill="none" 
                    stroke="#1e293b" 
                    strokeWidth="12" 
                 />
                 {/* Progress Circle */}
                 <circle 
                    cx="125" cy="125" r={radius} 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="12" 
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    className={`${getColor()} transition-all duration-1000 ease-linear`}
                 />
             </svg>
             <div className="text-6xl font-mono font-bold text-white relative z-10">{formatTime(timeLeft)}</div>
        </div>

        <div className="flex justify-center gap-4">
            <Button onClick={toggleTimer} className={`w-32 ${isActive ? 'bg-orange-500' : 'bg-emerald-500'}`}>
                {isActive ? <Pause size={20} /> : <Play size={20} />}
                {isActive ? ' Пауза' : ' Старт'}
            </Button>
            <Button onClick={resetTimer} variant="secondary">
                <RotateCcw size={20} />
            </Button>
        </div>
      </Card>
    </div>
  );
};