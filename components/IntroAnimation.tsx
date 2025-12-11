
import React, { useEffect, useState } from 'react';
import { Terminal, Cpu, Zap, ShieldCheck, Globe, Code2 } from 'lucide-react';

interface IntroAnimationProps {
  onComplete: () => void;
}

export const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [text, setText] = useState('');
  
  const fullText = "INITIALIZING DEVBOX SYSTEM...";

  useEffect(() => {
    // 1. Typing effect
    let charIndex = 0;
    const typeInterval = setInterval(() => {
      setText(fullText.substring(0, charIndex));
      charIndex++;
      if (charIndex > fullText.length) {
        clearInterval(typeInterval);
        setTimeout(() => setStep(1), 500);
      }
    }, 40);

    return () => clearInterval(typeInterval);
  }, []);

  useEffect(() => {
    if (step === 1) {
      setTimeout(() => setStep(2), 1500); // Show icons
    }
    if (step === 2) {
      setTimeout(() => setStep(3), 2500); // Show final logo
    }
    if (step === 3) {
      setTimeout(() => onComplete(), 4000); // Finish - Increased delay to allow reading description
    }
  }, [step, onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{ 
            backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            transform: 'perspective(500px) rotateX(60deg) translateY(-100px) scale(2)',
            animation: 'gridMove 20s linear infinite'
        }} 
      />
      <style>{`
        @keyframes gridMove {
            0% { transform: perspective(500px) rotateX(60deg) translateY(0) scale(2); }
            100% { transform: perspective(500px) rotateX(60deg) translateY(40px) scale(2); }
        }
        @keyframes scanline {
            0% { transform: translateY(-100vh); }
            100% { transform: translateY(100vh); }
        }
      `}</style>
      
      {/* Scanline - Fixed height to traverse full viewport */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-blue-500/20 to-transparent h-[50vh] w-full animate-[scanline_3s_linear_infinite]"></div>

      <div className="relative z-10 w-full max-w-md px-6 text-center">
        
        {/* Stage 0: Typing Text */}
        <div className={`font-mono text-green-400 text-sm md:text-base mb-8 h-6 transition-all duration-500 ${step >= 2 ? 'opacity-0 scale-90 blur-sm' : 'opacity-100'}`}>
          <span className="mr-2">{'>'}</span>{text}<span className="animate-pulse">_</span>
        </div>

        {/* Stage 1: Feature Icons */}
        {/* Added logic to fade out icons (opacity-0) when step 2 (Logo) starts */}
        <div className={`grid grid-cols-3 gap-6 mb-12 transition-all duration-1000 transform ${step === 1 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-90 blur-md'}`}>
            {[
                { i: Terminal, l: 'Code', c: 'text-fuchsia-400' },
                { i: Cpu, l: 'System', c: 'text-blue-400' },
                { i: Globe, l: 'Network', c: 'text-green-400' },
                { i: ShieldCheck, l: 'Security', c: 'text-red-400' },
                { i: Zap, l: 'Tools', c: 'text-yellow-400' },
                { i: Code2, l: 'Web', c: 'text-cyan-400' },
            ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2" style={{ transitionDelay: `${idx * 100}ms` }}>
                    <div className={`p-3 bg-white/5 rounded-xl border border-white/10 shadow-lg shadow-${item.c.split('-')[1]}-500/20`}>
                        <item.i className={item.c} size={24} />
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest">{item.l}</span>
                </div>
            ))}
        </div>

        {/* Stage 2/3: Logo Reveal */}
        <div className={`transition-all duration-1000 transform ${step >= 2 ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-150 blur-lg'} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full`}>
             {/* Backdrop to ensure contrast */}
             <div className="absolute inset-0 bg-black/80 blur-3xl -z-10 scale-150"></div>
             
             <div className="relative w-24 h-24 mx-auto mb-6">
                 <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-50 animate-pulse"></div>
                 <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 w-full h-full text-white">
                     <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="2" />
                     <path d="M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                     <path d="M15 9L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                 </svg>
             </div>
             <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tighter mb-2 font-['Press_Start_2P'] drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">DevBox</h1>
             <p className="text-blue-400 text-sm tracking-[0.3em] uppercase font-bold mb-6">All Systems Operational</p>
             
             {/* Added Project Description */}
             <div className={`transition-all duration-1000 delay-700 transform ${step >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-xs mx-auto font-medium border-t border-white/10 pt-6">
                    Набор профессиональных инструментов для разработчиков: конвертеры, генераторы и утилиты в одном приложении.
                </p>
             </div>
        </div>

      </div>
    </div>
  );
};