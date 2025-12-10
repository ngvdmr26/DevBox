import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Network, Search, ArrowLeft, Info, Server } from 'lucide-react';

const PORTS = [
    { p: 20, s: 'FTP Data', d: 'Передача файлов (File Transfer Protocol). Используется для передачи самих данных.' },
    { p: 21, s: 'FTP Control', d: 'Управление FTP сессией (команды).' },
    { p: 22, s: 'SSH', d: 'Secure Shell. Безопасный удаленный доступ к консоли сервера. Также используется для SFTP и SCP.' },
    { p: 23, s: 'Telnet', d: 'Устаревший протокол текстового интерфейса. Небезопасен (передает данные в открытом виде).' },
    { p: 25, s: 'SMTP', d: 'Simple Mail Transfer Protocol. Используется для ОТПРАВКИ почты между серверами.' },
    { p: 53, s: 'DNS', d: 'Domain Name System. Преобразует доменные имена (google.com) в IP-адреса.' },
    { p: 80, s: 'HTTP', d: 'HyperText Transfer Protocol. Стандартный порт для веб-сайтов (без шифрования).' },
    { p: 110, s: 'POP3', d: 'Post Office Protocol. Используется почтовыми клиентами для ПОЛУЧЕНИЯ писем.' },
    { p: 143, s: 'IMAP', d: 'Internet Message Access Protocol. Более современный протокол получения почты с синхронизацией папок.' },
    { p: 443, s: 'HTTPS', d: 'HTTP Secure. Зашифрованная версия HTTP. Стандарт для современного веба.' },
    { p: 3000, s: 'React/Node', d: 'Популярный порт по умолчанию для локальной разработки (Create React App, Node.js).' },
    { p: 3306, s: 'MySQL', d: 'Порт по умолчанию для базы данных MySQL.' },
    { p: 5432, s: 'PostgreSQL', d: 'Порт по умолчанию для базы данных PostgreSQL.' },
    { p: 6379, s: 'Redis', d: 'Порт по умолчанию для in-memory хранилища Redis.' },
    { p: 8080, s: 'HTTP Alternate', d: 'Часто используется как альтернатива порту 80 для веб-серверов или прокси.' },
    { p: 27017, s: 'MongoDB', d: 'Порт по умолчанию для NoSQL базы данных MongoDB.' },
];

export const PortReference: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<typeof PORTS[0] | null>(null);
  
  const filtered = PORTS.filter(x => x.p.toString().includes(search) || x.s.toLowerCase().includes(search.toLowerCase()));

  if (selected) {
    return (
        <div className="space-y-6 max-w-2xl mx-auto">
          <Card title="Информация о порте">
              <button 
                  onClick={() => setSelected(null)}
                  className="mb-6 flex items-center text-slate-400 hover:text-white transition-colors"
              >
                  <ArrowLeft size={16} className="mr-2" /> Назад к списку
              </button>

              <div className="flex flex-col items-center justify-center py-10 bg-gradient-to-br from-violet-900/20 to-transparent border border-white/10 rounded-3xl mb-6">
                   <Server size={48} className="text-violet-400 mb-4" />
                   <div className="text-6xl font-bold text-white font-mono">{selected.p}</div>
                   <div className="text-violet-300 font-bold uppercase tracking-widest mt-2">{selected.s}</div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Назначение</h4>
                  <p className="text-slate-200 leading-relaxed text-lg">{selected.d}</p>
              </div>
          </Card>
        </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Card title="Популярные порты">
        
        <div className="bg-violet-600/10 border border-violet-600/20 p-4 rounded-2xl mb-6 flex gap-3 backdrop-blur-md">
           <Info className="text-violet-300 shrink-0 mt-0.5" size={20} />
           <p className="text-sm text-violet-100">Порты — это "двери" в компьютере, через которые разные программы обмениваются данными. Стандартные порты (0-1023) зарезервированы для системных служб.</p>
        </div>

        <div className="relative mb-6">
            <Search className="absolute left-3 top-3.5 text-slate-500" size={18} />
            <input 
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Поиск порта..."
                className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-violet-500"
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
            {filtered.map(p => (
                <button 
                    key={p.p} 
                    onClick={() => setSelected(p)}
                    className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-white/10 transition-all hover:-translate-y-1 hover:shadow-lg active:scale-95"
                >
                    <div className="text-3xl font-bold text-white mb-1">{p.p}</div>
                    <div className="text-xs text-violet-300 font-bold uppercase tracking-wider">{p.s}</div>
                </button>
            ))}
        </div>
      </Card>
    </div>
  );
};