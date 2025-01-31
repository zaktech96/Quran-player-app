import { Surah, Ayah, QuranEdition } from "@/types/quran"

const API_BASE_URL = "https://api.alquran.cloud/v1"

// Available edition types
export const EDITION_TYPES = {
  TRANSLATION: "translation",
  TAFSIR: "tafsir",
  QURAN: "quran",
  TRANSLITERATION: "transliteration"
} as const

// Default editions - using specific Uthmani script edition
const DEFAULT_EDITIONS = {
  ARABIC: "quran-uthmani",  // Using the official Uthmani script
  ENGLISH: "en.asad"
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
    // Always use Uthmani script for Arabic text
    const arabicEdition = DEFAULT_EDITIONS.ARABIC
    const translationEdition = options.translation || DEFAULT_EDITIONS.ENGLISH

    // Get Arabic text from Uthmani script
    const arabicResponse = await fetch(`${API_BASE_URL}/quran/${arabicEdition}`)
    const arabicData = await arabicResponse.json()
    const surahData = arabicData.data.surahs[number - 1]

    // Get translation
    const translationResponse = await fetch(`${API_BASE_URL}/surah/${number}/${translationEdition}`)
    const translationData = await translationResponse.json()

    // Get edition information
    const [editionInfo, translationInfo] = await Promise.all([
      getEditionInfo(arabicEdition),
      getEditionInfo(translationEdition)
    ])

    // Process the ayahs directly from the API without any modifications
    const ayahs = surahData.ayahs.map((ayah: any, index: number) => ({
      number: ayah.number,
      numberInSurah: ayah.numberInSurah,
      text: ayah.text,
      translation: translationData.data.ayahs[index].text
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
