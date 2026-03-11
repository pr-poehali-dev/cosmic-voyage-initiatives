// ─── Types ────────────────────────────────────────────────────────────────────

export type FillEx = {
  id: string; type: "fill"; instruction: string
  text: string[]; answer: string; options: string[]
}
export type MatchEx = {
  id: string; type: "match"; instruction: string
  pairs: { word: string; translation: string }[]
}
export type OrderEx = {
  id: string; type: "order"; instruction: string
  words: string[]; answer: string[]
}
export type SongExercise = FillEx | MatchEx | OrderEx

export type LyricSection = {
  type: "verse" | "chorus" | "bridge"
  label: string
  lines: { en: string; ru: string }[]
}

export type Song = {
  id: string
  title: string
  artist: string
  year: number
  level: "A1" | "A2" | "B1" | "B2"
  genre: string
  cover: string
  lyrics: LyricSection[]
  exercises: SongExercise[]
}

// ─── Song store (persisted to localStorage) ──────────────────────────────────

const STORAGE_KEY = "custom_songs"

export function loadCustomSongs(): Song[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveCustomSong(song: Song): void {
  const existing = loadCustomSongs()
  const updated = [...existing.filter(s => s.id !== song.id), song]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

export function deleteCustomSong(id: string): void {
  const existing = loadCustomSongs()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.filter(s => s.id !== id)))
}

// ─── Songs data ───────────────────────────────────────────────────────────────

