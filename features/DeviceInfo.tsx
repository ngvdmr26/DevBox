import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../components/ui/Card';
import { Smartphone, Globe, Monitor, Wifi, Info, MousePointer2, Clock, MapPin, Navigation, Keyboard } from 'lucide-react';

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

export const DeviceInfo: React.FC = () => {
  const [network, setNetwork] = useState<NetworkInfo | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Telemetry
  const [sessionTime, setSessionTime] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [scrolls, setScrolls] = useState(0);
  const startTime = useRef(Date.now());

  useEffect(() => {
    // 1. Fetch IP & Location Data (using ipwho.is for detailed non-auth data)
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
            setLoading(false);
        })
        .catch(() => {
            setNetwork({ ip: 'Error', city: '', region: '', country: '', isp: '', flag: '', success: false });
            setLoading(false);
        });

    // 2. Telemetry Listeners
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

  // Format Helpers
  const formatTime = (sec: number) => {
      const m = Math.floor(sec / 60);
      const s = sec % 60;
      return `${m}м ${s}с`;
  };

  // Device Logic
  const ua = navigator.userAgent;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const platform = (navigator as any).userAgentData?.platform || navigator.platform;
  const connection = (navigator as any).connection;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Card title="Данные устройства и сессии">
        
        <div className="bg-fuchsia-900/20 border border-fuchsia-500/20 p-4 rounded-2xl mb-6 flex gap-3 backdrop-blur-md">
           <Info className="text-fuchsia-400 shrink-0 mt-0.5" size={20} />
           <div className="text-sm text-fuchsia-200">
             <p className="font-bold mb-1">Цифровой след</p>
             <p>Мы анализируем данные, которые ваш браузер отправляет автоматически, а также отслеживаем взаимодействие со страницей (клики, время) в реальном времени.</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 1. Device Tech */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4 text-blue-400 font-bold uppercase text-xs tracking-wider">
                    <Smartphone size={16} /> Технические данные
                </div>
                <ul className="space-y-3 text-sm">
                    <li className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-slate-400">Тип устройства</span>
                        <span className="text-white font-medium">{isMobile ? 'Mobile / Tablet' : 'Desktop'}</span>
                    </li>
                    <li className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-slate-400">Платформа (ОС)</span>
                        <span className="text-white font-medium">{platform}</span>
                    </li>
                    <li className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-slate-400">Разрешение</span>
                        <span className="text-white font-medium">{window.screen.width} x {window.screen.height}</span>
                    </li>
                    <li className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-slate-400">DPI (Scale)</span>
                        <span className="text-white font-medium">{window.devicePixelRatio}x</span>
                    </li>
                    <li className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-slate-400">Язык</span>
                        <span className="text-white font-medium">{navigator.language}</span>
                    </li>
                    <li className="flex justify-between pt-1">
                        <span className="text-slate-400">Timezone</span>
                        <span className="text-white font-medium">{Intl.DateTimeFormat().resolvedOptions().timeZone}</span>
                    </li>
                </ul>
            </div>

            {/* 2. Connection */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4 text-green-400 font-bold uppercase text-xs tracking-wider">
                    <Wifi size={16} /> Соединение и Локация
                </div>
                <div className="space-y-4">
                    <div className="text-center py-2">
                         <div className="text-2xl font-mono font-bold text-white mb-1">{loading ? '...' : network?.ip}</div>
                         <div className="text-xs text-slate-500">Ваш публичный IP</div>
                    </div>
                    {loading ? (
                        <div className="text-center text-slate-500 text-sm">Определение локации...</div>
                    ) : network?.success ? (
                        <ul className="space-y-3 text-sm">
                            <li className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span className="text-slate-400">Страна</span>
                                <span className="text-white font-medium flex items-center gap-2">
                                    {network.flag && <img src={network.flag} alt="flag" className="w-5 rounded-sm" />}
                                    {network.country}
                                </span>
                            </li>
                            <li className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-slate-400">Город</span>
                                <span className="text-white font-medium">{network.city}, {network.region}</span>
                            </li>
                            <li className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-slate-400">Провайдер (ISP)</span>
                                <span className="text-white font-medium text-right max-w-[150px] truncate" title={network.isp}>{network.isp}</span>
                            </li>
                            <li className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-slate-400">Тип сети</span>
                                <span className="text-white font-medium">{connection?.effectiveType?.toUpperCase() || 'Unknown'}</span>
                            </li>
                            <li className="flex justify-between pt-1">
                                <span className="text-slate-400">Скорость (Downlink)</span>
                                <span className="text-white font-medium">~{connection?.downlink || '?'} Mbps</span>
                            </li>
                        </ul>
                    ) : (
                        <div className="text-red-400 text-xs text-center bg-red-500/10 p-2 rounded">Не удалось определить локацию</div>
                    )}
                </div>
            </div>

            {/* 3. Interaction Telemetry */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 relative overflow-hidden">
                <div className="flex items-center gap-2 mb-4 text-orange-400 font-bold uppercase text-xs tracking-wider">
                    <MousePointer2 size={16} /> Активность сессии
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-black/20 rounded-xl p-3">
                        <div className="text-2xl font-bold text-white mb-1">{clicks}</div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Кликов</div>
                    </div>
                    <div className="bg-black/20 rounded-xl p-3">
                        <div className="text-2xl font-bold text-white mb-1">{scrolls}</div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Скроллов</div>
                    </div>
                    <div className="bg-black/20 rounded-xl p-3">
                        <div className="text-xl font-bold text-white mb-1 mt-1">{formatTime(sessionTime)}</div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Время</div>
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/5 text-xs">
                     <div className="flex justify-between mb-1">
                        <span className="text-slate-500">Источник (Referrer):</span>
                        <span className="text-white truncate max-w-[150px]">{document.referrer || 'Direct / None'}</span>
                     </div>
                     <div className="flex justify-between">
                        <span className="text-slate-500">Локальное время:</span>
                        <span className="text-white">{new Date().toLocaleTimeString()}</span>
                     </div>
                </div>
            </div>

             {/* 4. Browser Data */}
             <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4 text-purple-400 font-bold uppercase text-xs tracking-wider">
                    <Globe size={16} /> Браузер
                </div>
                <ul className="space-y-3 text-sm">
                    <li className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-slate-400">Cookies</span>
                        <span className={navigator.cookieEnabled ? "text-green-400" : "text-red-400"}>
                            {navigator.cookieEnabled ? 'Включены' : 'Отключены'}
                        </span>
                    </li>
                    <li className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-slate-400">Do Not Track</span>
                        <span className="text-white font-medium">{navigator.doNotTrack || 'Unspecified'}</span>
                    </li>
                    <li className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-slate-400">History Length</span>
                        <span className="text-white font-medium">{window.history.length} стр.</span>
                    </li>
                    <li className="flex justify-between pt-1">
                         <span className="text-slate-400">User Agent (кратко)</span>
                         <span className="text-white font-medium truncate max-w-[150px]">{isMobile ? 'Mobile Browser' : 'Desktop Browser'}</span>
                    </li>
                </ul>
            </div>

        </div>
      </Card>
    </div>
  );
};