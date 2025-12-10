
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../components/ui/Card';
import { Cpu, Wifi, Info, Fingerprint, Zap, Code2, Smartphone, Globe, MousePointer2 } from 'lucide-react';

interface NetworkInfo {
    ip: string;
    city: string;
    region: string;
    country: string;
    isp: string;
    flag: string;
    success: boolean;
    message?: string;
}

export const SystemMonitor: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hardware' | 'network' | 'session'>('hardware');

  // Hardware State
  const [cores, setCores] = useState(navigator.hardwareConcurrency || 'N/A');
  const [gpuInfo, setGpuInfo] = useState<string>('Определяется...');
  const [canvasHash, setCanvasHash] = useState<string>('Вычисление...');
  const [audioHash, setAudioHash] = useState<string>('Вычисление...');
  const [browserInfo, setBrowserInfo] = useState({ name: 'Unknown', engine: 'Unknown', version: '' });
  const [apis, setApis] = useState<string[]>([]);

  // Network State
  const [network, setNetwork] = useState<NetworkInfo | null>(null);
  const [networkLoading, setNetworkLoading] = useState(true);

  // Session State
  const [sessionTime, setSessionTime] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [scrolls, setScrolls] = useState(0);
  const startTime = useRef(Date.now());

  useEffect(() => {
    // --- 1. GPU Detection ---
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
            const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                setGpuInfo(renderer);
            } else {
                setGpuInfo('WebGL Supported (Masked)');
            }
        } else {
            setGpuInfo('WebGL Not Supported');
        }
    } catch (e) {
        setGpuInfo('Error detecting GPU');
    }

    // --- 2. Canvas Fingerprint ---
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
            canvas.height = 60;
            canvas.width = 400;
            ctx.textBaseline = "top";
            ctx.font = "14px 'Arial'";
            ctx.textBaseline = "alphabetic";
            ctx.fillStyle = "#f60";
            ctx.fillRect(125, 1, 62, 20);
            ctx.fillStyle = "#069";
            ctx.fillText("DevBox Fingerprint 123", 2, 15);
            ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
            ctx.fillText("DevBox Fingerprint 123", 4, 17);
            
            const dataURI = canvas.toDataURL();
            let hash = 0;
            for (let i = 0; i < dataURI.length; i++) {
                const char = dataURI.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            setCanvasHash(Math.abs(hash).toString(16));
        }
    } catch (e) {
        setCanvasHash('Error');
    }

    // --- 3. Audio Fingerprint ---
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
            const context = new AudioContext();
            const oscillator = context.createOscillator();
            const analyser = context.createAnalyser();
            const gain = context.createGain();
            const scriptProcessor = context.createScriptProcessor(4096, 1, 1);
            
            gain.gain.value = 0; // Mute
            oscillator.type = 'triangle';
            oscillator.connect(analyser);
            analyser.connect(scriptProcessor);
            scriptProcessor.connect(context.destination);
            
            scriptProcessor.onaudioprocess = (bins) => {
                const array = new Float32Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(new Uint8Array(array.buffer));
                const fingerprint = array.length + '_' + context.sampleRate;
                setAudioHash(btoa(fingerprint).substring(0, 16));
                oscillator.stop();
                scriptProcessor.disconnect();
                context.close();
            };
            oscillator.start(0);
        } else {
            setAudioHash('Not Supported');
        }
    } catch (e) {
        setAudioHash('Blocked/Error');
    }

    // --- 4. Browser Info ---
    const ua = navigator.userAgent;
    let engine = 'Unknown';
    if (ua.includes('AppleWebKit')) engine = 'WebKit';
    if (ua.includes('Gecko') && !ua.includes('KHTML')) engine = 'Gecko';
    if (ua.includes('Trident')) engine = 'Trident';
    if (ua.includes('Chrome') || ua.includes('CriOS')) engine = 'Blink';

    let browserName = "Unknown";
    if (ua.match(/chrome|chromium|crios/i)) browserName = "Chrome";
    else if (ua.match(/firefox|fxios/i)) browserName = "Firefox";
    else if (ua.match(/safari/i)) browserName = "Safari";
    else if (ua.match(/opr\//i)) browserName = "Opera";
    else if (ua.match(/edg/i)) browserName = "Edge";

    setBrowserInfo({ name: browserName, engine, version: navigator.appVersion });

    // --- 5. APIs ---
    const detectedApis = [];
    if ('serviceWorker' in navigator) detectedApis.push('Service Workers');
    if ('bluetooth' in navigator) detectedApis.push('Web Bluetooth');
    if ('usb' in navigator) detectedApis.push('Web USB');
    if ('geolocation' in navigator) detectedApis.push('Geolocation');
    if (window.WebGLRenderingContext) detectedApis.push('WebGL');
    if (window.RTCPeerConnection) detectedApis.push('WebRTC');
    if (window.WebSocket) detectedApis.push('WebSockets');
    if ('ontouchstart' in window) detectedApis.push('Touch Events');
    setApis(detectedApis);

    // --- 6. Network Fetch ---
    fetch('https://ipwho.is/')
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setNetwork({
                    ip: data.ip,
                    city: data.city,
                    region: data.region,
                    country: data.country,
                    isp: data.connection?.isp || data.org,
                    flag: data.flag?.img || '',
                    success: true
                });
            } else {
                 setNetwork({ ip: 'Unavailable', city: '', region: '', country: '', isp: '', flag: '', success: false, message: data.message });
            }
            setNetworkLoading(false);
        })
        .catch(() => {
            setNetwork({ ip: 'Error', city: '', region: '', country: '', isp: '', flag: '', success: false });
            setNetworkLoading(false);
        });

    // --- 7. Telemetry ---
    const clickHandler = () => setClicks(prev => prev + 1);
    const scrollHandler = () => setScrolls(prev => prev + 1);
    
    window.addEventListener('click', clickHandler);
    window.addEventListener('scroll', scrollHandler);

    const timer = setInterval(() => {
        setSessionTime(Math.floor((Date.now() - startTime.current) / 1000));
    }, 1000);

    return () => {
        window.removeEventListener('click', clickHandler);
        window.removeEventListener('scroll', scrollHandler);
        clearInterval(timer);
    };

  }, []);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}м ${s}с`;
  };

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const platform = (navigator as any).userAgentData?.platform || navigator.platform;
  const connection = (navigator as any).connection;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card title="Системный монитор" className="min-h-[600px] flex flex-col">
        
        {/* Navigation Tabs */}
        <div className="flex p-1 bg-black/40 rounded-xl mb-6 backdrop-blur-sm border border-white/5">
            <button 
                onClick={() => setActiveTab('hardware')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'hardware' ? 'bg-white/10 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
                Hardware
            </button>
            <button 
                onClick={() => setActiveTab('network')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'network' ? 'bg-white/10 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
                Сеть
            </button>
            <button 
                onClick={() => setActiveTab('session')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'session' ? 'bg-white/10 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
                Сессия
            </button>
        </div>

        {/* Content Area */}
        <div className="flex-1">
            
            {/* --- HARDWARE TAB --- */}
            {activeTab === 'hardware' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    <div className="bg-indigo-900/20 border border-indigo-500/20 p-4 rounded-2xl flex gap-3">
                        <Info className="text-indigo-400 shrink-0 mt-0.5" size={20} />
                        <div className="text-sm text-indigo-200">
                            <p>Этот раздел анализирует технические возможности вашего устройства и уникальные отпечатки (fingerprints).</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-4 text-purple-400 font-bold uppercase tracking-wider text-sm">
                                <Cpu size={18} /> Ядро
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <div className="text-xs text-slate-500 mb-1">Процессор</div>
                                    <div className="text-white font-medium">{cores} ядер</div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 mb-1">GPU Renderer</div>
                                    <div className="text-xs font-mono text-white bg-black/30 p-2 rounded border border-white/5 break-words">{gpuInfo}</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-4 text-blue-400 font-bold uppercase tracking-wider text-sm">
                                <Code2 size={18} /> Браузер
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-slate-400 text-sm">Имя</span>
                                    <span className="text-white font-medium">{browserInfo.name}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-slate-400 text-sm">Движок</span>
                                    <span className="text-white font-medium">{browserInfo.engine}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:col-span-2">
                            <div className="flex items-center gap-3 mb-4 text-orange-400 font-bold uppercase tracking-wider text-sm">
                                <Fingerprint size={18} /> Fingerprints
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <div className="text-xs text-slate-500 mb-1">Canvas Hash</div>
                                    <div className="font-mono text-xs text-orange-200 bg-orange-900/20 border border-orange-500/20 p-2 rounded break-all">{canvasHash}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 mb-1">Audio Hash</div>
                                    <div className="font-mono text-xs text-orange-200 bg-orange-900/20 border border-orange-500/20 p-2 rounded break-all">{audioHash}</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:col-span-2">
                             <div className="flex items-center gap-3 mb-4 text-teal-400 font-bold uppercase tracking-wider text-sm">
                                <Zap size={18} /> API Поддержка
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {apis.map(api => (
                                    <span key={api} className="px-3 py-1 bg-teal-500/10 border border-teal-500/20 rounded-full text-teal-200 text-xs font-medium">
                                        {api}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- NETWORK TAB --- */}
            {activeTab === 'network' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                     <div className="bg-emerald-900/20 border border-emerald-500/20 p-4 rounded-2xl flex gap-3">
                        <Globe className="text-emerald-400 shrink-0 mt-0.5" size={20} />
                        <div className="text-sm text-emerald-200">
                            <p>Данные о вашем текущем подключении, IP адресе и геолокации провайдера.</p>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-6 text-green-400 font-bold uppercase text-xs tracking-wider">
                            <Wifi size={16} /> Соединение
                        </div>
                        
                        <div className="text-center py-6 border-b border-white/5 mb-6">
                             <div className="text-3xl md:text-4xl font-mono font-bold text-white mb-2 break-all">{networkLoading ? '...' : network?.ip}</div>
                             <div className="text-sm text-slate-500">Ваш публичный IP</div>
                        </div>

                        {networkLoading ? (
                            <div className="text-center text-slate-500 text-sm">Сканирование сети...</div>
                        ) : network?.success ? (
                             <ul className="space-y-4 text-sm">
                                <li className="flex justify-between items-center">
                                    <span className="text-slate-400">Локация</span>
                                    <span className="text-white font-medium flex items-center gap-2 text-right">
                                        {network.flag && <img src={network.flag} alt="flag" className="w-5 rounded-sm" />}
                                        {network.country}, {network.city}
                                    </span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="text-slate-400">Провайдер</span>
                                    <span className="text-white font-medium text-right max-w-[200px]">{network.isp}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="text-slate-400">Тип сети</span>
                                    <span className="text-white font-medium">{connection?.effectiveType?.toUpperCase() || 'UNKNOWN'}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="text-slate-400">Скорость (Link)</span>
                                    <span className="text-white font-medium">~{connection?.downlink || '?'} Mbps</span>
                                </li>
                            </ul>
                        ) : (
                            <div className="text-red-400 text-center">Ошибка загрузки данных сети</div>
                        )}
                    </div>
                </div>
            )}

            {/* --- SESSION TAB --- */}
            {activeTab === 'session' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                     <div className="bg-orange-900/20 border border-orange-500/20 p-4 rounded-2xl flex gap-3">
                        <MousePointer2 className="text-orange-400 shrink-0 mt-0.5" size={20} />
                        <div className="text-sm text-orange-200">
                            <p>Телеметрия вашего взаимодействия с этой страницей в реальном времени.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                         <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                            <div className="text-3xl font-bold text-white mb-1">{clicks}</div>
                            <div className="text-[10px] text-slate-400 uppercase font-bold">Кликов</div>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                            <div className="text-3xl font-bold text-white mb-1">{scrolls}</div>
                            <div className="text-[10px] text-slate-400 uppercase font-bold">Скроллов</div>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                            <div className="text-2xl font-bold text-white mb-1 mt-1">{formatTime(sessionTime)}</div>
                            <div className="text-[10px] text-slate-400 uppercase font-bold">Время</div>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-4 text-pink-400 font-bold uppercase text-xs tracking-wider">
                            <Smartphone size={16} /> Окружение
                        </div>
                         <ul className="space-y-3 text-sm">
                            <li className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-slate-400">Устройство</span>
                                <span className="text-white font-medium">{isMobile ? 'Mobile' : 'Desktop'}</span>
                            </li>
                            <li className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-slate-400">ОС</span>
                                <span className="text-white font-medium">{platform}</span>
                            </li>
                            <li className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-slate-400">Разрешение</span>
                                <span className="text-white font-medium">{window.screen.width} x {window.screen.height}</span>
                            </li>
                            <li className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-slate-400">DPI</span>
                                <span className="text-white font-medium">{window.devicePixelRatio}x</span>
                            </li>
                             <li className="flex justify-between pt-1">
                                <span className="text-slate-400">Timezone</span>
                                <span className="text-white font-medium text-right">{Intl.DateTimeFormat().resolvedOptions().timeZone}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            )}

        </div>
      </Card>
    </div>
  );
};