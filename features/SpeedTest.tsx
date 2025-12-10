import React, { useState, useRef } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Wifi, Download, Play, RotateCcw, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface DataPoint {
  time: number;
  speed: number;
}

export const SpeedTest: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [chartData, setChartData] = useState<DataPoint[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  const runTest = async () => {
    setIsRunning(true);
    setSpeed(null);
    setProgress(0);
    setChartData([]);
    abortControllerRef.current = new AbortController();

    const startTime = Date.now();
    let downloadedBytes = 0;
    const testDuration = 10000; 
    const url = `https://picsum.photos/2000/2000?random=${Date.now()}`;
    const dataPoints: DataPoint[] = [];

    try {
      while (Date.now() - startTime < testDuration) {
        const chunkStartTime = Date.now();
        const fetchUrl = `${url}&t=${Date.now()}`;
        
        const response = await fetch(fetchUrl, { 
          signal: abortControllerRef.current.signal,
          cache: 'no-store'
        });

        const blob = await response.blob();
        const chunkSize = blob.size;
        downloadedBytes += chunkSize;

        const currentTime = Date.now();
        const duration = (currentTime - startTime) / 1000;
        const chunkDuration = (currentTime - chunkStartTime) / 1000;

        const instantSpeed = (chunkSize * 8) / (chunkDuration * 1000 * 1000); 
        const avgSpeedMbps = (downloadedBytes * 8) / (duration * 1000 * 1000);

        dataPoints.push({
            time: Math.round(duration * 10) / 10,
            speed: parseFloat(instantSpeed.toFixed(2))
        });
        setChartData([...dataPoints]);
        setSpeed(parseFloat(avgSpeedMbps.toFixed(2)));
        setProgress(Math.min(100, (duration * 1000 / testDuration) * 100));

        if (abortControllerRef.current.signal.aborted) break;
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error("Speed test error:", error);
      }
    } finally {
      setIsRunning(false);
      setProgress(100);
      abortControllerRef.current = null;
    }
  };

  const cancelTest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsRunning(false);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Card className="text-center py-12">
        {/* Info Block */}
        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl mb-10 flex gap-3 backdrop-blur-md text-left">
           <Info className="text-amber-300 shrink-0 mt-0.5" size={20} />
           <div className="text-sm text-amber-100">
             <p className="font-bold mb-1">Как работает тест?</p>
             <p>Мы скачиваем тестовые данные в браузере и измеряем время загрузки. Результат показывается в Мбит/с (Мегабиты в секунду). 100 Мбит/с = 12.5 МБ/с.</p>
           </div>
        </div>

        <div className="mb-10 relative inline-block">
            <div className={`absolute inset-0 bg-blue-500 blur-3xl opacity-40 rounded-full transition-all duration-1000 ${isRunning ? 'scale-150 opacity-60' : 'scale-100'}`}></div>
            <div className="relative z-10 w-24 h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-2xl mx-auto">
                 <Wifi size={40} className={`text-white ${isRunning ? 'animate-pulse' : ''}`} />
            </div>
        </div>
        
        <div className="mb-8">
            <h2 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 mb-2 font-[SF Pro Display]">
                {speed !== null ? speed : '--'} 
            </h2>
            <p className="text-slate-400 text-lg">Мбит/с</p>
        </div>

        <div className="flex justify-center gap-4">
            {!isRunning ? (
                <Button onClick={runTest} className="px-10 py-4 text-lg rounded-full">
                    {speed !== null ? <RotateCcw className="mr-2" /> : <Play className="mr-2" />}
                    {speed !== null ? 'Заново' : 'Начать'}
                </Button>
            ) : (
                <Button onClick={cancelTest} variant="danger" className="px-10 py-4 text-lg rounded-full">
                    Остановить
                </Button>
            )}
        </div>

        {isRunning && (
            <div className="mt-10 max-w-xs mx-auto">
                <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden backdrop-blur-sm">
                    <div 
                        className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-300" 
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
        )}
      </Card>

      {chartData.length > 0 && (
          <Card title="График скорости" className="backdrop-blur-xl bg-black/40">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                        <XAxis 
                            dataKey="time" 
                            stroke="#64748b" 
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <YAxis 
                            stroke="#64748b" 
                            tickLine={false}
                            axisLine={false}
                            dx={-10}
                        />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: 'rgba(15, 23, 42, 0.8)', 
                                borderColor: 'rgba(255,255,255,0.1)', 
                                color: '#f1f5f9',
                                backdropFilter: 'blur(8px)',
                                borderRadius: '12px'
                            }}
                            itemStyle={{ color: '#60a5fa' }}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="speed" 
                            stroke="#3b82f6" 
                            strokeWidth={3} 
                            dot={false} 
                            activeDot={{ r: 6, fill: '#fff', stroke: '#3b82f6', strokeWidth: 2 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
              </div>
          </Card>
      )}
    </div>
  );
};