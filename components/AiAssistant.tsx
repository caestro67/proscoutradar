
import React, { useState } from 'react';
import { ChartConfig, ChatMessage } from '../types';
import { analyzePlayerStats, sendChatMessage } from '../services/geminiService';
import { Bot, Loader2, Sparkles, Send, MessageSquare, RefreshCcw } from 'lucide-react';

interface Props {
  config: ChartConfig;
  onAnalysisChange?: (json: string) => void;
}

const AiAssistant: React.FC<Props> = ({ config, onAnalysisChange }) => {
  const [mode, setMode] = useState<'report' | 'chat'>('report');
  const [reportLoading, setReportLoading] = useState(false);
  const [playersAnalysis, setPlayersAnalysis] = useState<any[]>([]);
  
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const handleGenerateReport = async () => {
    setReportLoading(true);
    try {
      const result = await analyzePlayerStats(config);
      const data = JSON.parse(result);
      setPlayersAnalysis(data.players || []);
      if (onAnalysisChange) onAnalysisChange(result);
    } catch (err) {
      console.error(err);
      alert("Error al generar el informe. Revisa tu conexión.");
    } finally {
      setReportLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setChatHistory(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setChatLoading(true);
    try {
      const responseText = await sendChatMessage(currentInput, chatHistory, config);
      setChatHistory(prev => [...prev, { role: 'model', text: responseText, timestamp: Date.now() }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'model', text: "Error de conexión con el asistente.", timestamp: Date.now() }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden flex flex-col h-[600px] shadow-2xl">
      <div className="flex border-b border-slate-700 bg-slate-900/50">
        <button 
          onClick={() => setMode('report')} 
          className={`flex-1 py-3 text-xs font-black uppercase tracking-widest transition-all ${mode === 'report' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-indigo-500/5' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Informe por Jugador
        </button>
        <button 
          onClick={() => setMode('chat')} 
          className={`flex-1 py-3 text-xs font-black uppercase tracking-widest transition-all ${mode === 'chat' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-indigo-500/5' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Chat Scout
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {mode === 'report' && (
          <div className="space-y-6 h-full flex flex-col">
            {playersAnalysis.length === 0 && !reportLoading && (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
                <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4 border border-slate-700">
                  <Bot size={32} className="text-slate-600" />
                </div>
                <h4 className="text-slate-300 font-bold mb-2">Análisis Inteligente</h4>
                <p className="text-slate-500 text-xs mb-6 max-w-[240px]">Genera un informe técnico detallado basado en las métricas actuales de los jugadores.</p>
                <button 
                  onClick={handleGenerateReport} 
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-lg font-black uppercase text-[10px] tracking-widest flex items-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
                >
                  <Sparkles size={14}/> Iniciar Análisis
                </button>
              </div>
            )}

            {reportLoading && (
              <div className="flex-1 flex flex-col items-center justify-center py-10">
                <div className="relative">
                  <Loader2 className="animate-spin text-indigo-500" size={48}/>
                  <Sparkles className="absolute -top-1 -right-1 text-emerald-400 animate-pulse" size={16} />
                </div>
                <p className="mt-4 text-slate-400 font-bold text-sm">Escaneando perfiles técnicos...</p>
                <p className="text-slate-600 text-[10px] uppercase tracking-widest mt-1">Procesando con Gemini IA</p>
              </div>
            )}

            {playersAnalysis.length > 0 && !reportLoading && (
              <div className="space-y-4 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Resultados del Informe</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleGenerateReport}
                      className="text-[9px] font-black uppercase text-indigo-400 hover:text-indigo-300 flex items-center gap-1 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20 transition-all"
                    >
                      <RefreshCcw size={10} /> Actualizar Análisis
                    </button>
                  </div>
                </div>

                {playersAnalysis.map((pa, i) => {
                  const player = config.players.find(p => p.id === pa.id);
                  return (
                    <div key={i} className="bg-slate-900/40 rounded-2xl p-4 border border-slate-700/50 hover:border-slate-600 transition-colors shadow-inner">
                      <div className="flex items-center gap-3 mb-3 border-b border-slate-800 pb-2">
                        <div 
                          className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-black border border-slate-700" 
                          style={{ color: player?.color || '#fff', borderColor: player?.color ? `${player.color}44` : '#334155' }}
                        >
                          {player?.name ? player.name[0] : '?'}
                        </div>
                        <h4 className="font-bold text-white text-sm uppercase tracking-tight">{player?.name || 'Desconocido'}</h4>
                      </div>
                      <div className="prose prose-invert prose-xs text-slate-400 text-xs mb-4 leading-relaxed whitespace-pre-wrap">
                        {pa.detailedAnalysis}
                      </div>
                      <div className="bg-emerald-500/5 border border-emerald-500/20 p-3 rounded-xl">
                        <p className="text-[8px] font-black text-emerald-500 uppercase mb-1 tracking-widest flex items-center gap-1">
                          <Sparkles size={8} /> Resumen Ejecutivo
                        </p>
                        <p className="text-xs italic text-emerald-100/90 leading-snug">"{pa.executiveSummary}"</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {mode === 'chat' && (
          <div className="flex flex-col h-full">
            <div className="flex-1 space-y-4 mb-4 custom-scrollbar overflow-y-auto pr-1">
              {chatHistory.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                  <MessageSquare size={32} className="mb-2" />
                  <p className="text-xs uppercase font-black tracking-widest">Consultas de Scouting</p>
                </div>
              )}
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20 rounded-tr-none' 
                      : 'bg-slate-700/50 text-slate-200 border border-slate-600/30 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-700/30 p-3 rounded-2xl rounded-tl-none border border-slate-600/20">
                    <Loader2 className="animate-spin text-slate-500" size={14}/>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2 bg-slate-900/80 p-2 rounded-xl border border-slate-700 focus-within:border-indigo-500/50 transition-all">
              <input 
                value={input} 
                onChange={e => setInput(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()} 
                className="flex-1 bg-transparent border-none px-3 py-1 text-xs text-white outline-none placeholder:text-slate-600" 
                placeholder="¿Quién tiene mejores métricas físicas?" 
              />
              <button 
                onClick={handleSendMessage} 
                className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-lg transition-colors active:scale-95"
              >
                <Send size={14}/>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiAssistant;
