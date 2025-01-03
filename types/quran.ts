export type Surah = {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export type Ayah = {
  number: number;
  text: string;
  numberInSurah: number;
  translation: string;
}

export type Reciter = {
  id: string;
  name: string;
  arabicName: string;
  format: string;
} 