
import React, { useState, useEffect } from 'react';
import { ToolId, ToolDefinition } from './types';
import { IntroAnimation } from './components/IntroAnimation'; // Import Intro

import { PasswordGenerator } from './features/PasswordGenerator';
import { Encoder } from './features/Encoder';
import { SpeedTest } from './features/SpeedTest';
import { JsonTools } from './features/JsonTools';
import { QrGenerator } from './features/QrGenerator';
import { UnitConverter } from './features/UnitConverter';
import { Hasher } from './features/Hasher';
import { UuidGenerator } from './features/UuidGenerator';
import { TextTools } from './features/TextTools';
import { RegexTester } from './features/RegexTester';
import { ColorConverter } from './features/ColorConverter';
import { EpochConverter } from './features/EpochConverter';
import { JwtDecoder } from './features/JwtDecoder';
import { MarkdownPreview } from './features/MarkdownPreview';
import { UrlParser } from './features/UrlParser';
import { LoremIpsum } from './features/LoremIpsum';
import { ListUtils } from './features/ListUtils';
import { PercentageCalc } from './features/PercentageCalc';
import { KeycodeInfo } from './features/KeycodeInfo';
import { CssGradient } from './features/CssGradient';
import { TextDiff } from './features/TextDiff';

// Existing Tools
import { SystemMonitor } from './features/SystemMonitor';
import { SqlFormatter } from './features/SqlFormatter';
import { CronParser } from './features/CronParser';
import { ChmodCalc } from './features/ChmodCalc';
import { MetaTags } from './features/MetaTags';
import { ImageCompressor } from './features/ImageCompressor';
import { GitCheatsheet } from './features/GitCheatsheet';
import { HttpStatus } from './features/HttpStatus';
import { MimeTypes } from './features/MimeTypes';
import { PortReference } from './features/PortReference';
import { CssShadow } from './features/CssShadow';

// New Tools Imports
import { PomodoroTimer } from './features/PomodoroTimer';
import { Stopwatch } from './features/Stopwatch';
import { AspectRatioCalc } from './features/AspectRatioCalc';
import { BorderRadiusGen } from './features/BorderRadiusGen';
import { Base64Image } from './features/Base64Image';
import { CsvJsonConverter } from './features/CsvJsonConverter';
import { UserAgentParser } from './features/UserAgentParser';
import { SlugGenerator } from './features/SlugGenerator';
import { XmlFormatter } from './features/XmlFormatter';
import { TextStyler } from './features/TextStyler';
import { CurlBuilder } from './features/CurlBuilder';
import { RomanNumerals } from './features/RomanNumerals';
import { PassStrength } from './features/PassStrength';
import { RandomNumber } from './features/RandomNumber';
import { LuhnAlgo } from './features/LuhnAlgo';

import { 
  KeyRound, FileCode2, Gauge, Braces, ChevronLeft,
  QrCode, Calculator, Fingerprint, Dna, Type, ScanSearch, Palette,
  Clock, ShieldAlert, FileEdit, Link, FileText, List, Percent, Keyboard,
  Paintbrush, GitCompare, PlayCircle,
  // Existing Icons
  Activity, Database, CalendarClock, Lock, Globe, Image, GitBranch, Server, FileType, Network, Layers,
  // New Icons
  Timer, Watch, Ratio, Box, ImagePlus, FileSpreadsheet, MonitorSmartphone, Link2, Code, Heading, Terminal, Hash, ShieldCheck, Dices, CreditCard
} from 'lucide-react';

