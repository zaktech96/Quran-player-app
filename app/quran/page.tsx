"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getAllSurahs, getSurah, getAyah } from "@/lib/quran"
import { Surah, Ayah, Reciter } from "@/types/quran"
import { useEffect, useState } from "react"
import { Switch } from "@/components/ui/switch"
import { motion } from "framer-motion"
import { Pause, Play, X } from "lucide-react"

export default function QuranPlayer() {
  const [surahs, setSurahs] = useState<Surah[]>([])
  const [currentSurah, setCurrentSurah] = useState<Surah | null>(null)
  const [currentAyahs, setCurrentAyahs] = useState<Ayah[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null)
  const [currentAyahIndex, setCurrentAyahIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isContinuousPlay, setIsContinuousPlay] = useState(true)
  const [showFullSurah, setShowFullSurah] = useState(false)
  const [selectedReciter, setSelectedReciter] = useState<number | null>(null)
  const [reciters, setReciters] = useState<Reciter[]>([])
  const [isLoadingReciters, setIsLoadingReciters] = useState(true)
  const [surahProgress, setSurahProgress] = useState(0)
  const [showReciterPrompt, setShowReciterPrompt] = useState(true)

  useEffect(() => {
    const fetchReciters = async () => {
      try {
        const response = await fetch('https://api.quran.com/api/v4/resources/recitations');
        const data = await response.json();
        if (data.recitations) {
          setReciters(data.recitations);
          setIsLoadingReciters(false);
        }
      } catch (error) {
        console.error('Error fetching reciters:', error);
      }
    };

    fetchReciters();
  }, []);

  useEffect(() => {
    const loadSurahs = async () => {
      try {
        setIsLoading(true);
        const data = await getAllSurahs();
        if (data.length > 0) {
          setSurahs(data);
        } else {
          console.error("No surahs returned");
        }
      } catch (error) {
        console.error("Failed to load surahs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSurahs();
  }, []);

  useEffect(() => {
    if (audioRef) {
      audioRef.addEventListener('ended', handleAudioEnd)
      return () => {
        audioRef.removeEventListener('ended', handleAudioEnd)
      }
    }
  }, [audioRef, currentAyahIndex, currentAyahs, isContinuousPlay])

  useEffect(() => {
    if (audioRef) {
      const updateProgress = () => {
        const currentVerseProgress = (audioRef.currentTime / audioRef.duration) || 0
        const overallProgress = ((currentAyahIndex + currentVerseProgress) / currentAyahs.length) * 100
        setSurahProgress(overallProgress)
      }

      audioRef.addEventListener('timeupdate', updateProgress)
      return () => audioRef.removeEventListener('timeupdate', updateProgress)
    }
  }, [audioRef, currentAyahIndex, currentAyahs.length])

  const handleAudioEnd = () => {
    if (isContinuousPlay && currentAyahIndex < currentAyahs.length - 1) {
      playNextAyah()
    } else {
      setIsPlaying(false)
    }
  }

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    setAudioRef(audio);
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const getAudioUrl = (reciterId: number, chapterNumber: number) => {
    return `https://api.quran.com/api/v4/chapter_recitations/${reciterId}/${chapterNumber}`;
  };

  const handleSurahSelect = async (surah: Surah) => {
    try {
      setIsLoading(true);
      setCurrentSurah(surah);
      const { ayahs } = await getSurah(surah.number);
      if (ayahs.length > 0) {
        setCurrentAyahs(ayahs);
        setCurrentAyahIndex(0);
        if (audioRef && selectedReciter !== null) {
          audioRef.pause();
          setIsPlaying(false);
          try {
            const response = await fetch(getAudioUrl(selectedReciter, surah.number));
            const data = await response.json();
            audioRef.src = data.audio_file.audio_url;
            await audioRef.load();
          } catch (error) {
            console.error('Error loading audio:', error);
          }
        }
      }
    } catch (error) {
      console.error("Failed to load surah:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const playAudio = async () => {
    if (audioRef && currentSurah && selectedReciter !== null) {
      try {
        const response = await fetch(getAudioUrl(selectedReciter, currentSurah.number));
        if (response.ok) {
          const data = await response.json();
          audioRef.src = data.audio_file.audio_url;
          await audioRef.load();
          await audioRef.play();
          setIsPlaying(true);
        }
      } catch (error) {
        console.error('Error playing audio:', error);
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

  const playNextAyah = async () => {
    if (currentAyahIndex < currentAyahs.length - 1 && selectedReciter !== null) {
      const nextIndex = currentAyahIndex + 1;
      setCurrentAyahIndex(nextIndex);
      if (audioRef) {
        try {
          const newAudioUrl = getAudioUrl(selectedReciter, currentAyahs[nextIndex].number);
          const response = await fetch(newAudioUrl);
          if (response.ok) {
            const data = await response.json();
            audioRef.src = data.audio_file.url;
            await audioRef.load();
            await audioRef.play();
            setIsPlaying(true);
          }
        } catch (error) {
          console.error('Error playing next ayah:', error);
        }
      }
    }
  };

  const playPreviousAyah = async () => {
    if (currentAyahIndex > 0 && selectedReciter !== null) {
      const prevIndex = currentAyahIndex - 1;
      setCurrentAyahIndex(prevIndex);
      if (audioRef) {
        try {
          const response = await fetch(getAudioUrl(selectedReciter, currentAyahs[prevIndex].number));
          if (response.ok) {
            const data = await response.json();
            audioRef.src = data.audio_file.url;
            await audioRef.load();
            await audioRef.play();
            setIsPlaying(true);
          }
        } catch (error) {
          console.error('Error playing previous ayah:', error);
        }
      }
    }
  };

  const handleReciterChange = async (reciterId: string) => {
    const numericId = parseInt(reciterId, 10);
    setSelectedReciter(numericId);
    setShowReciterPrompt(false);
    if (audioRef && currentSurah) {
      try {
        const response = await fetch(getAudioUrl(numericId, currentSurah.number));
        if (response.ok) {
          const data = await response.json();
          audioRef.src = data.audio_file.audio_url;
          await audioRef.load();
          setIsPlaying(false);
        }
      } catch (error) {
        console.error('Error loading audio for reciter:', error);
      }
    }
  };

  const handleAyahSelect = async (surahNo: number, ayahNo: number) => {
    try {
      const ayah = await getAyah(surahNo, ayahNo);
      if (ayah) {
        setCurrentAyahIndex(ayahNo - 1);
        setCurrentAyahs(prev => {
          const newAyahs = [...prev];
          newAyahs[ayahNo - 1] = ayah;
          return newAyahs;
        });
      }
    } catch (error) {
      console.error('Error loading ayah:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] 
      from-green-50 via-white to-green-50/30 
      dark:from-green-950 dark:via-gray-950 dark:to-green-950/30">
      
      {/* Enhanced glass-morphism background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] 
          bg-gradient-to-br from-green-200/20 to-emerald-200/20 
          dark:from-green-900/10 dark:to-emerald-900/10 
          rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3 
          animate-pulse-slow" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] 
          bg-gradient-to-tr from-emerald-200/20 to-green-200/20 
          dark:from-emerald-900/10 dark:to-green-900/10 
          rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3 
          animate-pulse-slow" />
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
            <Card className="relative overflow-hidden backdrop-blur-md 
              bg-white/70 dark:bg-gray-900/70 
              border border-green-100/20 dark:border-green-800/20 
              shadow-lg hover:shadow-xl transition-all duration-500">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-800 to-green-600 dark:from-green-200 dark:to-green-400 text-transparent bg-clip-text">
                  Surahs
                </h2>
                {currentSurah && (
                  <motion.span 
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-green-100/80 to-emerald-100/80 dark:from-green-900/80 dark:to-emerald-900/80 text-sm font-medium text-green-800 dark:text-green-200"
                  >
                    {surahs.length} Chapters
                  </motion.span>
                )}
              </div>
              <ScrollArea className="h-[75vh] pr-4">
                <div className="space-y-2">
                  {surahs.map((surah, index) => (
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
                          ? 'bg-gradient-to-br from-green-100 via-emerald-50 to-green-50 dark:from-green-900 dark:via-emerald-900 dark:to-green-900 text-green-800 dark:text-green-200 shadow-lg scale-[1.02] border border-green-200/50 dark:border-green-800/50' 
                          : 'hover:bg-gradient-to-br hover:from-green-50 hover:via-emerald-50/50 hover:to-transparent dark:hover:from-green-900/30 dark:hover:via-emerald-900/20 dark:hover:to-transparent text-gray-700 dark:text-gray-300 hover:scale-[1.01] hover:shadow-md'
                        }`}
                        onClick={() => handleSurahSelect(surah)}
                      >
                        <div className="flex items-center w-full gap-4">
                          <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br from-green-200 to-emerald-100 dark:from-green-800 dark:to-emerald-900 shadow-inner group-hover:shadow-lg transition-all duration-300">
                            <span className="text-xl font-bold text-green-800 dark:text-green-100">{surah.number}</span>
                          </div>
                          <div className="flex-1">
                            <div className="text-xl font-semibold mb-1 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors">{surah.englishName}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 flex justify-between items-center">
                              <span className="text-green-600/75 dark:text-green-400/75">{surah.englishNameTranslation}</span>
                              <span className="font-arabic text-lg text-green-700 dark:text-green-300">{surah.name}</span>
                            </div>
                          </div>
                        </div>
                      </Button>
                    </motion.div>
                  ))}
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
                      <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
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
                      <label htmlFor="reciter" className="text-sm font-medium text-green-800 dark:text-green-200 whitespace-nowrap">
                        Select Reciter:
                      </label>
                      <select
                        id="reciter"
                        value={selectedReciter || ""}
                        onChange={(e) => handleReciterChange(e.target.value)}
                        className="flex-1 rounded-xl border border-green-200 dark:border-green-800 bg-white dark:bg-gray-900 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 transition-all duration-200"
                      >
                        <option value="">Select a reciter</option>
                        {reciters.map((reciter) => (
                          <option key={reciter.id} value={reciter.id}>
                            {reciter.reciter_name} ({reciter.style})
                          </option>
                        ))}
                      </select>
                    </div>
                  </motion.div>

                  {/* Enhanced View Toggle */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center justify-end gap-3 py-4"
                  >
                    <Switch
                      checked={showFullSurah}
                      onCheckedChange={setShowFullSurah}
                      id="view-mode"
                      className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-green-600 data-[state=checked]:to-emerald-600 dark:data-[state=checked]:from-green-500 dark:data-[state=checked]:to-emerald-500"
                    />
                    <label
                      htmlFor="view-mode"
                      className="text-sm font-medium cursor-pointer text-green-800 dark:text-green-200"
                    >
                      Show Full Surah
                    </label>
                  </motion.div>

                  {currentSurah && currentSurah.number !== 9 && currentSurah.number !== 1 && (
                    <motion.div className="text-center mb-8">
                      <div className="text-3xl font-arabic mb-2">
                        بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                      </div>
                      <div className="text-gray-600 dark:text-gray-300">
                        In the name of Allah, the Entirely Merciful, the Especially Merciful
                      </div>
                    </motion.div>
                  )}

                  <ScrollArea className="flex-grow">
                    <div className="space-y-6">
                      {showFullSurah ? (
                        <div className="space-y-6">
                          {currentAyahs.map((ayah, index) => {
                            const displayText = index === 0 
                              ? ayah.text.replace(/^بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\s*/, '')
                              : ayah.text;

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
                                    ? 'bg-gradient-to-br from-green-100 via-emerald-50 to-green-50 dark:from-green-900 dark:via-emerald-900 dark:to-green-900 shadow-lg border border-green-200/50 dark:border-green-800/50 scale-[1.02]' 
                                    : 'bg-gradient-to-br from-green-50 via-emerald-50/50 to-transparent dark:from-green-900/50 dark:via-emerald-900/30 dark:to-transparent hover:shadow-md'
                                  }`}
                                  dir="rtl"
                                  lang="ar"
                                  onClick={() => {
                                    setCurrentAyahIndex(index)
                                    if (audioRef && selectedReciter !== null) {
                                      const newAudioUrl = getAudioUrl(selectedReciter, ayah.number)
                                      audioRef.src = newAudioUrl
                                      audioRef.load()
                                      setIsPlaying(false)
                                    }
                                    document.getElementById(`verse-${ayah.numberInSurah}`)?.scrollIntoView({
                                      behavior: 'smooth',
                                      block: 'center'
                                    })
                                  }}
                                >
                                  <span className="inline-block">{displayText}</span>
                                  <span className="absolute bottom-2 left-4 text-xl text-green-600/75 dark:text-green-400/75">﴿{ayah.numberInSurah}﴾</span>
                                </motion.div>

                                {/* Enhanced Translation */}
                                <div className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-transparent dark:from-green-900/30 dark:via-emerald-900/20 dark:to-transparent p-8 rounded-2xl mt-6 border border-green-100/10 dark:border-green-800/10">
                                  {ayah.translation}
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm"
                        >
                          {/* Single Ayah view */}
                          <div className="flex items-center justify-center gap-4 mb-4">
                            <div className="h-px flex-1 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900"></div>
                            <div className="px-4 py-2 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/50 dark:to-emerald-900/50 text-sm font-medium text-green-800 dark:text-green-200">
                              Verse {currentAyahs[currentAyahIndex]?.numberInSurah} of {currentSurah.numberOfAyahs}
                            </div>
                            <div className="h-px flex-1 bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900 dark:to-green-900"></div>
                          </div>

                          {/* Arabic Text */}
                          <motion.div 
                            whileHover={{ scale: 1.01 }}
                            className="text-3xl md:text-4xl text-right font-arabic leading-[2] tracking-[0.02em] px-8 py-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/50 dark:to-emerald-900/50 rounded-2xl"
                            dir="rtl"
                            lang="ar"
                          >
                            <span className="inline-block">
                              {currentAyahIndex === 0 
                                ? currentAyahs[currentAyahIndex]?.text.replace(/^بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\s*/, '')
                                : currentAyahs[currentAyahIndex]?.text}
                            </span>
                            <span className="inline-block mr-4 text-2xl text-green-600 dark:text-green-400">﴿{currentAyahs[currentAyahIndex]?.numberInSurah}﴾</span>
                          </motion.div>

                          {/* Translation */}
                          <div className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/50 dark:to-emerald-900/50 p-6 rounded-xl mt-4">
                            {currentAyahs[currentAyahIndex]?.translation}
                          </div>
                        </motion.div>
                      )}
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
                    <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-green-800 dark:text-green-200">Begin Your Journey</h3>
                  <p className="text-gray-600 dark:text-gray-300 max-w-md">
                    Select a surah from the list to start reading and listening to the Quran
                  </p>
                </motion.div>
              )}
            </Card>

            {/* Enhanced Audio Player */}
            {currentSurah && (
              <>
                {showReciterPrompt ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-6 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 
                      rounded-2xl border border-green-100/20 dark:border-green-800/20
                      text-center"
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/50 
                        flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-600 dark:text-green-400" 
                          fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-3xl font-semibold text-green-800 dark:text-green-200 mb-3">
                          Select a Reciter
                        </h3>
                        <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
                          Choose a reciter to listen to the beautiful recitation
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Card className="backdrop-blur-md bg-white/90 dark:bg-gray-900/90 
                      shadow-xl border border-green-100/20 dark:border-green-800/20 
                      rounded-full hover:shadow-2xl transition-all duration-300"
                    >
                      {/* Progress Bar */}
                      <div className="absolute -top-3 left-4 right-4">
                        <div className="h-1 bg-green-100 dark:bg-green-900/50 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                            style={{ width: `${(audioRef?.currentTime || 0) / (audioRef?.duration || 1) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4">
                        {/* Left Side - Surah Info */}
                        <motion.div className="hidden sm:block min-w-[150px]">
                          <h4 className="text-sm font-medium bg-gradient-to-r from-green-600 to-emerald-600 
                            dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                            {currentSurah?.englishName}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Verse {currentAyahIndex + 1}
                            </span>
                            <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {selectedReciter && reciters.find(r => r.id === selectedReciter)?.reciter_name}
                            </span>
                          </div>
                        </motion.div>

                        {/* Center - Audio Controls */}
                        <div className="flex-1 flex items-center justify-center gap-4">
                          {/* Previous Button */}
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={playPreviousAyah}
                              disabled={currentAyahIndex === 0}
                              className="h-8 w-8 rounded-full hover:bg-green-50 dark:hover:bg-green-900/50"
                            >
                              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 20L9 12l10-8v16zM5 19V5" />
                              </svg>
                            </Button>
                          </motion.div>

                          {/* Play/Pause Button */}
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button
                              size="icon"
                              onClick={isPlaying ? pauseAudio : playAudio}
                              className="h-12 w-12 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 
                                hover:from-green-700 hover:to-emerald-700 shadow-lg"
                            >
                              {isPlaying ? (
                                <Pause className="h-5 w-5 text-white" />
                              ) : (
                                <Play className="h-5 w-5 text-white ml-1" />
                              )}
                            </Button>
                          </motion.div>

                          {/* Next Button */}
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={playNextAyah}
                              disabled={currentAyahIndex === currentAyahs.length - 1}
                              className="h-8 w-8 rounded-full hover:bg-green-50 dark:hover:bg-green-900/50"
                            >
                              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 4l10 8-10 8V4zM19 5v14" />
                              </svg>
                            </Button>
                          </motion.div>
                        </div>

                        {/* Right Side - Additional Controls */}
                        <div className="flex items-center gap-4">
                          {/* Continuous Play Toggle */}
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={isContinuousPlay}
                              onCheckedChange={setIsContinuousPlay}
                              className="data-[state=checked]:bg-green-600"
                            />
                            <span className="text-sm hidden lg:inline text-gray-600 dark:text-gray-300">
                              Continuous
                            </span>
                          </div>

                          {/* Close Button */}
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={stopAudio}
                              className="h-8 w-8 rounded-full hover:bg-red-50 dark:hover:bg-red-900/50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
} 