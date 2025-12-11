
import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { ShieldAlert, CheckCircle2, FileJson, Info } from 'lucide-react';

export const JwtDecoder: React.FC = () => {
  const [token, setToken] = useState('');
  const [header, setHeader] = useState<string | null>(null);
  const [payload, setPayload] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    setHeader(null);
    setPayload(null);

    if (!token.trim()) return;

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('JWT должен состоять из 3 частей, разделенных точками.');
      }

      const decode = (str: string) => {
        const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        const json = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.stringify(JSON.parse(json), null, 2);
      };

      setHeader(decode(parts[0]));
      setPayload(decode(parts[1]));

    } catch (e: any) {
      setError(e.message || 'Ошибка декодирования токена');
    }
  }, [token]);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Card title="JWT Декодер">
        
        {/* Info Block */}
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl mb-6 flex gap-3 backdrop-blur-md">
           <Info className="text-red-300 shrink-0 mt-0.5" size={20} />
           <div className="text-sm text-red-100">
             <p className="font-bold mb-1">Безопасность токенов</p>
             <p>JWT (JSON Web Token) состоит из заголовка, полезной нагрузки (Payload) и подписи. Данные в Payload закодированы в Base64, но <b>не зашифрованы</b>. Любой может их прочитать, поэтому никогда не храните там пароли.</p>
           </div>
        </div>

        <div className="mb-6">
            <textarea
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className={`
                    w-full h-32 bg-black/20 border rounded-2xl p-4 font-mono text-xs text-slate-300 
                    outline-none resize-none backdrop-blur-sm transition-all break-all
                    ${error ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-pink-500/50'}
                `}
                placeholder="Вставьте JWT токен (ey...)"
            />
            {error && (
                <div className="mt-2 text-red-400 text-sm flex items-center gap-2">
                    <ShieldAlert size={14} /> {error}
                </div>
            )}
             {!error && payload && (
                <div className="mt-2 text-emerald-400 text-sm flex items-center gap-2">
                    <CheckCircle2 size={14} /> Токен корректно распознан
                </div>
            )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2 overflow-hidden">
                <div className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <FileJson size={14} /> Header
                </div>
                <div className="w-full h-64 bg-slate-900/50 border border-white/5 rounded-2xl p-4 overflow-auto custom-scrollbar">
                    <pre className="text-xs md:text-sm font-mono text-purple-300 whitespace-pre-wrap break-all">
                        {header || <span className="text-slate-600">// Заголовок</span>}
                    </pre>
                </div>
            </div>

            <div className="space-y-2 overflow-hidden">
                <div className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <FileJson size={14} /> Payload
                </div>
                <div className="w-full h-64 bg-slate-900/50 border border-white/5 rounded-2xl p-4 overflow-auto custom-scrollbar">
                    <pre className="text-xs md:text-sm font-mono text-pink-300 whitespace-pre-wrap break-all">
                        {payload || <span className="text-slate-600">// Данные (Claims)</span>}
                    </pre>
                </div>
            </div>
        </div>
      </Card>
    </div>
  );
};