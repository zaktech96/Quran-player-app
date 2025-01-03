import { Surah, Ayah, QuranEdition } from "@/types/quran"

const API_BASE_URL = "http://api.alquran.cloud/v1"

// Available edition types
export const EDITION_TYPES = {
  TRANSLATION: "translation",
  TAFSIR: "tafsir",
  QURAN: "quran",
  TRANSLITERATION: "transliteration"
} as const

// Default editions
const DEFAULT_EDITIONS = {
  ARABIC: "quran-uthmani",
  ENGLISH: "en.asad",
  AUDIO: "ar.alafasy"
} as const

export async function getAvailableEditions(type?: string, language?: string): Promise<QuranEdition[]> {
  const response = await fetch(`${API_BASE_URL}/edition`)
  const data = await response.json()
  let editions = data.data as QuranEdition[]

  // Filter by type if specified
  if (type) {
    editions = editions.filter(edition => edition.type === type)
  }

  // Filter by language if specified
  if (language) {
    editions = editions.filter(edition => edition.language === language)
  }

  return editions
}

export async function getAllSurahs(): Promise<Surah[]> {
  const response = await fetch(`${API_BASE_URL}/surah`)
  const data = await response.json()
  return data.data
}

export async function getSurah(
  number: number,
  options: {
    edition?: string,
    translation?: string,
    audio?: string
  } = {}
): Promise<{
  ayahs: Ayah[],
  edition?: QuranEdition,
  translation?: QuranEdition
}> {
  try {
    // Use provided editions or defaults
    const arabicEdition = options.edition || DEFAULT_EDITIONS.ARABIC
    const translationEdition = options.translation || DEFAULT_EDITIONS.ENGLISH
    const audioEdition = options.audio || DEFAULT_EDITIONS.AUDIO

    // Get Arabic text
    const arabicResponse = await fetch(`${API_BASE_URL}/quran/${arabicEdition}`)
    const arabicData = await arabicResponse.json()
    const surahData = arabicData.data.surahs[number - 1]

    // Get translation
    const translationResponse = await fetch(`${API_BASE_URL}/surah/${number}/${translationEdition}`)
    const translationData = await translationResponse.json()

    // Get audio
    const audioResponse = await fetch(`${API_BASE_URL}/surah/${number}/${audioEdition}`)
    const audioData = await audioResponse.json()

    // Get edition information
    const [editionInfo, translationInfo] = await Promise.all([
      getEditionInfo(arabicEdition),
      getEditionInfo(translationEdition)
    ])

    // Directly process the ayahs from API without filtering
    const ayahs = surahData.ayahs.map((ayah: any, index: number) => ({
      number: ayah.number,
      numberInSurah: ayah.numberInSurah,
      text: ayah.text,
      translation: translationData.data.ayahs[index]?.text,  // Use the same index for translation
      audio: audioData.data.ayahs[index]?.audio  // Use the same index for audio
    }))

    return { 
      ayahs,
      edition: editionInfo,
      translation: translationInfo
    }
  } catch (error) {
    console.error('Error fetching surah:', error)
    throw error
  }
}

// Helper function to get edition information
async function getEditionInfo(identifier: string): Promise<QuranEdition | undefined> {
  const editions = await getAvailableEditions()
  return editions.find(edition => edition.identifier === identifier)
}
