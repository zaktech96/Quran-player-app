export interface Surah {
  number: number
  name: string
  englishName: string
  englishNameTranslation: string
  numberOfAyahs: number
  revelationType: string
}

export interface Ayah {
  number: number
  text: string
  numberInSurah: number
  translation: string
  audio: string
}

export interface QuranAudio {
  url: string
  duration: number
  reciter: string
} 