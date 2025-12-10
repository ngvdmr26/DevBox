
import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Clock, Copy, Info } from 'lucide-react';

export const CronParser: React.FC = () => {
  const [minute, setMinute] = useState('*');
  const [hour, setHour] = useState('*');
  const [day, setDay] = useState('*');
  const [month, setMonth] = useState('*');
  const [weekday, setWeekday] = useState('*');

  const cronString = `${minute} ${hour} ${day} ${month} ${weekday}`;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Card title="Cron Builder">
        <div className="bg-emerald-900/20 border border-emerald-500/20 p-4 rounded-2xl mb-6 flex gap-3 backdrop-blur-md">
           <Info className="text-emerald-400 shrink-0 mt-0.5" size={20} />
           <p className="text-sm text-emerald-100">Cron используется для планирования задач. Формат: <code>минута час день месяц день_недели</code>.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {[
                { l: 'Минута', v: minute, s: setMinute, ph: '0-59 или *' },
                { l: 'Час', v: hour, s: setHour, ph: '0-23 или *' },
                { l: 'День', v: day, s: setDay, ph: '1-31 или *' },
                { l: 'Месяц', v: month, s: setMonth, ph: '1-12 или *' },
                { l: 'Неделя', v: weekday, s: setWeekday, ph: '0-6 или *' },
            ].map((field, i) => (
                <div key={i} className="space-y-2">
                    <label className="text-xs text-slate-400 font-bold uppercase">{field.l}</label>
                    <input 
                        type="text" 
                        value={field.v}
                        onChange={(e) => field.s(e.target.value)}
                        className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-center text-white outline-none focus:border-emerald-500"
                        placeholder={field.ph}
                    />
                </div>
            ))}
        </div>

        <div className="bg-black/40 border border-white/10 rounded-2xl p-8 flex items-center justify-between group">
             <div className="font-mono text-3xl md:text-4xl text-emerald-400 tracking-wider">
                 {cronString}
             </div>
             <button 
                onClick={() => navigator.clipboard.writeText(cronString)}
                className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all active:scale-95"
            >
                <Copy size={24} />
            </button>
        </div>
      </Card>
    </div>
  );
};
