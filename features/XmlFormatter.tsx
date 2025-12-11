
import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Code, Copy, Info } from 'lucide-react';

export const XmlFormatter: React.FC = () => {
  const [xml, setXml] = useState('<root><child>Text</child></root>');

  const format = () => {
    let formatted = '';
    let pad = 0;
    const lines = xml
        .replace(/>\s*</g, '><')
        .replace(/</g, '~::~<')
        .split('~::~');

    for (const line of lines) {
        let indent = 0;
        if (line.match(/.+<\/\w[^>]*>$/)) {
            indent = 0;
        } else if (line.match(/^<\/\w/)) {
            if (pad !== 0) pad -= 1;
        } else if (line.match(/^<\w[^>]*[^\/]>.*$/)) {
            indent = 1;
        } else {
            indent = 0;
        }

        const padding = new Array(pad * 2).fill(' ').join('');
        formatted += padding + line + '\n';
        pad += indent;
    }
    setXml(formatted.trim());
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card title="XML Форматтер">
         <div className="bg-violet-500/10 border border-violet-500/20 p-4 rounded-xl mb-6 flex gap-3 text-sm text-violet-100">
            <Info className="shrink-0 mt-0.5 text-violet-400" size={20} />
            <p>Инструмент для форматирования (Beautify) неструктурированного XML кода. Добавляет отступы и переносы строк для улучшения читаемости.</p>
         </div>

         <div className="relative mb-4">
             <textarea 
                value={xml}
                onChange={e => setXml(e.target.value)}
                className="w-full h-80 bg-black/30 border border-white/10 rounded-xl p-4 font-mono text-xs text-violet-200 outline-none resize-none focus:border-violet-500"
             />
             <button onClick={() => navigator.clipboard.writeText(xml)} className="absolute top-4 right-4 p-2 bg-white/10 rounded-lg text-white">
                 <Copy size={16} />
             </button>
         </div>
         <Button onClick={format} fullWidth>
             <Code className="mr-2" /> Форматировать
         </Button>
      </Card>
    </div>
  );
};