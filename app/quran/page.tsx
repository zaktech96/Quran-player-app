"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getAllSurahs, getSurah } from "@/lib/quran"
import { Surah, Ayah } from "@/types/quran"
import { useEffect, useState } from "react"
import { Switch } from "@/components/ui/switch"

type Reciter = {
  id: string;
  name: string;
  arabicName: string;
  format: string;
  type: string;
  direction: string;
};

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
        const data = await getAllSurahs()
        setSurahs(data)
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to load surahs:", error)
        setIsLoading(false)
      }
    }

    loadSurahs()
  }, [])

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
      setIsLoading(true)
      const { ayahs } = await getSurah(surah.number)
      setCurrentSurah(surah)
      setCurrentAyahs(ayahs)
      setCurrentAyahIndex(0)
      setIsPlaying(false)
      
      if (audioRef) {
        const newAudioUrl = getAudioUrl(ayahs[0].number, selectedReciter)
        audioRef.src = newAudioUrl
        audioRef.load()
      } else {
        const audio = new Audio(getAudioUrl(ayahs[0].number, selectedReciter))
        setAudioRef(audio)
      }
    } catch (error) {
      console.error("Failed to load surah:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const playAudio = () => {
    if (audioRef) {
      audioRef.play()
      setIsPlaying(true)
    }
  }

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

  const playNextAyah = () => {
    if (currentAyahIndex < currentAyahs.length - 1) {
      const nextIndex = currentAyahIndex + 1
      setCurrentAyahIndex(nextIndex)
      if (audioRef) {
        const newAudioUrl = getAudioUrl(currentAyahs[nextIndex].number, selectedReciter)
        audioRef.src = newAudioUrl
        audioRef.load()
        audioRef.play()
        setIsPlaying(true)
      }
    } else {
      stopAudio()
    }
  }

  const playPreviousAyah = () => {
    if (currentAyahIndex > 0) {
      const prevIndex = currentAyahIndex - 1
      setCurrentAyahIndex(prevIndex)
      if (audioRef) {
        const newAudioUrl = getAudioUrl(currentAyahs[prevIndex].number, selectedReciter)
        audioRef.src = newAudioUrl
        audioRef.load()
        audioRef.play()
        setIsPlaying(true)
      }
    }
  }

  const getAudioUrl = (ayahNumber: number, reciterId: string) => {
    // mp3quran.net moshaf API format
    const moshafId = "11"; // Using default moshaf_id=11 for Hafs narration
    const surahNumber = Math.floor((ayahNumber - 1) / 6236 * 114) + 1;
    const ayahInSurah = ayahNumber % 6236 || 6236;
    
    return `https://mp3quran.net/api/v3/moshaf/${moshafId}/ayat/${surahNumber}/${ayahInSurah}`;
  };

  const handleReciterChange = async (reciterId: string) => {
    setSelectedReciter(reciterId);
    if (audioRef && currentAyahs[currentAyahIndex]) {
      const newAudioUrl = getAudioUrl(currentAyahs[currentAyahIndex].number, reciterId);
      console.log('New audio URL:', newAudioUrl);
      
      // Test if the audio URL is accessible
      try {
        const response = await fetch(newAudioUrl, { method: 'HEAD' });
        if (response.ok) {
          audioRef.src = newAudioUrl;
          audioRef.load();
          setIsPlaying(false);
        } else {
          console.error('Audio URL not accessible:', newAudioUrl);
        }
      } catch (error) {
        console.error('Error testing audio URL:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
      <div className="container mx-auto py-12 px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/60 text-transparent bg-clip-text">
            Quran Player
          </h1>
          <p className="text-muted-foreground">Listen, read, and reflect on the words of Allah</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Surah List */}
          <Card className="lg:col-span-4 p-6 shadow-xl border-primary/10 backdrop-blur-sm bg-background/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-primary">Surahs</h2>
              {currentSurah && (
                <span className="text-sm text-muted-foreground">
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
                    className={`w-full justify-start text-left p-4 h-auto ${
                      currentSurah?.number === surah.number ? 'bg-primary/10' : ''
                    }`}
                    onClick={() => handleSurahSelect(surah)}
                  >
                    <div className="flex items-center w-full">
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/5 mr-4">
                        <span className="text-primary font-semibold">{surah.number}</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{surah.englishName}</div>
                        <div className="text-sm text-muted-foreground flex justify-between items-center">
                          <span>{surah.englishNameTranslation}</span>
                          <span className="font-arabic text-base">{surah.name}</span>
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
            <Card className="p-8 shadow-xl border-primary/10 backdrop-blur-sm bg-background/50">
              {isLoading ? (
                <div className="flex items-center justify-center h-[60vh]">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                      </svg>
                    </div>
                  </div>
                </div>
              ) : currentSurah ? (
                <>
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b">
                    <div>
                      <h2 className="text-4xl font-bold text-primary mb-2">
                        {currentSurah.englishName}
                      </h2>
                      <p className="text-muted-foreground">
                        {currentSurah.englishNameTranslation}
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0 text-right">
                      <span className="text-3xl font-arabic text-primary/90 block mb-1">
                        {currentSurah.name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {currentSurah.revelationType} • {currentSurah.numberOfAyahs} Verses
                      </span>
                    </div>
                  </div>

                  {/* Add Reciter Selection */}
                  <div className="mb-6">
                    <div className="flex items-center space-x-4">
                      <label htmlFor="reciter" className="text-sm font-medium">
                        Select Reciter:
                      </label>
                      <select
                        id="reciter"
                        value={selectedReciter}
                        onChange={(e) => handleReciterChange(e.target.value)}
                        className="flex-1 max-w-xs rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background 
                          focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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

                  {/* Display Bismillah separately */}
                  {/* {currentSurah?.number !== 1 && currentSurah?.number !== 9 && (
                    <div className="text-4xl text-center font-arabic leading-loose p-8 bg-primary/5 rounded-xl mb-4">
                      بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                    </div>
                  )} */}

                  <div className="space-y-8">
                    {showFullSurah ? (
                      <div className="space-y-12">
                        {currentAyahs.map((ayah, index) => {
                          // Remove Bismillah from the first verse of every surah
                          const displayText = index === 0 
                            ? ayah.text.replace(/^بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\s*/, '')
                            : ayah.text;

                          return (
                            <div key={ayah.number} className="space-y-6">
                              {/* Ayah Number */}
                              <div className="flex items-center justify-center space-x-4">
                                <div className="h-px flex-1 bg-border"></div>
                                <div className="px-4 py-2 rounded-full bg-primary/5 text-sm font-medium">
                                  Verse {ayah.numberInSurah} of {currentSurah.numberOfAyahs}
                                </div>
                                <div className="h-px flex-1 bg-border"></div>
                              </div>

                              {/* Arabic Text */}
                              <div 
                                className={`text-4xl text-right font-arabic leading-loose p-8 rounded-xl cursor-pointer transition-colors duration-200 ${
                                  currentAyahIndex === index 
                                  ? 'bg-primary/20 shadow-lg border border-primary/20' 
                                  : 'bg-primary/5 hover:bg-primary/10 hover:shadow-md'
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
                                }}
                              >
                                {displayText}
                              </div>
                              
                              {/* Translation */}
                              <div className="text-lg text-muted-foreground leading-relaxed bg-muted/30 p-6 rounded-lg">
                                {ayah.translation}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="space-y-8 mt-8">
                        {/* Single Ayah view */}
                        <div className="flex items-center justify-center space-x-4">
                          <div className="h-px flex-1 bg-border"></div>
                          <div className="px-4 py-2 rounded-full bg-primary/5 text-sm font-medium">
                            Verse {currentAyahs[currentAyahIndex]?.numberInSurah} of {currentSurah.numberOfAyahs}
                          </div>
                          <div className="h-px flex-1 bg-border"></div>
                        </div>

                        {/* Arabic Text */}
                        <div 
                          className="text-4xl text-right font-arabic leading-loose p-8 bg-primary/5 rounded-xl"
                          dir="rtl"
                          lang="ar"
                        >
                          {currentAyahIndex === 0 
                            ? currentAyahs[currentAyahIndex]?.text.replace(/^بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\s*/, '')
                            : currentAyahs[currentAyahIndex]?.text}
                        </div>
                        
                        {/* Translation */}
                        <div className="text-lg text-muted-foreground leading-relaxed bg-muted/30 p-6 rounded-lg">
                          {currentAyahs[currentAyahIndex]?.translation}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-primary">Begin Your Journey</h3>
                  <p className="text-muted-foreground max-w-md">
                    Select a surah from the list to start reading and listening to the Quran
                  </p>
                </div>
              )}
            </Card>

            {/* Audio Player */}
            {currentSurah && (
              <Card className="p-6 shadow-xl border-primary/10 backdrop-blur-sm bg-background/50">
                <div className="flex flex-col items-center space-y-6">
                  {/* Continuous Play Toggle */}
                  <div className="flex items-center space-x-3 bg-primary/5 px-4 py-2 rounded-full">
                    <Switch
                      checked={isContinuousPlay}
                      onCheckedChange={setIsContinuousPlay}
                      id="continuous-play"
                      className="data-[state=checked]:bg-primary"
                    />
                    <label
                      htmlFor="continuous-play"
                      className="text-sm font-medium cursor-pointer"
                    >
                      Continuous Play
                    </label>
                  </div>

                  <div className="flex items-center justify-center space-x-6">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={playPreviousAyah}
                      disabled={currentAyahIndex === 0}
                      className="w-12 h-12 rounded-full"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                      >
                        <polygon points="19 20 9 12 19 4 19 20"></polygon>
                        <line x1="5" y1="19" x2="5" y2="5"></line>
                      </svg>
                    </Button>
                    
                    {isPlaying ? (
                      <Button 
                        size="icon" 
                        onClick={pauseAudio}
                        className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90"
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
                          <rect x="6" y="4" width="4" height="16"></rect>
                          <rect x="14" y="4" width="4" height="16"></rect>
                        </svg>
                      </Button>
                    ) : (
                      <Button 
                        size="icon" 
                        onClick={playAudio}
                        className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90"
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
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                      </Button>
                    )}

                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={playNextAyah}
                      disabled={currentAyahIndex === currentAyahs.length - 1}
                      className="w-12 h-12 rounded-full"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                      >
                        <polygon points="5 4 15 12 5 20 5 4"></polygon>
                        <line x1="19" y1="5" x2="19" y2="19"></line>
                      </svg>
                    </Button>

                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={stopAudio}
                      className="w-12 h-12 rounded-full"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
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