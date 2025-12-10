import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { QrCode, Download, Link2, Info } from 'lucide-react';

export const QrGenerator: React.FC = () => {
  const [text, setText] = useState('');
  
  // Using a reliable public API for QR generation to avoid heavy libraries
  // Size 300x300, Correction Level Q (High)
  const qrUrl = text 
    ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}&bgcolor=ffffff&color=000000&margin=10` 
    : null;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Card title="QR Генератор">
        
        {/* Info Block */}
        <div className="bg-pink-500/10 border border-pink-500/20 p-4 rounded-2xl mb-6 flex gap-3 backdrop-blur-md">
           <Info className="text-pink-300 shrink-0 mt-0.5" size={20} />
           <div className="text-sm text-pink-100">
             <p className="font-bold mb-1">Quick Response Code</p>
             <p>QR-коды позволяют мгновенно передавать ссылки или текст на смартфон через камеру. Идеально для шеринга ссылок с десктопа на мобильный.</p>
           </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-center">
            
            <div className="flex-1 w-full space-y-4">
                <div>
                    <label className="text-sm text-slate-400 mb-2 block ml-1">Текст или ссылка</label>
                    <div className="relative">
                        <input 
                            type="text" 
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="https://example.com"
                            className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                        <Link2 className="absolute left-3 top-3.5 text-slate-500" size={18} />
                    </div>
                </div>
            </div>

            <div className="flex-shrink-0">
                <div className="w-48 h-48 bg-white rounded-2xl flex items-center justify-center overflow-hidden shadow-2xl shadow-blue-900/20 border-4 border-white">
                    {qrUrl ? (
                        <img src={qrUrl} alt="QR Code" className="w-full h-full object-contain" />
                    ) : (
                        <div className="text-slate-300 flex flex-col items-center gap-2">
                            <QrCode size={48} className="opacity-20" />
                            <span className="text-xs text-slate-400">Пусто</span>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {qrUrl && (
             <div className="mt-8 flex justify-end">
                <Button 
                    onClick={() => {
                        // Creating a temporary link to download
                        const link = document.createElement('a');
                        link.href = qrUrl;
                        link.download = 'qrcode.png';
                        link.target = '_blank';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }}
                    variant="secondary"
                    className="w-full md:w-auto"
                >
                    <Download size={18} className="mr-2" />
                    Скачать PNG
                </Button>
             </div>
        )}
      </Card>
    </div>
  );
};