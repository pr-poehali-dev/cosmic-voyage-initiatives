import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Icon from "@/components/ui/icon"

// ─── Types ───────────────────────────────────────────────────────────────────

type FillEx = {
  id: string; type: "fill"; instruction: string
  text: string[]; answer: string; options: string[]
}
type MatchEx = {
  id: string; type: "match"; instruction: string
  pairs: { word: string; translation: string }[]
}
type OrderEx = {
  id: string; type: "order"; instruction: string
  words: string[]; answer: string[]
}
type SongExercise = FillEx | MatchEx | OrderEx

type LyricLine = { en: string; ru: string }
type LyricSection = { type: "verse" | "chorus"; label: string; lines: LyricLine[] }

type SongData = {
  title: string; artist: string; year: number
  audioUrl: string | null
  lyrics: LyricSection[]
  exercises: SongExercise[]
}

// ─── Default data ─────────────────────────────────────────────────────────────

const defaultSong: SongData = {
  title: "Yesterday",
  artist: "The Beatles",
  year: 1965,
  audioUrl: null,
  lyrics: [
    { type: "verse", label: "Куплет 1", lines: [
      { en: "Yesterday, all my troubles seemed so far away", ru: "Вчера все мои проблемы казались такими далёкими" },
      { en: "Now it looks as though they're here to stay", ru: "Теперь кажется, что они останутся здесь" },
      { en: "Oh, I believe in yesterday", ru: "О, я верю во вчера" },
    ]},
    { type: "chorus", label: "Припев", lines: [
      { en: "Why she had to go I don't know, she wouldn't say", ru: "Почему она ушла — не знаю, она не говорила" },
      { en: "I said something wrong, now I long for yesterday", ru: "Я сказал что-то не то, теперь я тоскую по вчера" },
    ]},
  ],
  exercises: [
    { id: "s-fill-1", type: "fill", instruction: "Вставь пропущенное слово",
      text: ["Yesterday, all my", "___", "seemed so far away"], answer: "troubles",
      options: ["troubles", "friends", "dreams", "words"] },
    { id: "s-match-1", type: "match", instruction: "Сопоставь слова с переводом",
      pairs: [{ word: "troubles", translation: "проблемы" }, { word: "shadow", translation: "тень" },
              { word: "suddenly", translation: "внезапно" }, { word: "believe", translation: "верить" }] },
    { id: "s-order-1", type: "order", instruction: "Собери строчку из песни по порядку",
      words: ["over", "hanging", "there's", "me", "a", "shadow"],
      answer: ["there's", "a", "shadow", "hanging", "over", "me"] },
  ],
}

const glassStyle = {
  background: "rgba(255,255,255,0.45)",
  backdropFilter: "blur(40px) saturate(180%)",
  WebkitBackdropFilter: "blur(40px) saturate(180%)",
  boxShadow: "inset 0 1px 1px rgba(255,255,255,0.9), 0 0 0 1px rgba(255,255,255,0.6), 0 8px 32px rgba(0,0,0,0.08)",
}

// ─── Exercise players ─────────────────────────────────────────────────────────

