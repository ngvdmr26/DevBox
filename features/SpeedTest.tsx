
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Wifi, Play, RotateCcw, ArrowDown, ArrowUp, Activity, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';

type TestPhase = 'idle' | 'ping' | 'download' | 'upload' | 'complete';

interface SpeedData {
  time: number;
  value: number;
}

// Cloudflare Speedtest Endpoints (Reliable & Fast globally)
const CF_DOWN = 'https://speed.cloudflare.com/__down?bytes=';
const CF_UP = 'https://speed.cloudflare.com/__up';

export const SpeedTest: React.FC = () => {
  const [phase, setPhase] = useState<TestPhase>('idle');
  const [currentSpeed, setCurrentSpeed] = useState(0); // Mbps
  const [progress, setProgress] = useState(0); // 0-100 total progress

  // Results
  const [ping, setPing] = useState<number | null>(null);
  const [jitter, setJitter] = useState<number | null>(null);
  const [download, setDownload] = useState<number | null>(null);
  const [upload, setUpload] = useState<number | null>(null);

  // Chart
  const [chartData, setChartData] = useState<SpeedData[]>([]);
  
  const abortRef = useRef<AbortController | null>(null);

  // --- Helpers ---

  const reset = () => {
    setPhase('idle');
    setCurrentSpeed(0);
    setProgress(0);
    setPing(null);
    setJitter(null);
    setDownload(null);
    setUpload(null);
    setChartData([]);
    if (abortRef.current) abortRef.current.abort();
  };

  const calculateSpeed = (bytes: number, ms: number) => {
    // bytes * 8 = bits
    // ms / 1000 = seconds
    // bits / seconds = bps
    // bps / 1000000 = Mbps
    return (bytes * 8) / (ms / 1000) / 1000000;
  };

  // --- Logic ---

  const runPingTest = async (signal: AbortSignal) => {
    setPhase('ping');
    const pings: number[] = [];
    const count = 10;

    for (let i = 0; i < count; i++) {
      if (signal.aborted) return;
      const start = performance.now();
      try {
        // Fetch tiny file
        await fetch('https://1.1.1.1/cdn-cgi/trace', { signal, cache: 'no-store', mode: 'cors' });
        const end = performance.now();
        pings.push(end - start);
      } catch (e) {
        // Ignore single failures
      }
      setProgress((i / count) * 10); // First 10% of progress
    }

    if (pings.length > 0) {
      const min = Math.min(...pings);
      const avg = pings.reduce((a, b) => a + b, 0) / pings.length;
      
      // Calculate Jitter (average deviation)
      let jitterSum = 0;
      for (let i = 0; i < pings.length - 1; i++) {
        jitterSum += Math.abs(pings[i] - pings[i + 1]);
      }
      
      setPing(Math.round(min));
      setJitter(Math.round(jitterSum / (pings.length - 1)));
    }
  };

  const runDownloadTest = async (signal: AbortSignal) => {
    setPhase('download');
    const DURATION = 10000; // 10s
    const START_TIME = performance.now();
    let totalBytes = 0;
    
    // Parallel streams for max saturation
    const STREAMS = 4; 
    const CHUNK_SIZE = 25000000; // 25MB chunks

    const fetchStream = async () => {
        while (performance.now() - START_TIME < DURATION) {
            if (signal.aborted) break;
            const chunkStart = performance.now();
            try {
                const res = await fetch(`${CF_DOWN}${CHUNK_SIZE}`, { signal, cache: 'no-store' });
                const reader = res.body?.getReader();
                if (!reader) break;

                while (true) {
                    const { done, value } = await reader.read();
                    if (done || signal.aborted) break;
                    if (value) {
                        totalBytes += value.byteLength;
                        
                        // Update UI periodically, not every chunk to save render cycles
                        if (Math.random() > 0.8) {
                            const now = performance.now();
                            const totalTime = now - START_TIME;
                            const speed = calculateSpeed(totalBytes, totalTime);
                            setCurrentSpeed(speed);
                            
                            const percent = Math.min(100, (totalTime / DURATION) * 100);
                            setProgress(10 + (percent * 0.45)); // 10% -> 55%

                            setChartData(prev => {
                                const newData = [...prev, { time: parseFloat((totalTime/1000).toFixed(1)), value: speed }];
                                // Keep chart performant
                                if (newData.length > 50) return newData.slice(newData.length - 50);
                                return newData;
                            });
                        }
                    }
                }
            } catch (e) {
                break;
            }
        }
    };

    await Promise.all(Array(STREAMS).fill(0).map(fetchStream));
    
    // Final Calculation
    const totalTime = performance.now() - START_TIME;
    setDownload(parseFloat(calculateSpeed(totalBytes, totalTime).toFixed(2)));
    setChartData([]); // Clear chart for next phase
  };

  const runUploadTest = async (signal: AbortSignal) => {
    setPhase('upload');
    const DURATION = 8000; // 8s upload
    const START_TIME = performance.now();
    let totalBytes = 0;
    
    // Random data blob (1MB)
    const payload = new Uint8Array(1024 * 1024).fill(Math.random() * 255); 
    const blob = new Blob([payload]);

    const uploadLoop = async () => {
         while (performance.now() - START_TIME < DURATION) {
             if (signal.aborted) break;
             try {
                 const reqStart = performance.now();
                 await fetch(CF_UP, {
                     method: 'POST',
                     body: blob,
                     signal,
                     mode: 'cors'
                 });
                 totalBytes += blob.size;
                 
                 const now = performance.now();
                 const totalTime = now - START_TIME;
                 const speed = calculateSpeed(totalBytes, totalTime);
                 setCurrentSpeed(speed);

                 const percent = Math.min(100, (totalTime / DURATION) * 100);
                 setProgress(55 + (percent * 0.45)); // 55% -> 100%

                 setChartData(prev => {
                    const newData = [...prev, { time: parseFloat((totalTime/1000).toFixed(1)), value: speed }];
                    if (newData.length > 50) return newData.slice(newData.length - 50);
                    return newData;
                 });
             } catch (e) {
                 // Upload failed or blocked
                 break;
             }
         }
    };

    // 2 parallel upload streams
    await Promise.all([uploadLoop(), uploadLoop()]);

    const totalTime = performance.now() - START_TIME;
    setUpload(parseFloat(calculateSpeed(totalBytes, totalTime).toFixed(2)));
  };

  const startTest = async () => {
    reset();
    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;

    try {
        await runPingTest(signal);
        if (signal.aborted) return;
        
        await runDownloadTest(signal);
        if (signal.aborted) return;

        await runUploadTest(signal);
        if (signal.aborted) return;

        setPhase('complete');
        setCurrentSpeed(0);
        setProgress(100);
    } catch (e) {
        console.error(e);
        setPhase('idle');
    }
  };

  // --- Gauge Component ---
  const SpeedGauge = ({ value, max = 100 }: { value: number, max?: number }) => {
      // Scale dynamic max for better visual
      const displayMax = value > 100 ? 500 : (value > 500 ? 1000 : 100);
      const angle = 180 * (Math.min(value, displayMax) / displayMax); // 0 to 180 degrees
      
      return (
          <div className="relative w-64 h-32 mx-auto overflow-hidden">
              {/* Background Arc */}
              <div className="absolute top-0 left-0 w-full h-64 rounded-full border-[12px] border-slate-800 box-border"></div>
              
              {/* Active Arc (Using conic gradient and mask to simulate arc progress is complex, using rotation wrapper instead) */}
              <div 
                className="absolute top-0 left-0 w-full h-64 rounded-full border-[12px] border-transparent border-t-cyan-500 border-r-cyan-500 transition-transform duration-300 ease-out"
                style={{ 
                    transform: `rotate(${angle - 135}deg)`, // Start at -135 (left bottom)
                    // This is a simplified CSS hack for gauge. For perfect arc, SVG is better.
                    // Let's switch to SVG below for precision.
                 }}
              ></div>
              
              {/* SVG Implementation for precision */}
              <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 200 110">
                  <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" />
                  <path 
                    d="M 20 100 A 80 80 0 0 1 180 100" 
                    fill="none" 
                    stroke="url(#gradient)" 
                    strokeWidth="12" 
                    strokeLinecap="round"
                    strokeDasharray="251.2" // Circumference of semi-circle
                    strokeDashoffset={251.2 - (251.2 * (value / displayMax))}
                    className="transition-[stroke-dashoffset] duration-300 ease-linear"
                  />
                  <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#22d3ee" />
                          <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                  </defs>
                  
                  {/* Needle Center Text */}
                  <text x="100" y="85" textAnchor="middle" fill="white" fontSize="28" fontWeight="bold" className="font-mono">
                      {value.toFixed(1)}
                  </text>
                  <text x="100" y="105" textAnchor="middle" fill="#94a3b8" fontSize="10">
                      Mbps
                  </text>
              </svg>
          </div>
      );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card title="Тест скорости сети">
        
        {/* Top Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-slate-400 text-xs font-bold uppercase mb-1">
                    <Activity size={14} /> Ping
                </div>
                <div className="text-xl md:text-2xl font-mono text-white">
                    {ping !== null ? ping : '--'} <span className="text-sm text-slate-500">ms</span>
                </div>
            </div>
             <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-slate-400 text-xs font-bold uppercase mb-1">
                    <Activity size={14} /> Jitter
                </div>
                <div className="text-xl md:text-2xl font-mono text-white">
                    {jitter !== null ? jitter : '--'} <span className="text-sm text-slate-500">ms</span>
                </div>
            </div>
             <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-green-400 text-xs font-bold uppercase mb-1">
                    <ArrowDown size={14} /> Download
                </div>
                <div className="text-xl md:text-2xl font-mono text-white">
                    {download !== null ? download : '--'} <span className="text-sm text-slate-500">Mbps</span>
                </div>
            </div>
             <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-purple-400 text-xs font-bold uppercase mb-1">
                    <ArrowUp size={14} /> Upload
                </div>
                <div className="text-xl md:text-2xl font-mono text-white">
                    {upload !== null ? upload : '--'} <span className="text-sm text-slate-500">Mbps</span>
                </div>
            </div>
        </div>

        {/* Main Gauge Area */}
        <div className="flex flex-col items-center justify-center py-8 relative">
            
            <SpeedGauge value={currentSpeed} />
            
            <div className="mt-8">
                {phase === 'idle' || phase === 'complete' ? (
                     <Button 
                        onClick={startTest} 
                        className="px-12 py-6 text-xl rounded-full shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:shadow-[0_0_50px_rgba(34,211,238,0.5)] border border-cyan-500/50"
                     >
                        {phase === 'complete' ? 'Заново' : 'Начать'}
                     </Button>
                ) : (
                    <div className="text-center">
                         <div className="text-cyan-400 font-bold uppercase tracking-widest animate-pulse mb-4">
                             {phase === 'ping' && 'Измерение пинга...'}
                             {phase === 'download' && 'Скачивание...'}
                             {phase === 'upload' && 'Загрузка...'}
                         </div>
                         <Button onClick={reset} variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                            Отмена
                         </Button>
                    </div>
                )}
            </div>
        </div>

        {/* Realtime Chart */}
        {(phase === 'download' || phase === 'upload' || phase === 'complete') && chartData.length > 0 && (
            <div className="mt-8 h-48 w-full bg-black/20 rounded-xl border border-white/5 p-4 animate-in fade-in slide-in-from-bottom-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={phase === 'upload' ? '#a855f7' : '#22d3ee'} stopOpacity={0.3}/>
                                <stop offset="95%" stopColor={phase === 'upload' ? '#a855f7' : '#22d3ee'} stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis hide />
                        <YAxis 
                            orientation="right" 
                            tick={{fontSize: 10, fill: '#64748b'}} 
                            axisLine={false} 
                            tickLine={false}
                            domain={[0, 'auto']}
                        />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: '#0f172a', 
                                border: '1px solid rgba(255,255,255,0.1)', 
                                borderRadius: '8px',
                                color: '#fff'
                            }}
                            itemStyle={{ color: '#fff' }}
                            formatter={(value: number) => [`${value} Mbps`, 'Speed']}
                            labelFormatter={() => ''}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke={phase === 'upload' ? '#a855f7' : '#22d3ee'} 
                            fillOpacity={1} 
                            fill="url(#colorSpeed)" 
                            strokeWidth={2}
                            isAnimationActive={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        )}

        <div className="mt-6 flex gap-3 text-xs text-slate-500 items-center justify-center">
             <Wifi size={14} />
             <span>Server: Cloudflare Global CDN</span>
        </div>

      </Card>
    </div>
  );
};
