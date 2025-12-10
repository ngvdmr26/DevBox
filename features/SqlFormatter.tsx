import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Database, Copy, RefreshCw, Info } from 'lucide-react';

export const SqlFormatter: React.FC = () => {
  const [sql, setSql] = useState('SELECT * FROM users WHERE id = 1 AND active = 1 ORDER BY created_at DESC');

  const format = () => {
    // Basic regex-based formatting
    let formatted = sql
        .replace(/\s+/g, ' ')
        .replace(/\s*,\s*/g, ', ')
        .replace(/\s*=\s*/g, ' = ')
        .replace(/\(/g, ' (\n  ')
        .replace(/\)/g, '\n) ')
        // Keywords to start new lines
        .replace(/(SELECT|FROM|WHERE|AND|OR|ORDER BY|GROUP BY|HAVING|LIMIT|JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN|UPDATE|SET|INSERT INTO|VALUES|DELETE FROM)/gi, (match) => {
            return '\n' + match.toUpperCase() + ' ';
        });
    
    setSql(formatted.trim());
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Card title="SQL Форматтер">
        <div className="bg-indigo-600/10 border border-indigo-600/20 p-4 rounded-2xl mb-6 flex gap-3 backdrop-blur-md">
           <Info className="text-indigo-300 shrink-0 mt-0.5" size={20} />
           <p className="text-sm text-indigo-100">Длинные SQL запросы в одну строку сложно читать. Этот инструмент разбивает запрос на логические блоки и расставляет отступы, делая код понятным.</p>
        </div>

        <div className="relative group">
            <textarea
                value={sql}
                onChange={(e) => setSql(e.target.value)}
                className="w-full h-64 bg-black/20 border border-white/10 rounded-2xl p-4 font-mono text-sm text-blue-100 outline-none resize-none focus:border-blue-500 placeholder-white/20"
                placeholder="SELECT * FROM table..."
            />
            <button 
                onClick={() => navigator.clipboard.writeText(sql)}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-md transition-colors"
                title="Копировать"
            >
                <Copy size={16} />
            </button>
        </div>
        <div className="mt-4 flex justify-end gap-3">
             <Button onClick={() => setSql('')} variant="ghost">Очистить</Button>
             <Button onClick={format}>
                <RefreshCw size={16} className="mr-2" /> Форматировать
             </Button>
        </div>
      </Card>
    </div>
  );
};