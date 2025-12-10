import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { FileType, Search, ArrowLeft, Info, FileCode } from 'lucide-react';

const MIMES = [
    { e: '.html', m: 'text/html', desc: 'Основной формат веб-страниц.' },
    { e: '.css', m: 'text/css', desc: 'Каскадные таблицы стилей.' },
    { e: '.js', m: 'text/javascript', desc: 'JavaScript код.' },
    { e: '.json', m: 'application/json', desc: 'Формат обмена данными JavaScript Object Notation.' },
    { e: '.png', m: 'image/png', desc: 'Изображение с поддержкой прозрачности (Lossless).' },
    { e: '.jpg', m: 'image/jpeg', desc: 'Фотографическое изображение (Lossy).' },
    { e: '.gif', m: 'image/gif', desc: 'Анимированные изображения.' },
    { e: '.svg', m: 'image/svg+xml', desc: 'Векторная графика.' },
    { e: '.pdf', m: 'application/pdf', desc: 'Документ Adobe Portable Document Format.' },
    { e: '.zip', m: 'application/zip', desc: 'Сжатый архив.' },
    { e: '.mp3', m: 'audio/mpeg', desc: 'Аудиофайл MP3.' },
    { e: '.mp4', m: 'video/mp4', desc: 'Видеофайл MP4.' },
    { e: '.csv', m: 'text/csv', desc: 'Табличные данные, разделенные запятыми.' },
    { e: '.webp', m: 'image/webp', desc: 'Современный формат изображений для веба от Google.' },
    { e: '.xml', m: 'application/xml', desc: 'eXtensible Markup Language.' },
    { e: '.txt', m: 'text/plain', desc: 'Простой текстовый файл.' },
    { e: '.wav', m: 'audio/wav', desc: 'Аудиофайл без сжатия.' },
    { e: '.ico', m: 'image/x-icon', desc: 'Иконка сайта (Favicon).' },
];

export const MimeTypes: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<typeof MIMES[0] | null>(null);

  const filtered = MIMES.filter(x => 
      x.e.includes(search.toLowerCase()) || 
      x.m.includes(search.toLowerCase())
  );

  if (selected) {
      return (
          <div className="space-y-6 max-w-2xl mx-auto">
            <Card title="Подробности типа">
                <button 
                    onClick={() => setSelected(null)}
                    className="mb-6 flex items-center text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={16} className="mr-2" /> Назад к списку
                </button>

                <div className="flex justify-center mb-8">
                    <div className="w-24 h-24 rounded-2xl bg-sky-500/20 flex items-center justify-center border border-sky-500/30">
                        <span className="text-3xl font-bold text-sky-400">{selected.e}</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <div className="text-xs text-slate-500 uppercase font-bold mb-1">MIME Type (Content-Type)</div>
                        <div className="text-xl font-mono text-white select-all">{selected.m}</div>
                    </div>
                    
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <div className="text-xs text-slate-500 uppercase font-bold mb-1">Описание</div>
                        <div className="text-slate-300">{selected.desc}</div>
                    </div>
                </div>
            </Card>
          </div>
      );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Card title="MIME Types">
        
        <div className="bg-sky-600/10 border border-sky-600/20 p-4 rounded-2xl mb-6 flex gap-3 backdrop-blur-md">
           <Info className="text-sky-300 shrink-0 mt-0.5" size={20} />
           <p className="text-sm text-sky-100">MIME-типы (Media Types) сообщают браузеру, как обрабатывать файл (показать как картинку, скачать как PDF и т.д.).</p>
        </div>

        <div className="relative mb-6">
            <Search className="absolute left-3 top-3.5 text-slate-500" size={18} />
            <input 
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Поиск расширения или типа..."
                className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-sky-500"
            />
        </div>
        <div className="space-y-2">
            {filtered.map((item, i) => (
                <button 
                    key={i} 
                    onClick={() => setSelected(item)}
                    className="w-full flex items-center justify-between bg-white/5 border border-white/5 rounded-xl p-3 px-4 hover:bg-white/10 transition-all text-left group"
                >
                    <div className="flex items-center gap-3">
                        <FileCode size={18} className="text-sky-500/50" />
                        <div className="font-bold text-sky-400 w-16">{item.e}</div>
                    </div>
                    <div className="font-mono text-sm text-slate-400 group-hover:text-white transition-colors truncate">{item.m}</div>
                </button>
            ))}
        </div>
      </Card>
    </div>
  );
};