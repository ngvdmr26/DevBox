
import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Layers, Copy, Info } from 'lucide-react';

export const CssShadow: React.FC = () => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(10);
  const [blur, setBlur] = useState(20);
  const [spread, setSpread] = useState(-5);
  const [opacity, setOpacity] = useState(0.3);
  const [color, setColor] = useState('#000000');
  const [inset, setInset] = useState(false);

  // Convert hex + opacity to rgba
  const hexToRgba = (hex: string, alpha: number) => {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const shadowValue = `${inset ? 'inset ' : ''}${x}px ${y}px ${blur}px ${spread}px ${hexToRgba(color, opacity)}`;
  const cssCode = `box-shadow: ${shadowValue};`;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Card title="Генератор Теней">
        
        <div className="bg-indigo-600/10 border border-indigo-600/20 p-4 rounded-2xl mb-8 flex gap-3 backdrop-blur-md">
           <Info className="text-indigo-300 shrink-0 mt-0.5" size={20} />
           <p className="text-sm text-indigo-100">Настройте параметры тени и скопируйте готовый CSS код. Поддерживаются внешние и внутренние (inset) тени.</p>
        </div>

        {/* Preview Area */}
        <div className="flex justify-center mb-10 bg-white/5 rounded-2xl p-10 border border-white/5">
            <div 
                className="w-40 h-40 bg-indigo-500 rounded-2xl flex items-center justify-center transition-all duration-300"
                style={{ boxShadow: shadowValue }}
            >
                <Layers className="text-white opacity-80" size={48} />
            </div>
        </div>

        {/* Controls */}
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <div className="flex justify-between text-sm text-slate-400 mb-2">
                        <span>Сдвиг X</span>
                        <span>{x}px</span>
                    </div>
                    <input 
                        type="range" min="-50" max="50" value={x} onChange={(e) => setX(Number(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                </div>
                <div>
                    <div className="flex justify-between text-sm text-slate-400 mb-2">
                        <span>Сдвиг Y</span>
                        <span>{y}px</span>
                    </div>
                    <input 
                        type="range" min="-50" max="50" value={y} onChange={(e) => setY(Number(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                </div>
                <div>
                    <div className="flex justify-between text-sm text-slate-400 mb-2">
                        <span>Размытие (Blur)</span>
                        <span>{blur}px</span>
                    </div>
                    <input 
                        type="range" min="0" max="100" value={blur} onChange={(e) => setBlur(Number(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                </div>
                <div>
                    <div className="flex justify-between text-sm text-slate-400 mb-2">
                        <span>Растяжение (Spread)</span>
                        <span>{spread}px</span>
                    </div>
                    <input 
                        type="range" min="-50" max="50" value={spread} onChange={(e) => setSpread(Number(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                </div>
                <div>
                    <div className="flex justify-between text-sm text-slate-400 mb-2">
                        <span>Прозрачность</span>
                        <span>{Math.round(opacity * 100)}%</span>
                    </div>
                    <input 
                        type="range" min="0" max="1" step="0.01" value={opacity} onChange={(e) => setOpacity(Number(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                </div>
                <div className="flex items-end gap-4">
                     <div className="flex-1">
                         <div className="text-sm text-slate-400 mb-2">Цвет тени</div>
                         <div className="flex gap-2">
                             <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer bg-transparent border-none" />
                             <input type="text" value={color} onChange={(e) => setColor(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-2 text-white outline-none uppercase" />
                         </div>
                     </div>
                     <div className="pb-1">
                        <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                            <input type="checkbox" checked={inset} onChange={(e) => setInset(e.target.checked)} className="hidden" />
                            <div className={`w-5 h-5 rounded border flex items-center justify-center ${inset ? 'bg-indigo-500 border-indigo-500' : 'border-slate-500'}`}>
                                {inset && <div className="w-2 h-2 bg-white rounded-full"></div>}
                            </div>
                            <span className="text-sm text-white">Inset</span>
                        </label>
                     </div>
                </div>
            </div>
        </div>

        <div className="mt-8 relative group">
            <div className="bg-black/40 border border-white/10 rounded-xl p-4 font-mono text-sm text-indigo-300 break-all pr-12 shadow-inner">
                {cssCode}
            </div>
            <button 
                onClick={() => navigator.clipboard.writeText(cssCode)}
                className="absolute top-2 right-2 p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors backdrop-blur-md"
                title="Копировать CSS"
            >
                <Copy size={18} />
            </button>
        </div>
      </Card>
    </div>
  );
};