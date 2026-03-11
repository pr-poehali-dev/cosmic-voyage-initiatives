import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Icon from "@/components/ui/icon"

const song = {
  title: "Yesterday",
  artist: "The Beatles",
  year: 1965,
  lyrics: [
    { type: "verse", label: "Куплет 1", lines: [
      { en: "Yesterday, all my troubles seemed so far away", ru: "Вчера все мои проблемы казались такими далёкими" },
      { en: "Now it looks as though they're here to stay", ru: "Теперь кажется, что они останутся здесь" },
      { en: "Oh, I believe in yesterday", ru: "О, я верю во вчера" },
    ]},
    { type: "verse", label: "Куплет 2", lines: [
      { en: "Suddenly, I'm not half the man I used to be", ru: "Внезапно я уже не тот человек, которым был" },
      { en: "There's a shadow hanging over me", ru: "Над мной нависла тень" },
      { en: "Oh, yesterday came suddenly", ru: "О, вчера пришло так внезапно" },
    ]},
    { type: "chorus", label: "Припев", lines: [
      { en: "Why she had to go I don't know, she wouldn't say", ru: "Почему она ушла — не знаю, она не говорила" },
      { en: "I said something wrong, now I long for yesterday", ru: "Я сказал что-то не то, теперь я тоскую по вчера" },
    ]},
  ],
}

const songExercises = [
  {
    id: "s-fill-1",
    type: "fill",
    instruction: "Вставь пропущенное слово",
    text: ["Yesterday, all my", "___", "seemed so far away"],
    answer: "troubles",
    options: ["troubles", "friends", "dreams", "words"],
  },
  {
    id: "s-match-1",
    type: "match",
    instruction: "Сопоставь слова с переводом",
    pairs: [
      { word: "troubles", translation: "проблемы" },
      { word: "shadow", translation: "тень" },
      { word: "suddenly", translation: "внезапно" },
      { word: "believe", translation: "верить" },
    ],
  },
  {
    id: "s-order-1",
    type: "order",
    instruction: "Собери строчку из песни по порядку",
    words: ["over", "hanging", "there's", "me", "a", "shadow"],
    answer: ["there's", "a", "shadow", "hanging", "over", "me"],
  },
  {
    id: "s-fill-2",
    type: "fill",
    instruction: "Вставь пропущенное слово",
    text: ["I said something wrong, now I", "___", "for yesterday"],
    answer: "long",
    options: ["long", "wait", "look", "care"],
  },
]

