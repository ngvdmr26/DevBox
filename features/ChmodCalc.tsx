
import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Lock, Info } from 'lucide-react';

export const ChmodCalc: React.FC = () => {
  const [state, setState] = useState({
    owner: { r: true, w: true, x: false },
    group: { r: true, w: false, x: false },
    public: { r: true, w: false, x: false },
  });

  const calcDigit = (p: {r: boolean, w: boolean, x: boolean}) => {
      return (p.r ? 4 : 0) + (p.w ? 2 : 0) + (p.x ? 1 : 0);
  };

  const code = `${calcDigit(state.owner)}${calcDigit(state.group)}${calcDigit(state.public)}`;

  const toggle = (who: 'owner'|'group'|'public', perm: 'r'|'w'|'x') => {
      setState(prev => ({
          ...prev,
          [who]: { ...prev[who], [perm]: !prev[who][perm] }
      }));
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Card title="Chmod Калькулятор">
        <div className="flex flex-col items-center mb-8">
            <div className="text-6xl font-bold text-white mb-2 font-mono tracking-widest">{code}</div>
            <div className="text-slate-400">chmod {code} filename</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
                { id: 'owner', label: 'Владелец (Owner)' },
                { id: 'group', label: 'Группа (Group)' },
                { id: 'public', label: 'Остальные (Public)' },
            ].map((col) => (
                <div key={col.id} className="bg-white/5 border border-white/5 rounded-2xl p-4">
                    <h3 className="font-bold text-slate-300 mb-4 text-center">{col.label}</h3>
                    <div className="space-y-3">
                        {[
                            { p: 'r', t: 'Read (4)' },
                            { p: 'w', t: 'Write (2)' },
                            { p: 'x', t: 'Execute (1)' },
                        ].map((perm) => (
                            <label key={perm.p} className="flex items-center gap-3 cursor-pointer select-none">
                                <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${(state as any)[col.id][perm.p] ? 'bg-blue-500 border-blue-500' : 'border-slate-600'}`}>
                                    {(state as any)[col.id][perm.p] && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                </div>
                                <input 
                                    type="checkbox" 
                                    className="hidden" 
                                    checked={(state as any)[col.id][perm.p]} 
                                    onChange={() => toggle(col.id as any, perm.p as any)}
                                />
                                <span className="text-slate-400">{perm.t}</span>
                            </label>
                        ))}
                    </div>
                </div>
            ))}
        </div>
      </Card>
    </div>
  );
};