function FillPlayer({ ex, onComplete }: { ex: FillEx; onComplete: () => void }) {
  const [selected, setSelected] = useState<string | null>(null)
  const isCorrect = selected === ex.answer
  const isWrong = selected !== null && !isCorrect
  return (
    <div className="space-y-4">
      <div className="text-center text-sm font-medium text-gray-700 leading-relaxed">
        {ex.text.map((part, i) =>
          part === "___"
            ? <span key={i} className={`inline-block mx-1 px-3 py-0.5 rounded-lg border-2 font-semibold transition-all ${isCorrect ? "border-green-400 bg-green-50 text-green-700" : isWrong ? "border-red-300 bg-red-50 text-red-500" : selected ? "border-blue-300 bg-blue-50 text-blue-700" : "border-dashed border-gray-300 text-gray-400"}`}>{selected || "___"}</span>
            : <span key={i}>{part} </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {ex.options.map(opt => (
          <motion.button key={opt} whileTap={{ scale: 0.96 }} onClick={() => { if (!isCorrect) setSelected(opt) }}
            className={`py-2 px-3 rounded-xl text-sm font-medium transition-all ${selected === opt && isCorrect ? "bg-green-100 border-2 border-green-400 text-green-700" : selected === opt && isWrong ? "bg-red-100 border-2 border-red-300 text-red-500" : "bg-white/60 border border-white/80 text-gray-700 hover:bg-white/80"}`}
            style={{ backdropFilter: "blur(10px)" }}>{opt}</motion.button>
        ))}
      </div>
      <AnimatePresence>
        {isCorrect && <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
          <p className="text-green-600 font-semibold text-sm">Верно! 🎉</p>
          <button onClick={onComplete} className="px-5 py-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium">Дальше →</button>
        </motion.div>}
        {isWrong && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-red-500 text-xs">Попробуй ещё раз!</motion.p>}
      </AnimatePresence>
    </div>
  )
}

function MatchPlayer({ ex, onComplete }: { ex: MatchEx; onComplete: () => void }) {
  const [sel, setSel] = useState<string | null>(null)
  const [matched, setMatched] = useState<Record<string, string>>({})
  const handleTr = (tr: string) => {
    if (!sel) return
    if (ex.pairs.find(p => p.word === sel)?.translation === tr) setMatched(prev => ({ ...prev, [sel]: tr }))
    setSel(null)
  }
  const allDone = Object.keys(matched).length === ex.pairs.length
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">{ex.pairs.map(({ word }) => (
          <motion.button key={word} whileTap={{ scale: 0.96 }} onClick={() => { if (!matched[word]) setSel(word) }}
            className={`w-full py-2 px-3 rounded-xl text-sm font-medium transition-all ${matched[word] ? "bg-green-100 border-2 border-green-400 text-green-700" : sel === word ? "bg-purple-100 border-2 border-purple-400 text-purple-700" : "bg-white/60 border border-white/80 text-gray-700 hover:bg-white/80"}`}
            style={{ backdropFilter: "blur(10px)" }}>{word}</motion.button>
        ))}</div>
        <div className="space-y-2">{ex.pairs.map(({ translation }) => (
          <motion.button key={translation} whileTap={{ scale: 0.96 }} onClick={() => handleTr(translation)}
            className={`w-full py-2 px-3 rounded-xl text-sm font-medium transition-all ${Object.values(matched).includes(translation) ? "bg-green-100 border-2 border-green-400 text-green-700" : "bg-white/60 border border-white/80 text-gray-700 hover:bg-white/80"}`}
            style={{ backdropFilter: "blur(10px)" }}>{translation}</motion.button>
        ))}</div>
      </div>
      {sel && <p className="text-center text-purple-600 text-xs">Выбрано: <b>{sel}</b> — выбери перевод</p>}
      <AnimatePresence>
        {allDone && <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
          <p className="text-green-600 font-semibold text-sm">Все пары найдены! 🎉</p>
          <button onClick={onComplete} className="px-5 py-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium">Дальше →</button>
        </motion.div>}
      </AnimatePresence>
    </div>
  )
}

