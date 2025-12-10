import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Keyboard, Info } from 'lucide-react';

export const KeycodeInfo: React.FC = () => {
  const [event, setEvent] = useState<KeyboardEvent | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
        e.preventDefault();
        setEvent(e);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Card title="JS KeyCodes">
        
        {/* Info Block */}
        <div className="bg-blue-600/10 border border-blue-600/20 p-4 rounded-2xl mb-6 flex gap-3 backdrop-blur-md">
           <Info className="text-blue-300 shrink-0 mt-0.5" size={20} />
           <div className="text-sm text-blue-100">
             <p className="font-bold mb-1">События клавиатуры</p>
             <p>При нажатии любой клавиши браузер генерирует событие <code>KeyboardEvent</code>. Свойства <code>key</code> и <code>code</code> используются разработчиками игр и веб-приложений для обработки ввода (хоткеи, управление).</p>
           </div>
        </div>

        {!event ? (
            <div className="py-20 text-center text-slate-400 flex flex-col items-center animate-pulse">
                <Keyboard size={48} className="mb-4 opacity-50" />
                <p className="text-xl font-medium">Нажмите любую клавишу...</p>
                <p className="text-sm mt-2">Коды клавиш отобразятся здесь</p>
            </div>
        ) : (
            <div className="space-y-8 animate-in zoom-in-95 duration-200">
                
                <div className="flex justify-center">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-blue-500 blur-xl opacity-40 rounded-full"></div>
                        <div className="relative w-40 h-40 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 flex flex-col items-center justify-center shadow-2xl">
                             <span className="text-6xl font-bold text-white">{event.which}</span>
                             <span className="text-xs text-blue-300 uppercase mt-2 font-bold tracking-widest">event.which</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                        { k: 'event.key', v: event.key === ' ' ? '(Space)' : event.key },
                        { k: 'event.code', v: event.code },
                        { k: 'event.location', v: event.location },
                        { k: 'event.ctrlKey', v: event.ctrlKey.toString() },
                        { k: 'event.shiftKey', v: event.shiftKey.toString() },
                        { k: 'event.metaKey', v: event.metaKey.toString() },
                    ].map((item, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                             <div className="text-xs text-slate-500 uppercase font-bold mb-1">{item.k}</div>
                             <div className="text-white font-mono text-lg">{item.v}</div>
                        </div>
                    ))}
                </div>

            </div>
        )}
      </Card>
    </div>
  );
};