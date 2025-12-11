
import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Copy, Info } from 'lucide-react';

export const BorderRadiusGen: React.FC = () => {
  const [tl, setTl] = useState(20);
  const [tr, setTr] = useState(20);
  const [br, setBr] = useState(20);
  const [bl, setBl] = useState(20);

  const css = `border-radius: ${tl}px ${tr}px ${br}px ${bl}px;`;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card title="Border Radius Генератор">
         <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl mb-6 flex gap-3 text-sm text-green-100">
            <Info className="shrink-0 mt-0.5 text-green-400" size={20} />
            <p>Генератор CSS свойства <code>border-radius</code> для создания скругленных углов. Настройте каждый угол отдельно и скопируйте код.</p>
         </div>

         <div className="grid md:grid-cols-2 gap-8 items-center">
             
             {/* Preview */}
             <div className="flex justify-center">
                 <div 
                    className="w-48 h-48 bg-gradient-to-br from-green-400 to-blue-500 shadow-2xl transition-all duration-300 border-4 border-white/20"
                    style={{ borderRadius: `${tl}px ${tr}px ${br}px ${bl}px` }}
                 ></div>
             </div>

             {/* Controls */}
             <div className="space-y-4">
                 <Control label="Top Left" val={tl} set={setTl} />
                 <Control label="Top Right" val={tr} set={setTr} />
                 <Control label="Bottom Right" val={br} set={setBr} />
                 <Control label="Bottom Left" val={bl} set={setBl} />
             </div>
         </div>

         <div className="mt-8 relative bg-black/30 border border-white/10 rounded-xl p-4 font-mono text-sm text-green-300">
             {css}
             <button 
                onClick={() => navigator.clipboard.writeText(css)}
                className="absolute top-2 right-2 p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white"
            >
                <Copy size={16} />
            </button>
         </div>
      </Card>
    </div>
  );
};

const Control = ({ label, val, set }: any) => (
    <div className="space-y-1">
        <div className="flex justify-between text-xs text-slate-400">
            <span>{label}</span>
            <span>{val}px</span>
        </div>
        <input 
            type="range" min="0" max="100" value={val} 
            onChange={(e) => set(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700/50 rounded-lg appearance-none cursor-pointer accent-green-500"
        />
    </div>
);