const exercises = [
  {
    id: "fill",
    type: "fill",
    song: "Bohemian Rhapsody — Queen",
    instruction: "Вставь пропущенное слово",
    text: ["Is this the real life? Is this just", "___", "?"],
    answer: "fantasy",
    options: ["fantasy", "dream", "story", "movie"],
  },
  {
    id: "match",
    type: "match",
    song: "Let It Be — The Beatles",
    instruction: "Сопоставь слова с переводом",
    pairs: [
      { word: "wisdom", translation: "мудрость" },
      { word: "answer", translation: "ответ" },
      { word: "broken", translation: "сломленный" },
      { word: "shining", translation: "сияющий" },
    ],
  },
  {
    id: "order",
    type: "order",
    song: "Don't Stop Me Now — Queen",
    instruction: "Собери строчку из песни по порядку",
    words: ["good", "having", "time", "a", "I'm"],
    answer: ["I'm", "having", "a", "good", "time"],
  },
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
            <span
              key={i}
              className={`inline-block mx-1 px-3 py-0.5 rounded-lg border-2 font-semibold transition-all ${
                isCorrect
                  ? "border-green-400 bg-green-50 text-green-700"
                  : isWrong
                  ? "border-red-300 bg-red-50 text-red-500"
                  : selected
                  ? "border-blue-300 bg-blue-50 text-blue-700"
                  : "border-dashed border-gray-300 text-gray-400"
              }`}
            >
              {selected || "___"}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {ex.options.map((opt) => (
          <motion.button
            key={opt}
            whileTap={{ scale: 0.96 }}
            onClick={() => { if (!isCorrect) setSelected(opt) }}
            className={`py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
              selected === opt && isCorrect
                ? "bg-green-100 border-2 border-green-400 text-green-700"
                : selected === opt && isWrong
                ? "bg-red-100 border-2 border-red-300 text-red-500"
                : "bg-white/60 border border-white/80 text-gray-700 hover:bg-white/80"
            }`}
            style={{ backdropFilter: "blur(10px)" }}
          >
            {opt}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {isCorrect && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="text-green-600 font-semibold mb-3">Отлично! 🎉</p>
            <button
              onClick={onComplete}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium text-sm"
            >
              Следующее упражнение →
            </button>
          </motion.div>
        )}
        {isWrong && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-red-500 text-sm">
            Попробуй ещё раз!
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

function MatchExercise({ ex, onComplete }: { ex: typeof exercises[1] & { type: "match" }, onComplete: () => void }) {
  const [selectedWord, setSelectedWord] = useState<string | null>(null)
  const [matched, setMatched] = useState<Record<string, string>>({})

  const handleWord = (word: string) => {
    if (matched[word]) return
    setSelectedWord(word)
  }

  const handleTranslation = (translation: string) => {
    if (!selectedWord) return
    const correct = ex.pairs.find(p => p.word === selectedWord)?.translation
    if (correct === translation) {
      setMatched(prev => ({ ...prev, [selectedWord]: translation }))
    }
    setSelectedWord(null)
  }

  const allMatched = Object.keys(matched).length === ex.pairs.length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          {ex.pairs.map(({ word }) => (
            <motion.button
              key={word}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleWord(word)}
              className={`w-full py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
                matched[word]
                  ? "bg-green-100 border-2 border-green-400 text-green-700"
                  : selectedWord === word
                  ? "bg-purple-100 border-2 border-purple-400 text-purple-700"
                  : "bg-white/60 border border-white/80 text-gray-700 hover:bg-white/80"
              }`}
              style={{ backdropFilter: "blur(10px)" }}
            >
              {word}
            </motion.button>
          ))}
        </div>
        <div className="space-y-2">
          {ex.pairs.map(({ translation }) => (
            <motion.button
              key={translation}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleTranslation(translation)}
              className={`w-full py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
                Object.values(matched).includes(translation)
                  ? "bg-green-100 border-2 border-green-400 text-green-700"
                  : "bg-white/60 border border-white/80 text-gray-700 hover:bg-white/80"
              }`}
              style={{ backdropFilter: "blur(10px)" }}
            >
              {translation}
            </motion.button>
          ))}
        </div>
      </div>

      {selectedWord && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-purple-600 text-sm">
          Выбрано: <b>{selectedWord}</b> — теперь выбери перевод
        </motion.p>
      )}

      <AnimatePresence>
        {allMatched && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <p className="text-green-600 font-semibold mb-3">Все пары найдены! 🎉</p>
            <button
              onClick={onComplete}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium text-sm"
            >
              Следующее упражнение →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function OrderExercise({ ex, onComplete }: { ex: typeof exercises[2] & { type: "order" }, onComplete: () => void }) {
  const [available, setAvailable] = useState([...ex.words])
  const [placed, setPlaced] = useState<string[]>([])

  const addWord = (word: string) => {
    setPlaced(prev => [...prev, word])
    setAvailable(prev => prev.filter((w, i) => i !== prev.indexOf(word)))
  }

  const removeWord = (idx: number) => {
    const word = placed[idx]
    setAvailable(prev => [...prev, word])
    setPlaced(prev => prev.filter((_, i) => i !== idx))
  }

  const isCorrect = placed.join(" ") === ex.answer.join(" ")

  return (
    <div className="space-y-5">
      <div
        className="min-h-[56px] flex flex-wrap gap-2 p-3 rounded-xl border-2 border-dashed border-gray-200 bg-white/30"
        style={{ backdropFilter: "blur(10px)" }}
      >
        {placed.length === 0 && (
          <span className="text-gray-400 text-sm self-center">Нажимай на слова ниже...</span>
        )}
        {placed.map((word, i) => (
          <motion.button
            key={i}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => removeWord(i)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border-2 transition-all ${
              isCorrect
                ? "bg-green-100 border-green-400 text-green-700"
                : "bg-purple-100 border-purple-300 text-purple-700"
            }`}
          >
            {word}
          </motion.button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {available.map((word, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.9 }}
            onClick={() => addWord(word)}
            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white/60 border border-white/80 text-gray-700 hover:bg-white/90"
            style={{ backdropFilter: "blur(10px)" }}
          >
            {word}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {isCorrect && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <p className="text-green-600 font-semibold mb-3">Правильно! 🎉</p>
            <button
              onClick={onComplete}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium text-sm"
            >
              Завершить →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

type SongExercise = typeof songExercises[number]

function SongFillExercise({ ex, onComplete }: { ex: SongExercise & { type: "fill" }, onComplete: () => void }) {
  const [selected, setSelected] = useState<string | null>(null)
  const isCorrect = selected === ex.answer
  const isWrong = selected !== null && selected !== ex.answer
  return (
    <div className="space-y-4">
      <div className="text-center text-sm font-medium text-gray-700 leading-relaxed">
        {ex.text.map((part, i) =>
          part === "___" ? (
            <span key={i} className={`inline-block mx-1 px-3 py-0.5 rounded-lg border-2 font-semibold transition-all ${isCorrect ? "border-green-400 bg-green-50 text-green-700" : isWrong ? "border-red-300 bg-red-50 text-red-500" : selected ? "border-blue-300 bg-blue-50 text-blue-700" : "border-dashed border-gray-300 text-gray-400"}`}>{selected || "___"}</span>
          ) : <span key={i}>{part} </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {ex.options.map((opt) => (
          <motion.button key={opt} whileTap={{ scale: 0.96 }} onClick={() => { if (!isCorrect) setSelected(opt) }}
            className={`py-2 px-3 rounded-xl text-sm font-medium transition-all ${selected === opt && isCorrect ? "bg-green-100 border-2 border-green-400 text-green-700" : selected === opt && isWrong ? "bg-red-100 border-2 border-red-300 text-red-500" : "bg-white/60 border border-white/80 text-gray-700 hover:bg-white/80"}`}
            style={{ backdropFilter: "blur(10px)" }}>{opt}</motion.button>
        ))}
      </div>
      <AnimatePresence>
        {isCorrect && <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <p className="text-green-600 font-semibold text-sm mb-2">Верно! 🎉</p>
          <button onClick={onComplete} className="px-5 py-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium">Дальше →</button>
        </motion.div>}
        {isWrong && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-red-500 text-xs">Попробуй ещё раз!</motion.p>}
      </AnimatePresence>
    </div>
  )
}

function SongMatchExercise({ ex, onComplete }: { ex: SongExercise & { type: "match" }, onComplete: () => void }) {
  const [selectedWord, setSelectedWord] = useState<string | null>(null)
  const [matched, setMatched] = useState<Record<string, string>>({})
  const handleTranslation = (translation: string) => {
    if (!selectedWord) return
    const correct = ex.pairs!.find(p => p.word === selectedWord)?.translation
    if (correct === translation) setMatched(prev => ({ ...prev, [selectedWord]: translation }))
    setSelectedWord(null)
  }
  const allMatched = Object.keys(matched).length === ex.pairs!.length
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          {ex.pairs!.map(({ word }) => (
            <motion.button key={word} whileTap={{ scale: 0.96 }} onClick={() => { if (!matched[word]) setSelectedWord(word) }}
              className={`w-full py-2 px-3 rounded-xl text-sm font-medium transition-all ${matched[word] ? "bg-green-100 border-2 border-green-400 text-green-700" : selectedWord === word ? "bg-purple-100 border-2 border-purple-400 text-purple-700" : "bg-white/60 border border-white/80 text-gray-700 hover:bg-white/80"}`}
              style={{ backdropFilter: "blur(10px)" }}>{word}</motion.button>
          ))}
        </div>
        <div className="space-y-2">
          {ex.pairs!.map(({ translation }) => (
            <motion.button key={translation} whileTap={{ scale: 0.96 }} onClick={() => handleTranslation(translation)}
              className={`w-full py-2 px-3 rounded-xl text-sm font-medium transition-all ${Object.values(matched).includes(translation) ? "bg-green-100 border-2 border-green-400 text-green-700" : "bg-white/60 border border-white/80 text-gray-700 hover:bg-white/80"}`}
              style={{ backdropFilter: "blur(10px)" }}>{translation}</motion.button>
          ))}
        </div>
      </div>
      {selectedWord && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-purple-600 text-xs">Выбрано: <b>{selectedWord}</b> — выбери перевод</motion.p>}
      <AnimatePresence>
        {allMatched && <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <p className="text-green-600 font-semibold text-sm mb-2">Все пары найдены! 🎉</p>
          <button onClick={onComplete} className="px-5 py-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium">Дальше →</button>
        </motion.div>}
      </AnimatePresence>
    </div>
  )
}

function SongOrderExercise({ ex, onComplete }: { ex: SongExercise & { type: "order" }, onComplete: () => void }) {
  const [available, setAvailable] = useState([...ex.words!])
  const [placed, setPlaced] = useState<string[]>([])
  const addWord = (word: string, idx: number) => { setPlaced(prev => [...prev, word]); setAvailable(prev => prev.filter((_, i) => i !== idx)) }
  const removeWord = (idx: number) => { const word = placed[idx]; setAvailable(prev => [...prev, word]); setPlaced(prev => prev.filter((_, i) => i !== idx)) }
  const isCorrect = placed.join(" ") === ex.answer!.join(" ")
  return (
    <div className="space-y-4">
      <div className="min-h-[48px] flex flex-wrap gap-1.5 p-2.5 rounded-xl border-2 border-dashed border-gray-200 bg-white/30" style={{ backdropFilter: "blur(10px)" }}>
        {placed.length === 0 && <span className="text-gray-400 text-xs self-center">Нажимай на слова ниже...</span>}
        {placed.map((word, i) => (
          <motion.button key={i} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} whileTap={{ scale: 0.9 }} onClick={() => removeWord(i)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border-2 ${isCorrect ? "bg-green-100 border-green-400 text-green-700" : "bg-white border-purple-300 text-purple-700"}`}>{word}</motion.button>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {available.map((word, i) => (
          <motion.button key={i} whileTap={{ scale: 0.9 }} onClick={() => addWord(word, i)}
            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/60 border border-white/80 text-gray-700 hover:bg-white/90" style={{ backdropFilter: "blur(10px)" }}>{word}</motion.button>
        ))}
      </div>
      <AnimatePresence>
        {isCorrect && <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <p className="text-green-600 font-semibold text-sm mb-2">Правильно! 🎉</p>
          <button onClick={onComplete} className="px-5 py-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium">Дальше →</button>
        </motion.div>}
      </AnimatePresence>
    </div>
  )
}

function SongSection() {
  const [showTranslation, setShowTranslation] = useState<Record<string, boolean>>({})
  const [currentTask, setCurrentTask] = useState(0)
  const [tasksDone, setTasksDone] = useState(false)

  const toggleTranslation = (key: string) => setShowTranslation(prev => ({ ...prev, [key]: !prev[key] }))

  const handleTaskComplete = () => {
    if (currentTask < songExercises.length - 1) setCurrentTask(currentTask + 1)
    else setTasksDone(true)
  }

  const ex = songExercises[currentTask]

  return (
    <div className="space-y-4 mt-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
          <Icon name="Music2" size={18} className="text-white" />
        </div>
        <div>
          <h2 className="text-base font-bold text-gray-800">{song.title}</h2>
          <p className="text-xs text-gray-400">{song.artist} · {song.year}</p>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(40px) saturate(180%)", WebkitBackdropFilter: "blur(40px) saturate(180%)", boxShadow: "inset 0 1px 1px rgba(255,255,255,0.9), 0 0 0 1px rgba(255,255,255,0.6), 0 8px 32px rgba(0,0,0,0.08)" }}>
        {song.lyrics.map((section, si) => (
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
                  <button onClick={() => toggleTranslation(key)} className="text-[10px] text-purple-400 hover:text-purple-600 mt-0.5 transition-colors">
                    {showTranslation[key] ? "Скрыть перевод" : "Показать перевод"}
                  </button>
                </div>
              )
            })}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700">Задания к песне</h3>
          <span className="text-xs text-gray-400">{Math.min(currentTask + 1, songExercises.length)} / {songExercises.length}</span>
        </div>
        <div className="flex gap-1 mb-4">
          {songExercises.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i < currentTask || tasksDone ? "bg-gradient-to-r from-purple-400 to-pink-400" : i === currentTask ? "bg-purple-300" : "bg-gray-200"}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tasksDone ? (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl p-5 text-center space-y-2" style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(40px)", boxShadow: "inset 0 1px 1px rgba(255,255,255,0.9), 0 0 0 1px rgba(255,255,255,0.6), 0 8px 32px rgba(0,0,0,0.08)" }}>
              <div className="text-3xl">🎵</div>
              <p className="text-gray-800 font-semibold">Все задания к песне выполнены!</p>
              <p className="text-xs text-gray-400">Отличная работа с Yesterday</p>
            </motion.div>
          ) : (
            <motion.div key={ex.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="rounded-2xl p-5 space-y-3" style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(40px) saturate(180%)", WebkitBackdropFilter: "blur(40px) saturate(180%)", boxShadow: "inset 0 1px 1px rgba(255,255,255,0.9), 0 0 0 1px rgba(255,255,255,0.6), 0 8px 32px rgba(0,0,0,0.08)" }}>
              <div className="flex items-center gap-2">
                <Icon name="Pencil" size={14} className="text-pink-400" />
                <span className="text-xs text-gray-400">Yesterday — The Beatles</span>
              </div>
              <h4 className="text-sm font-semibold text-gray-800">{ex.instruction}</h4>
              {ex.type === "fill" && <SongFillExercise ex={ex as SongExercise & { type: "fill" }} onComplete={handleTaskComplete} />}
              {ex.type === "match" && <SongMatchExercise ex={ex as SongExercise & { type: "match" }} onComplete={handleTaskComplete} />}
              {ex.type === "order" && <SongOrderExercise ex={ex as SongExercise & { type: "order" }} onComplete={handleTaskComplete} />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export function SongsPage() {
  const [current, setCurrent] = useState(0)
  const [done, setDone] = useState(false)

  const ex = exercises[current]

  const handleComplete = () => {
    if (current < exercises.length - 1) {
      setCurrent(current + 1)
    } else {
      setDone(true)
    }
  }

  return (
    <main className="relative min-h-screen px-6 py-10 flex flex-col overflow-hidden">
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-slate-50 via-white to-slate-100" />

      <motion.div
        className="fixed z-0 w-[500px] h-[500px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(147, 51, 234, 0.25) 0%, transparent 70%)", filter: "blur(60px)", top: "-10%", left: "-10%" }}
        animate={{ x: [0, 100, 50, 0], y: [0, 50, 100, 0], scale: [1, 1.2, 0.9, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="fixed z-0 w-[600px] h-[600px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, transparent 70%)", filter: "blur(80px)", top: "30%", right: "-20%" }}
        animate={{ x: [0, -80, -40, 0], y: [0, 80, -40, 0], scale: [1, 0.85, 1.15, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />

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
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center flex-1 text-center gap-4"
            >
              <div className="text-5xl">🎸</div>
              <h2 className="text-2xl font-bold text-gray-800">Все упражнения выполнены!</h2>
              <p className="text-gray-500 text-sm">Ты молодец — учиться через музыку легко и приятно</p>
              <a href="/" className="mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium">
                Вернуться назад
              </a>
            </motion.div>
          ) : (
            <motion.div
              key={ex.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="rounded-2xl p-5 space-y-4"
              style={{
                background: "rgba(255, 255, 255, 0.45)",
                backdropFilter: "blur(40px) saturate(180%)",
                WebkitBackdropFilter: "blur(40px) saturate(180%)",
                boxShadow: "inset 0 1px 1px rgba(255,255,255,0.9), 0 0 0 1px rgba(255,255,255,0.6), 0 8px 32px rgba(0,0,0,0.08)",
                border: "1px solid rgba(255,255,255,0.5)",
              }}
            >
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