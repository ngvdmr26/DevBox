import React, { useState, useRef } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Image, Upload, Download, Info } from 'lucide-react';

export const ImageCompressor: React.FC = () => {
  const [original, setOriginal] = useState<string | null>(null);
  const [compressed, setCompressed] = useState<string | null>(null);
  const [quality, setQuality] = useState(0.7);
  const [loading, setLoading] = useState(false);
  const [origSize, setOrigSize] = useState(0);
  const [compSize, setCompSize] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOrigSize(file.size);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setOriginal(ev.target?.result as string);
        compress(ev.target?.result as string, quality);
      };
      reader.readAsDataURL(file);
    }
  };

  const compress = (src: string, q: number) => {
    setLoading(true);
    const img = document.createElement('img');
    img.src = src;
    img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', q);
        setCompressed(dataUrl);
        // Calculate approx size
        const head = 'data:image/jpeg;base64,';
        const size = Math.round((dataUrl.length - head.length) * 3/4);
        setCompSize(size);
        setLoading(false);
    };
  };

  const handleQualityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const q = parseFloat(e.target.value);
      setQuality(q);
      if (original) compress(original, q);
  };

  const formatSize = (b: number) => (b / 1024).toFixed(1) + ' KB';

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Card title="Сжатие изображений">
        <div className="bg-pink-600/10 border border-pink-600/20 p-4 rounded-xl mb-6 flex gap-3 text-sm text-pink-100">
            <Info className="shrink-0 mt-0.5 text-pink-400" size={20} />
            <p>Сжатие происходит локально <b>в вашем браузере</b> через Canvas API. Фотографии не загружаются на сервер, что гарантирует полную конфиденциальность.</p>
        </div>

        <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-2xl p-8 mb-8 transition-colors hover:border-pink-500/50 bg-white/5">
             {!original ? (
                 <div className="text-center" onClick={() => fileInputRef.current?.click()}>
                     <Upload size={48} className="mx-auto mb-4 text-slate-500" />
                     <p className="text-lg font-medium text-white cursor-pointer">Выберите изображение</p>
                     <p className="text-sm text-slate-500">или перетащите сюда (JPG, PNG)</p>
                 </div>
             ) : (
                 <div className="grid md:grid-cols-2 gap-8 w-full">
                     <div className="space-y-2">
                         <div className="text-xs font-bold text-slate-400 uppercase">Оригинал ({formatSize(origSize)})</div>
                         <img src={original} className="w-full rounded-lg shadow-lg border border-white/10" alt="Original" />
                     </div>
                     <div className="space-y-2">
                         <div className="text-xs font-bold text-emerald-400 uppercase">Сжатое ({formatSize(compSize)})</div>
                         <img src={compressed || ''} className="w-full rounded-lg shadow-lg border border-white/10" alt="Compressed" />
                         <div className="text-right text-xs text-emerald-400">-{Math.round((1 - compSize/origSize)*100)}%</div>
                     </div>
                 </div>
             )}
             <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFile} />
        </div>

        {original && (
            <div className="space-y-6">
                <div>
                    <div className="flex justify-between mb-2 text-sm text-slate-300">
                        <span>Качество</span>
                        <span>{Math.round(quality * 100)}%</span>
                    </div>
                    <input 
                        type="range" 
                        min="0.1" 
                        max="1" 
                        step="0.1"
                        value={quality} 
                        onChange={handleQualityChange}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />
                </div>
                {compressed && (
                    <Button 
                        onClick={() => {
                            const a = document.createElement('a');
                            a.href = compressed;
                            a.download = 'compressed-image.jpg';
                            a.click();
                        }}
                        fullWidth
                    >
                        <Download className="mr-2" /> Скачать
                    </Button>
                )}
            </div>
        )}
      </Card>
    </div>
  );
};