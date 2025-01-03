export interface Surah {
  number: number
  name: string
  englishName: string
  englishNameTranslation: string
  numberOfAyahs: number
  revelationType: string
  edition?: QuranEdition
}

export interface Ayah {
  number: number
  numberInSurah: number
  text: string
  translation: string
  audio: string
  edition?: QuranEdition
  translationEdition?: QuranEdition
}

export interface QuranAudio {
  url: string
  duration: number
  reciter: string
}

export interface QuranEdition {
  identifier: string
  language: string
  name: string
  englishName: string
  format: "text" | "audio"
  type: "quran" | "translation" | "transliteration" | "tafsir"
  direction: "rtl" | "ltr" | null
}

export type EditionType = "quran" | "translation" | "transliteration" | "tafsir"
export type EditionFormat = "text" | "audio"
export type EditionDirection = "rtl" | "ltr" 