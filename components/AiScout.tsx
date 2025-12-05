import React, { useState } from 'react';
import { ChartConfig } from '../types';
import { analyzePlayerStats } from '../services/geminiService';
import { Bot, Loader2, Sparkles, AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  config: ChartConfig;
}

const AiScout: React.FC<Props> = ({ config }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzePlayerStats(config);
      setAnalysis(result);
    } catch (err: any) {
      setError(err.message || "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden flex flex-col h-full">
      <div className="p-4 bg-gradient-to-r from-indigo-900 to-slate-900 border-b border-slate-700 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bot className="text-indigo-400" size={24} />
          <h3 className="font-bold text-white">Informe de Scout IA</h3>
        </div>
        {!analysis && !loading && (
          <button
            onClick={handleAnalyze}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-lg hover:shadow-indigo-500/20"
          >
            <Sparkles size={16} />
            Generar Análisis
          </button>
        )}
      </div>

      <div className="p-6 flex-1 overflow-y-auto min-h-[200px]">
        {loading && (
          <div className="flex flex-col items-center justify-center h-full space-y-4 text-slate-400">
            <Loader2 className="animate-spin text-indigo-500" size={40} />
            <p className="animate-pulse">Analizando jugadores...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
             <AlertTriangle className="text-amber-500" size={40} />
             <p className="text-slate-300 max-w-xs">{error}</p>
             <button 
                onClick={() => setError(null)}
                className="text-sm text-indigo-400 hover:underline"
             >
                Intentar de nuevo
             </button>
          </div>
        )}

        {!loading && !error && !analysis && (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
            <p>Haz clic en "Generar Análisis" para obtener un desglose de estadísticas impulsado por IA.</p>
          </div>
        )}

        {!loading && analysis && (
          <div className="prose prose-invert prose-sm max-w-none">
             {/* Simple Markdown Rendering */}
             {analysis.split('\n').map((line, i) => {
                if (line.startsWith('###')) return <h3 key={i} className="text-lg font-bold text-indigo-300 mt-4 mb-2">{line.replace('###', '')}</h3>;
                if (line.startsWith('##')) return <h2 key={i} className="text-xl font-bold text-white mt-4 mb-2">{line.replace('##', '')}</h2>;
                if (line.startsWith('**')) return <strong key={i} className="block mt-2 text-slate-200">{line.replace(/\*\*/g, '')}</strong>;
                if (line.startsWith('- ')) return <li key={i} className="ml-4 text-slate-300">{line.replace('- ', '')}</li>;
                return <p key={i} className="mb-2 text-slate-300 leading-relaxed">{line}</p>;
             })}
             
             <button 
                onClick={handleAnalyze}
                className="mt-6 text-xs text-indigo-400 hover:text-indigo-300 underline flex items-center gap-1"
             >
                <RefreshCcw size={12} /> Actualizar Análisis
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiScout;