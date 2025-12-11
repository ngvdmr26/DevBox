
import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Copy, Info } from 'lucide-react';

export const CurlBuilder: React.FC = () => {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('https://api.example.com/data');
  const [header, setHeader] = useState('Authorization: Bearer token');
  const [body, setBody] = useState('{"key": "value"}');

  let cmd = `curl -X ${method} "${url}"`;
  if (header) cmd += ` \\\n  -H "${header}"`;
  if (method !== 'GET' && body) cmd += ` \\\n  -d '${body}'`;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card title="Curl Builder">
          <div className="bg-fuchsia-500/10 border border-fuchsia-500/20 p-4 rounded-xl mb-6 flex gap-3 text-sm text-fuchsia-100">
            <Info className="shrink-0 mt-0.5 text-fuchsia-400" size={20} />
            <p>Конструктор команд cURL — консольной утилиты для отправки запросов к API. Полезно для тестирования бэкенда через терминал.</p>
          </div>

          <div className="grid md:grid-cols-[100px,1fr] gap-4 mb-4">
               <select value={method} onChange={e => setMethod(e.target.value)} className="bg-black/30 border border-white/10 rounded-lg p-3 text-white">
                   {['GET', 'POST', 'PUT', 'DELETE'].map(m => <option key={m}>{m}</option>)}
               </select>
               <input value={url} onChange={e => setUrl(e.target.value)} className="bg-black/30 border border-white/10 rounded-lg p-3 text-white w-full" />
          </div>
          
          <div className="space-y-4 mb-6">
              <div>
                  <label className="text-xs text-slate-400 font-bold uppercase mb-1 block">Headers</label>
                  <input value={header} onChange={e => setHeader(e.target.value)} className="bg-black/30 border border-white/10 rounded-lg p-3 text-white w-full" />
              </div>
              {method !== 'GET' && (
                  <div>
                    <label className="text-xs text-slate-400 font-bold uppercase mb-1 block">Body (JSON)</label>
                    <textarea value={body} onChange={e => setBody(e.target.value)} className="bg-black/30 border border-white/10 rounded-lg p-3 text-white w-full h-24" />
                  </div>
              )}
          </div>

          <div className="bg-slate-900 border border-white/10 rounded-xl p-4 relative group">
              <pre className="font-mono text-sm text-fuchsia-300 whitespace-pre-wrap">{cmd}</pre>
              <button 
                onClick={() => navigator.clipboard.writeText(cmd)}
                className="absolute top-2 right-2 p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                  <Copy size={16} />
              </button>
          </div>
      </Card>
    </div>
  );
};