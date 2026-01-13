
import React, { useState } from 'react';
import { HelpCircle, X, ChevronRight, Play, Database, Sparkles, Download, Layout, Video } from 'lucide-react';

const steps = [
  {
    title: "1. Configuración de Base",
    desc: "Usa el panel izquierdo para cargar logos de tu club y elegir una plantilla de métricas (Ataque, Defensa o Posesión).",
    icon: <Layout className="text-blue-400" size={32} />,
    color: "blue"
  },
  {
    title: "2. Gestión de Jugadores",
    desc: "Añade jugadores, sube sus fotos, mapas de calor y ajusta sus estadísticas del 0 al 100 en tiempo real.",
    icon: <Database className="text-emerald-400" size={32} />,
    color: "emerald"
  },
  {
    title: "3. Análisis con IA",
    desc: "Usa el Asistente IA para generar informes técnicos automáticos y chatear con Gemini sobre el rendimiento de tu plantilla.",
    icon: <Sparkles className="text-purple-400" size={32} />,
    color: "purple"
  },
  {
    title: "4. Generación de Vídeo",
    desc: "En el modo 'Video', puedes crear clips cinematográficos de 6 segundos de tus jugadores usando el modelo Veo 3.1.",
    icon: <Video className="text-amber-400" size={32} />,
    color: "amber"
  },
  {
    title: "5. Exportar Informes",
    desc: "Cambia al modo 'Card' para ver fichas de nivel profesional y descárgalas en PNG de alta resolución para tus presentaciones.",
    icon: <Download className="text-pink-400" size={32} />,
    color: "pink"
  }
];

const AppGuide: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-white text-xs font-bold transition-all bg-slate-800/50 rounded-lg border border-slate-700"
      >
        <HelpCircle size={16} /> ¿CÓMO FUNCIONA?
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative">
        <button 
          onClick={() => { setIsOpen(false); setCurrentStep(0); }}
          className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-emerald-500/20 rounded-2xl">
              <Play className="text-emerald-500 fill-emerald-500" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tighter">Guía ProScout IA</h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Tutorial de funcionamiento</p>
            </div>
          </div>

          <div className="min-h-[220px] flex flex-col items-center text-center">
            <div className={`mb-6 p-6 rounded-full bg-slate-800 border-2 border-slate-700 shadow-xl animate-bounce`}>
              {steps[currentStep].icon}
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{steps[currentStep].title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              {steps[currentStep].desc}
            </p>
          </div>

          <div className="mt-10 flex items-center justify-between">
            <div className="flex gap-1.5">
              {steps.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all ${i === currentStep ? 'w-8 bg-emerald-500' : 'w-2 bg-slate-700'}`} 
                />
              ))}
            </div>
            
            <button 
              onClick={() => {
                if (currentStep < steps.length - 1) {
                  setCurrentStep(currentStep + 1);
                } else {
                  setIsOpen(false);
                  setCurrentStep(0);
                }
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
            >
              {currentStep === steps.length - 1 ? "Comenzar ahora" : "Siguiente"}
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppGuide;
