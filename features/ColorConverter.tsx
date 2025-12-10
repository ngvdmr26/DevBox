import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Palette, Copy, Info } from 'lucide-react';

export const ColorConverter: React.FC = () => {
  const [color, setColor] = useState('#6366f1');
  const [rgb, setRgb] = useState('');
  const [hsl, setHsl] = useState('');

  useEffect(() => {
    // Hex to RGB
    let c = color.substring(1).split('');
    if(c.length === 3) c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    const colorInt = parseInt(c.join(''), 16);
    const r = (colorInt >> 16) & 255;
    const g = (colorInt >> 8) & 255;
    const b = colorInt & 255;
    
    setRgb(`rgb(${r}, ${g}, ${b})`);

    // RGB to HSL
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;
    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
            case gNorm: h = (bNorm - rNorm) / d + 2; break;
            case bNorm: h = (rNorm - gNorm) / d + 4; break;
        }
        h /= 6;
    }
    
    setHsl(`hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`);
  }, [color]);

  const CopyField = ({ label, value }: { label: string, value: string }) => (
    <div className="bg-black/20 border border-white/10 rounded-xl p-4 flex items-center justify-between group backdrop-blur-sm hover:bg-black/30 transition-colors">
        <div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-bold">{label}</div>
            <div className="text-white font-mono text-sm md:text-base select-all">{value}</div>
        </div>
        <button 
            onClick={() => navigator.clipboard.writeText(value)}
            className="p-2 text-slate-500 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all"
        >
            <Copy size={18} />
        </button>
    </div>
  );

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Card title="Конвертер Цветов">
        
        {/* Info Block */}
        <div className="bg-lime-500/10 border border-lime-500/20 p-4 rounded-2xl mb-6 flex gap-3 backdrop-blur-md">
           <Info className="text-lime-300 shrink-0 mt-0.5" size={20} />
           <div className="text-sm text-lime-100">
             <p className="font-bold mb-1">Форматы цвета</p>
             <p><b>HEX</b> (#RRGGBB) удобен для копирования. <b>RGB</b> описывает количество красного, зеленого и синего. <b>HSL</b> (Hue, Saturation, Lightness) удобен для изменения оттенка или яркости.</p>
           </div>
        </div>

        <div className="flex flex-col items-center mb-8">
            <div className="relative w-32 h-32 rounded-full shadow-[0_0_40px_rgba(0,0,0,0.5)] border-4 border-white/10 mb-6 overflow-hidden group">
                <input 
                    type="color" 
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer"
                />
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                    <Palette className="text-white drop-shadow-lg" size={32} />
                </div>
            </div>
            <p className="text-slate-400 text-sm">Нажмите на круг, чтобы выбрать цвет</p>
        </div>

        <div className="space-y-3">
            <CopyField label="HEX" value={color} />
            <CopyField label="RGB" value={rgb} />
            <CopyField label="HSL" value={hsl} />
        </div>
      </Card>
    </div>
  );
};