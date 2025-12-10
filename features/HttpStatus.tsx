import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Globe, Search, ArrowLeft, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const CODES = [
    { c: 200, m: 'OK', d: 'Успешный запрос. Стандартный ответ для успешных HTTP-запросов.', cause: 'Сервер успешно обработал запрос.' },
    { c: 201, m: 'Created', d: 'Ресурс создан. Обычно используется после POST-запроса.', cause: 'Был создан новый ресурс (например, новый пользователь в базе).' },
    { c: 204, m: 'No Content', d: 'Нет содержимого. Сервер обработал запрос, но не возвращает контент.', cause: 'Успешное удаление или обновление без возврата данных.' },
    { c: 301, m: 'Moved Permanently', d: 'Ресурс перемещен навсегда.', cause: 'URL страницы изменился навсегда. Используется для SEO-редиректов.' },
    { c: 302, m: 'Found', d: 'Временное перенаправление.', cause: 'Ресурс временно находится по другому адресу.' },
    { c: 304, m: 'Not Modified', d: 'Не изменялся.', cause: 'Клиентский кэш актуален, загрузка тела ответа не требуется.' },
    { c: 400, m: 'Bad Request', d: 'Плохой запрос.', cause: 'Сервер не понял запрос из-за неверного синтаксиса (ошибка в JSON, параметрах).' },
    { c: 401, m: 'Unauthorized', d: 'Не авторизован.', cause: 'Для доступа нужна аутентификация (нет токена или он неверен).' },
    { c: 403, m: 'Forbidden', d: 'Запрещено.', cause: 'Сервер понял запрос, но отказывается его выполнять (нет прав доступа).' },
    { c: 404, m: 'Not Found', d: 'Не найдено.', cause: 'Сервер не может найти запрашиваемый ресурс (битая ссылка).' },
    { c: 405, m: 'Method Not Allowed', d: 'Метод не разрешен.', cause: 'Метод запроса известен серверу, но был отключен (например, POST вместо GET).' },
    { c: 429, m: 'Too Many Requests', d: 'Слишком много запросов.', cause: 'Пользователь отправил слишком много запросов за короткое время (Rate Limit).' },
    { c: 500, m: 'Internal Server Error', d: 'Внутренняя ошибка сервера.', cause: 'Сервер столкнулся с непредвиденным условием (ошибка в коде бэкенда).' },
    { c: 502, m: 'Bad Gateway', d: 'Плохой шлюз.', cause: 'Сервер, действуя как шлюз, получил недопустимый ответ от вышестоящего сервера.' },
    { c: 503, m: 'Service Unavailable', d: 'Сервис недоступен.', cause: 'Сервер временно не готов обрабатывать запрос (перегрузка или техобслуживание).' },
    { c: 504, m: 'Gateway Timeout', d: 'Шлюз не ответил вовремя.', cause: 'Сервер-шлюз не дождался ответа от вышестоящего сервера вовремя.' },
];

export const HttpStatus: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<typeof CODES[0] | null>(null);

  const filtered = CODES.filter(c => 
      c.c.toString().includes(search) || 
      c.m.toLowerCase().includes(search.toLowerCase())
  );

  const getColor = (code: number) => {
      if (code >= 500) return 'text-red-400';
      if (code >= 400) return 'text-orange-400';
      if (code >= 300) return 'text-blue-400';
      return 'text-green-400';
  };

  const getIcon = (code: number) => {
    if (code >= 500) return <AlertTriangle className="text-red-400" size={48} />;
    if (code >= 400) return <AlertTriangle className="text-orange-400" size={48} />;
    if (code >= 200 && code < 300) return <CheckCircle className="text-green-400" size={48} />;
    return <Info className="text-blue-400" size={48} />;
  };

  if (selected) {
      return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <Card title={`Ошибка ${selected.c}`}>
                <button 
                    onClick={() => setSelected(null)}
                    className="mb-6 flex items-center text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={16} className="mr-2" /> Назад к списку
                </button>

                <div className="flex flex-col items-center text-center mb-8 animate-in fade-in zoom-in-95">
                    <div className="mb-4 p-4 bg-white/5 rounded-full border border-white/10 shadow-xl">
                        {getIcon(selected.c)}
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-2">{selected.c}</h2>
                    <h3 className={`text-xl font-mono ${getColor(selected.c)}`}>{selected.m}</h3>
                </div>

                <div className="space-y-4">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                        <h4 className="text-sm font-bold text-slate-400 uppercase mb-2">Описание</h4>
                        <p className="text-white leading-relaxed">{selected.d}</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                        <h4 className="text-sm font-bold text-slate-400 uppercase mb-2">Возможная причина</h4>
                        <p className="text-slate-300 leading-relaxed">{selected.cause}</p>
                    </div>
                </div>
            </Card>
        </div>
      );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Card title="HTTP Коды">
        
        <div className="bg-lime-600/10 border border-lime-600/20 p-4 rounded-2xl mb-6 flex gap-3 backdrop-blur-md">
           <Info className="text-lime-300 shrink-0 mt-0.5" size={20} />
           <p className="text-sm text-lime-100">Коды состояния HTTP — это стандартные ответы сервера, сообщающие о результате запроса. Нажмите на код, чтобы узнать подробности.</p>
        </div>

        <div className="relative mb-6">
            <Search className="absolute left-3 top-3.5 text-slate-500" size={18} />
            <input 
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Поиск кода или названия..."
                className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-blue-500"
            />
        </div>
        <div className="space-y-3">
            {filtered.map(code => (
                <button 
                    key={code.c} 
                    onClick={() => setSelected(code)}
                    className="w-full bg-white/5 border border-white/5 rounded-xl p-4 flex items-center gap-4 hover:bg-white/10 hover:translate-x-1 transition-all text-left group"
                >
                    <div className={`text-2xl font-bold font-mono w-16 text-center group-hover:scale-110 transition-transform ${getColor(code.c)}`}>{code.c}</div>
                    <div className="flex-1 border-l border-white/10 pl-4">
                        <div className="font-bold text-white group-hover:text-blue-300 transition-colors">{code.m}</div>
                        <div className="text-sm text-slate-400 truncate">{code.d}</div>
                    </div>
                </button>
            ))}
            {filtered.length === 0 && <div className="text-center text-slate-500 py-8">Ничего не найдено</div>}
        </div>
      </Card>
    </div>
  );
};