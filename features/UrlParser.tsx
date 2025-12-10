import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Link, Search, Info } from 'lucide-react';

export const UrlParser: React.FC = () => {
  const [url, setUrl] = useState('');
  const [parsed, setParsed] = useState<URL | null>(null);
  const [params, setParams] = useState<[string, string][]>([]);

  useEffect(() => {
    try {
        if (!url) {
            setParsed(null);
            setParams([]);
            return;
        }
        const u = new URL(url);
        setParsed(u);
        const p: [string, string][] = [];
        u.searchParams.forEach((value, key) => p.push([key, value]));
        setParams(p);
    } catch (e) {
        setParsed(null);
        setParams([]);
    }
  }, [url]);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Card title="URL Парсер">
        
        {/* Info Block */}
        <div className="bg-teal-500/10 border border-teal-500/20 p-4 rounded-2xl mb-6 flex gap-3 backdrop-blur-md">
           <Info className="text-teal-300 shrink-0 mt-0.5" size={20} />
           <div className="text-sm text-teal-100">
             <p className="font-bold mb-1">Структура ссылки</p>
             <p>URL (Uniform Resource Locator) состоит из протокола (https), хоста (site.com), пути (/page) и параметров запроса (?id=1). Этот инструмент разбирает длинные ссылки на понятные части.</p>
           </div>
        </div>

        <div className="relative mb-8">
            <Link className="absolute left-3 top-3.5 text-slate-500" size={18} />
            <input 
                type="text" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/path?query=123"
                className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-blue-500 transition-all"
            />
        </div>

        {parsed ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="grid md:grid-cols-2 gap-4">
                     {[
                         { k: 'Protocol', v: parsed.protocol },
                         { k: 'Hostname', v: parsed.hostname },
                         { k: 'Path', v: parsed.pathname },
                         { k: 'Port', v: parsed.port || '(default)' },
                     ].map((item, i) => (
                         <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3">
                             <div className="text-xs text-slate-500 uppercase font-bold">{item.k}</div>
                             <div className="text-white font-mono truncate">{item.v}</div>
                         </div>
                     ))}
                </div>

                {params.length > 0 && (
                    <div>
                        <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                             <Search size={14} /> Query Parameters
                        </div>
                        <div className="bg-black/20 border border-white/10 rounded-2xl overflow-hidden">
                            {params.map(([k, v], i) => (
                                <div key={i} className="flex border-b border-white/5 last:border-0 p-3 text-sm">
                                    <div className="w-1/3 font-bold text-blue-300 truncate pr-2">{k}</div>
                                    <div className="w-2/3 font-mono text-slate-300 break-all">{v}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        ) : url ? (
            <div className="text-center text-slate-500 p-8 border border-dashed border-white/10 rounded-2xl">
                Неверный формат URL
            </div>
        ) : null}
      </Card>
    </div>
  );
};