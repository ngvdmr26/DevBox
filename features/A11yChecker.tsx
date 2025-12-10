import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { analyzeAccessibility } from '../services/geminiService';
import { ScanSearch, AlertCircle, FileCode } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const A11yChecker: React.FC = () => {
  const [htmlCode, setHtmlCode] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!htmlCode.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const analysis = await analyzeAccessibility(htmlCode);
      setResult(analysis);
    } catch (e) {
      setResult("Произошла ошибка при подключении к сервису анализа.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card title="AI Проверка доступности (A11y)" className="border-blue-900/50">
        <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 mb-6 flex gap-3 items-start">
            <AlertCircle className="text-blue-400 shrink-0 mt-1" size={20} />
            <div className="text-sm text-blue-200">
                <p className="font-semibold mb-1">Как это работает?</p>
                <p>Вставьте фрагмент HTML кода вашей веб-страницы ниже. Искусственный интеллект (Gemini) проанализирует его на соответствие стандартам WCAG (доступность для людей с ограниченными возможностями) и предложит улучшения.</p>
            </div>
        </div>

        <div className="space-y-4">
            <div className="relative">
                <label className="text-sm font-medium text-slate-300 mb-2 block">HTML Код</label>
                <textarea 
                    value={htmlCode}
                    onChange={(e) => setHtmlCode(e.target.value)}
                    className="w-full h-64 bg-slate-950 border border-slate-700 rounded-lg p-4 font-mono text-sm text-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                    placeholder="<button>Click me</button>..."
                />
                <div className="absolute top-9 right-4 text-slate-600">
                    <FileCode size={20} />
                </div>
            </div>

            <Button 
                onClick={handleAnalyze} 
                disabled={!htmlCode.trim() || loading} 
                isLoading={loading}
                fullWidth
                variant="primary"
                className="py-3"
            >
                <ScanSearch className="mr-2" size={20} />
                {loading ? 'Анализируем...' : 'Запустить проверку'}
            </Button>
        </div>
      </Card>

      {result && (
        <Card title="Результаты анализа" className="animate-fade-in">
            <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{result}</ReactMarkdown>
            </div>
        </Card>
      )}
    </div>
  );
};
