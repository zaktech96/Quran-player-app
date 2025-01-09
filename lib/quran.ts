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
  translation?: QuranEdition,
  bismillah?: { arabic: string; translation: string }
}> {
  try {
    const arabicEdition = DEFAULT_EDITIONS.ARABIC
    const translationEdition = options.translation || DEFAULT_EDITIONS.ENGLISH

    const arabicResponse = await fetch(`${API_BASE_URL}/quran/${arabicEdition}`)
    const arabicData = await arabicResponse.json()
    const surahData = arabicData.data.surahs[number - 1]

    const translationResponse = await fetch(`${API_BASE_URL}/surah/${number}/${translationEdition}`)
    const translationData = await translationResponse.json()

    const [editionInfo, translationInfo] = await Promise.all([
      getEditionInfo(arabicEdition),
      getEditionInfo(translationEdition)
    ])

    // Handle Bismillah separately
    let bismillah;
    if (number !== 1 && number !== 9) {
      bismillah = {
        arabic: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
        translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful"
      };
    }

    const ayahs = surahData.ayahs.map((ayah: any, index: number) => {
      let text = ayah.text;
      let translation = translationData.data.ayahs[index].text;

      // Remove Bismillah from first ayah of ALL surahs except Al-Fatiha (1)
      if (ayah.numberInSurah === 1) {
        if (number === 1) {
          // For Al-Fatiha, keep Bismillah as it's the first verse
          return {
            number: ayah.number,
            numberInSurah: ayah.numberInSurah,
            text,
            translation
          };
        } else {
          // For all other surahs, remove Bismillah from first verse
          text = text.replace(/^بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\s*/, '');
          translation = translation.replace(/^In the name of Allah, .+?\. /, '');
        }
      }

      return {
        number: ayah.number,
        numberInSurah: ayah.numberInSurah,
        text,
        translation
      };
    });

    return { 
      ayahs,
      bismillah,
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

interface VerseTimings {
  timestampFrom: number;
  timestampTo: number;
  duration: number;
  verseNumber: number;
}

export async function getVerseTimings(surahNumber: number, reciterId: number): Promise<VerseTimings[]> {
  try {
    const response = await fetch(`https://api.quran.com/api/v4/chapter_recitations/${reciterId}/${surahNumber}/timings`);
    const data = await response.json();
    return data.verse_timings.map((timing: any) => ({
      timestampFrom: timing.timestamp_from,
      timestampTo: timing.timestamp_to,
      duration: timing.duration,
      verseNumber: timing.verse_key.split(':')[1]
    }));
  } catch (error) {
    console.error('Error fetching verse timings:', error);
    return [];
  }
}

export async function getAyah(surahNo: number, ayahNo: number): Promise<Ayah | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/ayah/${surahNo}:${ayahNo}/en.asad`);
    const data = await response.json();
    
    if (data.code === 200) {
      return {
        number: data.data.number,
        text: data.data.text,
        numberInSurah: data.data.numberInSurah,
        translation: data.data.translation
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching ayah:', error);
    return null;
  }
}
