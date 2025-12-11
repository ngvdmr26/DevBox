
import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Copy, Info } from 'lucide-react';

const STYLES = {
    'Bold (Serif)': (c: string) => c.replace(/[a-zA-Z0-9]/g, (char) => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D400 + code - 65);
        if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D41A + code - 97);
        if (code >= 48 && code <= 57) return String.fromCodePoint(0x1D7CE + code - 48);
        return char;
    }),
    'Bold (Sans)': (c: string) => c.replace(/[a-zA-Z0-9]/g, (char) => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D5D4 + code - 65);
        if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D5EE + code - 97);
        if (code >= 48 && code <= 57) return String.fromCodePoint(0x1D7EC + code - 48);
        return char;
    }),
    'Italic (Serif)': (c: string) => c.replace(/[a-zA-Z]/g, (char) => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D434 + code - 65);
        if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D44E + code - 97);
        return char;
    }),
    'Script (Bold)': (c: string) => c.replace(/[a-zA-Z]/g, (char) => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D4D0 + code - 65);
        if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D4EA + code - 97);
        return char;
    }),
    'Fraktur': (c: string) => c.replace(/[a-zA-Z]/g, (char) => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D56C + code - 65);
        if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D586 + code - 97);
        return char;
    }),
    'Double Struck': (c: string) => c.replace(/[a-zA-Z0-9]/g, (char) => {
        const code = char.charCodeAt(0);
        if(char === 'C') return '\u2102';
        if(char === 'H') return '\u210D';
        if(char === 'N') return '\u2115';
        if(char === 'P') return '\u2119';
        if(char === 'Q') return '\u211A';
        if(char === 'R') return '\u211D';
        if(char === 'Z') return '\u2124';
        if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D538 + code - 65);
        if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D552 + code - 97);
        if (code >= 48 && code <= 57) return String.fromCodePoint(0x1D7D8 + code - 48);
        return char;
    }),
    'Monospace': (c: string) => c.replace(/[a-zA-Z0-9]/g, (char) => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D670 + code - 65);
        if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D68A + code - 97);
        if (code >= 48 && code <= 57) return String.fromCodePoint(0x1D7F6 + code - 48);
        return char;
    }),
    'Bubbles (Black)': (c: string) => c.replace(/[a-zA-Z0-9]/g, (char) => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(0x1F150 + code - 65);
        if (code >= 97 && code <= 122) return String.fromCodePoint(0x1F150 + code - 97);
        if (code === 48) return '⓿'; // 0
        if (code >= 49 && code <= 57) return String.fromCodePoint(0x2776 + code - 49);
        return char;
    }),
    'Bubbles (White)': (c: string) => c.replace(/[a-zA-Z0-9]/g, (char) => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(0x24B6 + code - 65);
        if (code >= 97 && code <= 122) return String.fromCodePoint(0x24D0 + code - 97);
        if (code >= 49 && code <= 57) return String.fromCodePoint(0x2460 + code - 49);
        return char;
    }),
    'Squares (White)': (c: string) => c.replace(/[a-zA-Z]/g, (char) => {
         const code = char.charCodeAt(0);
         if (code >= 65 && code <= 90) return String.fromCodePoint(0x1F130 + code - 65);
         if (code >= 97 && code <= 122) return String.fromCodePoint(0x1F130 + code - 97);
         return char;
    }),
    'Fullwidth': (c: string) => c.replace(/[!-~]/g, (char) => String.fromCharCode(char.charCodeAt(0) + 0xFEE0)),
    'Upside Down': (c: string) => {
        const map: any = {'a':'ɐ','b':'q','c':'ɔ','d':'p','e':'ǝ','f':'ɟ','g':'ƃ','h':'ɥ','i':'ᴉ','j':'ɾ','k':'ʞ','l':'l','m':'ɯ','n':'u','o':'o','p':'d','q':'b','r':'ɹ','s':'s','t':'ʇ','u':'n','v':'ʌ','w':'ʍ','x':'x','y':'ʎ','z':'z','A':'∀','B':'q','C':'Ɔ','D':'p','E':'Ǝ','F':'Ⅎ','G':'פ','H':'H','I':'I','J':'ſ','K':'ʞ','L':'˥','M':'W','N':'N','O':'O','P':'d','Q':'b','R':'R','S':'S','T':'┴','U':'∩','V':'Λ','W':'M','X':'X','Y':'⅄','Z':'Z','1':'1','2':'2','3':'Ɛ','4':'h','5':'5','6':'9','7':'L','8':'8','9':'6','0':'0','.':'˙',',':'\'','?':'¿','!':'¡','\"':',,','\'':',','`':',','<':'>','>':'<','&':'⅋','_':'‾'};
        return c.split('').reverse().map(char => map[char] || char).join('');
    },
    'Small Caps': (c: string) => c.replace(/[a-z]/g, (char) => {
        const map: any = {'a':'ᴀ','b':'ʙ','c':'ᴄ','d':'ᴅ','e':'ᴇ','f':'ғ','g':'ɢ','h':'ʜ','i':'ɪ','j':'ᴊ','k':'ᴋ','l':'ʟ','m':'ᴍ','n':'ɴ','o':'ᴏ','p':'ᴘ','q':'ǫ','r':'ʀ','s':'s','t':'ᴛ','u':'ᴜ','v':'ᴠ','w':'ᴡ','x':'x','y':'ʏ','z':'ᴢ'};
        return map[char] || char;
    }),
    'Strikethrough': (c: string) => c.split('').map(char => char + '\u0336').join(''),
    'Underline': (c: string) => c.split('').map(char => char + '\u0332').join(''),
};

export const TextStyler: React.FC = () => {
  const [text, setText] = useState('DevBox Tools');

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card title="Стили Текста">
          <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-xl mb-6 flex gap-3 text-sm text-purple-100">
            <Info className="shrink-0 mt-0.5 text-purple-400" size={20} />
            <p>Преобразование обычного текста в красивые Unicode-шрифты. Используйте их в социальных сетях, никнеймах и мессенджерах.</p>
          </div>

          <input 
            value={text}
            onChange={e => setText(e.target.value)}
            className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-purple-500 mb-8"
            placeholder="Введите текст..."
          />
          
          <div className="space-y-3">
              {Object.entries(STYLES).map(([name, transform]) => (
                  <div key={name} className="flex items-center justify-between bg-white/5 border border-white/5 p-4 rounded-xl">
                      <div>
                          <div className="text-xs text-slate-500 uppercase font-bold mb-1">{name}</div>
                          <div className="text-xl text-white break-all pr-4">{transform(text)}</div>
                      </div>
                      <button onClick={() => navigator.clipboard.writeText(transform(text))} className="p-2 text-slate-400 hover:text-white shrink-0">
                          <Copy size={18} />
                      </button>
                  </div>
              ))}
          </div>
      </Card>
    </div>
  );
};