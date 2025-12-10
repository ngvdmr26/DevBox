
import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Layers, Copy, Info, Move, Maximize, Palette, BoxSelect } from 'lucide-react';

export const CssShadow: React.FC = () => {
  const [x, setX] = useState(10);
  const [y, setY] = useState(10);
  const [blur, setBlur] = useState(20);
  const [spread, setSpread] = useState(-5);
  const [opacity, setOpacity] = useState(0.4);
  const [color, setColor] = useState('#000000');
  const [inset, setInset] = useState(false);
  const [boxColor, setBoxColor] = useState('#6366f1'); // Indigo-500
  const [bgColor, setBgColor] = useState('#ffffff');

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
    <div className="space-y-6 max-w-5xl mx-auto">
      <Card title="Генератор Теней" className="overflow-visible">
        
        {/* Info Block */}
        <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-2xl mb-8 flex gap-3 backdrop-blur-md">
           <Info className="text-indigo-400 shrink-0 mt-0.5" size={20} />
           <div className="text-sm text-indigo-200">
             <p>Генератор CSS свойства <code>box-shadow</code>. Настройте параметры справа и скопируйте готовый код. Используйте переключатели фона превью, чтобы проверить контрастность.</p>
           </div>
        </div>

        <div className="grid lg:grid-cols-[1.2fr,1fr] gap-8">
            
            {/* Left Column: Preview & Code */}
            <div className="space-y-6">
                
                {/* Preview Box */}
                <div 
                    className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex items-center justify-center transition-colors duration-300"
                    style={{ backgroundColor: bgColor }}
                >
                    {/* Transparency Pattern (visible on light bg) */}
                    {bgColor === '#ffffff' && (
                        <div className="absolute inset-0 opacity-10 pointer-events-none" 
                            style={{ 
                                backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, 
                                backgroundSize: '20px 20px' 
                            }} 
                        />
                    )}

                    <div 
                        className="w-32 h-32 md:w-48 md:h-48 rounded-3xl flex items-center justify-center transition-all duration-100"
                        style={{ 
                            backgroundColor: boxColor,
                            boxShadow: shadowValue 
                        }}
                    >
                        <Layers className="text-white opacity-90 drop-shadow-md" size={48} />
                    </div>

                    {/* Preview Background Controls */}
                    <div className="absolute bottom-4 right-4 flex gap-2 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-xl border border-white/10 shadow-lg">
                         <button 
                            onClick={() => setBgColor('#ffffff')}
                            className={`w-8 h-8 rounded-lg border-2 transition-all flex items-center justify-center ${bgColor === '#ffffff' ? 'border-indigo-500 scale-105 shadow-glow' : 'border-transparent opacity-50 hover:opacity-100'}`}
                            style={{ background: '#ffffff' }}
                            title="Светлый фон"
                         >
                            <span className="text-[10px] text-black font-bold">L</span>
                         </button>
                         <button 
                            onClick={() => setBgColor('#0f172a')}
                            className={`w-8 h-8 rounded-lg border-2 transition-all flex items-center justify-center ${bgColor === '#0f172a' ? 'border-indigo-500 scale-105 shadow-glow' : 'border-transparent opacity-50 hover:opacity-100'}`}
                            style={{ background: '#0f172a' }}
                            title="Темный фон"
                         >
                            <span className="text-[10px] text-white font-bold">D</span>
                         </button>
                    </div>
                </div>

                {/* Code Block */}
                <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden relative group shadow-inner">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                             <div className="flex gap-1.5">
                                 <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
                                 <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                                 <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
                             </div>
                             CSS Code
                        </span>
                        <button 
                            onClick={() => navigator.clipboard.writeText(cssCode)}
                            className="flex items-center gap-2 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/10 hover:bg-indigo-500/20 px-2 py-1 rounded-md"
                        >
                            <Copy size={14} /> Копировать
                        </button>
                    </div>
                    <div className="p-5 font-mono text-sm text-indigo-100 break-all leading-relaxed">
                        <span className="text-purple-400">box-shadow</span>: {shadowValue};
                    </div>
                </div>
            </div>

            {/* Right Column: Controls */}
            <div className="space-y-6 bg-slate-900/40 border border-white/10 rounded-3xl p-6 h-fit backdrop-blur-sm shadow-xl">
                
                {/* Position Group */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-white mb-2 pb-2 border-b border-white/5">
                        <Move size={16} className="text-indigo-400" /> Позиция
                    </div>
                    
                    <ControlRow label="X Смещение" val={x} set={setX} min={-100} max={100} unit="px" />
                    <ControlRow label="Y Смещение" val={y} set={setY} min={-100} max={100} unit="px" />
                </div>

                {/* Size Group */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-white mb-2 pb-2 border-b border-white/5 pt-2">
                        <Maximize size={16} className="text-indigo-400" /> Размеры
                    </div>
                    
                    <ControlRow label="Размытие (Blur)" val={blur} set={setBlur} min={0} max={100} unit="px" />
                    <ControlRow label="Растяжение (Spread)" val={spread} set={setSpread} min={-50} max={50} unit="px" />
                </div>

                {/* Style Group */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-white mb-2 pb-2 border-b border-white/5 pt-2">
                        <Palette size={16} className="text-indigo-400" /> Стиль
                    </div>
                    
                     <ControlRow label="Прозрачность" val={opacity} set={setOpacity} min={0} max={1} step={0.01} unit="" />

                     <div className="grid grid-cols-2 gap-3 mt-4">
                        <div>
                             <label className="text-[10px] uppercase font-bold text-slate-500 mb-2 block tracking-wider">Цвет тени</label>
                             <div className="flex items-center gap-2 bg-black/30 rounded-lg p-1.5 pr-3 border border-white/10 hover:border-indigo-500/50 transition-colors group">
                                <div className="relative w-8 h-8 rounded overflow-hidden shadow-inner ring-1 ring-white/10">
                                    <input type="color" value={color} onChange={e => setColor(e.target.value)} className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer border-none p-0 bg-transparent" />
                                </div>
                                <span className="text-xs font-mono text-slate-300 group-hover:text-white">{color}</span>
                             </div>
                        </div>
                         <div>
                             <label className="text-[10px] uppercase font-bold text-slate-500 mb-2 block tracking-wider">Цвет объекта</label>
                             <div className="flex items-center gap-2 bg-black/30 rounded-lg p-1.5 pr-3 border border-white/10 hover:border-indigo-500/50 transition-colors group">
                                <div className="relative w-8 h-8 rounded overflow-hidden shadow-inner ring-1 ring-white/10">
                                    <input type="color" value={boxColor} onChange={e => setBoxColor(e.target.value)} className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer border-none p-0 bg-transparent" />
                                </div>
                                <span className="text-xs font-mono text-slate-300 group-hover:text-white">{boxColor}</span>
                             </div>
                        </div>
                     </div>

                     <div className="pt-2">
                        <label className={`
                            flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-300
                            ${inset ? 'bg-indigo-500/20 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'bg-black/20 border-white/10 hover:bg-black/30'}
                        `}>
                            <div className="flex items-center gap-3">
                                <BoxSelect size={18} className={inset ? 'text-indigo-400' : 'text-slate-500'} />
                                <span className={`text-sm font-medium transition-colors ${inset ? 'text-white' : 'text-slate-400'}`}>Внутренняя тень (Inset)</span>
                            </div>
                            <input type="checkbox" checked={inset} onChange={e => setInset(e.target.checked)} className="hidden" />
                            <div className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${inset ? 'bg-indigo-500' : 'bg-slate-700'}`}>
                                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm ${inset ? 'translate-x-5' : ''}`} />
                            </div>
                        </label>
                     </div>
                </div>

            </div>
        </div>

      </Card>
    </div>
  );
};

const ControlRow = ({ label, val, set, min, max, step = 1, unit }: any) => (
    <div className="space-y-2 group">
        <div className="flex justify-between text-xs">
            <span className="text-slate-400 group-hover:text-slate-300 transition-colors">{label}</span>
            <span className="text-indigo-400 font-mono bg-indigo-500/10 px-1.5 rounded text-[10px] flex items-center">{Math.round(val * 100) / 100}{unit}</span>
        </div>
        <input 
            type="range" min={min} max={max} step={step} value={val} onChange={(e) => set(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700/50 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all"
        />
    </div>
);
