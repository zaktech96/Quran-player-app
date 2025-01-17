"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Surah, Ayah } from "@/types/quran"
import { useEffect, useState, useMemo, useRef, useCallback } from "react"
import { Switch } from "@/components/ui/switch"
import { motion } from "framer-motion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AlQuranResponse {
  code: number
  status: string
  data: {
    surahs: {
      number: number
      name: string
      englishName: string
      englishNameTranslation: string
      numberOfAyahs: number
      revelationType: string
      ayahs: {
        number: number
        text: string
        numberInSurah: number
        juz: number
        manzil: number
        page: number
        ruku: number
        hizbQuarter: number
      }[]
    }[]
  }
}

interface Reciter {
  id: number;
  name: string;
  identifier: string;
}

const RECITERS: Reciter[] = [
  { id: 1, name: "AbdulBaset AbdulSamad [Mujawwad]", identifier: "ar.abdulbasitmujawwad" },
  { id: 2, name: "AbdulBaset AbdulSamad [Murattal]", identifier: "ar.abdulbasitmurattal" },
  { id: 3, name: "Abdullah Basfar", identifier: "ar.abdullahbasfar" },
  { id: 4, name: "Mishary Rashid Alafasy", identifier: "ar.alafasy" },
  { id: 5, name: "Sa'ud al-Shuraym", identifier: "ar.saudalshuraim" },
  { id: 6, name: "Muhammad Siddeeq al-Minshawi [Mujawwad]", identifier: "ar.muhammadsiddiqalminshawimujawwad" },
  { id: 7, name: "Hani ar-Rifai", identifier: "ar.haniarrifai" },
  { id: 8, name: "Ibrahim Al Akhdar", identifier: "ar.ibrahimalakhdar" },
  { id: 9, name: "Maher Al Muaiqly", identifier: "ar.mahermuaiqly" },
  { id: 10, name: "Mohammad Al-Tablawi", identifier: "ar.mohamedtablawi" }
];

