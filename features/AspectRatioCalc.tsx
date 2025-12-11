
import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Ratio, Info } from 'lucide-react';

export const AspectRatioCalc: React.FC = () => {
  const [width, setWidth] = useState<number>(1920);
  const [height, setHeight] = useState<number>(1080);

  // GCD function
  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };

  const divisor = gcd(width, height);
  const ratio = `${width / divisor}:${height / divisor}`;
  
  const presets = [
      { w: 1920, h: 1080, l: 'FHD (16:9)' },
      { w: 1280, h: 720, l: 'HD (16:9)' },
      { w: 1080, h: 1080, l: 'Insta (1:1)' },
      { w: 1080, h: 1350, l: 'Portrait (4:5)' },
      { w: 2560, h: 1440, l: '2K (16:9)' },
      { w: 3840, h: 2160, l: '4K (16:9)' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card title="Калькулятор соотношения сторон">
        <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl mb-6 flex gap-3">
             <Info className="text-yellow-400 shrink-0" size={20} />
             <p className="text-sm text-yellow-100">Введите ширину и высоту, чтобы узнать соотношение сторон. Или выберите пресет.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
                <label className="text-sm text-slate-400 font-bold">Ширина (W)</label>
                <input type="number" value={width} onChange={e => setWidth(Number(e.target.value))} className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white text-lg font-mono outline-none focus:border-yellow-500" />
            </div>
            <div className="space-y-2">
                <label className="text-sm text-slate-400 font-bold">Высота (H)</label>
                <input type="number" value={height} onChange={e => setHeight(Number(e.target.value))} className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white text-lg font-mono outline-none focus:border-yellow-500" />
            </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center mb-8">
            <div className="text-xs text-slate-500 uppercase font-bold mb-2">Соотношение</div>
            <div className="text-5xl font-bold text-white mb-2">{ratio}</div>
            <div className="text-yellow-400 text-sm">{(width / height).toFixed(2)} : 1</div>
        </div>

        <div className="flex flex-wrap gap-2">
            {presets.map(p => (
                <button 
                    key={p.l} 
                    onClick={() => { setWidth(p.w); setHeight(p.h); }}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium text-slate-300 transition-colors"
                >
                    {p.l}
                </button>
            ))}
        </div>
      </Card>
    </div>
  );
};