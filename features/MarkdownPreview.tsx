import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import ReactMarkdown from 'react-markdown';
import { FileEdit, Eye, Info } from 'lucide-react';

export const MarkdownPreview: React.FC = () => {
  const [markdown, setMarkdown] = useState('# Привет, Мир!\n\nЭто **живой** редактор Markdown.\n\n- Список 1\n- Список 2\n\n> Цитата');
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  return (
    <div className="space-y-6 max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      <Card className="flex-1 flex flex-col p-0 overflow-hidden" title="Markdown Редактор">
        
        {/* Info Block */}
        <div className="bg-gray-500/10 border-b border-gray-500/20 p-4 flex gap-3 backdrop-blur-md">
           <Info className="text-gray-300 shrink-0 mt-0.5" size={20} />
           <div className="text-sm text-gray-100">
             <p className="font-bold mb-1">Разметка текста</p>
             <p>Markdown — это простой язык разметки. Используйте <code>#</code> для заголовков, <code>**текст**</code> для жирного и <code>-</code> для списков. Популярен в Telegram и GitHub.</p>
           </div>
        </div>

        <div className="flex border-b border-white/10">
            <button 
                onClick={() => setActiveTab('edit')}
                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'edit' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
                <FileEdit size={16} /> Редактор
            </button>
            <button 
                onClick={() => setActiveTab('preview')}
                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'preview' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
                <Eye size={16} /> Просмотр
            </button>
        </div>

        <div className="flex-1 relative overflow-hidden">
            {activeTab === 'edit' ? (
                <textarea
                    value={markdown}
                    onChange={(e) => setMarkdown(e.target.value)}
                    className="w-full h-full bg-black/20 p-6 font-mono text-sm text-slate-200 outline-none resize-none"
                    placeholder="Начните печатать..."
                />
            ) : (
                <div className="w-full h-full overflow-y-auto p-6 bg-white text-slate-900">
                     <div className="prose prose-sm max-w-none">
                        <ReactMarkdown>{markdown}</ReactMarkdown>
                     </div>
                </div>
            )}
        </div>
      </Card>
    </div>
  );
};