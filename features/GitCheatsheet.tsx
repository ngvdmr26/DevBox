
import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { GitBranch, Terminal, ArrowLeft, Info, ChevronRight } from 'lucide-react';

interface Command {
    c: string;
    d: string;
    details: string;
    example?: string;
}

interface Group {
    t: string;
    cmds: Command[];
}

const COMMANDS: Group[] = [
      { t: 'Настройка (Config)', cmds: [
          { c: 'git config --global user.name', d: 'Установить имя пользователя', details: 'Эта команда задает имя, которое будет прикрепляться к каждому вашему коммиту.', example: 'git config --global user.name "John Doe"' },
          { c: 'git config --global user.email', d: 'Установить email', details: 'Задает email для коммитов. Важно, чтобы он совпадал с email на GitHub/GitLab.', example: 'git config --global user.email "john@example.com"' }
      ]},
      { t: 'Создание (Create)', cmds: [
          { c: 'git init', d: 'Инициализация репозитория', details: 'Создает новый пустой репозиторий Git в текущей папке. Появляется скрытая папка .git.', example: 'cd my-project\ngit init' },
          { c: 'git clone', d: 'Клонировать репозиторий', details: 'Скачивает проект с удаленного сервера (GitHub) на ваш компьютер.', example: 'git clone https://github.com/user/repo.git' }
      ]},
      { t: 'Изменения (Changes)', cmds: [
          { c: 'git status', d: 'Состояние файлов', details: 'Показывает, какие файлы были изменены, добавлены в индекс или являются новыми (untracked).', example: 'git status' },
          { c: 'git add .', d: 'Добавить все файлы', details: 'Добавляет все измененные и новые файлы в "индекс" (staging area), подготавливая их к коммиту.', example: 'git add .' },
          { c: 'git commit -m', d: 'Зафиксировать изменения', details: 'Создает "снимок" файлов из индекса с комментарием. Сохраняет историю изменений.', example: 'git commit -m "Исправил баг в логине"' }
      ]},
      { t: 'Ветки (Branches)', cmds: [
          { c: 'git branch', d: 'Список веток', details: 'Показывает список всех локальных веток. Текущая ветка отмечена звездочкой.', example: 'git branch' },
          { c: 'git checkout -b', d: 'Создать и перейти', details: 'Создает новую ветку от текущей и сразу переключается на нее.', example: 'git checkout -b feature-login' },
          { c: 'git merge', d: 'Слияние ветки', details: 'Вливает изменения из указанной ветки в текущую.', example: 'git checkout main\ngit merge feature-login' }
      ]},
      { t: 'Синхронизация (Remote)', cmds: [
          { c: 'git push', d: 'Отправить изменения', details: 'Загружает ваши локальные коммиты на удаленный сервер (например, origin).', example: 'git push origin main' },
          { c: 'git pull', d: 'Получить изменения', details: 'Скачивает изменения с сервера и пытается объединить их с вашей версией.', example: 'git pull origin main' },
          { c: 'git remote -v', d: 'Список удаленных репо', details: 'Показывает URL-адреса, связанные с короткими именами (origin).', example: 'git remote -v' }
      ]}
  ];

export const GitCheatsheet: React.FC = () => {
  const [selectedCmd, setSelectedCmd] = useState<Command | null>(null);

  if (selectedCmd) {
      return (
          <div className="space-y-6 max-w-3xl mx-auto">
            <Card title="Детали команды">
                <button 
                    onClick={() => setSelectedCmd(null)}
                    className="mb-6 flex items-center text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={16} className="mr-2" /> Назад к списку
                </button>

                <div className="bg-black/40 border border-white/10 rounded-2xl p-6 font-mono text-base md:text-lg text-fuchsia-400 mb-6 shadow-inner break-all">
                    {selectedCmd.c}
                </div>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-white font-bold text-xl mb-2">{selectedCmd.d}</h3>
                        <p className="text-slate-300 leading-relaxed">{selectedCmd.details}</p>
                    </div>

                    {selectedCmd.example && (
                        <div className="bg-slate-900/50 border border-white/5 rounded-xl p-4 overflow-hidden">
                            <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Пример использования</h4>
                            <div className="overflow-x-auto">
                                <pre className="font-mono text-sm text-green-300 whitespace-pre-wrap break-all">{selectedCmd.example}</pre>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
          </div>
      )
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Card title="Git Шпаргалка">
        
        <div className="bg-fuchsia-600/10 border border-fuchsia-600/20 p-4 rounded-2xl mb-6 flex gap-3 backdrop-blur-md">
           <Info className="text-fuchsia-300 shrink-0 mt-0.5" size={20} />
           <p className="text-sm text-fuchsia-100">Самые необходимые команды для работы с системой контроля версий Git. Нажмите на команду для подробностей.</p>
        </div>

        <div className="space-y-8">
            {COMMANDS.map((group, i) => (
                <div key={i}>
                    <h3 className="text-lg font-bold text-orange-400 mb-3 flex items-center gap-2 px-1">
                        <GitBranch size={20} /> {group.t}
                    </h3>
                    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                        {group.cmds.map((cmd, j) => (
                            <button 
                                key={j} 
                                onClick={() => setSelectedCmd(cmd)}
                                className="w-full flex flex-col md:flex-row md:items-center border-b border-white/5 last:border-0 p-4 hover:bg-white/10 transition-colors text-left group gap-2"
                            >
                                <div className="flex-1 font-mono text-sm text-green-300 break-all flex gap-3 items-center">
                                    <Terminal size={14} className="opacity-50 shrink-0 hidden md:block" />
                                    <span className="group-hover:translate-x-1 transition-transform">
                                        <span className="break-all">{cmd.c.split(' ')[0]} <span className="text-slate-400">{cmd.c.split(' ').slice(1).join(' ')}</span></span>
                                    </span>
                                </div>
                                <div className="text-sm text-slate-400 md:w-1/3 md:text-right flex items-center justify-between md:justify-end gap-2">
                                    <span>{cmd.d}</span>
                                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-50" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
      </Card>
    </div>
  );
};