export const songs: Song[] = [
  {
    id: "yesterday",
    title: "Yesterday",
    artist: "The Beatles",
    year: 1965,
    level: "A2",
    genre: "Pop / Rock",
    cover: "🎸",
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
      { type: "verse", label: "Куплет 2", lines: [
        { en: "Suddenly, I'm not half the man I used to be", ru: "Внезапно я уже не тот человек, которым был" },
        { en: "There's a shadow hanging over me", ru: "Над мной нависла тень" },
        { en: "Oh, yesterday came suddenly", ru: "О, вчера пришло так внезапно" },
      ]},
    ],
    exercises: [
      { id: "y-fill-1", type: "fill", instruction: "Вставь пропущенное слово",
        text: ["Yesterday, all my", "___", "seemed so far away"], answer: "troubles",
        options: ["troubles", "friends", "dreams", "words"] },
      { id: "y-match-1", type: "match", instruction: "Сопоставь слова с переводом",
        pairs: [{ word: "troubles", translation: "проблемы" }, { word: "shadow", translation: "тень" },
                { word: "suddenly", translation: "внезапно" }, { word: "believe", translation: "верить" }] },
      { id: "y-order-1", type: "order", instruction: "Собери строчку из песни по порядку",
        words: ["over", "hanging", "there's", "me", "a", "shadow"],
        answer: ["there's", "a", "shadow", "hanging", "over", "me"] },
      { id: "y-fill-2", type: "fill", instruction: "Вставь пропущенное слово",
        text: ["I said something wrong, now I", "___", "for yesterday"], answer: "long",
        options: ["long", "wait", "look", "care"] },
    ],
  },
  {
    id: "bohemian-rhapsody",
    title: "Bohemian Rhapsody",
    artist: "Queen",
    year: 1975,
    level: "B1",
    genre: "Rock",
    cover: "👑",
    lyrics: [
      { type: "verse", label: "Вступление", lines: [
        { en: "Is this the real life? Is this just fantasy?", ru: "Это реальная жизнь? Или просто фантазия?" },
        { en: "Caught in a landslide, no escape from reality", ru: "Попавший в оползень, нет побега от реальности" },
        { en: "Open your eyes, look up to the skies and see", ru: "Открой глаза, посмотри в небо и смотри" },
      ]},
      { type: "verse", label: "Куплет", lines: [
        { en: "I'm just a poor boy, I need no sympathy", ru: "Я просто бедный мальчик, мне не нужна жалость" },
        { en: "Because it's easy come, easy go, little high, little low", ru: "Потому что легко приходит, легко уходит, чуть выше, чуть ниже" },
        { en: "Anywhere the wind blows doesn't really matter to me", ru: "Куда ветер дует — мне всё равно" },
      ]},
      { type: "chorus", label: "Припев", lines: [
        { en: "Mama, just killed a man", ru: "Мама, я только что убил человека" },
        { en: "Put a gun against his head, pulled my trigger, now he's dead", ru: "Приставил пистолет к его голове, нажал на курок — теперь он мёртв" },
        { en: "Mama, life had just begun", ru: "Мама, жизнь только началась" },
        { en: "But now I've gone and thrown it all away", ru: "Но теперь я взял и всё это выбросил" },
      ]},
    ],
    exercises: [
      { id: "bq-fill-1", type: "fill", instruction: "Вставь пропущенное слово",
        text: ["Is this the real life? Is this just", "___", "?"], answer: "fantasy",
        options: ["fantasy", "dream", "story", "movie"] },
      { id: "bq-match-1", type: "match", instruction: "Сопоставь слова с переводом",
        pairs: [{ word: "reality", translation: "реальность" }, { word: "sympathy", translation: "жалость" },
                { word: "escape", translation: "побег" }, { word: "trigger", translation: "курок" }] },
      { id: "bq-order-1", type: "order", instruction: "Собери строчку по порядку",
        words: ["me", "matter", "wind", "the", "blows", "anywhere", "to", "doesn't", "really"],
        answer: ["anywhere", "the", "wind", "blows", "doesn't", "really", "matter", "to", "me"] },
      { id: "bq-fill-2", type: "fill", instruction: "Вставь пропущенное слово",
        text: ["Caught in a landslide, no", "___", "from reality"], answer: "escape",
        options: ["escape", "exit", "way", "run"] },
    ],
  },
  {
    id: "let-it-be",
    title: "Let It Be",
    artist: "The Beatles",
    year: 1970,
    level: "A2",
    genre: "Rock / Gospel",
    cover: "🕊️",
    lyrics: [
      { type: "verse", label: "Куплет 1", lines: [
        { en: "When I find myself in times of trouble", ru: "Когда я оказываюсь в трудные времена" },
        { en: "Mother Mary comes to me", ru: "Матушка Мария приходит ко мне" },
        { en: "Speaking words of wisdom, let it be", ru: "Говоря слова мудрости: пусть будет так" },
      ]},
      { type: "chorus", label: "Припев", lines: [
        { en: "Let it be, let it be, let it be, let it be", ru: "Пусть будет так, пусть будет так" },
        { en: "Whisper words of wisdom, let it be", ru: "Шепчи слова мудрости: пусть будет так" },
      ]},
      { type: "verse", label: "Куплет 2", lines: [
        { en: "And when the broken hearted people living in the world agree", ru: "И когда люди с разбитыми сердцами в этом мире соглашаются" },
        { en: "There will be an answer, let it be", ru: "Будет ответ: пусть будет так" },
        { en: "For though they may be parted, there is still a chance that they will see", ru: "Хотя они могут быть разлучены, есть ещё шанс, что они увидят" },
      ]},
    ],
    exercises: [
      { id: "lib-fill-1", type: "fill", instruction: "Вставь пропущенное слово",
        text: ["Speaking words of", "___", ", let it be"], answer: "wisdom",
        options: ["wisdom", "love", "hope", "peace"] },
      { id: "lib-match-1", type: "match", instruction: "Сопоставь слова с переводом",
        pairs: [{ word: "wisdom", translation: "мудрость" }, { word: "broken", translation: "сломленный" },
                { word: "whisper", translation: "шептать" }, { word: "parted", translation: "разлучённый" }] },
      { id: "lib-order-1", type: "order", instruction: "Собери строчку по порядку",
        words: ["wisdom", "words", "of", "let", "whisper", "be", "it"],
        answer: ["whisper", "words", "of", "wisdom", "let", "it", "be"] },
    ],
  },
  {
    id: "dont-stop-me-now",
    title: "Don't Stop Me Now",
    artist: "Queen",
    year: 1978,
    level: "B1",
    genre: "Rock",
    cover: "🚀",
    lyrics: [
      { type: "verse", label: "Куплет 1", lines: [
        { en: "Tonight I'm gonna have myself a real good time", ru: "Сегодня ночью я собираюсь хорошо провести время" },
        { en: "I feel alive and the world I'll turn it inside out", ru: "Я чувствую себя живым и переверну мир вверх дном" },
        { en: "I'm floating around in ecstasy", ru: "Я плаваю в экстазе" },
      ]},
      { type: "chorus", label: "Припев", lines: [
        { en: "Don't stop me now, I'm having such a good time", ru: "Не останавливай меня, мне так хорошо" },
        { en: "I'm having a ball, don't stop me now", ru: "Я веселюсь, не останавливай меня" },
        { en: "If you wanna have a good time, just give me a call", ru: "Если хочешь хорошо провести время — просто позвони мне" },
      ]},
      { type: "bridge", label: "Бридж", lines: [
        { en: "I'm a shooting star leaping through the sky", ru: "Я падающая звезда, прыгающая через небо" },
        { en: "Like a tiger defying the laws of gravity", ru: "Как тигр, бросающий вызов законам гравитации" },
      ]},
    ],
    exercises: [
      { id: "dsn-fill-1", type: "fill", instruction: "Вставь пропущенное слово",
        text: ["I'm having such a good", "___", ", don't stop me now"], answer: "time",
        options: ["time", "day", "night", "fun"] },
      { id: "dsn-match-1", type: "match", instruction: "Сопоставь слова с переводом",
        pairs: [{ word: "alive", translation: "живой" }, { word: "ecstasy", translation: "экстаз" },
                { word: "leaping", translation: "прыгающий" }, { word: "defying", translation: "бросающий вызов" }] },
      { id: "dsn-order-1", type: "order", instruction: "Собери строчку по порядку",
        words: ["good", "having", "time", "a", "I'm"],
        answer: ["I'm", "having", "a", "good", "time"] },
      { id: "dsn-fill-2", type: "fill", instruction: "Вставь пропущенное слово",
        text: ["I'm a shooting star", "___", "through the sky"], answer: "leaping",
        options: ["leaping", "flying", "falling", "jumping"] },
    ],
  },
]