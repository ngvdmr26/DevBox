
import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { FileSpreadsheet, ArrowDown, ArrowUp, Info } from 'lucide-react';

export const CsvJsonConverter: React.FC = () => {
  const [csv, setCsv] = useState('id,name,age\n1,John,30\n2,Jane,25');
  const [json, setJson] = useState('');

  const csvToJson = () => {
    const lines = csv.split('\n');
    const result = [];
    const headers = lines[0].split(',');

    for (let i = 1; i < lines.length; i++) {
        if (!lines[i]) continue;
        const obj: any = {};
        const currentline = lines[i].split(',');

        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }
        result.push(obj);
    }
    setJson(JSON.stringify(result, null, 2));
  };

  const jsonToCsv = () => {
      try {
          const arr = JSON.parse(json);
          const array = [Object.keys(arr[0])].concat(arr);
          setCsv(array.map(it => Object.values(it).toString()).join('\n'));
      } catch (e) {
          alert('Invalid JSON');
      }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card title="CSV ↔ JSON">
        <div className="bg-cyan-500/10 border border-cyan-500/20 p-4 rounded-xl mb-6 flex gap-3 text-sm text-cyan-100">
            <Info className="shrink-0 mt-0.5 text-cyan-400" size={20} />
            <p>Конвертация табличных данных (Excel, CSV) в формат JSON для использования в веб-приложениях и API, и обратно.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
            <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">CSV</label>
                <textarea 
                    value={csv} 
                    onChange={e => setCsv(e.target.value)} 
                    className="w-full h-64 bg-black/30 border border-white/10 rounded-xl p-3 font-mono text-xs outline-none focus:border-cyan-500" 
                />
            </div>
            <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">JSON</label>
                <textarea 
                    value={json} 
                    onChange={e => setJson(e.target.value)} 
                    className="w-full h-64 bg-black/30 border border-white/10 rounded-xl p-3 font-mono text-xs outline-none focus:border-cyan-500" 
                />
            </div>
        </div>

        <div className="flex gap-4 justify-center mt-6">
            <Button onClick={csvToJson} className="w-40">
                 CSV <ArrowDown size={16} className="mx-2 rotate-90 md:rotate-0" /> JSON
            </Button>
            <Button onClick={jsonToCsv} variant="secondary" className="w-40">
                 JSON <ArrowUp size={16} className="mx-2 rotate-90 md:rotate-0" /> CSV
            </Button>
        </div>
      </Card>
    </div>
  );
};