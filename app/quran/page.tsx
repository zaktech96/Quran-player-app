"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getAllSurahs, getSurah } from "@/lib/quran"
import { Surah, Ayah, Reciter } from "@/types/quran"
import { useEffect, useState } from "react"
import { Switch } from "@/components/ui/switch"

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
  const [selectedReciter, setSelectedReciter] = useState<string>("ar.alafasy")
  const [reciters, setReciters] = useState<Reciter[]>([])
  const [isLoadingReciters, setIsLoadingReciters] = useState(true)

  useEffect(() => {
    const fetchReciters = async () => {
      try {
        const response = await fetch('/api/reciters');
        const data = await response.json();
        console.log('Fetched reciters:', data); // Debug log
        if (Array.isArray(data)) {
          setReciters(data);
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

  const handleAudioEnd = () => {
    if (isContinuousPlay && currentAyahIndex < currentAyahs.length - 1) {
      playNextAyah()
    } else {
      setIsPlaying(false)
    }
  }

  const handleSurahSelect = async (surah: Surah) => {
    try {
      setIsLoading(true);
      const { ayahs } = await getSurah(surah.number);
      setCurrentSurah(surah);
      setCurrentAyahs(ayahs);
      setCurrentAyahIndex(0);
      setIsPlaying(false);
      
      if (audioRef) {
        try {
          const response = await fetch(getAudioUrl(ayahs[0].number, selectedReciter));
          if (response.ok) {
            const data = await response.json();
            audioRef.src = data.audio_file.url;
            await audioRef.load();
          }
        } catch (error) {
          console.error('Error loading initial audio:', error);
        }
      } else {
        const audio = new Audio();
        setAudioRef(audio);
      }
    } catch (error) {
      console.error("Failed to load surah:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const playAudio = async () => {
    if (audioRef && currentAyahs[currentAyahIndex]) {
      try {
        const response = await fetch(getAudioUrl(currentAyahs[currentAyahIndex].number, selectedReciter));
        if (response.ok) {
          const data = await response.json();
          audioRef.src = data.audio_file.url;
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
      audioRef.pause()
      setIsPlaying(false)
    }
  }

  const stopAudio = () => {
    if (audioRef) {
      audioRef.pause()
      audioRef.currentTime = 0
      setIsPlaying(false)
    }
  }

  const playNextAyah = async () => {
    if (currentAyahIndex < currentAyahs.length - 1) {
      const nextIndex = currentAyahIndex + 1;
      setCurrentAyahIndex(nextIndex);
      if (audioRef) {
        try {
          const response = await fetch(getAudioUrl(currentAyahs[nextIndex].number, selectedReciter));
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
    } else {
      stopAudio();
    }
  };

  const playPreviousAyah = async () => {
    if (currentAyahIndex > 0) {
      const prevIndex = currentAyahIndex - 1;
      setCurrentAyahIndex(prevIndex);
      if (audioRef) {
        try {
          const response = await fetch(getAudioUrl(currentAyahs[prevIndex].number, selectedReciter));
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

  const getAudioUrl = (ayahNumber: number, reciterId: string) => {
    // Using Quran.com API v4 for audio recitations
    const surahNumber = currentSurah?.number;
    const ayahInSurah = currentAyahs[currentAyahIndex]?.numberInSurah;
    
    return `https://api.quran.com/api/v4/chapter_recitations/${reciterId}/${surahNumber}/${ayahInSurah}`;
  };

  const handleReciterChange = async (reciterId: string) => {
    setSelectedReciter(reciterId);
    if (audioRef && currentAyahs[currentAyahIndex]) {
      const newAudioUrl = getAudioUrl(currentAyahs[currentAyahIndex].number, reciterId);
      
      try {
        const response = await fetch(newAudioUrl);
        if (response.ok) {
          const data = await response.json();
          // Update audio source with the audio URL from the API response
          const audioUrl = data.audio_file.url;
          audioRef.src = audioUrl;
          audioRef.load();
          setIsPlaying(false);
        } else {
          console.error('Failed to fetch audio URL:', newAudioUrl);
        }
      } catch (error) {
        console.error('Error fetching audio:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFCFC] dark:bg-gray-950">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-200/20 dark:bg-green-900/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-200/20 dark:bg-green-900/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container relative mx-auto py-8 px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-b from-green-800 via-green-700 to-green-600 dark:from-green-200 dark:via-green-300 dark:to-green-400 text-transparent bg-clip-text">
            Digital Quran Player
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Experience the divine words through beautiful recitation and reflection
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Surah List */}
          <Card className="lg:col-span-4 p-6 md:p-8 shadow-lg border-green-100 dark:border-green-900 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-3xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-800 to-green-600 dark:from-green-200 dark:to-green-400 text-transparent bg-clip-text">
                Surahs
              </h2>
              {currentSurah && (
                <span className="px-4 py-2 rounded-full bg-green-100/80 dark:bg-green-900/80 text-sm font-medium text-green-800 dark:text-green-200">
                  {surahs.length} Chapters
                </span>
              )}
            </div>
            <ScrollArea className="h-[75vh] pr-4">
              <div className="space-y-2">
                {surahs.map((surah) => (
                  <Button
                    key={surah.number}
                    variant={currentSurah?.number === surah.number ? "default" : "ghost"}
                    className={`w-full justify-start text-left p-4 h-auto rounded-xl transition-all duration-300 ${
                      currentSurah?.number === surah.number 
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 shadow-md' 
                      : 'hover:bg-green-50 dark:hover:bg-green-900/50 text-gray-700 dark:text-gray-300'
                    }`}
                    onClick={() => handleSurahSelect(surah)}
                  >
                    <div className="flex items-center w-full gap-4">
                      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-green-100/50 dark:bg-green-900/50">
                        <span className="text-lg font-bold text-green-800 dark:text-green-200">{surah.number}</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-lg font-semibold mb-1">{surah.englishName}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 flex justify-between items-center">
                          <span>{surah.englishNameTranslation}</span>
                          <span className="font-arabic text-base text-green-700 dark:text-green-300">{surah.name}</span>
                        </div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="p-8 shadow-lg border-green-100 dark:border-green-900 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-3xl">
              {isLoading ? (
                <div className="flex items-center justify-center h-[60vh]">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 dark:border-green-400"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                      </svg>
                    </div>
                  </div>
                </div>
              ) : currentSurah ? (
                <div className="flex flex-col h-[75vh]">
                  <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-green-100 dark:border-green-900">
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
                      <span className="px-4 py-2 rounded-full bg-green-100/80 dark:bg-green-900/80 text-sm font-medium text-green-800 dark:text-green-200">
                        {currentSurah.revelationType} • {currentSurah.numberOfAyahs} Verses
                      </span>
                    </div>
                  </div>

                  {/* Reciter Selection */}
                  <div className="py-4">
                    <div className="flex items-center gap-4 bg-green-50 dark:bg-green-900/50 p-4 rounded-2xl">
                      <label htmlFor="reciter" className="text-sm font-medium text-green-800 dark:text-green-200 whitespace-nowrap">
                        Select Reciter:
                      </label>
                      <select
                        id="reciter"
                        value={selectedReciter}
                        onChange={(e) => handleReciterChange(e.target.value)}
                        className="flex-1 rounded-xl border border-green-200 dark:border-green-800 bg-white dark:bg-gray-900 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 transition-all duration-200"
                      >
                        <option value="">Select a reciter</option>
                        {reciters.map((reciter) => (
                          <option key={reciter.id} value={reciter.id}>
                            {reciter.name} ({reciter.arabicName})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* View Toggle */}
                  <div className="flex items-center justify-end gap-3 py-4">
                    <Switch
                      checked={showFullSurah}
                      onCheckedChange={setShowFullSurah}
                      id="view-mode"
                      className="data-[state=checked]:bg-green-600 dark:data-[state=checked]:bg-green-500"
                    />
                    <label
                      htmlFor="view-mode"
                      className="text-sm font-medium cursor-pointer text-green-800 dark:text-green-200"
                    >
                      Show Full Surah
                    </label>
                  </div>

                  <ScrollArea className="flex-grow">
                    <div className="space-y-6">
                      {showFullSurah ? (
                        <div className="space-y-6">
                          {currentAyahs.map((ayah, index) => {
                            const displayText = index === 0 
                              ? ayah.text.replace(/^بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\s*/, '')
                              : ayah.text;

                            return (
                              <div 
                                key={ayah.number} 
                                className="scroll-mt-6 bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm"
                                id={`verse-${ayah.numberInSurah}`}
                              >
                                {/* Ayah Number */}
                                <div className="flex items-center justify-center gap-4 opacity-70 mb-4">
                                  <div className="h-px flex-1 bg-green-100 dark:bg-green-900"></div>
                                  <div className="px-4 py-1.5 rounded-full bg-green-50 dark:bg-green-900/50 text-sm font-medium text-green-800 dark:text-green-200">
                                    {ayah.numberInSurah}
                                  </div>
                                  <div className="h-px flex-1 bg-green-100 dark:bg-green-900"></div>
                                </div>

                                {/* Arabic Text */}
                                <div 
                                  className={`text-3xl md:text-4xl text-right font-arabic leading-[2] tracking-[0.02em] px-8 py-6 rounded-2xl cursor-pointer transition-all duration-200 ${
                                    currentAyahIndex === index 
                                    ? 'bg-green-100 dark:bg-green-900 shadow-lg border border-green-200 dark:border-green-800 scale-[1.02]' 
                                    : 'bg-green-50 dark:bg-green-900/50 hover:bg-green-100/50 dark:hover:bg-green-900 hover:shadow-md hover:scale-[1.01]'
                                  }`}
                                  dir="rtl"
                                  lang="ar"
                                  onClick={() => {
                                    setCurrentAyahIndex(index)
                                    if (audioRef) {
                                      const newAudioUrl = getAudioUrl(ayah.number, selectedReciter)
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
                                  <span className="inline-block mr-4 text-2xl text-green-600 dark:text-green-400">﴿{ayah.numberInSurah}﴾</span>
                                </div>

                                {/* Translation */}
                                <div className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed bg-green-50/50 dark:bg-green-900/50 p-6 rounded-xl mt-4">
                                  {ayah.translation}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm">
                          {/* Single Ayah view */}
                          <div className="flex items-center justify-center gap-4 mb-4">
                            <div className="h-px flex-1 bg-green-100 dark:bg-green-900"></div>
                            <div className="px-4 py-2 rounded-full bg-green-50 dark:bg-green-900/50 text-sm font-medium text-green-800 dark:text-green-200">
                              Verse {currentAyahs[currentAyahIndex]?.numberInSurah} of {currentSurah.numberOfAyahs}
                            </div>
                            <div className="h-px flex-1 bg-green-100 dark:bg-green-900"></div>
                          </div>

                          {/* Arabic Text */}
                          <div 
                            className="text-3xl md:text-4xl text-right font-arabic leading-[2] tracking-[0.02em] px-8 py-6 bg-green-50 dark:bg-green-900/50 rounded-2xl"
                            dir="rtl"
                            lang="ar"
                          >
                            <span className="inline-block">
                              {currentAyahIndex === 0 
                                ? currentAyahs[currentAyahIndex]?.text.replace(/^بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\s*/, '')
                                : currentAyahs[currentAyahIndex]?.text}
                            </span>
                            <span className="inline-block mr-4 text-2xl text-green-600 dark:text-green-400">﴿{currentAyahs[currentAyahIndex]?.numberInSurah}﴾</span>
                          </div>

                          {/* Translation */}
                          <div className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed bg-green-50/50 dark:bg-green-900/50 p-6 rounded-xl mt-4">
                            {currentAyahs[currentAyahIndex]?.translation}
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-green-800 dark:text-green-200">Begin Your Journey</h3>
                  <p className="text-gray-600 dark:text-gray-300 max-w-md">
                    Select a surah from the list to start reading and listening to the Quran
                  </p>
                </div>
              )}
            </Card>

            {/* Audio Player */}
            {currentSurah && (
              <Card className="p-6 md:p-8 shadow-lg border-green-100 dark:border-green-900 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-3xl">
                <div className="flex flex-col items-center gap-6">
                  {/* Continuous Play Toggle */}
                  <div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/50 px-6 py-3 rounded-full">
                    <Switch
                      checked={isContinuousPlay}
                      onCheckedChange={setIsContinuousPlay}
                      id="continuous-play"
                      className="data-[state=checked]:bg-green-600 dark:data-[state=checked]:bg-green-500"
                    />
                    <label
                      htmlFor="continuous-play"
                      className="text-sm font-medium cursor-pointer text-green-800 dark:text-green-200"
                    >
                      Continuous Play
                    </label>
                  </div>

                  <div className="flex items-center justify-center gap-6">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={playPreviousAyah}
                      disabled={currentAyahIndex === 0}
                      className="w-12 h-12 rounded-full hover:bg-green-50 dark:hover:bg-green-900/50 transition-colors duration-200 border-green-200 dark:border-green-800"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6"
                      >
                        <polygon points="19 20 9 12 19 4 19 20"></polygon>
                        <line x1="5" y1="19" x2="5" y2="5"></line>
                      </svg>
                    </Button>

                    {isPlaying ? (
                      <Button 
                        size="icon" 
                        onClick={pauseAudio}
                        className="w-16 h-16 rounded-full bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition-colors duration-200 shadow-lg"
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
                        className="w-16 h-16 rounded-full bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition-colors duration-200 shadow-lg"
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
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                      </Button>
                    )}

                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={playNextAyah}
                      disabled={currentAyahIndex === currentAyahs.length - 1}
                      className="w-12 h-12 rounded-full hover:bg-green-50 dark:hover:bg-green-900/50 transition-colors duration-200 border-green-200 dark:border-green-800"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6"
                      >
                        <polygon points="5 4 15 12 5 20 5 4"></polygon>
                        <line x1="19" y1="5" x2="19" y2="19"></line>
                      </svg>
                    </Button>

                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={stopAudio}
                      className="w-12 h-12 rounded-full hover:bg-green-50 dark:hover:bg-green-900/50 transition-colors duration-200 border-green-200 dark:border-green-800"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      </svg>
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 