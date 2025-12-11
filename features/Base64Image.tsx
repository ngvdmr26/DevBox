
import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ImagePlus, Upload, Copy, Info } from 'lucide-react';

export const Base64Image: React.FC = () => {
  const [base64, setBase64] = useState('');
  
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
              setBase64(ev.target?.result as string);
          };
          reader.readAsDataURL(file);
      }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card title="Base64 Image Converter">
        <div className="bg-teal-500/10 border border-teal-500/20 p-4 rounded-xl mb-6 flex gap-3 text-sm text-teal-100">
            <Info className="shrink-0 mt-0.5 text-teal-400" size={20} />
            <p>Кодирование изображений в строку Base64 позволяет вставлять картинки прямо в код HTML/CSS без внешних файлов. Полезно для иконок и маленьких логотипов.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 hover:bg-white/5 transition-colors text-center relative">
                    <input type="file" accept="image/*" onChange={handleFile} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <Upload size={32} className="mx-auto mb-2 text-teal-400" />
                    <p className="text-sm text-slate-300">Нажмите или перетащите фото</p>
                </div>
                
                <textarea 
                    value={base64}
                    onChange={(e) => setBase64(e.target.value)}
                    className="w-full h-40 bg-black/30 border border-white/10 rounded-xl p-3 text-xs text-slate-400 break-all outline-none resize-none"
                    placeholder="data:image/png;base64,..."
                />
            </div>

            <div className="bg-black/20 border border-white/5 rounded-2xl flex items-center justify-center p-4 min-h-[200px]">
                {base64 ? (
                    <img src={base64} alt="Preview" className="max-w-full max-h-64 object-contain rounded-lg" />
                ) : (
                    <div className="text-slate-500 flex flex-col items-center">
                        <ImagePlus size={32} className="mb-2 opacity-50" />
                        <span className="text-sm">Превью</span>
                    </div>
                )}
            </div>
        </div>
        
        {base64 && (
            <Button onClick={() => navigator.clipboard.writeText(base64)} fullWidth variant="secondary" className="mt-4">
                <Copy size={16} className="mr-2" /> Копировать строку
            </Button>
        )}
      </Card>
    </div>
  );
};