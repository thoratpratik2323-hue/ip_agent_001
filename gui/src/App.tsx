import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Terminal, 
  Shield, 
  Cpu, 
  Command, 
  ChevronRight, 
  Globe,
  Zap,
  Activity,
  Box,
  Database,
  Code2,
  Clock,
  Layers,
  Settings,
  LayoutDashboard,
  Maximize2,
  History,
  MoreVertical,
  Plus,
  ArrowRight,
  Edit2,
  Trash2,
  Send,
  Menu,
  PanelLeftClose,
  Search,
  Copy,
  Check
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "./lib/utils";

// --- THEME DEFINITION ---
const THEME = {
  primary: "#00d2ff",
  secondary: "#9333ea",
  pc: "0, 210, 255",
  label: "Neural · Default",
  name: "Agent Blue",
  mode: "Vortex Protocol",
  avt: "AB"
};

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Project {
  id: string;
  name: string;
  lastModified: Date;
}

// --- COMPONENTS ---

const VortexCanvas = ({ themeColor }: { themeColor: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: any[] = [];
    const resize = () => {
      canvas.width = canvas.parentElement?.offsetWidth || 0;
      canvas.height = canvas.parentElement?.offsetHeight || 0;
    };

    const init = () => {
      particles = [];
      for (let i = 0; i < 60; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.5 + 0.3,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          alpha: Math.random() * 0.4 + 0.1
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${themeColor}, ${p.alpha})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dist = Math.hypot(p.x - q.x, p.y - q.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(${themeColor}, ${0.1 * (1 - dist / 120)})`;
            ctx.stroke();
          }
        }
      });
      requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    resize(); init(); draw();
    return () => window.removeEventListener("resize", resize);
  }, [themeColor]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen" />;
};

const StatCard = ({ label, value, sub, spark, accent }: { label: string; value: string; sub: string; spark?: boolean; accent: string }) => (
  <div className="stat-card group">
    <div className="text-[9px] font-black tracking-widest opacity-30 mb-1.5 uppercase">{label}</div>
    <div className="text-2xl font-black text-white glow-text-blue" style={{ textShadow: `0 0 15px ${accent}66` }}>{value}</div>
    <div className="text-[10px] opacity-30 mt-1 font-mono">{sub}</div>
    {spark && (
      <div className="flex items-end gap-0.5 h-6 mt-4">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i} 
            className="flex-1 rounded-t-[1px] transition-all duration-500" 
            style={{ 
              height: `${20 + Math.random() * 80}%`, 
              backgroundColor: `${accent}${Math.floor(i * 15 + 20).toString(16)}` 
            }} 
          />
        ))}
      </div>
    )}
  </div>
);

const Gauge = ({ name, value, accent }: { name: string; value: number; accent: string }) => (
  <div className="mb-5">
    <div className="flex justify-between items-center mb-1.5">
      <div className="text-[10px] font-bold opacity-30 uppercase tracking-tighter">{name}</div>
      <div className="text-[9px] font-mono opacity-40" style={{ color: accent }}>{value.toFixed(0)}%</div>
    </div>
    <div className="h-[2px] bg-white/5 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1 }}
        className="h-full rounded-full"
        style={{ backgroundColor: accent }}
      />
    </div>
  </div>
);

const CodeBlock = ({ inline, className, children, ...props }: any) => {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  const handleCopy = () => {
    const text = String(children).replace(/\n$/, "");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (inline) {
    return <code className={cn("bg-white/10 px-1.5 py-0.5 rounded text-cyan-400 font-mono text-[13px]", className)} {...props}>{children}</code>;
  }

  return (
    <div className="relative group my-6 first:mt-0 last:mb-0">
      <div className="absolute right-3 top-3 z-20">
        <button
          onClick={handleCopy}
          className={cn(
            "p-2 rounded-lg transition-all duration-300 backdrop-blur-md border border-white/10 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest",
            copied ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
          )}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className={cn("p-6 overflow-x-auto rounded-xl bg-black/40 border border-white/5 custom-scrollbar text-[13px] leading-relaxed", className)}>
        <code className="block font-mono text-cyan-500/90" {...props}>{children}</code>
      </pre>
    </div>
  );
};

export default function App() {
  const theme = THEME;
  const themeKey = "blue";
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [projects, setProjects] = useState<Project[]>([
    { id: "1", name: "PROJECT_VORTEX_ALPHA", lastModified: new Date() },
    { id: "2", name: "NEURAL_CORE_V2", lastModified: new Date(Date.now() - 86400000) },
  ]);

  const [gauges, setGauges] = useState({ cpu: 42, mem: 68, net: 22, engine: 94 });
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setGauges({
        cpu: Math.min(100, Math.max(0, 35 + Math.random() * 20)),
        mem: Math.min(100, Math.max(0, 65 + Math.random() * 5)),
        net: Math.min(100, Math.max(0, 15 + Math.random() * 30)),
        engine: Math.min(100, Math.max(0, 92 + Math.random() * 8))
      });
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const resp = await fetch("http://localhost:5000/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: input }),
      });
      
      const data = await resp.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.error ? `### ENGINE_FAILURE\n\n${data.output}` : data.output,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `### CONNECTION_FAILURE\n\nUnauthorized or broken link to Claw Backend (Port 5000). Ensure \`server.py\` is active.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden relative bg-[#07070f] text-[#c8c8e0] font-mono selection:bg-white/10 antialiased">
      <VortexCanvas themeColor={theme.pc} />
      <div className="neural-mesh pointer-events-none" />

      {/* --- MAIN AREA --- */}
      <main className="flex-1 flex flex-col relative min-w-0 h-full">
        <header className="h-16 flex items-center justify-between px-6 bg-[#0c0c1a]/80 backdrop-blur-3xl border-b border-white/10 z-50">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black italic text-lg border border-white/20 bg-black shadow-lg" style={{ color: theme.primary }}>IP</div>
            <div className="hidden sm:block">
                <h1 className="text-sm font-black tracking-tighter text-white uppercase italic leading-none">IP Codemaker</h1>
                <p className="text-[8px] font-mono mt-0.5 opacity-40 uppercase tracking-widest" style={{ color: theme.primary }}>ip_agent_001</p>
              </div>
            </div>
            
            <div className="h-6 w-[1px] bg-white/10 mx-2" />
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-6">
              <div className="flex flex-col gap-1">
                <span className="text-[7px] font-bold text-gray-500 uppercase tracking-widest">Neural Load</span>
                <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full transition-all duration-1000" style={{ width: `${gauges.engine}%`, backgroundColor: theme.primary }} />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[7px] font-bold text-gray-500 uppercase tracking-widest">Memory</span>
                <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full transition-all duration-1000" style={{ width: `${gauges.mem}%`, backgroundColor: theme.primary }} />
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 border-l border-white/10 pl-6 text-gray-500">
              <Shield className="w-4 h-4" />
              <Activity className="w-4 h-4" />
              <Settings className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
          {messages.length === 0 ? (
            <div className="h-full max-w-5xl mx-auto flex flex-col justify-center">
              <div className="grid grid-cols-3 gap-6 mb-12">
                <StatCard label="Token Pool" value="1.4M" sub="Available Context" accent={theme.primary} spark />
                <StatCard label="Neural Latency" value="12ms" sub="Real-time link" accent={theme.primary} />
                <StatCard label="Model Core" value="405B" sub="Llama v3.1 Vortex" accent={theme.primary} spark />
              </div>

              <div className="text-center mb-12">
                <motion.h2 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-5xl font-black italic uppercase tracking-tighter text-white glow-text-blue"
                  style={{ textShadow: `0 0 30px ${theme.primary}33` }}
                >
                  Neural Interface <span style={{ color: theme.primary }}>Online</span>
                </motion.h2>
                <div className="mt-8 flex justify-center gap-6 text-[10px] font-black uppercase tracking-[0.4em] opacity-20">
                  <span>AES-256 Encryption</span>
                  <span>|</span>
                  <span>Autonomous Logic</span>
                  <span>|</span>
                  <span>Secure Sandbox</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { icon: Code2, label: "Core Gen", desc: "Logic Synthesis" },
                  { icon: Zap, label: "Burst Mode", desc: "Turbo Inference" },
                  { icon: Terminal, label: "Debug Link", desc: "System Probe" },
                  { icon: Globe, label: "Net Search", desc: "Knowledge Sync" },
                ].map((item, i) => (
                  <button key={i} className="p-6 stat-card hover:translate-y-[-4px] group">
                    <item.icon className="w-7 h-7 mb-4 transition-all group-hover:scale-110" style={{ color: theme.primary }} />
                    <p className="text-[12px] font-black text-white italic uppercase tracking-widest">{item.label}</p>
                    <p className="text-[9px] opacity-30 mt-1 uppercase leading-tight">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-14">
              {messages.map((m) => (
                <motion.div 
                  key={m.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className={cn("flex flex-col gap-5", m.role === "user" ? "items-end" : "items-start")}
                >
                  <div className="flex items-center gap-3 px-2">
                    {m.role === "assistant" && <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: theme.primary }} />}
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40">
                      {m.role === "user" ? "Protocol Operator" : `ip_agent_001 · VORTEX PROTOCOL`}
                    </span>
                  </div>
                  <div className={cn(
                    "glass-panel relative group",
                    m.role === "user" 
                      ? "bg-white/10 rounded-tr-none border-white/20 p-4 max-w-[70%]" 
                      : "bg-black/60 rounded-tl-none border-white/5 shadow-inner p-6 max-w-[80%]"
                  )}>
                   <div className="prose prose-invert max-w-none prose-pre:bg-transparent prose-pre:p-0 prose-pre:border-none prose-code:text-cyan-400 text-sm leading-relaxed">
                    <ReactMarkdown components={{ code: CodeBlock }}>{m.content}</ReactMarkdown>
                  </div>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex flex-col items-start gap-3">
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-30 animate-pulse">Synthesizing Neural Buffer...</span>
                  <div className="p-4 glass-panel bg-black/60 rounded-tl-none flex items-center gap-5 shadow-inner">
                    <div className="flex gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: theme.primary, animationDelay: "0ms" }} />
                      <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: theme.primary, animationDelay: "150ms" }} />
                      <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: theme.primary, animationDelay: "300ms" }} />
                    </div>
                    <span className="text-[10px] font-mono opacity-20 lowercase italic tracking-tighter">link operational · analyzing schematic...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* --- COMMAND INPUT --- */}
        {/* --- COMMAND INPUT --- */}
        <div className="p-8 pt-0 z-40 bg-gradient-to-t from-[#07070f] via-[#07070f]/80 to-transparent">
          <div className="max-w-4xl mx-auto relative group">
            <div className="absolute -inset-1 blur-2xl opacity-10 group-focus-within:opacity-30 transition-all duration-700 pointer-events-none" style={{ backgroundColor: theme.primary }} />
            <div className="relative glass-panel bg-[#0c0c1a]/95 p-2 flex items-center gap-2 rounded-2xl border-white/5 group-hover:border-white/10 transition-all shadow-xl">
              <div className="p-3 rounded-xl bg-black shadow-inner flex items-center justify-center">
                <Terminal className="w-5 h-5" style={{ color: theme.primary }} />
              </div>
              <input 
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSend()}
                placeholder="Enter Neural Mandate Sequence..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-white font-mono placeholder:text-gray-800 py-2.5 text-base tracking-tight"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="p-3 rounded-xl transition-all active:scale-95 disabled:opacity-20 shadow-xl hover:scale-105 flex items-center justify-center"
                style={{ backgroundColor: theme.primary, color: "black" }}
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.03); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.08); }
      `}</style>
    </div>
  );
}
