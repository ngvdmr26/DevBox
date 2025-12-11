
import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Copy, Info } from 'lucide-react';

export const SlugGenerator: React.FC = () => {
  const [input, setInput] = useState('');

  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')     // Replace spaces with -
      .replace(/[^\w\-]+/g, '') // Remove all non-word chars
      .replace(/\-\-+/g, '-');  // Replace multiple - with single -
  };

  const slug = slugify(input);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card title="Slug Generator">
          <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl mb-6 flex gap-3 text-sm text-indigo-100">
            <Info className="shrink-0 mt-0.5 text-indigo-400" size={20} />
            <p>Генерация URL-friendly строк (Slug) для использования в ссылках. Преобразует текст в нижний регистр и заменяет пробелы на дефисы.</p>
          </div>

          <input 
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Введите заголовок статьи..."
            className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-lg text-white outline-none focus:border-indigo-500 mb-6"
          />
          
          <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-6 relative group">
              <div className="text-xs text-indigo-300 uppercase font-bold mb-2">Результат (Slug)</div>
              <div className="text-xl font-mono text-white break-all">{slug || '...'}</div>
              <button 
                onClick={() => navigator.clipboard.writeText(slug)}
                className="absolute top-4 right-4 p-2 bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 rounded-lg transition-colors"
              >
                  <Copy size={18} />
              </button>
          </div>
      </Card>
    </div>
  );
};