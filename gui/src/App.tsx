import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, 
  Shield, 
  Cpu, 
  Command, 
  ChevronRight, 
  Globe
} from 'lucide-react';
import logo from './assets/logo.png'; // CANONICAL IMPORT FOR MISSION RELIABILITY

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
      content: "IP CODEMAKER AGENT ONLINE. Neural Link Synchronized. Emerald Protocol Engaged.",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- NEURAL VORTEX ENGINE (EMERALD MINT) ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: { x: number; y: number; vx: number; vy: number; size: number }[] = [];
    const particleCount = 50;

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
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 2 + 0.5,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const accentColor = '45, 212, 191'; 
      
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${accentColor}, 0.5)`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${accentColor}, ${0.12 * (1 - dist / 100)})`;
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
    <div className="relative min-h-screen bg-[#050505] text-teal-400 font-mono overflow-hidden select-none">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(45, 212, 191, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(45, 212, 191, 0.1) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,5,5,0.9)_100%)] pointer-events-none" />
      
      <nav className="fixed top-0 left-0 right-0 z-40 border-b border-teal-900/30 bg-[#050505]/90 backdrop-blur-3xl px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="w-11 h-11 bg-teal-400/10 rounded-xl border border-teal-400/20 flex items-center justify-center p-1 shadow-[0_0_20px_rgba(45,212,191,0.2)] overflow-hidden">
             <img src={logo} className="w-full h-full object-cover rounded-lg" alt="Vortex_Shard" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tight flex items-center gap-3">
              IP Codemaker Agent
              <span className="text-[9px] opacity-30 font-bold border border-teal-400/30 px-2 py-0.5 rounded tracking-[0.3em] uppercase">IP_Agent_001</span>
            </span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-8 text-[11px] font-black tracking-[0.2em] opacity-40 uppercase">
           <div className="flex items-center gap-2"><Globe size={14} className="text-teal-500" /> IP Verse</div>
           <div className="flex items-center gap-2 px-4 py-1.5 border border-teal-400/20 rounded-lg bg-teal-400/5"><Shield size={14} /> Link Secure</div>
        </div>
      </nav>

      <main className="pt-32 pb-40 px-6 md:px-12 max-w-5xl mx-auto flex flex-col items-center">
        <div className="w-full space-y-10">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[90%] md:max-w-[80%]`}>
                  <div className={`p-6 rounded-2xl border transition-all duration-500 shadow-2xl
                    ${msg.role === 'user' 
                      ? 'bg-teal-400/5 border-teal-400/20 text-teal-50' 
                      : 'bg-zinc-950/80 border-teal-900/40 text-teal-400 backdrop-blur-3xl'}
                  `}>
                    <div className="flex items-center gap-2 mb-3 opacity-20 text-[10px] font-black uppercase tracking-[0.2em]">
                      {msg.role === 'agent' ? <ChevronRight size={14} className="animate-pulse" /> : <Terminal size={14} />}
                      {msg.role === 'user' ? 'Local_Terminal' : 'Agent_Response'}
                      <span className="ml-auto">{msg.timestamp.toLocaleTimeString()}</span>
                    </div>
                    
                    <div className="text-sm md:text-[15px] leading-relaxed whitespace-pre-wrap break-words font-medium tracking-wide">
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
              className="flex items-center gap-4 text-[11px] font-black px-10 opacity-40 tracking-[0.4em] uppercase italic"
            >
              <div className="flex gap-2">
                {[0, 1, 2].map(i => (
                  <motion.div key={i} animate={{ y: [-3, 3, -3] }} transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }} className="w-1.5 h-1.5 bg-teal-400 rounded-full" />
                ))}
              </div>
              Streaming_Link...
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-10 z-40 bg-gradient-to-t from-[#050505] via-[#050505]/95 to-transparent">
        <div className="max-w-4xl mx-auto relative group">
          <div className="absolute -inset-1 rounded-2xl bg-teal-400/5 blur-xl group-focus-within:bg-teal-400/10 transition-all opacity-0 group-focus-within:opacity-100" />
          
          <div className="relative flex bg-zinc-950/80 rounded-xl border border-teal-400/10 backdrop-blur-3xl p-2 transition-all duration-300 group-focus-within:border-teal-400/40 group-focus-within:shadow-[0_0_30px_rgba(45,212,191,0.1)]">
            <div className="flex items-center justify-center w-14 opacity-20">
               <Command size={24} />
            </div>
            
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="ENTER MISSION COMMAND..."
              className="flex-1 bg-transparent px-5 py-4 text-sm focus:outline-none placeholder:opacity-20 text-teal-100"
            />
            
            <div className="flex items-center px-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSend}
                className="bg-teal-400 text-black px-8 py-3 rounded-lg font-black text-xs tracking-[0.2em] uppercase hover:bg-teal-300 transition-all shadow-[0_0_20px_rgba(45,212,191,0.2)]"
              >
                ENGAGE
              </motion.button>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { 
          background: rgba(45, 212, 191, 0.1); 
          border-radius: 20px;
        }
        ::-webkit-scrollbar-thumb:hover { 
          background: rgba(45, 212, 191, 0.3); 
        }
      `}</style>
    </div>
  );
};

export default App;
