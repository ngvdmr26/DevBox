
import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { MonitorSmartphone, Info } from 'lucide-react';

export const UserAgentParser: React.FC = () => {
  const [ua, setUa] = useState(navigator.userAgent);

  const parse = (s: string) => {
      let browser = "Unknown";
      if(s.includes("Firefox")) browser = "Firefox";
      else if(s.includes("SamsungBrowser")) browser = "Samsung Internet";
      else if(s.includes("Opera") || s.includes("OPR")) browser = "Opera";
      else if(s.includes("Trident")) browser = "Internet Explorer";
      else if(s.includes("Edge")) browser = "Edge";
      else if(s.includes("Chrome")) browser = "Chrome";
      else if(s.includes("Safari")) browser = "Safari";

      let os = "Unknown";
      if (s.includes("Win")) os = "Windows";
      else if (s.includes("Mac")) os = "MacOS";
      else if (s.includes("Linux")) os = "Linux";
      else if (s.includes("Android")) os = "Android";
      else if (s.includes("like Mac")) os = "iOS";

      return { browser, os };
  };

  const info = parse(ua);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card title="User Agent Parser">
         <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl mb-6 flex gap-3 text-sm text-blue-100">
            <Info className="shrink-0 mt-0.5 text-blue-400" size={20} />
            <p>Строка User-Agent отправляется вашим браузером на каждый сайт. Она сообщает серверу информацию о вашей операционной системе и версии браузера.</p>
         </div>

         <textarea 
            value={ua}
            onChange={e => setUa(e.target.value)}
            className="w-full h-24 bg-black/30 border border-white/10 rounded-xl p-3 text-sm text-slate-300 outline-none focus:border-blue-500 mb-6"
         />
         
         <div className="grid grid-cols-2 gap-4">
             <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
                 <div className="text-xs text-slate-500 uppercase font-bold mb-2">Браузер</div>
                 <div className="text-2xl font-bold text-white">{info.browser}</div>
             </div>
             <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
                 <div className="text-xs text-slate-500 uppercase font-bold mb-2">ОС</div>
                 <div className="text-2xl font-bold text-white">{info.os}</div>
             </div>
         </div>
         
         <div className="mt-4 text-center">
             <button onClick={() => setUa(navigator.userAgent)} className="text-blue-400 text-sm hover:underline">
                 Мой User Agent
             </button>
         </div>
      </Card>
    </div>
  );
};