const TOOLS: ToolDefinition[] = [
  // --- MOVED TO TOP ---
  {
    id: ToolId.SYSTEM_MONITOR,
    name: 'Инфо системы',
    description: 'Hardware, Сеть, Телеметрия',
    icon: Activity,
    color: 'bg-red-600',
    iconColor: 'text-red-500'
  },
  // --- New 15 Tools ---
  {
    id: ToolId.POMODORO,
    name: 'Помодоро',
    description: 'Таймер фокуссировки',
    icon: Timer,
    color: 'bg-red-500',
    iconColor: 'text-red-400'
  },
  {
    id: ToolId.STOPWATCH,
    name: 'Секундомер',
    description: 'Счетчик времени',
    icon: Watch,
    color: 'bg-orange-500',
    iconColor: 'text-orange-400'
  },
  {
    id: ToolId.ASPECT_RATIO,
    name: 'Соотношение сторон',
    description: 'Калькулятор пропорций',
    icon: Ratio,
    color: 'bg-yellow-500',
    iconColor: 'text-yellow-400'
  },
  {
    id: ToolId.BORDER_RADIUS,
    name: 'Border Radius',
    description: 'Генератор скруглений',
    icon: Box,
    color: 'bg-green-500',
    iconColor: 'text-green-400'
  },
  {
    id: ToolId.BASE64_IMAGE,
    name: 'Base64 Картинка',
    description: 'Кодирование изображений',
    icon: ImagePlus,
    color: 'bg-teal-500',
    iconColor: 'text-teal-400'
  },
  {
    id: ToolId.CSV_JSON,
    name: 'CSV ↔ JSON',
    description: 'Конвертер данных',
    icon: FileSpreadsheet,
    color: 'bg-cyan-500',
    iconColor: 'text-cyan-400'
  },
  {
    id: ToolId.USER_AGENT,
    name: 'User Agent',
    description: 'Парсер UA строки',
    icon: MonitorSmartphone,
    color: 'bg-blue-500',
    iconColor: 'text-blue-400'
  },
  {
    id: ToolId.SLUG_GENERATOR,
    name: 'Slug Генератор',
    description: 'ЧПУ ссылки',
    icon: Link2,
    color: 'bg-indigo-500',
    iconColor: 'text-indigo-400'
  },
  {
    id: ToolId.XML_FORMATTER,
    name: 'XML Форматтер',
    description: 'Beautifier для XML',
    icon: Code,
    color: 'bg-violet-500',
    iconColor: 'text-violet-400'
  },
  {
    id: ToolId.TEXT_STYLER,
    name: 'Стили Текста',
    description: 'Unicode шрифты',
    icon: Heading,
    color: 'bg-purple-500',
    iconColor: 'text-purple-400'
  },
  {
    id: ToolId.CURL_BUILDER,
    name: 'Curl Builder',
    description: 'Конструктор запросов',
    icon: Terminal,
    color: 'bg-fuchsia-500',
    iconColor: 'text-fuchsia-400'
  },
  {
    id: ToolId.ROMAN_NUMERALS,
    name: 'Римские цифры',
    description: 'Конвертер чисел',
    icon: Hash,
    color: 'bg-pink-500',
    iconColor: 'text-pink-400'
  },
  {
    id: ToolId.PASS_STRENGTH,
    name: 'Анализ пароля',
    description: 'Проверка стойкости',
    icon: ShieldCheck,
    color: 'bg-rose-500',
    iconColor: 'text-rose-400'
  },
  {
    id: ToolId.RANDOM_NUMBER,
    name: 'Рандомайзер',
    description: 'Генератор чисел',
    icon: Dices,
    color: 'bg-emerald-500',
    iconColor: 'text-emerald-400'
  },
  {
    id: ToolId.LUHN_ALGO,
    name: 'Валидатор карт',
    description: 'Алгоритм Луна',
    icon: CreditCard,
    color: 'bg-sky-500',
    iconColor: 'text-sky-400'
  },
  // --- Existing Tools ---
  {
    id: ToolId.PASSWORD_GENERATOR,
    name: 'Пароли',
    description: 'Генератор стойких паролей',
    icon: KeyRound,
    color: 'bg-emerald-500',
    iconColor: 'text-emerald-400'
  },
  {
    id: ToolId.ENCODER,
    name: 'Кодировщик',
    description: 'Base64, URL, Hex, Системы',
    icon: FileCode2,
    color: 'bg-purple-500',
    iconColor: 'text-purple-400'
  },
  {
    id: ToolId.JSON_TOOLS,
    name: 'JSON',
    description: 'Валидатор и форматтер',
    icon: Braces,
    color: 'bg-blue-500',
    iconColor: 'text-blue-400'
  },
  {
    id: ToolId.CSS_SHADOW,
    name: 'Генератор теней',
    description: 'CSS Box Shadow',
    icon: Layers,
    color: 'bg-indigo-500',
    iconColor: 'text-indigo-400'
  },
  {
    id: ToolId.SQL_FORMATTER,
    name: 'SQL',
    description: 'Форматирование запросов',
    icon: Database,
    color: 'bg-indigo-600',
    iconColor: 'text-indigo-500'
  },
  {
    id: ToolId.CRON_PARSER,
    name: 'Cron Builder',
    description: 'Создание расписаний',
    icon: CalendarClock,
    color: 'bg-teal-600',
    iconColor: 'text-teal-500'
  },
  {
    id: ToolId.SPEED_TEST,
    name: 'Скорость',
    description: 'Тест пропускной сети',
    icon: Gauge,
    color: 'bg-amber-500',
    iconColor: 'text-amber-400'
  },
  {
    id: ToolId.CHMOD_CALC,
    name: 'Chmod',
    description: 'Права доступа Linux',
    icon: Lock,
    color: 'bg-orange-600',
    iconColor: 'text-orange-500'
  },
  {
    id: ToolId.META_TAGS,
    name: 'SEO Meta',
    description: 'Генератор мета-тегов',
    icon: Globe,
    color: 'bg-cyan-600',
    iconColor: 'text-cyan-500'
  },
  {
    id: ToolId.IMAGE_COMPRESSOR,
    name: 'Сжатие фото',
    description: 'Оптимизация изображений',
    icon: Image,
    color: 'bg-pink-600',
    iconColor: 'text-pink-500'
  },
  {
    id: ToolId.GIT_CHEATSHEET,
    name: 'Git',
    description: 'Шпаргалка команд',
    icon: GitBranch,
    color: 'bg-fuchsia-600',
    iconColor: 'text-fuchsia-500'
  },
  {
    id: ToolId.HTTP_STATUS,
    name: 'HTTP Коды',
    description: 'Справочник ответов',
    icon: Server,
    color: 'bg-lime-600',
    iconColor: 'text-lime-500'
  },
  {
    id: ToolId.MIME_TYPES,
    name: 'MIME Types',
    description: 'Типы файлов',
    icon: FileType,
    color: 'bg-sky-600',
    iconColor: 'text-sky-500'
  },
  {
    id: ToolId.PORT_REFERENCE,
    name: 'Порты',
    description: 'Справочник TCP/UDP',
    icon: Network,
    color: 'bg-violet-600',
    iconColor: 'text-violet-500'
  },
  {
    id: ToolId.QR_GENERATOR,
    name: 'QR Код',
    description: 'Создание QR кодов',
    icon: QrCode,
    color: 'bg-pink-500',
    iconColor: 'text-pink-400'
  },
  {
    id: ToolId.UNIT_CONVERTER,
    name: 'Конвертер',
    description: 'Перевод единиц (KB, MB)',
    icon: Calculator,
    color: 'bg-cyan-500',
    iconColor: 'text-cyan-400'
  },
  {
    id: ToolId.HASHER,
    name: 'Крипто Хеш',
    description: 'SHA-256 генератор',
    icon: Fingerprint,
    color: 'bg-indigo-500',
    iconColor: 'text-indigo-400'
  },
  {
    id: ToolId.UUID_GENERATOR,
    name: 'UUID',
    description: 'Генератор ID (v4)',
    icon: Dna,
    color: 'bg-rose-500',
    iconColor: 'text-rose-400'
  },
  {
    id: ToolId.TEXT_TOOLS,
    name: 'Текст',
    description: 'Регистр, camelCase',
    icon: Type,
    color: 'bg-orange-500',
    iconColor: 'text-orange-400'
  },
  {
    id: ToolId.REGEX_TESTER,
    name: 'Регулярки',
    description: 'Тестер выражений',
    icon: ScanSearch,
    color: 'bg-yellow-500',
    iconColor: 'text-yellow-400'
  },
  {
    id: ToolId.COLOR_CONVERTER,
    name: 'Цвета',
    description: 'HEX, RGB, HSL',
    icon: Palette,
    color: 'bg-lime-500',
    iconColor: 'text-lime-400'
  },
  {
    id: ToolId.EPOCH_CONVERTER,
    name: 'Unix Время',
    description: 'Timestamp конвертер',
    icon: Clock,
    color: 'bg-sky-500',
    iconColor: 'text-sky-400'
  },
  {
    id: ToolId.JWT_DECODER,
    name: 'JWT Декодер',
    description: 'Просмотр токенов',
    icon: ShieldAlert,
    color: 'bg-red-500',
    iconColor: 'text-red-400'
  },
  {
    id: ToolId.MARKDOWN_PREVIEW,
    name: 'Markdown',
    description: 'Редактор и просмотр',
    icon: FileEdit,
    color: 'bg-gray-500',
    iconColor: 'text-gray-400'
  },
  {
    id: ToolId.URL_PARSER,
    name: 'URL Парсер',
    description: 'Разбор ссылок',
    icon: Link,
    color: 'bg-teal-500',
    iconColor: 'text-teal-400'
  },
  {
    id: ToolId.LOREM_IPSUM,
    name: 'Lorem Ipsum',
    description: 'Рыбный текст',
    icon: FileText,
    color: 'bg-zinc-500',
    iconColor: 'text-zinc-400'
  },
  {
    id: ToolId.LIST_UTILS,
    name: 'Списки',
    description: 'Сортировка, unique',
    icon: List,
    color: 'bg-violet-500',
    iconColor: 'text-violet-400'
  },
  {
    id: ToolId.PERCENTAGE_CALC,
    name: 'Проценты',
    description: 'Калькулятор %',
    icon: Percent,
    color: 'bg-green-600',
    iconColor: 'text-green-500'
  },
  {
    id: ToolId.KEYCODE_INFO,
    name: 'KeyCodes',
    description: 'Коды клавиш JS',
    icon: Keyboard,
    color: 'bg-blue-600',
    iconColor: 'text-blue-500'
  },
  {
    id: ToolId.CSS_GRADIENT,
    name: 'Градиент',
    description: 'CSS генератор',
    icon: Paintbrush,
    color: 'bg-pink-600',
    iconColor: 'text-pink-500'
  },
  {
    id: ToolId.TEXT_DIFF,
    name: 'Diff',
    description: 'Сравнение текстов',
    icon: GitCompare,
    color: 'bg-indigo-600',
    iconColor: 'text-indigo-500'
  }
];

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolId>(ToolId.HOME);
  const [showIntro, setShowIntro] = useState(true);

  // Check LocalStorage (permanent) instead of SessionStorage
  useEffect(() => {
    const hasSkippedIntro = localStorage.getItem('devbox_skip_intro');
    if (hasSkippedIntro === 'true') {
        setShowIntro(false);
    }
  }, []);

  const handleIntroComplete = (skipForever = false) => {
      setShowIntro(false);
      if (skipForever) {
          localStorage.setItem('devbox_skip_intro', 'true');
      }
  };

  const forceReplayIntro = () => {
      localStorage.removeItem('devbox_skip_intro');
      setShowIntro(true);
  };

  useEffect(() => {
    // Initialize Telegram WebApp if available
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.ready();
      try {
        tg.expand();
        tg.setHeaderColor('#000000'); 
        tg.setBackgroundColor('#000000');
        if (activeTool !== ToolId.HOME) {
            tg.BackButton.show();
            tg.BackButton.onClick(() => setActiveTool(ToolId.HOME));
        } else {
            tg.BackButton.hide();
        }
      } catch (e) {
        console.error('Telegram API error', e);
      }
    }
    
    return () => {
         const tg = (window as any).Telegram?.WebApp;
         if(tg) {
             tg.BackButton.offClick();
         }
    }
  }, [activeTool]);

  const renderContent = () => {
    switch (activeTool) {
      case ToolId.PASSWORD_GENERATOR: return <PasswordGenerator />;
      case ToolId.ENCODER: return <Encoder />;
      case ToolId.SPEED_TEST: return <SpeedTest />;
      case ToolId.JSON_TOOLS: return <JsonTools />;
      case ToolId.QR_GENERATOR: return <QrGenerator />;
      case ToolId.UNIT_CONVERTER: return <UnitConverter />;
      case ToolId.HASHER: return <Hasher />;
      case ToolId.UUID_GENERATOR: return <UuidGenerator />;
      case ToolId.TEXT_TOOLS: return <TextTools />;
      case ToolId.REGEX_TESTER: return <RegexTester />;
      case ToolId.COLOR_CONVERTER: return <ColorConverter />;
      case ToolId.EPOCH_CONVERTER: return <EpochConverter />;
      case ToolId.JWT_DECODER: return <JwtDecoder />;
      case ToolId.MARKDOWN_PREVIEW: return <MarkdownPreview />;
      case ToolId.URL_PARSER: return <UrlParser />;
      case ToolId.LOREM_IPSUM: return <LoremIpsum />;
      case ToolId.LIST_UTILS: return <ListUtils />;
      case ToolId.PERCENTAGE_CALC: return <PercentageCalc />;
      case ToolId.KEYCODE_INFO: return <KeycodeInfo />;
      case ToolId.CSS_GRADIENT: return <CssGradient />;
      case ToolId.TEXT_DIFF: return <TextDiff />;
      case ToolId.SYSTEM_MONITOR: return <SystemMonitor />;
      case ToolId.SQL_FORMATTER: return <SqlFormatter />;
      case ToolId.CRON_PARSER: return <CronParser />;
      case ToolId.CHMOD_CALC: return <ChmodCalc />;
      case ToolId.META_TAGS: return <MetaTags />;
      case ToolId.IMAGE_COMPRESSOR: return <ImageCompressor />;
      case ToolId.GIT_CHEATSHEET: return <GitCheatsheet />;
      case ToolId.HTTP_STATUS: return <HttpStatus />;
      case ToolId.MIME_TYPES: return <MimeTypes />;
      case ToolId.PORT_REFERENCE: return <PortReference />;
      case ToolId.CSS_SHADOW: return <CssShadow />;
      
      // New Tools
      case ToolId.POMODORO: return <PomodoroTimer />;
      case ToolId.STOPWATCH: return <Stopwatch />;
      case ToolId.ASPECT_RATIO: return <AspectRatioCalc />;
      case ToolId.BORDER_RADIUS: return <BorderRadiusGen />;
      case ToolId.BASE64_IMAGE: return <Base64Image />;
      case ToolId.CSV_JSON: return <CsvJsonConverter />;
      case ToolId.USER_AGENT: return <UserAgentParser />;
      case ToolId.SLUG_GENERATOR: return <SlugGenerator />;
      case ToolId.XML_FORMATTER: return <XmlFormatter />;
      case ToolId.TEXT_STYLER: return <TextStyler />;
      case ToolId.CURL_BUILDER: return <CurlBuilder />;
      case ToolId.ROMAN_NUMERALS: return <RomanNumerals />;
      case ToolId.PASS_STRENGTH: return <PassStrength />;
      case ToolId.RANDOM_NUMBER: return <RandomNumber />;
      case ToolId.LUHN_ALGO: return <LuhnAlgo />;

      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-in fade-in zoom-in-95 duration-500 pb-10">
            {TOOLS.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className="
                    relative overflow-hidden group
                    bg-slate-900/50 hover:bg-slate-900/70 backdrop-blur-xl border border-white/10 
                    p-6 rounded-3xl text-left transition-all duration-300 
                    hover:shadow-2xl hover:shadow-blue-900/20 
                    hover:-translate-y-2 hover:scale-[1.02]
                "
              >
                <div className={`
                    absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500
                    ${tool.color} -translate-y-1/2 translate-x-1/2
                `}></div>

                <div className={`
                    w-14 h-14 rounded-2xl bg-white/5 border border-white/5 
                    flex items-center justify-center mb-5 group-hover:scale-115 transition-transform duration-300
                    shadow-lg
                `}>
                  <tool.icon className={`${tool.iconColor}`} size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 tracking-tight">{tool.name}</h3>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">{tool.description}</p>
              </button>
            ))}
          </div>
        );
    }
  };

  const getHeaderTitle = () => {
    if (activeTool === ToolId.HOME) return 'DevBox';
    const tool = TOOLS.find(t => t.id === activeTool);
    return tool ? tool.name : 'DevBox';
  };

  return (
    <>
    {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}
    <div className={`min-h-screen pb-12 relative z-10 selection:bg-blue-500/30 transition-opacity duration-1000 ${showIntro ? 'opacity-0' : 'opacity-100'}`}>
      {/* Absolute Dark Header with Light Beam */}
      <header className="sticky top-0 z-50 bg-[#000] border-b border-white/10 shadow-lg shadow-black/50 overflow-hidden">
        
        {/* Light Beam Layer (Behind) */}
        <div className="light-beam-container">
            <div className="light-beam"></div>
        </div>

        {/* Content Layer (Front) */}
        <div className="max-w-4xl mx-auto px-4 h-20 flex items-center justify-between relative z-50">
          <div className="flex items-center gap-3">
            {activeTool !== ToolId.HOME && (
              <button 
                onClick={() => setActiveTool(ToolId.HOME)}
                className="p-2 -ml-2 text-slate-300 hover:text-white rounded-full hover:bg-white/10 transition-all active:scale-95"
              >
                <ChevronLeft size={24} />
              </button>
            )}
            <div className="flex items-center gap-3">
                {activeTool === ToolId.HOME && (
                   // New Tech Cube Logo for DevBox
                    <div className="relative w-12 h-12 group">
                         <div className="absolute inset-0 bg-blue-500 blur-md opacity-40 group-hover:opacity-60 transition-opacity"></div>
                         <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 w-full h-full text-blue-400">
                             <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="2" />
                             <path d="M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                             <path d="M15 9L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                         </svg>
                    </div>
                )}
                {/* Applied pixel font to title */}
                <h1 className={`text-xl font-bold text-white tracking-wide ${activeTool === ToolId.HOME ? "font-['Press_Start_2P'] text-lg mt-1" : ""}`}>
                {getHeaderTitle()}
                </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 pt-8">
        {renderContent()}
      </main>
      
      {/* Footer info */}
      <footer className="mt-16 text-center text-slate-500 text-sm pb-8 font-medium">
        <p className="mb-1">DevBox &copy; {new Date().getFullYear()}</p>
        <p className="text-slate-600 text-xs mb-2">Essential Tools for Developers</p>
        <button 
            onClick={forceReplayIntro}
            className="text-[10px] uppercase tracking-widest text-slate-700 hover:text-blue-500 transition-colors flex items-center justify-center gap-1 mx-auto"
        >
            <PlayCircle size={10} /> Play Intro
        </button>
      </footer>
    </div>
    </>
  );
};

export default App;