'use client';
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Maximize, Minimize, Pause, Play, Volume2, VolumeX } from 'lucide-react';

interface CustomVideoPlayerProps {
  videoSrc: string;
  onTimeUpdate?: (currentTime: number) => void;
  timestamps: { time: number; verseId: string | number }[];
  onVerseEnd?: () => void;
  isContinuousPlay?: boolean;
  currentVerseId?: string | number;
}

export const VideoPlayer: React.FC<CustomVideoPlayerProps> = ({ 
  videoSrc, 
  onTimeUpdate,
  timestamps,
  onVerseEnd,
  isContinuousPlay = false,
  currentVerseId
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [currentVolume, setCurrentVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const [lastMouseMoveTime, setLastMouseMoveTime] = useState(Date.now());

  const autoplay = useMemo(() => false, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      if (video.duration > 0) {
        const currentTime = video.currentTime;
        setProgress((currentTime / video.duration) * 100);
        onTimeUpdate?.(currentTime);

        // Find the current verse based on timestamps
        const currentVerse = timestamps
          .slice()
          .reverse()
          .find(t => currentTime >= t.time);

        // If we're in a new verse, trigger verse change
        if (currentVerse && currentVerse.verseId !== currentVerseId) {
          console.log('Changing to verse:', currentVerse.verseId, 'at time:', currentTime);
          onVerseEnd?.();
        }
      }
    };

    // Check more frequently for precise verse changes
    const checkInterval = setInterval(updateProgress, 100);
    video.addEventListener('timeupdate', updateProgress);

    return () => {
      video.removeEventListener('timeupdate', updateProgress);
      clearInterval(checkInterval);
    };
  }, [onTimeUpdate, timestamps, currentVerseId, onVerseEnd]);

  useEffect(() => {
    const handleMouseMove = () => {
      setLastMouseMoveTime(Date.now());
      setShowControls(true);
    };

    const handleMouseLeave = () => {
      if (isPlaying) {
        setShowControls(false);
      }
    };

    const checkMouseInactivity = () => {
      const currentTime = Date.now();
      if (currentTime - lastMouseMoveTime > 3000 && isFullscreen) {
        setShowControls(false);
      }
    };

    if (playerRef.current) {
      playerRef.current.addEventListener('mousemove', handleMouseMove);
      playerRef.current.addEventListener('mouseleave', handleMouseLeave);
    }

    const inactivityInterval = setInterval(checkMouseInactivity, 1000);

    return () => {
      if (playerRef.current) {
        playerRef.current.removeEventListener('mousemove', handleMouseMove);
        playerRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
      clearInterval(inactivityInterval);
    };
  }, [isFullscreen, lastMouseMoveTime]);

  useEffect(() => {
    if (!isFullscreen) {
      setShowControls(true);
    }
  }, [isFullscreen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current[isPlaying ? 'pause' : 'play']();
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleProgressChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const newTime = (Number(e.target.value) / 100) * videoRef.current.duration;
    videoRef.current.currentTime = newTime;
    setProgress(Number(e.target.value));
  }, []);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.volume = currentVolume;
      setVolume(currentVolume);
    } else {
      setCurrentVolume(volume);
      videoRef.current.volume = 0;
      setVolume(0);
    }
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted, volume, currentVolume]);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const newVolume = Number(e.target.value);
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setCurrentVolume(newVolume);
    setIsMuted(newVolume === 0);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!playerRef.current) return;
    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    // Reset video and wait for source to load before playing
    const handleLoadedData = () => {
      if (isPlaying) {
        video.play().catch(console.error);
      }
    };

    video.addEventListener('loadeddata', handleLoadedData);
    
    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [videoSrc, isPlaying]);

  return (
    <div
      ref={playerRef}
      className="flex flex-col justify-center items-center max-w-full relative mb-16"
    >
      <div className="relative w-full">
        <video ref={videoRef} className="w-full cursor-pointer" src={videoSrc} onClick={togglePlay}>
          Your browser does not support the video tag.
        </video>
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center" onClick={togglePlay}>
            <Play size={64} className="text-white opacity-50" />
          </div>
        )}
      </div>
      <div
        className={`
          text-white
         bg-black bg-opacity-50
          p-2 w-full absolute
          bottom-0
          left-0
          transition-opacity duration-300 ease-in-out
          ${showControls ? 'opacity-100' : 'opacity-0'}
        `}
      >
        <div className="flex items-center justify-between">
          <button
            onClick={togglePlay}
            className="p-1 bg-transparent border-none cursor-pointer flex items-center justify-center mr-0 text-inherit"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleProgressChange}
            className={`w-full mx-2 cursor-pointer`}
          />
          <div className="flex items-center">
            <button onClick={toggleMute} className="p-1">
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-16 mx-2"
            />
            <button onClick={toggleFullscreen} className="p-1">
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
