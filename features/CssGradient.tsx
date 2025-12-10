import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Copy, Info, Paintbrush } from 'lucide-react';

export const CssGradient: React.FC = () => {
  const [color1, setColor1] = useState('#4f46e5');
  const [color2, setColor2] = useState('#ec4899');
  const [angle, setAngle] = useState(135);

  const gradientCss = `background: linear-gradient(${angle}deg, ${color1}, ${color2});`;

  const copy = () => {
    navigator.clipboard.writeText(gradientCss);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Card title="CSS Градиент">
        
        {/* Info Block */}
        <div className="bg-fuchsia-500/10 border border-fuchsia-500/20 p-4 rounded-2xl mb-6 flex gap-3 backdrop-blur-md">
           <Info className="text-fuchsia-300 shrink-0 mt-0.5" size={20} />
           <div className="text-sm text-fuchsia-100">
             <p className="font-bold mb-1">Генератор фона</p>
             <p>Создавайте красивые переходы цветов для сайтов. Выберите два цвета и угол наклона, а затем скопируйте готовый CSS код.</p>
           </div>
        </div>

        {/* Preview */}
        <div 
            className="w-full h-48 rounded-2xl shadow-2xl mb-8 flex items-center justify-center border border-white/10 transition-all duration-300"
            style={{ background: `linear-gradient(${angle}deg, ${color1}, ${color2})` }}
        >
            <span className="bg-black/40 text-white px-4 py-2 rounded-lg backdrop-blur-md font-mono text-sm shadow-lg">
                Preview
            </span>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
                <label className="text-sm text-slate-400 font-bold ml-1">Цвет 1</label>
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-2 rounded-xl">
                    <input 
                        type="color" 
                        value={color1}
                        onChange={(e) => setColor1(e.target.value)}
                        className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-none"
                    />
                    <input 
                         type="text"
                         value={color1}
                         onChange={(e) => setColor1(e.target.value)}
                         className="flex-1 bg-transparent text-white font-mono outline-none uppercase"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm text-slate-400 font-bold ml-1">Цвет 2</label>
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-2 rounded-xl">
                    <input 
                        type="color" 
                        value={color2}
                        onChange={(e) => setColor2(e.target.value)}
                        className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-none"
                    />
                    <input 
                         type="text"
                         value={color2}
                         onChange={(e) => setColor2(e.target.value)}
                         className="flex-1 bg-transparent text-white font-mono outline-none uppercase"
                    />
                </div>
            </div>

            <div className="md:col-span-2 space-y-2">
                <div className="flex justify-between text-sm text-slate-400 font-bold ml-1">
                    <span>Угол</span>
                    <span>{angle}°</span>
                </div>
                <input 
                    type="range" 
                    min="0" 
                    max="360" 
                    value={angle} 
                    onChange={(e) => setAngle(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700/50 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                />
            </div>
        </div>

        {/* Code Output */}
        <div className="relative group">
            <div className="bg-black/30 border border-white/10 rounded-xl p-4 font-mono text-sm text-purple-200 break-all pr-12">
                {gradientCss}
            </div>
            <button 
                onClick={copy}
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