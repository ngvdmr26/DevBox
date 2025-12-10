
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Wifi, ArrowDown, ArrowUp, Activity, Play, RotateCcw } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

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
    // bytes * 8 = bits, ms / 1000 = seconds, / 1000000 = Mbps
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
        await fetch('https://1.1.1.1/cdn-cgi/trace', { signal, cache: 'no-store', mode: 'cors' });
        const end = performance.now();
        pings.push(end - start);
      } catch (e) { /* ignore */ }
      setProgress((i / count) * 10);
    }

    if (pings.length > 0) {
      const min = Math.min(...pings);
      // Jitter
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
    const STREAMS = 4; 
    const CHUNK_SIZE = 25000000; // 25MB

    const fetchStream = async () => {
        while (performance.now() - START_TIME < DURATION) {
            if (signal.aborted) break;
            try {
                const res = await fetch(`${CF_DOWN}${CHUNK_SIZE}`, { signal, cache: 'no-store' });
                const reader = res.body?.getReader();
                if (!reader) break;
                while (true) {
                    const { done, value } = await reader.read();
                    if (done || signal.aborted) break;
                    if (value) {
                        totalBytes += value.byteLength;
                        if (Math.random() > 0.85) { // update UI occasionally
                            const now = performance.now();
                            const totalTime = now - START_TIME;
                            const speed = calculateSpeed(totalBytes, totalTime);
                            setCurrentSpeed(speed);
                            setProgress(10 + ((totalTime / DURATION) * 45));
                            setChartData(prev => [...prev.slice(-49), { time: parseFloat((totalTime/1000).toFixed(1)), value: parseFloat(speed.toFixed(2)) }]);
                        }
                    }
                }
            } catch (e) { break; }
        }
    };

    await Promise.all(Array(STREAMS).fill(0).map(fetchStream));
    const totalTime = performance.now() - START_TIME;
    setDownload(parseFloat(calculateSpeed(totalBytes, totalTime).toFixed(2)));
    setChartData([]); // Clear for upload
  };

  const runUploadTest = async (signal: AbortSignal) => {
    setPhase('upload');
    const DURATION = 8000; 
    const START_TIME = performance.now();
    let totalBytes = 0;
    const payload = new Uint8Array(1024 * 1024).fill(Math.random() * 255); 
    const blob = new Blob([payload]);

    const uploadLoop = async () => {
         while (performance.now() - START_TIME < DURATION) {
             if (signal.aborted) break;
             try {
                 await fetch(CF_UP, { method: 'POST', body: blob, signal, mode: 'cors' });
                 totalBytes += blob.size;
                 const now = performance.now();
                 const totalTime = now - START_TIME;
                 const speed = calculateSpeed(totalBytes, totalTime);
                 setCurrentSpeed(speed);
                 setProgress(55 + ((totalTime / DURATION) * 45));
                 setChartData(prev => [...prev.slice(-49), { time: parseFloat((totalTime/1000).toFixed(1)), value: parseFloat(speed.toFixed(2)) }]);
             } catch (e) { break; }
         }
    };
    await Promise.all([uploadLoop(), uploadLoop()]); // 2 streams
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
    } catch (e) { setPhase('idle'); }
  };

  // --- Visual Components ---

  const SpeedGauge = ({ value }: { value: number }) => {
      // Dynamic max scale logic for visual pleasure
      const displayMax = value > 500 ? 1000 : (value > 100 ? 500 : 100);
      const percent = Math.min(value / displayMax, 1);
      // SVG Arc Math: Semi-circle is 180 degrees.
      // Circumference (C) = PI * R. Length of semi-circle arc = PI * R.
      // R = 80. Length = 251.2
      const radius = 80;
      const arcLength = Math.PI * radius; 
      const dashOffset = arcLength - (arcLength * percent);

      return (
          <div className="relative w-72 h-40 mx-auto flex justify-center items-end overflow-visible group">
              {/* Glow Effect Background */}
              <div className="absolute inset-0 bg-cyan-500/10 blur-3xl rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-1000"></div>
              
              <svg className="w-full h-full overflow-visible" viewBox="0 0 200 110">
                  <defs>
                      <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#22d3ee" /> {/* cyan-400 */}
                          <stop offset="50%" stopColor="#3b82f6" /> {/* blue-500 */}
                          <stop offset="100%" stopColor="#a855f7" /> {/* purple-500 */}
                      </linearGradient>
                      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                          <feMerge>
                              <feMergeNode in="coloredBlur" />
                              <feMergeNode in="SourceGraphic" />
                          </feMerge>
                      </filter>
                  </defs>

                  {/* Track */}
                  <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#1e293b" strokeWidth="16" strokeLinecap="round" />
                  
                  {/* Progress Arc */}
                  <path 
                    d="M 20 100 A 80 80 0 0 1 180 100" 
                    fill="none" 
                    stroke="url(#gaugeGradient)" 
                    strokeWidth="16" 
                    strokeLinecap="round"
                    strokeDasharray={arcLength}
                    strokeDashoffset={dashOffset}
                    className="transition-[stroke-dashoffset] duration-300 ease-out"
                    filter="url(#glow)"
                  />

                  {/* Ticks */}
                  <text x="20" y="110" textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="bold">0</text>
                  <text x="180" y="110" textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="bold">{displayMax}</text>
              </svg>

              {/* Center Text overlay */}
              <div className="absolute bottom-0 text-center mb-2">
                  <div className="text-5xl font-bold text-white font-mono tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                      {value.toFixed(1)}
                  </div>
                  <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Mbps</div>
              </div>
          </div>
      );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card title="Speed Test" className="overflow-visible min-h-[600px] flex flex-col relative">
        
        {/* Connection Status Icon */}
        <div className="absolute top-6 right-8 text-xs text-slate-500 flex items-center gap-2">
             <div className={`w-2 h-2 rounded-full ${phase === 'idle' || phase === 'complete' ? 'bg-slate-500' : 'bg-green-500 animate-pulse'}`}></div>
             {phase === 'idle' ? 'Ready' : 'Testing...'}
             <Wifi size={14} />
        </div>

        {/* --- Main Gauge Section --- */}
        <div className="flex-1 flex flex-col items-center justify-center py-10">
            <SpeedGauge value={currentSpeed} />
            
            <div className="mt-12 w-full flex justify-center">
                {phase === 'idle' || phase === 'complete' ? (
                     <button 
                        onClick={startTest} 
                        className="group relative w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_40px_rgba(34,211,238,0.2)]"
                     >
                        <div className="absolute inset-0 rounded-full border border-cyan-500/30 opacity-0 group-hover:opacity-100 transition-opacity animate-ping"></div>
                        {phase === 'complete' ? (
                            <RotateCcw size={32} className="text-cyan-400 group-hover:rotate-180 transition-transform duration-500" />
                        ) : (
                            <Play size={32} className="text-cyan-400 fill-cyan-400/20 ml-1" />
                        )}
                     </button>
                ) : (
                    <div className="text-center h-20 flex flex-col justify-center">
                         <div className="text-cyan-400 font-bold uppercase tracking-[0.2em] animate-pulse text-sm mb-3">
                             {phase === 'ping' && 'Measuring Latency'}
                             {phase === 'download' && 'Downloading Data'}
                             {phase === 'upload' && 'Uploading Data'}
                         </div>
                         <Button onClick={reset} variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs px-6 py-1 h-auto rounded-full border border-red-500/20">
                            Stop Test
                         </Button>
                    </div>
                )}
            </div>
        </div>

        {/* --- Stats Grid --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard 
                label="Ping" 
                value={ping} 
                unit="ms" 
                icon={<Activity size={16} />} 
                color="text-yellow-400" 
                active={phase === 'ping'}
            />
            <StatCard 
                label="Jitter" 
                value={jitter} 
                unit="ms" 
                icon={<Activity size={16} />} 
                color="text-yellow-400" 
                active={phase === 'ping'}
            />
            <StatCard 
                label="Download" 
                value={download} 
                unit="Mbps" 
                icon={<ArrowDown size={16} />} 
                color="text-cyan-400" 
                active={phase === 'download'}
            />
            <StatCard 
                label="Upload" 
                value={upload} 
                unit="Mbps" 
                icon={<ArrowUp size={16} />} 
                color="text-purple-400" 
                active={phase === 'upload'}
            />
        </div>

        {/* --- Realtime Chart --- */}
        <div className={`h-40 w-full transition-all duration-500 ${chartData.length > 0 ? 'opacity-100' : 'opacity-0 scale-y-0 h-0'}`}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={phase === 'upload' ? '#a855f7' : '#22d3ee'} stopOpacity={0.2}/>
                            <stop offset="95%" stopColor={phase === 'upload' ? '#a855f7' : '#22d3ee'} stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis hide />
                    <YAxis hide domain={[0, 'auto']} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                        formatter={(value: number) => [`${Number(value).toFixed(2)} Mbps`, 'Speed']}
                        labelFormatter={() => ''}
                    />
                    <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke={phase === 'upload' ? '#a855f7' : '#22d3ee'} 
                        fill="url(#chartGradient)" 
                        strokeWidth={2}
                        isAnimationActive={false}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>

      </Card>
    </div>
  );
};

const StatCard = ({ label, value, unit, icon, color, active }: any) => (
    <div className={`
        relative bg-white/5 border rounded-2xl p-4 transition-all duration-300 overflow-hidden
        ${active ? 'border-white/20 bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]' : 'border-white/5'}
    `}>
        {active && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>}
        
        <div className={`flex items-center gap-2 ${color} text-xs font-bold uppercase mb-2`}>
            {icon} {label}
        </div>
        <div className="flex items-baseline gap-1">
            <span className={`text-2xl md:text-3xl font-mono font-bold text-white ${!value && 'opacity-50'}`}>
                {value !== null ? value : '-'}
            </span>
            <span className="text-xs text-slate-500 font-bold">{unit}</span>
        </div>
    </div>
);
