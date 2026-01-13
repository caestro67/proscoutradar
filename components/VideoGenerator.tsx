
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ChartConfig } from '../types';
import { Video, Loader2, Sparkles, AlertCircle, Play, Download, Key } from 'lucide-react';

interface Props {
  config: ChartConfig;
  hasKey: boolean;
  onOpenKey: () => void;
}

const VideoGenerator: React.FC<Props> = ({ config, hasKey, onOpenKey }) => {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>(config.players[0]?.id || '');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState<string | null>(null);

  const activePlayers = config.players.filter(p => p.visible !== false);

  const generateVideo = async () => {
    const player = activePlayers.find(p => p.id === selectedPlayerId);
    if (!player) return;

    setLoading(true);
    setError(null);
    setVideoUrl(null);
    setStatus('Iniciando motores de renderizado...');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const statsPrompt = `A professional cinematic shot of a soccer player named ${player.name} in a futuristic stadium. 
      The player specializes in ${config.categories.join(', ')}. 
      Visual style: High contrast, 8k resolution, emerald green lighting, dramatic shadows, particles in the air. 
      The player is performing a dynamic action sequence.`;

      setStatus('Subiendo assets y procesando prompt...');

      let payload: any = {
        model: 'veo-3.1-fast-generate-preview',
        prompt: statsPrompt,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      };

      if (player.image && player.image.startsWith('data:image')) {
        const base64Data = player.image.split(',')[1];
        payload.image = {
          imageBytes: base64Data,
          mimeType: 'image/png'
        };
      }

      let operation = await ai.models.generateVideos(payload);

      const waitingMessages = [
        'Renderizando texturas de alta definición...',
        'Aplicando efectos de iluminación volumétrica...',
        'Sincronizando movimientos con la física de ProScout IA...',
        'Casi listo: puliendo los detalles del campo...',
        'Finalizando codificación de vídeo...'
      ];

      let msgIdx = 0;
      while (!operation.done) {
        setStatus(waitingMessages[msgIdx % waitingMessages.length]);
        msgIdx++;
        await new Promise(resolve => setTimeout(resolve, 10000));
        
        try {
          operation = await ai.operations.getVideosOperation({ operation: operation });
        } catch (opErr: any) {
          if (opErr.message?.includes("Requested entity was not found")) {
            throw new Error("API_KEY_EXPIRED");
          }
          throw opErr;
        }
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const fetchRes = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await fetchRes.blob();
        setVideoUrl(URL.createObjectURL(blob));
      }
    } catch (err: any) {
      console.error(err);
      if (err.message === "API_KEY_EXPIRED") {
        setError("La clave API no parece válida o ha expirado. Por favor, selecciona una de un proyecto con facturación activa.");
      } else {
        setError("Error al generar el vídeo. Asegúrate de tener una clave API válida con facturación de Google Cloud activada.");
      }
    } finally {
      setLoading(false);
      setStatus('');
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col items-center min-h-[500px] justify-center text-center shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-blue-500"></div>
      
      {!hasKey ? (
        <div className="max-w-md space-y-6">
          <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto border border-amber-500/20">
            <Video size={40} className="text-amber-500" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Generación de Vídeo <span className="text-amber-500">Pro</span></h2>
          <p className="text-slate-400 text-sm">
            Para generar vídeos cinematográficos de tus jugadores con IA, necesitas configurar una clave API personal con facturación activa.
          </p>
          <div className="bg-slate-800/50 p-4 rounded-xl text-left border border-slate-700">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1">
              <AlertCircle size={10} /> Requisitos
            </p>
            <ul className="text-xs text-slate-300 list-disc list-inside space-y-1">
              <li>API Key de un proyecto Google Cloud</li>
              <li>Facturación activada (Pay-as-you-go)</li>
              <li>Consulte la <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-blue-400 underline">documentación de facturación</a></li>
            </ul>
          </div>
          <button 
            onClick={onOpenKey}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase py-4 rounded-xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-emerald-600/20"
          >
            <Key size={20} /> CONFIGURAR API KEY
          </button>
        </div>
      ) : (
        <div className="w-full max-w-2xl space-y-8">
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-white flex items-center gap-3">
              <Sparkles className="text-emerald-500" /> VEO <span className="text-emerald-500">CINEMATIC</span> GENERATOR
            </h2>
            <p className="text-slate-400 mt-2">Convierte estadísticas en una pieza de vídeo épica de 6 segundos.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-left space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Seleccionar Jugador</label>
              <select 
                value={selectedPlayerId}
                onChange={(e) => setSelectedPlayerId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 transition-colors"
                disabled={loading}
              >
                {activePlayers.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <button 
                onClick={generateVideo}
                disabled={loading || !selectedPlayerId}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 font-black uppercase py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/10 text-white"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Play size={20} />}
                {loading ? 'GENERANDO...' : 'GENERAR VÍDEO'}
              </button>
            </div>
          </div>

          {loading && (
            <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-10 flex flex-col items-center gap-6 animate-pulse">
               <Loader2 className="animate-spin text-emerald-500" size={60} />
               <div className="space-y-2">
                 <p className="text-lg font-bold text-emerald-400 uppercase tracking-widest">{status}</p>
                 <p className="text-xs text-slate-500">Este proceso suele tardar unos 2 minutos. No cierres la ventana.</p>
               </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl flex items-center gap-3 text-red-400 text-sm">
              <AlertCircle size={20} />
              <div className="text-left">
                <p className="font-bold">Error de Generación</p>
                <p className="text-xs opacity-80">{error}</p>
                <button onClick={onOpenKey} className="text-xs underline mt-1 font-bold">Cambiar API Key</button>
              </div>
            </div>
          )}

          {videoUrl && (
            <div className="space-y-4">
              <div className="rounded-3xl overflow-hidden border-4 border-emerald-500/20 shadow-2xl bg-black aspect-video relative group">
                <video 
                  src={videoUrl} 
                  controls 
                  autoPlay 
                  loop 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex justify-center gap-4">
                <a 
                  href={videoUrl} 
                  download="ProScout-Cinematic.mp4"
                  className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition-all border border-slate-700"
                >
                  <Download size={18} /> DESCARGAR MP4
                </a>
                <button 
                  onClick={generateVideo}
                  className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition-all border border-emerald-500/30"
                >
                  <Sparkles size={18} /> GENERAR OTRO
                </button>
              </div>
            </div>
          )}

          {!loading && !videoUrl && !error && (
            <div className="border-2 border-dashed border-slate-800 rounded-3xl p-16 opacity-50">
               <Video size={48} className="mx-auto mb-4 text-slate-700" />
               <p className="text-sm uppercase font-black tracking-[0.2em] text-slate-600">Vista previa de vídeo</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoGenerator;
