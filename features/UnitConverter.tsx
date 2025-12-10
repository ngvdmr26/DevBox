import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { ArrowRight, Scale, Info } from 'lucide-react';

type Unit = 'B' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB';

const UNITS: Record<Unit, number> = {
    'B': 1,
    'KB': 1024,
    'MB': 1024 * 1024,
    'GB': 1024 * 1024 * 1024,
    'TB': 1024 * 1024 * 1024 * 1024,
    'PB': 1024 * 1024 * 1024 * 1024 * 1024
};

export const UnitConverter: React.FC = () => {
    const [value, setValue] = useState<string>('1');
    const [fromUnit, setFromUnit] = useState<Unit>('GB');
    const [toUnit, setToUnit] = useState<Unit>('MB');
    const [result, setResult] = useState<string>('');

    useEffect(() => {
        const val = parseFloat(value);
        if (isNaN(val)) {
            setResult('---');
            return;
        }

        const bytes = val * UNITS[fromUnit];
        const converted = bytes / UNITS[toUnit];

        // Format logic: if integer, show integer. If float, max 4 decimals, trim trailing zeros
        let formatted = converted.toFixed(6);
        formatted = parseFloat(formatted).toString(); // removes trailing zeros
        
        setResult(formatted);
    }, [value, fromUnit, toUnit]);

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <Card title="Конвертер данных">
                
                {/* Info Block */}
                <div className="bg-cyan-500/10 border border-cyan-500/20 p-4 rounded-2xl mb-6 flex gap-3 backdrop-blur-md">
                   <Info className="text-cyan-300 shrink-0 mt-0.5" size={20} />
                   <div className="text-sm text-cyan-100">
                     <p className="font-bold mb-1">Двоичная система</p>
                     <p>Производители дисков считают, что 1 КБ = 1000 байт (десятичная система), а Windows — что 1 КБ = 1024 байта (двоичная). Здесь мы используем стандарт программистов: 1024.</p>
                   </div>
                </div>

                <div className="bg-white/5 border border-white/5 rounded-2xl p-6 md:p-10 flex flex-col items-center justify-center gap-8 relative overflow-hidden">
                    
                    {/* Background decoration */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50"></div>

                    <div className="w-full grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-6 items-center">
                        {/* FROM */}
                        <div className="space-y-3">
                             <input 
                                type="number" 
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                className="w-full text-2xl md:text-3xl font-bold bg-transparent border-b border-white/20 pb-2 outline-none text-white focus:border-blue-500 transition-colors text-center md:text-left placeholder-slate-600"
                                placeholder="0"
                            />
                            <select 
                                value={fromUnit}
                                onChange={(e) => setFromUnit(e.target.value as Unit)}
                                className="w-full bg-black/30 text-white text-base rounded-xl p-3 border border-white/10 outline-none focus:border-cyan-500 transition-all cursor-pointer hover:bg-black/40"
                            >
                                {Object.keys(UNITS).map(u => <option key={u} value={u}>{u}</option>)}
                            </select>
                        </div>

                        {/* ARROW */}
                        <div className="flex justify-center text-slate-500">
                            <ArrowRight size={24} className="rotate-90 md:rotate-0" />
                        </div>

                        {/* TO */}
                        <div className="space-y-3">
                            <div className="w-full text-2xl md:text-3xl font-bold pb-2 text-emerald-400 break-all text-center md:text-right min-h-[3rem] border-b border-transparent">
                                {result}
                            </div>
                            <select 
                                value={toUnit}
                                onChange={(e) => setToUnit(e.target.value as Unit)}
                                className="w-full bg-black/30 text-white text-base rounded-xl p-3 border border-white/10 outline-none focus:border-cyan-500 transition-all cursor-pointer hover:bg-black/40"
                            >
                                {Object.keys(UNITS).map(u => <option key={u} value={u}>{u}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-4">
                        <Scale size={14} />
                        <span>Используется стандарт: 1 KB = 1024 B</span>
                    </div>

                </div>
            </Card>
        </div>
    );
};