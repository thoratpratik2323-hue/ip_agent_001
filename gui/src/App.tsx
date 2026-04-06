import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, 
  Shield, 
  Cpu, 
  Activity, 
  Zap, 
  Layers, 
  Command, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  Hash, 
  Settings,
  Database,
  Eye,
  Globe,
  Share2,
  Trash2,
  Copy,
  PlusCircle,
  Palette
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
  theme?: 'red' | 'purple';
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'agent',
      content: "IP CODEMAKER AGENT (ip_agent_001) ONLINE. Neural Link Secure. Awaiting Mission Directives.",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [theme, setTheme] = useState<'red' | 'purple'>('red');
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- NEURAL VORTEX ENGINE (V2) ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: { x: number; y: number; vx: number; vy: number; size: number }[] = [];
    const particleCount = 60;

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
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const accentColor = theme === 'red' ? '255, 69, 0' : '138, 43, 226';
      
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
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${accentColor}, ${0.15 * (1 - dist / 150)})`;
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
  }, [theme]);

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
        timestamp: new Date(),
        theme: theme
      };
      setMessages(prev => [...prev, agentMsg]);
    } catch (error) {
      console.error("Link Failure:", error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={`relative min-h-screen ${theme === 'red' ? 'bg-black text-orange-500' : 'bg-black text-purple-400'} font-mono overflow-hidden select-none`}>
      {/* --- BACKGROUND VORTEX --- */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />
      
      {/* --- SCANLINE OVERLAY --- */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.05]" style={{
        background: 'repeating-linear-gradient(0deg, #000, #000 1px, transparent 1px, transparent 2px)',
        backgroundSize: '100% 2px'
      }} />

      {/* --- TOP TACTICAL HUD --- */}
      <nav className={`fixed top-0 left-0 right-0 z-40 border-b ${theme === 'red' ? 'border-orange-900/40 bg-black/60' : 'border-purple-900/40 bg-black/60'} backdrop-blur-xl px-6 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 180 }}
            onClick={() => setTheme(theme === 'red' ? 'purple' : 'red')}
            className={`p-2 rounded-lg cursor-pointer ${theme === 'red' ? 'bg-orange-500/10 text-orange-500 shadow-[0_0_15px_rgba(255,69,0,0.3)]' : 'bg-purple-500/10 text-purple-400 shadow-[0_0_15px_rgba(138,43,226,0.3)]'}`}
          >
            <Palette size={20} />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-[0.3em] opacity-60 font-bold">Project Designation</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight flex items-center gap-2">
                <img src="/vortex-logo.png" className="w-5 h-5 rounded-full" alt="" />
                IP CODEMAKER <span className="opacity-40">001</span>
              </span>
              <div className={`w-2 h-2 rounded-full animate-pulse ${theme === 'red' ? 'bg-orange-500 shadow-[0_0_8px_#ff4500]' : 'bg-purple-500 shadow-[0_0_8px_#a855f7]'}`} />
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-[10px] uppercase font-bold tracking-widest opacity-60">
          <div className="flex items-center gap-2"><Cpu size={12} /> Model: Llama-3.1-405B</div>
          <div className="flex items-center gap-2"><Globe size={12} /> Region: IP Verse Node</div>
          <div className="flex items-center gap-2"><Shield size={12} /> Signal: AES-256 Encrypted</div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`px-3 py-1 rounded border ${theme === 'red' ? 'border-orange-500/30 text-orange-500' : 'border-purple-500/30 text-purple-400'} text-[10px] font-bold`}>
            {theme === 'red' ? 'AGENT RED' : 'AGENT PURPLE'} MODE
          </div>
        </div>
      </nav>

      {/* --- SIDE DENSE METRICS --- */}
      <div className="fixed left-6 top-32 z-40 hidden xl:flex flex-col gap-6 w-16">
         {[Activity, Zap, Layers, Database].map((Icon, idx) => (
           <motion.div 
             key={idx}
             whileHover={{ x: 5 }}
             className={`p-4 rounded-xl border ${theme === 'red' ? 'border-orange-900/20 bg-black/40 text-orange-500/40 hover:text-orange-500' : 'border-purple-900/20 bg-black/40 text-purple-500/40 hover:text-purple-400'} backdrop-blur-md transition-colors cursor-help`}
           >
             <Icon size={20} />
             <div className="h-4 w-1 mt-2 bg-current rounded-full opacity-20" />
           </motion.div>
         ))}
      </div>

      {/* --- MAIN VORTEX CHAT --- */}
      <main className={`pt-24 pb-32 px-4 md:px-8 max-w-6xl mx-auto flex flex-col items-center transition-all duration-700 ${isExpanded ? 'max-w-full scale-100' : 'scale-[0.98]'}`} style={{ 
        perspective: '1200px',
        transform: 'translateZ(0px)'
      }}>
        <div className="w-full space-y-6" style={{ transform: 'rotateX(2deg)' }}>
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: msg.role === 'user' ? 40 : -40, z: -100 }}
                animate={{ opacity: 1, x: 0, z: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`relative max-w-[85%] md:max-w-[70%] group`}>
                  {/* Glassmorphic Bubble */}
                  <div className={`p-4 md:p-6 rounded-2xl md:rounded-3xl border backdrop-blur-3xl shadow-2xl transition-all duration-300
                    ${msg.role === 'user' 
                      ? (theme === 'red' ? 'bg-orange-500/10 border-orange-500/30 text-orange-100' : 'bg-purple-500/10 border-purple-500/30 text-purple-100') 
                      : (theme === 'red' ? 'bg-black/60 border-orange-900/40' : 'bg-black/60 border-purple-900/40')}
                  `}>
                    <div className="flex items-center gap-2 mb-2 opacity-40 text-[10px] font-bold tracking-tighter">
                      {msg.role === 'agent' ? <ChevronRight size={14} className="text-current animate-pulse" /> : <Terminal size={12} />}
                      {msg.role === 'user' ? 'CONTROL_COMMAND' : `AGENT_RESPONSE // MISSION_${msg.id.slice(-4)}`}
                      <span className="ml-auto">{msg.timestamp.toLocaleTimeString()}</span>
                    </div>
                    
                    <div className="text-sm md:text-base leading-relaxed tracking-wide whitespace-pre-wrap break-words font-light">
                      {msg.content}
                    </div>
                  </div>

                  {/* Aesthetic Shadow/Glow */}
                  <div className={`absolute -inset-1 rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none
                    ${theme === 'red' ? 'bg-orange-500' : 'bg-purple-500'}`} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className={`flex items-center gap-2 text-xs font-black p-4 italic opacity-80 ${theme === 'red' ? 'text-orange-500' : 'text-purple-400'}`}
            >
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <motion.div key={i} animate={{ y: [-2, 2, -2] }} transition={{ repeat: Infinity, delay: i * 0.1 }} className="w-1.5 h-1.5 bg-current rounded-full" />
                ))}
              </div>
              DECRYPTING NEURAL STREAM...
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* --- COMMAND DOCK (V2) --- */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 z-40 bg-gradient-to-t from-black via-black/90 to-transparent">
        <div className="max-w-4xl mx-auto relative group">
          {/* Animated Glow Border */}
          <div className={`absolute -inset-[2px] rounded-2xl blur-sm opacity-50 group-focus-within:opacity-100 transition-opacity
            ${theme === 'red' ? 'bg-gradient-to-r from-orange-600 via-red-500 to-orange-600' : 'bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-600'}`} />
          
          <div className="relative flex bg-black/80 rounded-2xl border border-white/10 backdrop-blur-2xl p-1 overflow-hidden">
            <div className={`flex items-center justify-center w-14 border-r border-white/5 opacity-50 ${theme === 'red' ? 'text-orange-500' : 'text-purple-400'}`}>
               <Command size={22} className="animate-pulse" />
            </div>
            
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={theme === 'red' ? "AGENT RED // INPUT COMMAND..." : "AGENT PURPLE // AWAITING DIRECTIVES..."}
              className={`flex-1 bg-transparent px-6 py-4 text-sm focus:outline-none placeholder:opacity-30 ${theme === 'red' ? 'text-orange-100' : 'text-purple-100'}`}
            />
            
            <div className="flex items-center gap-1 px-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                className={`p-3 rounded-xl transition-all font-black text-xs tracking-widest flex items-center gap-2
                  ${theme === 'red' 
                    ? 'bg-orange-500 text-black hover:bg-orange-400 shadow-[0_0_20px_rgba(255,69,0,0.4)]' 
                    : 'bg-purple-500 text-black hover:bg-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.4)]'}`}
              >
                ENGAGE <ChevronRight size={16} strokeWidth={3} />
              </motion.button>
            </div>
          </div>
        </div>
      </footer>

      {/* --- HUD DECORATIONS --- */}
      <div className={`fixed bottom-8 right-8 z-50 text-[10px] font-bold opacity-30 tracking-[0.5em] hidden lg:block ${theme === 'red' ? 'text-orange-500' : 'text-purple-400'}`}>
        VORTEX_PROTOCOL_v.1.00.01 // SYSTEM_READY
      </div>

      <style>{`
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
        ::-webkit-scrollbar-thumb { 
          background: ${theme === 'red' ? 'rgba(255,69,0,0.2)' : 'rgba(168,85,247,0.2)'}; 
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover { 
          background: ${theme === 'red' ? 'rgba(255,69,0,0.4)' : 'rgba(168,85,247,0.4)'}; 
        }
      `}</style>
    </div>
  );
};

export default App;
