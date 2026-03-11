import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import Icon from "@/components/ui/icon"
import { songs } from "@/data/songs"

const levelColor: Record<string, string> = {
  A1: "bg-green-100 text-green-700",
  A2: "bg-blue-100 text-blue-700",
  B1: "bg-purple-100 text-purple-700",
  B2: "bg-orange-100 text-orange-700",
}

const glassStyle = {
  background: "rgba(255,255,255,0.45)",
  backdropFilter: "blur(40px) saturate(180%)",
  WebkitBackdropFilter: "blur(40px) saturate(180%)",
  boxShadow: "inset 0 1px 1px rgba(255,255,255,0.9), 0 0 0 1px rgba(255,255,255,0.6), 0 8px 32px rgba(0,0,0,0.08)",
}

const levels = ["Все", "A1", "A2", "B1", "B2"]

export function SongsPage() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState("Все")

  const filtered = filter === "Все" ? songs : songs.filter(s => s.level === filter)

  return (
    <main className="relative min-h-screen px-6 py-10 overflow-hidden">
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-slate-50 via-white to-slate-100" />
      <motion.div className="fixed z-0 w-[500px] h-[500px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(147,51,234,0.22) 0%, transparent 70%)", filter: "blur(70px)", top: "-10%", left: "-10%" }}
        animate={{ x: [0, 100, 50, 0], y: [0, 50, 100, 0], scale: [1, 1.2, 0.9, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="fixed z-0 w-[600px] h-[600px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(236,72,153,0.18) 0%, transparent 70%)", filter: "blur(80px)", top: "30%", right: "-20%" }}
        animate={{ x: [0, -80, -40, 0], y: [0, 80, -40, 0], scale: [1, 0.85, 1.15, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }} />

      <div className="relative z-10 mx-auto max-w-[480px] w-full pb-20">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-8">
          <a href="/"
            className="flex items-center justify-center h-9 w-9 rounded-full bg-white/60 border border-white/80 text-gray-500 hover:text-gray-700 transition-colors flex-shrink-0"
            style={{ backdropFilter: "blur(10px)" }}>
            <Icon name="ArrowLeft" size={18} />
          </a>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Английский по песням</h1>
            <p className="text-xs text-gray-400">{songs.length} песни · интерактивные задания</p>
          </div>
        </motion.div>

        {/* Level filter */}
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-none">
          {levels.map(lvl => (
            <button key={lvl} onClick={() => setFilter(lvl)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${filter === lvl ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md" : "bg-white/60 border border-white/80 text-gray-600 hover:bg-white/80"}`}
              style={{ backdropFilter: "blur(10px)" }}>
              {lvl}
            </button>
          ))}
        </motion.div>

        {/* Songs grid */}
        <div className="space-y-3">
          {filtered.map((song, i) => (
            <motion.button
              key={song.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.06 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/songs/${song.id}`)}
              className="w-full text-left rounded-2xl p-4 transition-all hover:scale-[1.01]"
              style={glassStyle}
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 flex-shrink-0 border border-white/80">
                  {song.cover}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h2 className="text-base font-bold text-gray-900 truncate">{song.title}</h2>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{song.artist} · {song.year}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${levelColor[song.level]}`}>{song.level}</span>
                    <span className="text-[10px] text-gray-400">{song.genre}</span>
                    <span className="text-[10px] text-gray-300">·</span>
                    <span className="text-[10px] text-gray-400">{song.exercises.length} задания</span>
                  </div>
                </div>
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-sm">
                  <Icon name="ChevronRight" size={15} className="text-white" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 space-y-2">
            <div className="text-4xl">🎵</div>
            <p className="text-gray-500 text-sm">Песни этого уровня пока не добавлены</p>
          </motion.div>
        )}
      </div>
    </main>
  )
}

export default SongsPage
