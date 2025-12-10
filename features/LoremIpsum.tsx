import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Copy, FileText, RefreshCw, Info } from 'lucide-react';

export const LoremIpsum: React.FC = () => {
  const [paragraphs, setParagraphs] = useState(3);
  const [text, setText] = useState('');

  const generate = () => {
    const words = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum".split(' ');
    
    let result = [];
    for(let i=0; i<paragraphs; i++) {
        const len = Math.floor(Math.random() * 30) + 20;
        let p = [];
        // Always start first paragraph with Lorem Ipsum...
        if (i === 0) {
            p.push("Lorem ipsum dolor sit amet, consectetur adipiscing elit.");
        }
        for(let j=0; j<len; j++) {
             p.push(words[Math.floor(Math.random() * words.length)]);
        }
        let pStr = p.join(' ');
        pStr = pStr.charAt(0).toUpperCase() + pStr.slice(1) + '.';
        result.push(pStr);
    }
    setText(result.join('\n\n'));
  };

  useEffect(() => {
    generate();
  }, [paragraphs]);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Card title="Lorem Ipsum">
        
        {/* Info Block */}
        <div className="bg-zinc-500/10 border border-zinc-500/20 p-4 rounded-2xl mb-6 flex gap-3 backdrop-blur-md">
           <Info className="text-zinc-300 shrink-0 mt-0.5" size={20} />
           <div className="text-sm text-zinc-100">
             <p className="font-bold mb-1">Рыбный текст</p>
             <p>Lorem Ipsum — это стандартный текст-заполнитель, используемый в печати и дизайне с XVI века. Он позволяет оценить визуальное оформление документа, не отвлекаясь на смысл содержания.</p>
           </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
                <label className="text-sm text-slate-400 mb-2 block">Параграфов: {paragraphs}</label>
                <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    value={paragraphs} 
                    onChange={(e) => setParagraphs(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700/50 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
            </div>
            <Button onClick={generate} variant="secondary">
                <RefreshCw size={20} />
            </Button>
        </div>

        <div className="relative group">
            <textarea
                value={text}
                readOnly
                className="w-full h-80 bg-black/20 border border-white/10 rounded-2xl p-6 text-slate-300 text-sm leading-relaxed outline-none resize-none backdrop-blur-sm"
            />
            <button 
                onClick={() => navigator.clipboard.writeText(text)}
                className="absolute top-4 right-4 p-2 bg-teal-500/20 hover:bg-teal-500/40 text-teal-300 rounded-lg transition-colors backdrop-blur-md"
            >
                <Copy size={18} />
            </button>
        </div>
      </Card>
    </div>
  );
};