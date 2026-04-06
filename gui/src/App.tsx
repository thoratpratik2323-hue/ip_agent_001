import { useState, useEffect, useRef } from 'react'
import { 
  Terminal, 
  Settings, 
  FileCode, 
  ShieldCheck, 
  Cpu, 
  Command as CommandIcon, 
  Zap,
  ChevronRight,
  Database,
  RefreshCw,
  Copy,
  Power,
  Orbit,
  Radiation,
  Microscope,
  Menu,
  Activity,
  User,
  Palette
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

const API_BASE = 'http://localhost:5000/api'

export default function App() {
  const [messages, setMessages] = useState<any[]>([
    { type: 'system', content: '[LINK] Neural Link Optimized. IP Verse Core Synced.', timestamp: new Date() },
    { 
      type: 'agent', 
      content: 'Neural Link Established. Good to see you again, Agent Red.\n\nI have synchronized the workspace and established secure communication with the IP Verse core. The NVIDIA LLaMa 3.1-405B engine is at 100% capacity. How shall we impact the mission today, Pratik?', 
      timestamp: new Date() 
    }
  ])
  const [theme, setTheme] = useState<'red' | 'purple'>('red')
  const [inputValue, setInputValue] = useState('')
  const [status, setStatus] = useState<any>({ status: 'connecting...', tokens: 0, model: '...' })
  const [files, setFiles] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    fetchStatus()
    fetchFiles()
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Neural Background Canvas Effect
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    const particles: any[] = []
    const particleCount = 80

    const init = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          color: theme === 'red' ? 'rgba(255, 50, 50, 0.2)' : 'rgba(168, 85, 247, 0.2)'
        })
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = theme === 'red' ? 'rgba(255, 0, 0, 0.05)' : 'rgba(168, 85, 247, 0.05)'
      
      particles.forEach((p, i) => {
        p.x += p.speedX
        p.y += p.speedY

        if (p.x > canvas.width) p.x = 0
        if (p.x < 0) p.x = canvas.width
        if (p.y > canvas.height) p.y = 0
        if (p.y < 0) p.y = canvas.height

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()

        // Draw lines
        for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j]
            const dx = p.x - p2.x
            const dy = p.y - p2.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            if (distance < 150) {
              ctx.strokeStyle = theme === 'red' 
                ? `rgba(255, 50, 50, ${0.1 * (1 - distance / 150)})` 
                : `rgba(168, 85, 247, ${0.1 * (1 - distance / 150)})`
              ctx.lineWidth = 0.5
              ctx.beginPath()
              ctx.moveTo(p.x, p.y)
              ctx.lineTo(p2.x, p2.y)
              ctx.stroke()
            }
        }
      })
      animationFrameId = requestAnimationFrame(animate)
    }

    init()
    animate()
    return () => cancelAnimationFrame(animationFrameId)
  }, [theme])

  const fetchStatus = async () => {
    try {
      const res = await axios.get(`${API_BASE}/status`)
      setStatus(res.data)
    } catch (e) {
      console.error("Status fetch failed", e)
    }
  }

  const fetchFiles = async () => {
    try {
      const res = await axios.get(`${API_BASE}/files`)
      setFiles(res.data.files || [])
    } catch (e) {
      console.error("Files fetch failed", e)
    }
  }

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || loading) return

    const userCommand = inputValue
    setMessages(prev => [...prev, { type: 'user', content: userCommand, timestamp: new Date() }])
    setInputValue('')
    setLoading(true)

    try {
      const res = await axios.post(`${API_BASE}/execute`, { command: userCommand })
      setMessages(prev => [...prev, { 
        type: 'agent', 
        content: res.data.output, 
        timestamp: new Date(),
        isError: res.data.error 
      }])
    } catch (e) {
      setMessages(prev => [...prev, { 
        type: 'agent', 
        content: "Error: Could not reach backend server.", 
        timestamp: new Date(),
        isError: true 
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`flex h-screen w-full bg-[#05060a] text-white overflow-hidden font-sans selection:bg-${theme === 'red' ? 'red-500' : 'purple-500'}/30 transition-colors duration-500`}>
      {/* Canvas Background */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
      
      {/* HUD Glitch Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
      
      {/* 3D Sidebar Dock */}
      <aside className="w-20 lg:w-28 flex flex-col items-center py-10 bg-black/40 border-r border-white/5 space-y-12 z-20 relative backdrop-blur-xl">
        <motion.div 
          onClick={() => setTheme(theme === 'red' ? 'purple' : 'red')}
          animate={{ boxShadow: theme === 'red' ? ["0 0 10px #ef444433", "0 0 30px #ef444466", "0 0 10px #ef444433"] : ["0 0 10px #a855f733", "0 0 30px #a855f766", "0 0 10px #a855f733"] }}
          transition={{ duration: 3, repeat: Infinity }}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center p-3 border cursor-pointer hover:scale-110 transition-all duration-300 relative group overflow-hidden ${
            theme === 'red' ? 'bg-red-500/10 border-red-500/30' : 'bg-purple-500/10 border-purple-500/30'
          }`}
        >
          <Palette className={`w-full h-full group-hover:rotate-45 transition-transform ${theme === 'red' ? 'text-red-500' : 'text-purple-500'}`} />
          <div className="absolute inset-x-0 bottom-0 h-1 bg-current opacity-20"></div>
        </motion.div>
        
        <nav className="flex flex-col space-y-12 flex-1 items-center pt-8">
          <NavItem icon={<Terminal />} label="CMD" active color={theme === 'red' ? 'text-red-500' : 'text-purple-500'} />
          <NavItem icon={<FileCode />} label="CORE" color={theme === 'red' ? 'text-red-500' : 'text-purple-500'} />
          <NavItem icon={<Orbit />} label="HUD" color={theme === 'red' ? 'text-red-500' : 'text-purple-500'} />
          <NavItem icon={<Microscope />} label="SCAN" color={theme === 'red' ? 'text-red-500' : 'text-purple-500'} />
        </nav>

        <div className="mt-auto space-y-8 flex flex-col items-center">
            <NavItem icon={<Settings />} label="CONF" color={theme === 'red' ? 'text-red-500' : 'text-purple-500'} />
        </div>
      </aside>

      {/* Main Mission Control */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-10 p-4 lg:p-8">
        
        {/* Floating Header HUD */}
        <header className="h-20 bg-black/60 border border-white/5 backdrop-blur-3xl rounded-[2rem] flex items-center px-10 justify-between mb-8 shadow-2xl relative overflow-hidden group">
          <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000`}></div>
          
          <div className="flex flex-col">
             <div className="flex items-center space-x-4">
               <div className={`w-3 h-3 rounded-full ${theme === 'red' ? 'bg-red-500 shadow-[0_0_15px_#ef4444]' : 'bg-purple-500 shadow-[0_0_15px_#a855f7]'} animate-pulse`}></div>
               <h1 className="text-2xl font-mono font-black italic tracking-tighter">
                <span className={theme === 'red' ? 'text-red-500' : 'text-purple-500'}>NEURAL</span> CODEMAKER
               </h1>
               <div className={`px-2 py-0.5 rounded-full border text-[8px] font-mono tracking-widest ${theme === 'red' ? 'border-red-500/20 text-red-500/60' : 'border-purple-500/20 text-purple-500/60'}`}>
                 MISSION CAPABLE
               </div>
             </div>
             <p className="text-[10px] text-white/30 uppercase tracking-[.4em] font-bold mt-1">
               OPERATOR: AGENT {theme === 'red' ? 'RED' : 'PURPLE'} // IP-VERSE
             </p>
          </div>

          <div className="flex items-center space-x-12">
            <HudMetric icon={<Cpu />} label="NVIDIA 405B" value="100% ONLINE" color={theme === 'red' ? 'text-red-500' : 'text-purple-500'} />
            <HudMetric icon={<Radiation />} label="TOKEN LINK" value={status.tokens || 0} color={theme === 'red' ? 'text-red-500' : 'text-purple-500'} />
            
            <div className="flex items-center bg-white/5 rounded-2xl p-2 px-4 space-x-4 border border-white/5">
                <Menu className="w-5 h-5 text-white/20" />
            </div>
          </div>
        </header>

        {/* 3D Perspective Workspace */}
        <div className="flex-1 flex space-x-8 perspective-[2000px]">
          
          {/* File Vault (Left Panel) - Holographic Item List */}
          <motion.div 
            initial={{ rotateY: 5 }}
            whileHover={{ rotateY: 2 }}
            className="w-1/4 bg-black/40 border border-white/5 backdrop-blur-2xl rounded-[2.5rem] p-8 flex flex-col shadow-2xl transition-all"
          >
            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-1.5 rounded bg-white/5 ${theme === 'red' ? 'text-red-500' : 'text-purple-500'}`}>
                  <Database className="w-4 h-4" />
                </div>
                <h2 className="text-[10px] font-black tracking-widest text-white/60">FILE_VAULT.db</h2>
              </div>
              <RefreshCw onClick={fetchFiles} className="w-3 h-3 text-white/20 hover:text-white cursor-pointer transition-colors" />
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
              {files.map((f, i) => (
                <FileEntry key={f} name={f} delay={i} theme={theme} />
              ))}
            </div>

            <div className={`mt-8 p-4 rounded-2xl border border-dashed text-center font-mono ${theme === 'red' ? 'border-red-500/20 text-red-500/40' : 'border-purple-500/20 text-purple-500/40'}`}>
              <div className="text-[9px] uppercase tracking-widest">DRIVE_STATUS: NOMINAL</div>
            </div>
          </motion.div>

          {/* Neural Console (Right Panel) - Command Stream */}
          <motion.div 
            initial={{ rotateY: -5 }}
            whileHover={{ rotateY: -2 }}
            className="flex-1 flex flex-col bg-[#05060a]/60 border border-white/5 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto p-12 space-y-10 scrollbar-hide">
              <AnimatePresence mode="popLayout">
                {messages.map((m, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: m.type === 'user' ? 40 : -40, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`relative max-w-[85%] p-8 rounded-[3rem] transition-all group/msg ${
                      m.type === 'user' 
                        ? `bg-white/5 border border-white/10 ml-auto shadow-xl` 
                        : `bg-gradient-to-br border shadow-2xl ${
                            theme === 'red' 
                              ? 'from-red-500/10 via-red-950/20 to-black border-red-500/20' 
                              : 'from-purple-500/10 via-purple-950/20 to-black border-purple-500/20'
                          }`
                    }`}>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black border text-xs ${
                            m.type === 'user' ? 'bg-white/10 border-white/20 text-white' : theme === 'red' ? 'bg-red-500/20 border-red-500/40 text-red-500' : 'bg-purple-500/20 border-purple-500/40 text-purple-500'
                          }`}>
                            {m.type === 'user' ? <User className="w-5 h-5" /> : <Cpu className="w-5 h-5" />}
                          </div>
                          <div className="flex flex-col">
                            <span className={`text-[10px] font-black tracking-widest ${m.type === 'user' ? 'text-white/60' : theme === 'red' ? 'text-red-500' : 'text-purple-500'}`}>
                              {m.type === 'user' ? 'AGENT RED' : 'CODEMAKER UNIT'}
                            </span>
                            <span className="text-[8px] text-white/20 mt-1 uppercase font-bold">{m.timestamp.toLocaleTimeString()}</span>
                          </div>
                        </div>
                        {m.type === 'agent' && (
                          <Copy className="w-4 h-4 text-white/20 hover:text-white cursor-pointer transition-opacity opacity-0 group-hover/msg:opacity-100" />
                        )}
                      </div>
                      <pre className="font-mono text-[14px] text-white/80 leading-relaxed whitespace-pre-wrap break-words italic selection:bg-current selection:text-black">
                        {m.content}
                      </pre>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {loading && (
                <div className="flex justify-start">
                   <div className="flex items-center space-x-6 bg-white/5 p-6 rounded-[2rem] border border-white/5 italic">
                     <RefreshCw className={`w-5 h-5 animate-spin ${theme === 'red' ? 'text-red-500' : 'text-purple-500'}`} />
                     <span className="text-xs font-mono text-white/30 tracking-[0.3em] uppercase">Processing Mission Data...</span>
                   </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Tactical Control Bar Overlay */}
            <div className="p-10 relative">
               <form onSubmit={handleCommand} className="relative">
                 <div className={`absolute inset-0 blur-3xl opacity-20 -z-10 bg-${theme === 'red' ? 'red' : 'purple'}-500 transition-colors`}></div>
                 <div className="relative flex items-center bg-black/60 border border-white/10 rounded-full overflow-hidden hover:border-white/20 focus-within:border-current transition-all backdrop-blur-3xl group">
                    <CommandIcon className={`w-6 h-6 ml-8 mr-4 ${theme === 'red' ? 'text-red-500' : 'text-purple-500'}`} />
                    <input 
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      disabled={loading}
                      placeholder="ENTER MISSION PARAMETERS..."
                      className="flex-1 bg-transparent p-7 pl-4 text-sm font-mono tracking-widest focus:outline-none placeholder:text-white/10 uppercase"
                    />
                    <button 
                      type="submit"
                      className={`px-12 py-7 font-black tracking-[0.2em] uppercase text-[11px] transition-all ${
                        theme === 'red' ? 'bg-red-500 text-black hover:bg-white' : 'bg-purple-500 text-white hover:bg-white hover:text-black'
                      }`}
                    >
                      ENGAGE
                    </button>
                 </div>
               </form>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

function NavItem({ icon, label, active = false, color }: { icon: any, label: string, active?: boolean, color: string }) {
  return (
    <div className={`flex flex-col items-center group cursor-pointer space-y-2 transition-all ${active ? 'scale-110' : 'hover:scale-105'}`}>
      <div className={`w-10 h-10 flex items-center justify-center transition-all ${active ? color : 'text-white/20 group-hover:text-white/40'}`}>
        {icon}
      </div>
      <span className={`text-[8px] font-black tracking-widest uppercase ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'} transition-opacity`}>
        {label}
      </span>
    </div>
  )
}

function HudMetric({ icon, label, value, color }: { icon: any, label: string, value: any, color: string }) {
  return (
    <div className="flex items-center space-x-4">
      <div className={`p-2.5 bg-white/5 rounded-xl ${color}`}>
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-[8px] text-white/20 uppercase font-black tracking-[0.2em] mb-1">{label}</span>
        <span className="text-xs font-mono font-bold tracking-widest">{value}</span>
      </div>
    </div>
  )
}

function FileEntry({ name, delay, theme }: { name: string, delay: number, theme: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: delay * 0.02 }}
      className={`group flex items-center p-3.5 rounded-2xl cursor-pointer transition-all border border-transparent hover:bg-white/5 ${theme === 'red' ? 'hover:border-red-500/10' : 'hover:border-purple-500/10'}`}
    >
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center mr-4 transition-colors ${theme === 'red' ? 'bg-red-500/5 text-red-500/40 group-hover:bg-red-500/20' : 'bg-purple-500/5 text-purple-500/40 group-hover:bg-purple-500/20'}`}>
        <FileCode className="w-4 h-4" />
      </div>
      <span className="text-[11px] font-mono font-medium text-white/30 group-hover:text-white/80 truncate">
        {name}
      </span>
      <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-20 transition-opacity" />
    </motion.div>
  )
}