export default function QuranPlayer() {
  const [surahs, setSurahs] = useState<Surah[]>([])
  const [currentSurah, setCurrentSurah] = useState<Surah | null>(null)
  const [currentAyahs, setCurrentAyahs] = useState<Ayah[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null)
  const [currentAyahIndex, setCurrentAyahIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedReciter, setSelectedReciter] = useState<number | null>(null)
  const [isLoadingAudio, setIsLoadingAudio] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [quranData, setQuranData] = useState<AlQuranResponse["data"] | null>(null)

  const currentAyahIndexRef = useRef(currentAyahIndex);
  const currentAyahsRef = useRef(currentAyahs);

  useEffect(() => {
    currentAyahIndexRef.current = currentAyahIndex;
  }, [currentAyahIndex]);

  useEffect(() => {
    currentAyahsRef.current = currentAyahs;
  }, [currentAyahs]);

  /* ---------------------------
   *    Fetch Quran Data
   * --------------------------- */
  useEffect(() => {
    const fetchQuranData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("http://api.alquran.cloud/v1/quran/quran-uthmani")
        const data: AlQuranResponse = await response.json()

        if (data.status === "OK" && data.data) {
          setQuranData(data.data)

          // Transform data to match our Surah interface
          const transformedSurahs: Surah[] = data.data.surahs.map((surah) => ({
            number: surah.number,
            name: surah.name,
            englishName: surah.englishName,
            englishNameTranslation: surah.englishNameTranslation,
            numberOfAyahs: surah.numberOfAyahs,
            revelationType: surah.revelationType,
          }))
          setSurahs(transformedSurahs)
        }
      } catch (error) {
        console.error("Failed to load Quran data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuranData()
  }, [])

  /* -------------------------------------------
   *   Create single audio element on mount
   * ------------------------------------------- */
  useEffect(() => {
    const audio = new Audio();
    setAudioRef(audio);

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.pause();
      audio.src = "";
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  /* -------------------------------------------
   *       Helpers
   * ------------------------------------------- */
  const getAudioUrl = (reciterId: number, surahNumber: number) => {
    const reciter = RECITERS.find(r => r.id === reciterId);
    if (!reciter) return '';
    return `https://cdn.islamic.network/quran/audio-surah/128/${reciter.identifier}/${surahNumber}.mp3`;
  };

  /* -------------------------------------------
   *   Surah Selection => Load its ayahs
   * ------------------------------------------- */
  const handleSurahSelect = async (surah: Surah) => {
    try {
      setIsLoading(true);
      setCurrentSurah(surah);

      if (quranData) {
        const selectedSurah = quranData.surahs.find((s: { number: number }) => s.number === surah.number);
        if (selectedSurah) {
          // Fetch translations
          const translationResponse = await fetch(
            `http://api.alquran.cloud/v1/surah/${surah.number}/en.sahih`
          );
          const translationData = await translationResponse.json();

          // Transform ayahs
          const transformedAyahs: Ayah[] = selectedSurah.ayahs.map((ayah: any, index: number) => ({
            number: ayah.number,
            text: ayah.text,
            numberInSurah: ayah.numberInSurah,
            translation: translationData.data.ayahs[index]?.text || "",
            audio: "",
          }));

          setCurrentAyahs(transformedAyahs);
          
          // Reset audio if playing
          if (audioRef) {
            audioRef.pause();
            audioRef.currentTime = 0;
            setIsPlaying(false);
          }
        }
      }
    } catch (error) {
      console.error("Failed to load surah:", error);
    } finally {
      setIsLoading(false);
    }
  };

  /* -------------------------------------------
   *   Play/Pause/Stop
   * ------------------------------------------- */
  const playAudio = async () => {
    if (audioRef && selectedReciter !== null && currentSurah) {
      try {
        setIsLoadingAudio(true);
        const audioUrl = getAudioUrl(selectedReciter, currentSurah.number);
        if (!audioUrl) {
          throw new Error('Could not get audio URL for selected reciter');
        }

        audioRef.pause();
        audioRef.currentTime = 0;
        audioRef.src = audioUrl;
        await audioRef.load();
        await audioRef.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Error playing audio:", error);
        setIsPlaying(false);
        alert("Unable to play audio. Please try a different reciter or surah.");
      } finally {
        setIsLoadingAudio(false);
      }
    }
  };

  const pauseAudio = () => {
    if (audioRef) {
      audioRef.pause();
      setIsPlaying(false);
    }
  };

  const stopAudio = () => {
    if (audioRef) {
      audioRef.pause();
      audioRef.currentTime = 0;
      setIsPlaying(false);
    }
  };

  /* -------------------------------------------
   *   Handle Reciter Change
   * ------------------------------------------- */
  const handleReciterChange = async (reciterId: string) => {
    const numericId = parseInt(reciterId, 10)
    setSelectedReciter(numericId)
    // Optionally pause or reset audio
    if (audioRef && currentSurah && currentAyahs.length > 0) {
      audioRef.pause()
      audioRef.currentTime = 0
      setIsPlaying(false)
      // If desired, you can attempt to preload the current verse
      // ...
    }
  }

  /* -------------------------------------------
   *   Filtering Surahs
   * ------------------------------------------- */
  const filteredSurahs = useMemo(() => {
    return surahs.filter(
      (surah) =>
        surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        surah.englishNameTranslation
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        surah.name.includes(searchQuery) ||
        surah.number.toString().includes(searchQuery)
    )
  }, [surahs, searchQuery])

  const handleVerseClick = (ayah: Ayah, index: number) => {
    setCurrentAyahIndex(index);
    document
      .getElementById(`verse-${ayah.numberInSurah}`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  /* -------------------------------------------
   *   JSX Return
   * ------------------------------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FCFCFC] to-green-50/30 dark:from-gray-950 dark:to-green-950/30">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-green-200/20 to-emerald-200/20 dark:from-green-900/20 dark:to-emerald-900/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-200/20 to-green-200/20 dark:from-emerald-900/20 dark:to-green-900/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2 animate-pulse" />
      </div>

      <div className="container relative mx-auto py-8 px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-b from-green-800 via-green-700 to-green-600 dark:from-green-200 dark:via-green-300 dark:to-green-400 text-transparent bg-clip-text">
            Digital Quran Player
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Experience the divine words through beautiful recitation and reflection
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Enhanced Surah List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-4"
          >
            <Card className="p-6 md:p-8 shadow-lg border border-green-100/20 dark:border-green-800/20 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-3xl hover:shadow-xl transition-all duration-300">
              <div className="flex flex-col gap-4 mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-800 to-green-600 dark:from-green-200 dark:to-green-400 text-transparent bg-clip-text">
                  Surahs
                </h2>

                {/* Search Input */}
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search surah..."
                    className="w-full px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-green-100 dark:border-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                  />
                  <svg
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>

                {searchQuery && (
                  <motion.span
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-green-100/80 to-emerald-100/80 dark:from-green-900/80 dark:to-emerald-900/80 text-sm font-medium text-green-800 dark:text-green-200 text-center"
                  >
                    {filteredSurahs.length} matches found
                  </motion.span>
                )}
              </div>

              <ScrollArea className="h-[75vh] pr-4">
                <div className="space-y-2">
                  {filteredSurahs.map((surah, index) => (
                    <motion.div
                      key={surah.number}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.03 }}
                    >
                      <Button
                        variant={currentSurah?.number === surah.number ? "default" : "ghost"}
                        className={`w-full justify-start text-left p-4 h-auto rounded-2xl transition-all duration-300 group ${
                          currentSurah?.number === surah.number
                            ? "bg-gradient-to-br from-green-100 via-emerald-50 to-green-50 dark:from-green-900 dark:via-emerald-900 dark:to-green-900 text-green-800 dark:text-green-200 shadow-lg scale-[1.02] border border-green-200/50 dark:border-green-800/50"
                            : "hover:bg-gradient-to-br hover:from-green-50 hover:via-emerald-50/50 hover:to-transparent dark:hover:from-green-900/30 dark:hover:via-emerald-900/20 dark:hover:to-transparent text-gray-700 dark:text-gray-300 hover:scale-[1.01] hover:shadow-md"
                        }`}
                        onClick={() => handleSurahSelect(surah)}
                      >
                        <div className="flex items-center w-full gap-4">
                          <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br from-green-200 to-emerald-100 dark:from-green-800 dark:to-emerald-900 shadow-inner group-hover:shadow-lg transition-all duration-300">
                            <span className="text-xl font-bold text-green-800 dark:text-green-100">
                              {surah.number}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="text-xl font-semibold mb-1 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors">
                              {surah.englishName}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 flex justify-between items-center">
                              <span className="text-green-600/75 dark:text-green-400/75">
                                {surah.englishNameTranslation}
                              </span>
                              <span className="font-arabic text-lg text-green-700 dark:text-green-300">
                                {surah.name}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Button>
                    </motion.div>
                  ))}

                  {filteredSurahs.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400">No surahs found</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </Card>
          </motion.div>

          {/* Enhanced Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-8 space-y-6"
          >
            <Card className="p-8 shadow-lg border border-green-100/20 dark:border-green-800/20 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-3xl hover:shadow-xl transition-all duration-300">
              {isLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center h-[60vh]"
                >
                  <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 dark:border-green-400"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <svg
                        className="w-8 h-8 text-green-600 dark:text-green-400"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              ) : currentSurah ? (
                <div className="flex flex-col h-[75vh]">
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-green-100 dark:border-green-900"
                  >
                    <div>
                      <h2 className="text-4xl font-bold bg-gradient-to-r from-green-800 to-green-600 dark:from-green-200 dark:to-green-400 text-transparent bg-clip-text mb-2">
                        {currentSurah.englishName}
                      </h2>
                      <p className="text-lg text-gray-600 dark:text-gray-300">
                        {currentSurah.englishNameTranslation}
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0 text-right">
                      <span className="text-3xl font-arabic text-green-800 dark:text-green-200 block mb-2">
                        {currentSurah.name}
                      </span>
                      <span className="px-4 py-2 rounded-full bg-gradient-to-r from-green-100/80 to-emerald-100/80 dark:from-green-900/80 dark:to-emerald-900/80 text-sm font-medium text-green-800 dark:text-green-200">
                        {currentSurah.revelationType} • {currentSurah.numberOfAyahs} Verses
                      </span>
                    </div>
                  </motion.div>

                  {/* Enhanced Reciter Selection */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="py-4"
                  >
                    <div className="flex items-center gap-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/50 dark:to-emerald-900/50 p-4 rounded-2xl">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild className="w-full">
                          <Button
                            variant="outline"
                            className="w-full justify-between gap-4 h-auto py-3 px-4 bg-white dark:bg-gray-900 border-green-100 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/50"
                          >
                            {selectedReciter ? (
                              <span className="flex flex-col items-start gap-1">
                                <span className="font-medium text-base">
                                  {RECITERS.find((r) => r.id === selectedReciter)?.name}
                                </span>
                              </span>
                            ) : (
                              <span className="text-gray-500 dark:text-gray-400">
                                Select a reciter
                              </span>
                            )}
                            <svg
                              className="h-4 w-4 shrink-0 opacity-50"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="m6 9 6 6 6-6" />
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-[300px] overflow-auto bg-white dark:bg-gray-900 border border-green-100 dark:border-green-800"
                          align="start"
                          sideOffset={4}
                        >
                          <DropdownMenuLabel className="px-3 py-2 text-base font-semibold text-green-800 dark:text-green-200">
                            Reciters
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-green-100 dark:bg-green-800" />
                          <DropdownMenuRadioGroup
                            value={selectedReciter?.toString()}
                            onValueChange={handleReciterChange}
                          >
                            {RECITERS.map((reciter) => (
                              <DropdownMenuRadioItem
                                key={reciter.id}
                                value={reciter.id.toString()}
                                className="flex flex-col items-start gap-1 py-3 px-3 cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/50 focus:bg-green-50 dark:focus:bg-green-900/50"
                              >
                                <span className="font-medium text-base">
                                  {reciter.name}
                                </span>
                              </DropdownMenuRadioItem>
                            ))}
                          </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </motion.div>

                  {selectedReciter && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-center gap-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/50 dark:to-emerald-900/50 p-6 rounded-2xl"
                    >
                      <motion.div whileHover={{ scale: 1.1 }}>
                        {isPlaying ? (
                          <Button
                            size="icon"
                            onClick={pauseAudio}
                            className="w-16 h-16 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 dark:from-green-500 dark:to-emerald-500 dark:hover:from-green-600 dark:hover:to-emerald-600 transition-all duration-200 shadow-lg"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-8 w-8"
                            >
                              <rect x="6" y="4" width="4" height="16"></rect>
                              <rect x="14" y="4" width="4" height="16"></rect>
                            </svg>
                          </Button>
                        ) : (
                          <Button
                            size="icon"
                            onClick={playAudio}
                            disabled={isLoadingAudio}
                            className="w-16 h-16 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 dark:from-green-500 dark:to-emerald-500 dark:hover:from-green-600 dark:hover:to-emerald-600 transition-all duration-200 shadow-lg"
                          >
                            {isLoadingAudio ? (
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-8 w-8"
                              >
                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                              </svg>
                            )}
                          </Button>
                        )}
                      </motion.div>
                    </motion.div>
                  )}

                  <ScrollArea className="flex-grow">
                    <div className="space-y-6">
                      {currentAyahs.map((ayah, index) => {
                        const displayText = ayah.text.replace(
                          /^بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\s*/,
                          ""
                        )

                        return (
                          <motion.div
                            key={ayah.number}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="scroll-mt-6 bg-gradient-to-br from-white via-white to-green-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-green-900/30 rounded-3xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-green-100/20 dark:border-green-800/20 backdrop-blur-sm"
                            id={`verse-${ayah.numberInSurah}`}
                          >
                            {/* Enhanced Ayah Number */}
                            <div className="flex items-center justify-center gap-4 opacity-80 mb-6">
                              <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-green-200 to-transparent dark:via-green-800"></div>
                              <div className="px-6 py-2 rounded-full bg-gradient-to-r from-green-100 to-emerald-50 dark:from-green-900 dark:to-emerald-900 text-base font-medium text-green-800 dark:text-green-200 shadow-sm">
                                Verse {ayah.numberInSurah}
                              </div>
                              <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-green-200 to-transparent dark:via-green-800"></div>
                            </div>

                            {/* Enhanced Arabic Text */}
                            <motion.div
                              whileHover={{ scale: 1.01 }}
                              className={`relative text-3xl md:text-4xl text-right font-arabic leading-[2] tracking-[0.02em] px-8 py-8 rounded-2xl cursor-pointer transition-all duration-300 ${
                                currentAyahIndex === index
                                  ? "bg-gradient-to-br from-green-100 via-emerald-50 to-green-50 dark:from-green-900 dark:via-emerald-900 dark:to-green-900 shadow-lg border border-green-200/50 dark:border-green-800/50 scale-[1.02]"
                                  : "bg-gradient-to-br from-green-50 via-emerald-50/50 to-transparent dark:from-green-900/50 dark:via-emerald-900/30 dark:to-transparent hover:shadow-md"
                              }`}
                              dir="rtl"
                              lang="ar"
                              onClick={() => handleVerseClick(ayah, index)}
                              id={`verse-block-${index}`}
                            >
                              <span className="inline-block">{displayText}</span>
                              <span className="absolute bottom-2 left-4 text-xl text-green-600/75 dark:text-green-400/75">
                                ﴿{ayah.numberInSurah}﴾
                              </span>
                            </motion.div>

                            {/* Enhanced Translation */}
                            <div className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-transparent dark:from-green-900/30 dark:via-emerald-900/20 dark:to-transparent p-8 rounded-2xl mt-6 border border-green-100/10 dark:border-green-800/10">
                              {ayah.translation.replace(
                                /^In the name of Allah, the Entirely Merciful, the Especially Merciful\s*/,
                                ""
                              )}
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </ScrollArea>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 flex items-center justify-center mb-4">
                    <svg
                      className="w-10 h-10 text-green-600 dark:text-green-400"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-green-800 dark:text-green-200">
                    Begin Your Journey
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 max-w-md">
                    Select a surah from the list to start reading and listening to the Quran
                  </p>
                </motion.div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
