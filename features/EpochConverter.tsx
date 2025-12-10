import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Clock, Calendar, ArrowRightLeft, Info } from 'lucide-react';

export const EpochConverter: React.FC = () => {
  const [ts, setTs] = useState<string>(Math.floor(Date.now() / 1000).toString());
  const [dateStr, setDateStr] = useState<string>('');
  const [humanDate, setHumanDate] = useState<string>('');

  // Update current time every second if user hasn't modified input
  useEffect(() => {
    const interval = setInterval(() => {
       // Only update if we are in "live" mode or input is empty (optional feature, kept simple for now)
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timestamp = parseInt(ts);
    if (!isNaN(timestamp)) {
      const date = new Date(timestamp * 1000);
      setHumanDate(date.toLocaleString('ru-RU', { timeZoneName: 'short' }));
      
      // Update the date picker input (requires ISO format YYYY-MM-DDTHH:mm)
      try {
        const iso = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
        setDateStr(iso);
      } catch (e) {}
    } else {
        setHumanDate('Неверный формат');
    }
  }, [ts]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateStr(e.target.value);
    const date = new Date(e.target.value);
    if (!isNaN(date.getTime())) {
        setTs(Math.floor(date.getTime() / 1000).toString());
    }
  };

  const setNow = () => {
    setTs(Math.floor(Date.now() / 1000).toString());
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Card title="Unix Время (Epoch)">
        
        {/* Info Block */}
        <div className="bg-sky-500/10 border border-sky-500/20 p-4 rounded-2xl mb-6 flex gap-3 backdrop-blur-md">
           <Info className="text-sky-300 shrink-0 mt-0.5" size={20} />
           <div className="text-sm text-sky-100">
             <p className="font-bold mb-1">Что такое Unix Timestamp?</p>
             <p>Это способ отслеживания времени как количество секунд, прошедших с полуночи 1 января 1970 года (UTC). Компьютерам так проще хранить и сравнивать даты.</p>
           </div>
        </div>

        <div className="space-y-8">
            
            {/* Timestamp Input */}
            <div className="space-y-2">
                <label className="text-sm text-slate-400 font-bold tracking-wider">UNIX TIMESTAMP</label>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Clock className="absolute left-3 top-3.5 text-blue-400" size={18} />
                        <input 
                            type="number" 
                            value={ts}
                            onChange={(e) => setTs(e.target.value)}
                            className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-lg font-mono outline-none focus:border-blue-500 transition-all"
                        />
                    </div>
                    <Button onClick={setNow} variant="secondary">
                        Сейчас
                    </Button>
                </div>
            </div>

            {/* Middle Indicator */}
            <div className="flex justify-center text-slate-500">
                <ArrowRightLeft className="rotate-90" />
            </div>

            {/* Human Date Output/Input */}
            <div className="space-y-4">
                 <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 text-center backdrop-blur-md">
                    <div className="text-xs text-blue-300 uppercase mb-1">Человекочитаемая дата</div>
                    <div className="text-xl md:text-2xl font-bold text-white">{humanDate}</div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-sm text-slate-400 font-bold tracking-wider">ВЫБРАТЬ ДАТУ</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-3.5 text-purple-400" size={18} />
                        <input 
                            type="datetime-local" 
                            value={dateStr}
                            onChange={handleDateChange}
                            className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-purple-500 transition-all [color-scheme:dark]"
                        />
                    </div>
                 </div>
            </div>

        </div>
      </Card>
    </div>
  );
};