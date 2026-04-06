import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, 
  Shield, 
  Cpu, 
  Command, 
  ChevronRight, 
  Hash, 
  Globe
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'agent',
      content: "IP CODEMAKER AGENT ONLINE. Neural Link Secure. System Optimized for Light Blue Protocol.",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- NEURAL VORTEX ENGINE (LIGHT BLUE) ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: { x: number; y: number; vx: number; vy: number; size: number }[] = [];
    const particleCount = 40;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: Math.random() * 1.5 + 0.5,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const accentColor = '56, 189, 248'; // Sky-400 (Light Blue)
      
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${accentColor}, 0.6)`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${accentColor}, ${0.1 * (1 - dist / 120)})`;
            ctx.stroke();
          }
        }
      });
      requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    createParticles();
    draw();

    return () => window.removeEventListener('resize', resize);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await response.json();
      
      const agentMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: data.response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, agentMsg]);
    } catch (error) {
      console.error("Link Failure:", error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#020617] text-sky-400 font-mono overflow-hidden select-none">
      {/* --- BACKGROUND --- */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.9)_100%)] pointer-events-none" />
      
      {/* --- SCANLINE EFFECT --- */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.03]" style={{
        background: 'repeating-linear-gradient(0deg, #000, #000 1px, transparent 1px, transparent 2px)',
        backgroundSize: '100% 2px'
      }} />

      {/* --- HUD --- */}
      <nav className="fixed top-0 left-0 right-0 z-40 border-b border-sky-900/30 bg-[#020617]/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src="/vortex-logo.png" className="w-8 h-8 rounded-lg shadow-[0_0_15px_rgba(56,189,248,0.2)]" alt="" />
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight">
              IP Codemaker Agent
              <span className="ml-3 text-[10px] opacity-40 font-black tracking-[0.2em] border border-sky-500/20 px-2 py-0.5 rounded">IP_Agent_001</span>
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 text-[10px] uppercase font-bold tracking-widest opacity-40">
          <div className="flex items-center gap-2 px-3 py-1 bg-sky-500/5 rounded-full border border-sky-500/10"><Shield size={12} /> SECURE SIGNAL</div>
          <div className="flex items-center gap-2"><Cpu size={12} /> Llama 405B</div>
          <div className="flex items-center gap-2"><Globe size={12} /> IP Verse</div>
        </div>
      </nav>

      {/* --- MAIN INTERFACE --- */}
      <main className="pt-28 pb-32 px-4 md:px-8 max-w-5xl mx-auto flex flex-col items-center">
        <div className="w-full space-y-8">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] md:max-w-[75%]`}>
                  <div className={`p-5 rounded-2xl border backdrop-blur-2xl transition-all duration-300
                    ${msg.role === 'user' 
                      ? 'bg-sky-500/10 border-sky-400/20 text-sky-50' 
                      : 'bg-slate-900/40 border-sky-900/40 text-sky-400'}
                  `}>
                    <div className="flex items-center gap-2 mb-2 opacity-30 text-[10px] font-black uppercase tracking-tighter">
                      {msg.role === 'agent' ? <ChevronRight size={14} className="text-sky-500" /> : <Terminal size={12} />}
                      {msg.role === 'user' ? 'Local_IO' : 'Agent_Response'}
                      <span className="ml-auto">{msg.timestamp.toLocaleTimeString()}</span>
                    </div>
                    
                    <div className="text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words font-medium">
                      {msg.content}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="flex items-center gap-3 text-[10px] font-black px-6 opacity-50 tracking-widest italic"
            >
              <div className="flex gap-1.5">
                {[0, 1, 2].map(i => (
                  <motion.div key={i} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, delay: i * 0.2 }} className="w-1 h-1 bg-sky-400 rounded-full" />
                ))}
              </div>
              AGENT STREAMING...
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* --- COMMAND CONSOLE --- */}
      <footer className="fixed bottom-0 left-0 right-0 p-8 z-40 bg-gradient-to-t from-[#020617] via-[#020617] to-transparent">
        <div className="max-w-4xl mx-auto relative group">
          <div className="relative flex bg-slate-900/60 rounded-xl border border-sky-500/10 backdrop-blur-3xl p-1.5 transition-all group-focus-within:border-sky-500/30">
            <div className="flex items-center justify-center w-12 opacity-30">
               <Command size={20} />
            </div>
            
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="ENTER COMMAND FOR IP CODEMAKER..."
              className="flex-1 bg-transparent px-4 py-3.5 text-sm focus:outline-none placeholder:opacity-20 text-sky-100"
            />
            
            <div className="flex items-center px-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSend}
                className="bg-sky-500 text-slate-950 px-6 py-2.5 rounded-lg font-black text-xs tracking-widest hover:bg-sky-400 transition-colors shadow-[0_0_15px_rgba(56,189,248,0.2)]"
              >
                ENGAGE
              </motion.button>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { 
          background: rgba(56, 189, 248, 0.1); 
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover { 
          background: rgba(56, 189, 248, 0.3); 
        }
      `}</style>
    </div>
  );
};

export default App;