function OrderPlayer({ ex, onComplete }: { ex: OrderEx; onComplete: () => void }) {
  const [available, setAvailable] = useState([...ex.words])
  const [placed, setPlaced] = useState<string[]>([])
  const add = (word: string, idx: number) => { setPlaced(p => [...p, word]); setAvailable(a => a.filter((_, i) => i !== idx)) }
  const remove = (idx: number) => { setAvailable(a => [...a, placed[idx]]); setPlaced(p => p.filter((_, i) => i !== idx)) }
  const isCorrect = placed.join(" ") === ex.answer.join(" ")
  return (
    <div className="space-y-4">
      <div className="min-h-[48px] flex flex-wrap gap-1.5 p-2.5 rounded-xl border-2 border-dashed border-gray-200 bg-white/30" style={{ backdropFilter: "blur(10px)" }}>
        {placed.length === 0 && <span className="text-gray-400 text-xs self-center">Нажимай на слова ниже...</span>}
        {placed.map((w, i) => <motion.button key={i} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} whileTap={{ scale: 0.9 }} onClick={() => remove(i)}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium border-2 ${isCorrect ? "bg-green-100 border-green-400 text-green-700" : "bg-white border-purple-300 text-purple-700"}`}>{w}</motion.button>)}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {available.map((w, i) => <motion.button key={i} whileTap={{ scale: 0.9 }} onClick={() => add(w, i)}
          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/60 border border-white/80 text-gray-700 hover:bg-white/90" style={{ backdropFilter: "blur(10px)" }}>{w}</motion.button>)}
      </div>
      <AnimatePresence>
        {isCorrect && <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
          <p className="text-green-600 font-semibold text-sm">Правильно! 🎉</p>
          <button onClick={onComplete} className="px-5 py-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium">Дальше →</button>
        </motion.div>}
      </AnimatePresence>
    </div>
  )
}

// ─── Audio Player ─────────────────────────────────────────────────────────────

function AudioPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)

  const toggle = () => {
    const a = audioRef.current
    if (!a) return
    if (playing) { a.pause(); setPlaying(false) }
    else { a.play(); setPlaying(true) }
  }

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={glassStyle}>
      <audio ref={audioRef}
        src={src}
        onTimeUpdate={e => setProgress(e.currentTarget.currentTime)}
        onLoadedMetadata={e => setDuration(e.currentTarget.duration)}
        onEnded={() => setPlaying(false)}
      />
      <motion.button whileTap={{ scale: 0.9 }} onClick={toggle}
        className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md">
        <Icon name={playing ? "Pause" : "Play"} size={18} />
      </motion.button>
      <div className="flex-1 min-w-0">
        <input type="range" min={0} max={duration || 1} step={0.1} value={progress}
          onChange={e => { const t = Number(e.target.value); if (audioRef.current) audioRef.current.currentTime = t; setProgress(t) }}
          className="w-full h-1.5 rounded-full accent-purple-500 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>{fmt(progress)}</span>
          <span>{fmt(duration)}</span>
        </div>
      </div>
    </div>
  )
}

// ─── Exercise Editor ──────────────────────────────────────────────────────────

function ExerciseEditor({ exercises, onChange }: {
  exercises: SongExercise[]
  onChange: (exs: SongExercise[]) => void
}) {
  const [open, setOpen] = useState<string | null>(null)
  const [addType, setAddType] = useState<"fill" | "match" | "order">("fill")

  const update = (id: string, patch: Partial<SongExercise>) => {
    onChange(exercises.map(e => e.id === id ? { ...e, ...patch } as SongExercise : e))
  }

  const remove = (id: string) => onChange(exercises.filter(e => e.id !== id))

  const addExercise = () => {
    const id = `ex-${Date.now()}`
    let ex: SongExercise
    if (addType === "fill") ex = { id, type: "fill", instruction: "Вставь пропущенное слово", text: ["", "___", ""], answer: "", options: ["", "", "", ""] }
    else if (addType === "match") ex = { id, type: "match", instruction: "Сопоставь слова с переводом", pairs: [{ word: "", translation: "" }] }
    else ex = { id, type: "order", instruction: "Собери строчку по порядку", words: [""], answer: [""] }
    onChange([...exercises, ex])
    setOpen(id)
  }

  return (
    <div className="space-y-3">
      {exercises.map((ex, idx) => (
        <div key={ex.id} className="rounded-2xl overflow-hidden" style={glassStyle}>
          <button className="w-full flex items-center justify-between px-4 py-3 text-left"
            onClick={() => setOpen(open === ex.id ? null : ex.id)}>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-400">#{idx + 1}</span>
              <span className="text-xs font-semibold uppercase tracking-wide text-purple-400">
                {ex.type === "fill" ? "Пропуск" : ex.type === "match" ? "Сопоставление" : "Порядок"}
              </span>
              <span className="text-sm text-gray-700 truncate max-w-[160px]">{ex.instruction}</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={e => { e.stopPropagation(); remove(ex.id) }} className="p-1 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                <Icon name="Trash2" size={14} />
              </button>
              <Icon name={open === ex.id ? "ChevronUp" : "ChevronDown"} size={14} className="text-gray-400" />
            </div>
          </button>

          <AnimatePresence>
            {open === ex.id && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="px-4 pb-4 space-y-3 border-t border-white/40">
                <div className="pt-3">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 block mb-1">Инструкция</label>
                  <input value={ex.instruction} onChange={e => update(ex.id, { instruction: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/60 border border-white/80 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-purple-300" />
                </div>

                {ex.type === "fill" && (
                  <>
                    <div>
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 block mb-1">Текст (используй ___ для пропуска)</label>
                      <input value={ex.text.join(" ")} onChange={e => {
                        const parts = e.target.value.split("___")
                        if (parts.length === 2) update(ex.id, { text: [parts[0].trimEnd(), "___", parts[1].trimStart()] } as Partial<FillEx>)
                      }}
                        className="w-full px-3 py-2 rounded-xl bg-white/60 border border-white/80 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-purple-300"
                        placeholder="Текст до ___ текст после" />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 block mb-1">Правильный ответ</label>
                      <input value={ex.answer} onChange={e => update(ex.id, { answer: e.target.value } as Partial<FillEx>)}
                        className="w-full px-3 py-2 rounded-xl bg-white/60 border border-white/80 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-purple-300" />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 block mb-1">Варианты ответа (через запятую)</label>
                      <input value={ex.options.join(", ")} onChange={e => update(ex.id, { options: e.target.value.split(",").map(s => s.trim()) } as Partial<FillEx>)}
                        className="w-full px-3 py-2 rounded-xl bg-white/60 border border-white/80 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-purple-300" />
                    </div>
                  </>
                )}

                {ex.type === "match" && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 block">Пары слово — перевод</label>
                    {ex.pairs.map((pair, pi) => (
                      <div key={pi} className="flex gap-2 items-center">
                        <input value={pair.word} placeholder="Слово"
                          onChange={e => { const pairs = [...ex.pairs]; pairs[pi] = { ...pair, word: e.target.value }; update(ex.id, { pairs } as Partial<MatchEx>) }}
                          className="flex-1 px-2.5 py-1.5 rounded-xl bg-white/60 border border-white/80 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-purple-300" />
                        <span className="text-gray-400 text-xs">→</span>
                        <input value={pair.translation} placeholder="Перевод"
                          onChange={e => { const pairs = [...ex.pairs]; pairs[pi] = { ...pair, translation: e.target.value }; update(ex.id, { pairs } as Partial<MatchEx>) }}
                          className="flex-1 px-2.5 py-1.5 rounded-xl bg-white/60 border border-white/80 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-purple-300" />
                        <button onClick={() => { const pairs = ex.pairs.filter((_, i) => i !== pi); update(ex.id, { pairs } as Partial<MatchEx>) }}
                          className="p-1 text-gray-400 hover:text-red-500"><Icon name="X" size={12} /></button>
                      </div>
                    ))}
                    <button onClick={() => update(ex.id, { pairs: [...ex.pairs, { word: "", translation: "" }] } as Partial<MatchEx>)}
                      className="text-xs text-purple-500 hover:text-purple-700 flex items-center gap-1"><Icon name="Plus" size={12} />Добавить пару</button>
                  </div>
                )}

                {ex.type === "order" && (
                  <>
                    <div>
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 block mb-1">Слова (через пробел, в любом порядке)</label>
                      <input value={ex.words.join(" ")} onChange={e => update(ex.id, { words: e.target.value.split(" ").filter(Boolean) } as Partial<OrderEx>)}
                        className="w-full px-3 py-2 rounded-xl bg-white/60 border border-white/80 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-purple-300" />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 block mb-1">Правильный порядок (через пробел)</label>
                      <input value={ex.answer.join(" ")} onChange={e => update(ex.id, { answer: e.target.value.split(" ").filter(Boolean) } as Partial<OrderEx>)}
                        className="w-full px-3 py-2 rounded-xl bg-white/60 border border-white/80 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-purple-300" />
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      <div className="flex gap-2">
        <select value={addType} onChange={e => setAddType(e.target.value as "fill" | "match" | "order")}
          className="flex-1 px-3 py-2 rounded-xl bg-white/60 border border-white/80 text-sm text-gray-700 outline-none">
          <option value="fill">Пропуск в тексте</option>
          <option value="match">Сопоставление</option>
          <option value="order">Порядок слов</option>
        </select>
        <motion.button whileTap={{ scale: 0.96 }} onClick={addExercise}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium flex items-center gap-1.5">
          <Icon name="Plus" size={14} />Добавить
        </motion.button>
      </div>
    </div>
  )
}

// ─── Song Section ─────────────────────────────────────────────────────────────

function SongSection() {
  const [songData, setSongData] = useState<SongData>(defaultSong)
  const [showTranslation, setShowTranslation] = useState<Record<string, boolean>>({})
  const [currentTask, setCurrentTask] = useState(0)
  const [tasksDone, setTasksDone] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const toggleTr = (key: string) => setShowTranslation(p => ({ ...p, [key]: !p[key] }))

  const handleAudio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setSongData(s => ({ ...s, audioUrl: url }))
  }

  const updateExercises = useCallback((exs: SongExercise[]) => {
    setSongData(s => ({ ...s, exercises: exs }))
    setCurrentTask(0)
    setTasksDone(false)
  }, [])

  const handleTaskComplete = () => {
    if (currentTask < songData.exercises.length - 1) setCurrentTask(t => t + 1)
    else setTasksDone(true)
  }

  const ex = songData.exercises[currentTask]

  return (
    <div className="space-y-4 mt-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
            <Icon name="Music2" size={18} className="text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-800">{songData.title}</h2>
            <p className="text-xs text-gray-400">{songData.artist} · {songData.year}</p>
          </div>
        </div>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setEditMode(v => !v)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${editMode ? "bg-purple-100 text-purple-700 border border-purple-300" : "bg-white/60 border border-white/80 text-gray-600 hover:bg-white/80"}`}
          style={{ backdropFilter: "blur(10px)" }}>
          <Icon name={editMode ? "Check" : "Settings2"} size={13} />
          {editMode ? "Готово" : "Редактировать"}
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {editMode ? (
          <motion.div key="edit" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="space-y-4">
            {/* Song meta */}
            <div className="rounded-2xl p-4 space-y-3" style={glassStyle}>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Информация о песне</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-gray-400 block mb-1">Название</label>
                  <input value={songData.title} onChange={e => setSongData(s => ({ ...s, title: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-white/60 border border-white/80 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-purple-300" />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 block mb-1">Исполнитель</label>
                  <input value={songData.artist} onChange={e => setSongData(s => ({ ...s, artist: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-white/60 border border-white/80 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-purple-300" />
                </div>
              </div>
            </div>

            {/* Audio upload */}
            <div className="rounded-2xl p-4 space-y-3" style={glassStyle}>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Аудио песни</p>
              <input ref={fileRef} type="file" accept="audio/*" className="hidden" onChange={handleAudio} />
              {songData.audioUrl ? (
                <div className="space-y-2">
                  <AudioPlayer src={songData.audioUrl} />
                  <button onClick={() => { setSongData(s => ({ ...s, audioUrl: null })); if (fileRef.current) fileRef.current.value = "" }}
                    className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1">
                    <Icon name="Trash2" size={12} />Удалить аудио
                  </button>
                </div>
              ) : (
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => fileRef.current?.click()}
                  className="w-full py-6 rounded-2xl border-2 border-dashed border-purple-200 flex flex-col items-center gap-2 text-purple-400 hover:border-purple-400 hover:bg-purple-50/30 transition-all">
                  <Icon name="Upload" size={22} />
                  <span className="text-sm font-medium">Загрузить аудио</span>
                  <span className="text-xs text-gray-400">MP3, WAV, OGG — любой формат</span>
                </motion.button>
              )}
            </div>

            {/* Exercise editor */}
            <div className="rounded-2xl p-4 space-y-3" style={glassStyle}>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Интерактивные задания</p>
              <ExerciseEditor exercises={songData.exercises} onChange={updateExercises} />
            </div>
          </motion.div>
        ) : (
          <motion.div key="view" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="space-y-4">
            {/* Audio player */}
            {songData.audioUrl && <AudioPlayer src={songData.audioUrl} />}

            {/* Lyrics */}
            <div className="rounded-2xl overflow-hidden" style={glassStyle}>
              {songData.lyrics.map((section, si) => (
                <div key={si} className="px-5 py-4 border-b border-white/40 last:border-0">
                  <p className={`text-[10px] font-semibold uppercase tracking-widest mb-2 ${section.type === "chorus" ? "text-pink-400" : "text-purple-400"}`}>{section.label}</p>
                  {section.lines.map((line, li) => {
                    const key = `${si}-${li}`
                    return (
                      <div key={li} className="mb-2 last:mb-0">
                        <p className="text-sm text-gray-800 leading-relaxed">{line.en}</p>
                        <AnimatePresence>
                          {showTranslation[key] && (
                            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-xs text-gray-400 mt-0.5">{line.ru}</motion.p>
                          )}
                        </AnimatePresence>
                        <button onClick={() => toggleTr(key)} className="text-[10px] text-purple-400 hover:text-purple-600 mt-0.5 transition-colors">
                          {showTranslation[key] ? "Скрыть перевод" : "Показать перевод"}
                        </button>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>

            {/* Exercises */}
            {songData.exercises.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-700">Задания к песне</h3>
                  <span className="text-xs text-gray-400">{Math.min(currentTask + 1, songData.exercises.length)} / {songData.exercises.length}</span>
                </div>
                <div className="flex gap-1">
                  {songData.exercises.map((_, i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i < currentTask || tasksDone ? "bg-gradient-to-r from-purple-400 to-pink-400" : i === currentTask ? "bg-purple-300" : "bg-gray-200"}`} />
                  ))}
                </div>
                <AnimatePresence mode="wait">
                  {tasksDone ? (
                    <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                      className="rounded-2xl p-5 text-center space-y-2" style={glassStyle}>
                      <div className="text-3xl">🎵</div>
                      <p className="text-gray-800 font-semibold">Все задания выполнены!</p>
                      <button onClick={() => { setCurrentTask(0); setTasksDone(false) }}
                        className="text-xs text-purple-500 hover:text-purple-700">Пройти снова</button>
                    </motion.div>
                  ) : (
                    <motion.div key={ex?.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className="rounded-2xl p-5 space-y-3" style={glassStyle}>
                      <div className="flex items-center gap-2">
                        <Icon name="Pencil" size={14} className="text-pink-400" />
                        <span className="text-xs text-gray-400">{songData.title} — {songData.artist}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-gray-800">{ex?.instruction}</h4>
                      {ex?.type === "fill" && <FillPlayer ex={ex} onComplete={handleTaskComplete} />}
                      {ex?.type === "match" && <MatchPlayer ex={ex} onComplete={handleTaskComplete} />}
                      {ex?.type === "order" && <OrderPlayer ex={ex} onComplete={handleTaskComplete} />}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Old exercises (Bohemian Rhapsody etc.) ───────────────────────────────────

const exercises = [
  { id: "fill", type: "fill", song: "Bohemian Rhapsody — Queen", instruction: "Вставь пропущенное слово",
    text: ["Is this the real life? Is this just", "___", "?"], answer: "fantasy",
    options: ["fantasy", "dream", "story", "movie"] },
  { id: "match", type: "match", song: "Let It Be — The Beatles", instruction: "Сопоставь слова с переводом",
    pairs: [{ word: "wisdom", translation: "мудрость" }, { word: "answer", translation: "ответ" },
            { word: "broken", translation: "сломленный" }, { word: "shining", translation: "сияющий" }] },
  { id: "order", type: "order", song: "Don't Stop Me Now — Queen", instruction: "Собери строчку из песни по порядку",
    words: ["good", "having", "time", "a", "I'm"], answer: ["I'm", "having", "a", "good", "time"] },
]

function FillExercise({ ex, onComplete }: { ex: typeof exercises[0] & { type: "fill" }, onComplete: () => void }) {
  const [selected, setSelected] = useState<string | null>(null)
  const isCorrect = selected === ex.answer
  const isWrong = selected !== null && selected !== ex.answer
  return (
    <div className="space-y-6">
      <div className="text-center text-lg font-medium text-gray-800 leading-relaxed">
        {ex.text.map((part, i) =>
          part === "___" ? (
            <span key={i} className={`inline-block mx-1 px-3 py-0.5 rounded-lg border-2 font-semibold transition-all ${isCorrect ? "border-green-400 bg-green-50 text-green-700" : isWrong ? "border-red-300 bg-red-50 text-red-500" : selected ? "border-blue-300 bg-blue-50 text-blue-700" : "border-dashed border-gray-300 text-gray-400"}`}>{selected || "___"}</span>
          ) : <span key={i}>{part}</span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {ex.options.map(opt => (
          <motion.button key={opt} whileTap={{ scale: 0.96 }} onClick={() => { if (!isCorrect) setSelected(opt) }}
            className={`py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${selected === opt && isCorrect ? "bg-green-100 border-2 border-green-400 text-green-700" : selected === opt && isWrong ? "bg-red-100 border-2 border-red-300 text-red-500" : "bg-white/60 border border-white/80 text-gray-700 hover:bg-white/80"}`}
            style={{ backdropFilter: "blur(10px)" }}>{opt}</motion.button>
        ))}
      </div>
      <AnimatePresence>
        {isCorrect && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <p className="text-green-600 font-semibold mb-3">Отлично! 🎉</p>
          <button onClick={onComplete} className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium text-sm">Следующее упражнение →</button>
        </motion.div>}
        {isWrong && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-red-500 text-sm">Попробуй ещё раз!</motion.p>}
      </AnimatePresence>
    </div>
  )
}

function MatchExercise({ ex, onComplete }: { ex: typeof exercises[1] & { type: "match" }, onComplete: () => void }) {
  const [selectedWord, setSelectedWord] = useState<string | null>(null)
  const [matched, setMatched] = useState<Record<string, string>>({})
  const handleTranslation = (translation: string) => {
    if (!selectedWord) return
    const correct = ex.pairs.find(p => p.word === selectedWord)?.translation
    if (correct === translation) setMatched(prev => ({ ...prev, [selectedWord]: translation }))
    setSelectedWord(null)
  }
  const allMatched = Object.keys(matched).length === ex.pairs.length
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">{ex.pairs.map(({ word }) => (
          <motion.button key={word} whileTap={{ scale: 0.96 }} onClick={() => { if (!matched[word]) setSelectedWord(word) }}
            className={`w-full py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${matched[word] ? "bg-green-100 border-2 border-green-400 text-green-700" : selectedWord === word ? "bg-purple-100 border-2 border-purple-400 text-purple-700" : "bg-white/60 border border-white/80 text-gray-700 hover:bg-white/80"}`}
            style={{ backdropFilter: "blur(10px)" }}>{word}</motion.button>
        ))}</div>
        <div className="space-y-2">{ex.pairs.map(({ translation }) => (
          <motion.button key={translation} whileTap={{ scale: 0.96 }} onClick={() => handleTranslation(translation)}
            className={`w-full py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${Object.values(matched).includes(translation) ? "bg-green-100 border-2 border-green-400 text-green-700" : "bg-white/60 border border-white/80 text-gray-700 hover:bg-white/80"}`}
            style={{ backdropFilter: "blur(10px)" }}>{translation}</motion.button>
        ))}</div>
      </div>
      {selectedWord && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-purple-600 text-sm">Выбрано: <b>{selectedWord}</b> — теперь выбери перевод</motion.p>}
      <AnimatePresence>
        {allMatched && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <p className="text-green-600 font-semibold mb-3">Все пары найдены! 🎉</p>
          <button onClick={onComplete} className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium text-sm">Следующее упражнение →</button>
        </motion.div>}
      </AnimatePresence>
    </div>
  )
}

function OrderExercise({ ex, onComplete }: { ex: typeof exercises[2] & { type: "order" }, onComplete: () => void }) {
  const [available, setAvailable] = useState([...ex.words])
  const [placed, setPlaced] = useState<string[]>([])
  const addWord = (word: string) => { setPlaced(prev => [...prev, word]); setAvailable(prev => prev.filter((w, i) => i !== prev.indexOf(word))) }
  const removeWord = (idx: number) => { const word = placed[idx]; setAvailable(prev => [...prev, word]); setPlaced(prev => prev.filter((_, i) => i !== idx)) }
  const isCorrect = placed.join(" ") === ex.answer.join(" ")
  return (
    <div className="space-y-5">
      <div className="min-h-[56px] flex flex-wrap gap-2 p-3 rounded-xl border-2 border-dashed border-gray-200 bg-white/30" style={{ backdropFilter: "blur(10px)" }}>
        {placed.length === 0 && <span className="text-gray-400 text-sm self-center">Нажимай на слова ниже...</span>}
        {placed.map((word, i) => (
          <motion.button key={i} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} whileTap={{ scale: 0.9 }} onClick={() => removeWord(i)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border-2 transition-all ${isCorrect ? "bg-green-100 border-green-400 text-green-700" : "bg-white border-purple-300 text-purple-700"}`}>{word}</motion.button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        {available.map((word, i) => (
          <motion.button key={i} whileTap={{ scale: 0.9 }} onClick={() => addWord(word)}
            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white/60 border border-white/80 text-gray-700 hover:bg-white/90" style={{ backdropFilter: "blur(10px)" }}>{word}</motion.button>
        ))}
      </div>
      <AnimatePresence>
        {isCorrect && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <p className="text-green-600 font-semibold mb-3">Правильно! 🎉</p>
          <button onClick={onComplete} className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium text-sm">Завершить →</button>
        </motion.div>}
      </AnimatePresence>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function SongsPage() {
  const [current, setCurrent] = useState(0)
  const [done, setDone] = useState(false)
  const ex = exercises[current]
  const handleComplete = () => {
    if (current < exercises.length - 1) setCurrent(current + 1)
    else setDone(true)
  }

  return (
    <main className="relative min-h-screen px-6 py-10 flex flex-col overflow-hidden">
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-slate-50 via-white to-slate-100" />
      <motion.div className="fixed z-0 w-[500px] h-[500px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(147, 51, 234, 0.25) 0%, transparent 70%)", filter: "blur(60px)", top: "-10%", left: "-10%" }}
        animate={{ x: [0, 100, 50, 0], y: [0, 50, 100, 0], scale: [1, 1.2, 0.9, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="fixed z-0 w-[600px] h-[600px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, transparent 70%)", filter: "blur(80px)", top: "30%", right: "-20%" }}
        animate={{ x: [0, -80, -40, 0], y: [0, 80, -40, 0], scale: [1, 0.85, 1.15, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }} />

      <div className="relative z-10 mx-auto max-w-[440px] w-full flex flex-col pb-16">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-8">
          <a href="/" className="flex items-center justify-center h-9 w-9 rounded-full bg-white/60 border border-white/80 text-gray-500 hover:text-gray-700 transition-colors" style={{ backdropFilter: "blur(10px)" }}>
            <Icon name="ArrowLeft" size={18} />
          </a>
          <div>
            <h1 className="text-lg font-semibold text-gray-800">Английский по песням</h1>
            <p className="text-xs text-gray-500">Упражнение {Math.min(current + 1, exercises.length)} из {exercises.length}</p>
          </div>
        </motion.div>

        <div className="flex gap-1.5 mb-6">
          {exercises.map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i < current || done ? "bg-gradient-to-r from-purple-400 to-pink-400" : i === current ? "bg-purple-300" : "bg-gray-200"}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {done ? (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center flex-1 text-center gap-4">
              <div className="text-5xl">🎸</div>
              <h2 className="text-2xl font-bold text-gray-800">Все упражнения выполнены!</h2>
              <p className="text-gray-500 text-sm">Ты молодец — учиться через музыку легко и приятно</p>
              <a href="/" className="mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium">Вернуться назад</a>
            </motion.div>
          ) : (
            <motion.div key={ex.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="rounded-2xl p-5 space-y-4"
              style={{ background: "rgba(255, 255, 255, 0.45)", backdropFilter: "blur(40px) saturate(180%)", WebkitBackdropFilter: "blur(40px) saturate(180%)", boxShadow: "inset 0 1px 1px rgba(255,255,255,0.9), 0 0 0 1px rgba(255,255,255,0.6), 0 8px 32px rgba(0,0,0,0.08)", border: "1px solid rgba(255,255,255,0.5)" }}>
              <div className="flex items-center gap-2">
                <Icon name="Music" size={16} className="text-purple-400" />
                <span className="text-xs text-gray-400">{ex.song}</span>
              </div>
              <h2 className="text-base font-semibold text-gray-800">{ex.instruction}</h2>
              {ex.type === "fill" && <FillExercise ex={ex as typeof exercises[0] & { type: "fill" }} onComplete={handleComplete} />}
              {ex.type === "match" && <MatchExercise ex={ex as typeof exercises[1] & { type: "match" }} onComplete={handleComplete} />}
              {ex.type === "order" && <OrderExercise ex={ex as typeof exercises[2] & { type: "order" }} onComplete={handleComplete} />}
            </motion.div>
          )}
        </AnimatePresence>

        <SongSection />
      </div>
    </main>
  )
}

export default SongsPage
