export interface QuranEdition {
  identifier: string
  language: string
  name: string
  englishName: string
  format: "text" | "audio"
  type: "quran" | "translation" | "transliteration" | "tafsir"
  direction?: "rtl" | "ltr"
}

export type Surah = {
  number: number
  name: string
  englishName: string
  englishNameTranslation: string
  numberOfAyahs: number
  revelationType: string
}

export type Ayah = {
  number: number
  text: string
  numberInSurah: number
  translation: string
}

export interface Reciter {
  id: number;
  reciter_name: string;
  style: string;
  translated_name: {
    name: string;
    language_name: string;
  };
} 