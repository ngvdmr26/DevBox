import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Copy, Globe, Info } from 'lucide-react';

export const MetaTags: React.FC = () => {
  const [title, setTitle] = useState('My Awesome Site');
  const [desc, setDesc] = useState('The best website in the world.');
  const [image, setImage] = useState('https://example.com/og-image.jpg');
  const [url, setUrl] = useState('https://example.com');

  const code = `
<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}">
<meta name="description" content="${desc}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="${image}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${url}">
<meta property="twitter:title" content="${title}">
<meta property="twitter:description" content="${desc}">
<meta property="twitter:image" content="${image}">
  `.trim();

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Card title="SEO Meta Tags">
        
        <div className="bg-cyan-600/10 border border-cyan-600/20 p-4 rounded-2xl mb-6 flex gap-3 backdrop-blur-md">
           <Info className="text-cyan-300 shrink-0 mt-0.5" size={20} />
           <p className="text-sm text-cyan-100">Мета-теги (особенно Open Graph) отвечают за то, как ссылка на ваш сайт будет выглядеть при отправке в Telegram, VK, Twitter или Discord. Красивое превью повышает кликабельность.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
                 <div>
                    <label className="text-sm text-slate-400 block mb-1">Заголовок (Title)</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="input-std w-full bg-black/30 border border-white/10 rounded-lg p-2 text-white outline-none focus:border-cyan-500" />
                 </div>
                 <div>
                    <label className="text-sm text-slate-400 block mb-1">Описание (Description)</label>
                    <textarea value={desc} onChange={e => setDesc(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-white h-24 resize-none outline-none focus:border-cyan-500" />
                 </div>
                 <div>
                    <label className="text-sm text-slate-400 block mb-1">Ссылка на картинку</label>
                    <input type="text" value={image} onChange={e => setImage(e.target.value)} className="input-std w-full bg-black/30 border border-white/10 rounded-lg p-2 text-white outline-none focus:border-cyan-500" />
                 </div>
                 <div>
                    <label className="text-sm text-slate-400 block mb-1">URL сайта</label>
                    <input type="text" value={url} onChange={e => setUrl(e.target.value)} className="input-std w-full bg-black/30 border border-white/10 rounded-lg p-2 text-white outline-none focus:border-cyan-500" />
                 </div>
            </div>

            <div className="bg-white rounded-xl overflow-hidden shadow-lg h-fit text-black">
                {/* Social Preview */}
                <div className="h-40 bg-slate-200 bg-cover bg-center relative" style={{backgroundImage: `url(${image})`}}>
                    {!image && <div className="absolute inset-0 flex items-center justify-center text-slate-400">No Image</div>}
                </div>
                <div className="p-4">
                    <div className="text-xs text-slate-500 uppercase mb-1">{new URL(url || 'https://example.com').hostname}</div>
                    <div className="font-bold text-lg leading-tight mb-2 line-clamp-2">{title}</div>
                    <div className="text-sm text-slate-600 line-clamp-3">{desc}</div>
                </div>
            </div>
        </div>

        <div className="relative">
            <textarea readOnly value={code} className="w-full h-64 bg-black/40 border border-white/10 rounded-xl p-4 font-mono text-xs text-blue-200 outline-none resize-none" />
            <button 
                onClick={() => navigator.clipboard.writeText(code)}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
                <Copy size={16} />
            </button>
        </div>
      </Card>
    </div>
  );
};