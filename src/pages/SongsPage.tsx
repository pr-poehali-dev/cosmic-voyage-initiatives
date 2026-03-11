import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import Icon from "@/components/ui/icon"
import { songs as builtinSongs, loadCustomSongs, saveCustomSong, deleteCustomSong } from "@/data/songs"
import type { Song } from "@/data/songs"

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
const levelOptions = ["A1", "A2", "B1", "B2"] as const
const COVERS = ["🎸", "🎹", "🎺", "🎻", "🥁", "🎤", "🎼", "👑", "🚀", "🌟", "💎", "🔥", "🌙", "🌊", "🎭"]

type FormData = {
  title: string
  artist: string
  year: string
  level: "A1" | "A2" | "B1" | "B2"
  genre: string
  cover: string
  lyricsEn: string
  lyricsRu: string
}

const defaultForm: FormData = {
  title: "",
  artist: "",
  year: String(new Date().getFullYear()),
  level: "A2",
  genre: "",
  cover: "🎸",
  lyricsEn: "",
  lyricsRu: "",
}

function AddSongModal({ onClose, onAdd }: { onClose: () => void; onAdd: (song: Song) => void }) {
  const [form, setForm] = useState<FormData>(defaultForm)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const validate = () => {
    const err: typeof errors = {}
    if (!form.title.trim()) err.title = "Введи название"
    if (!form.artist.trim()) err.artist = "Введи исполнителя"
    if (!form.lyricsEn.trim()) err.lyricsEn = "Добавь хотя бы одну строчку"
    const enLines = form.lyricsEn.trim().split("\n").filter(Boolean)
    const ruLines = form.lyricsRu.trim().split("\n").filter(Boolean)
    if (ruLines.length > 0 && ruLines.length !== enLines.length) err.lyricsRu = "Количество строк перевода должно совпадать с английскими строками"
    return err
  }

  const handleSubmit = () => {
    const err = validate()
    if (Object.keys(err).length) { setErrors(err); return }

    const enLines = form.lyricsEn.trim().split("\n").filter(Boolean)
    const ruLines = form.lyricsRu.trim().split("\n").filter(Boolean)

    const song: Song = {
      id: `custom-${Date.now()}`,
      title: form.title.trim(),
      artist: form.artist.trim(),
      year: Number(form.year) || new Date().getFullYear(),
      level: form.level,
      genre: form.genre.trim() || "Pop",
      cover: form.cover,
      lyrics: [{
        type: "verse",
        label: "Текст песни",
        lines: enLines.map((en, i) => ({ en, ru: ruLines[i] ?? "" })),
      }],
      exercises: [],
    }
    saveCustomSong(song)
    onAdd(song)
    onClose()
  }

  const inputCls = (err?: string) =>
    `w-full px-3 py-2.5 rounded-xl text-sm bg-white/70 border ${err ? "border-red-300" : "border-white/80"} focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder:text-gray-400`

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: "spring", damping: 24, stiffness: 300 }}
        className="relative w-full max-w-[480px] rounded-3xl p-6 overflow-y-auto max-h-[90vh]"
        style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(40px)", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">Добавить песню</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
            <Icon name="X" size={16} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Cover emoji */}
          <div>
            <p className="text-xs font-medium text-gray-600 mb-2">Обложка</p>
            <div className="flex flex-wrap gap-2">
              {COVERS.map(c => (
                <button key={c} onClick={() => setForm(f => ({ ...f, cover: c }))}
                  className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${form.cover === c ? "ring-2 ring-purple-500 bg-purple-50 scale-110" : "bg-white/60 border border-white/80 hover:bg-white"}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Title + Artist */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Название *</label>
              <input value={form.title} onChange={set("title")} placeholder="Yesterday" className={inputCls(errors.title)} />
              {errors.title && <p className="text-[10px] text-red-500 mt-1">{errors.title}</p>}
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Исполнитель *</label>
              <input value={form.artist} onChange={set("artist")} placeholder="The Beatles" className={inputCls(errors.artist)} />
              {errors.artist && <p className="text-[10px] text-red-500 mt-1">{errors.artist}</p>}
            </div>
          </div>

          {/* Year + Level + Genre */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Год</label>
              <input value={form.year} onChange={set("year")} type="number" min="1900" max="2030" className={inputCls()} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Уровень</label>
              <select value={form.level} onChange={set("level")}
                className="w-full px-3 py-2.5 rounded-xl text-sm bg-white/70 border border-white/80 focus:outline-none focus:ring-2 focus:ring-purple-300">
                {levelOptions.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Жанр</label>
              <input value={form.genre} onChange={set("genre")} placeholder="Pop" className={inputCls()} />
            </div>
          </div>

          {/* Lyrics */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Текст на английском * <span className="text-gray-400">(каждая строчка — новая строка)</span></label>
            <textarea value={form.lyricsEn} onChange={set("lyricsEn")} rows={5}
              placeholder={"Yesterday, all my troubles seemed so far away\nNow it looks as though they're here to stay"}
              className={`${inputCls(errors.lyricsEn)} resize-none font-mono text-xs leading-relaxed`} />
            {errors.lyricsEn && <p className="text-[10px] text-red-500 mt-1">{errors.lyricsEn}</p>}
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Перевод на русском <span className="text-gray-400">(необязательно, строка в строку)</span></label>
            <textarea value={form.lyricsRu} onChange={set("lyricsRu")} rows={5}
              placeholder={"Вчера все мои проблемы казались такими далёкими\nТеперь кажется, что они останутся здесь"}
              className={`${inputCls(errors.lyricsRu)} resize-none font-mono text-xs leading-relaxed`} />
            {errors.lyricsRu && <p className="text-[10px] text-red-500 mt-1">{errors.lyricsRu}</p>}
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-shadow"
          >
            Добавить песню
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function SongsPage() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState("Все")
  const [customSongs, setCustomSongs] = useState<Song[]>(() => loadCustomSongs())
  const [showAdd, setShowAdd] = useState(false)

  const allSongs = [...builtinSongs, ...customSongs]
  const filtered = filter === "Все" ? allSongs : allSongs.filter(s => s.level === filter)

  const handleAdd = (song: Song) => setCustomSongs(loadCustomSongs())

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    deleteCustomSong(id)
    setCustomSongs(loadCustomSongs())
  }

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
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900">Английский по песням</h1>
            <p className="text-xs text-gray-400">{allSongs.length} песни · интерактивные задания</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowAdd(true)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold shadow-md hover:shadow-lg transition-shadow"
          >
            <Icon name="Plus" size={14} />
            Добавить
          </motion.button>
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
          {filtered.map((song, i) => {
            const isCustom = song.id.startsWith("custom-")
            return (
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
                      {isCustom && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-600 font-semibold flex-shrink-0">МОЯ</span>}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{song.artist} · {song.year}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${levelColor[song.level]}`}>{song.level}</span>
                      <span className="text-[10px] text-gray-400">{song.genre}</span>
                      {song.exercises.length > 0 && <>
                        <span className="text-[10px] text-gray-300">·</span>
                        <span className="text-[10px] text-gray-400">{song.exercises.length} задания</span>
                      </>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {isCustom && (
                      <button
                        onClick={e => handleDelete(song.id, e)}
                        className="w-7 h-7 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-400 hover:bg-red-100 transition-colors"
                      >
                        <Icon name="Trash2" size={13} />
                      </button>
                    )}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-sm">
                      <Icon name="ChevronRight" size={15} className="text-white" />
                    </div>
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 space-y-2">
            <div className="text-4xl">🎵</div>
            <p className="text-gray-500 text-sm">Песни этого уровня пока не добавлены</p>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showAdd && <AddSongModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />}
      </AnimatePresence>
    </main>
  )
}

export default SongsPage
