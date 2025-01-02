import { Surah, Ayah } from "@/types/quran"

const API_BASE_URL = "https://api.alquran.cloud/v1"

export async function getAllSurahs(): Promise<Surah[]> {
  const response = await fetch(`${API_BASE_URL}/surah`)
  const data = await response.json()
  return data.data
}

export async function getSurah(number: number): Promise<{
  surah: Surah
  ayahs: Ayah[]
}> {
  const [surahResponse, translationResponse, audioResponse] = await Promise.all([
    fetch(`${API_BASE_URL}/surah/${number}`),
    fetch(`${API_BASE_URL}/surah/${number}/en.asad`),
    fetch(`${API_BASE_URL}/surah/${number}/ar.alafasy`),
  ])

  const [surahData, translationData, audioData] = await Promise.all([
    surahResponse.json(),
    translationResponse.json(),
    audioResponse.json(),
  ])

  const ayahs = surahData.data.ayahs.map((ayah: any, index: number) => ({
    number: ayah.number,
    text: ayah.text,
    numberInSurah: ayah.numberInSurah,
    translation: translationData.data.ayahs[index].text,
    audio: audioData.data.ayahs[index].audio,
  }))

  return {
    surah: surahData.data,
    ayahs,
  }
} 