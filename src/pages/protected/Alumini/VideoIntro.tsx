import { useState, useEffect, useRef } from "react";
import { Play, Volume2, VolumeX, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoIntroProps {
  onComplete: () => void;
}

const VideoIntro = ({ onComplete }: VideoIntroProps) => {
  const [currentVideo, setCurrentVideo] = useState<'university' | 'department'>('university');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [videoPaused, setVideoPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Sample video URLs - replace with your actual video files
  const videoSources = {
    university: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    department: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const currentTime = video.currentTime;
      const duration = video.duration;
      const progressPercent = (currentTime / duration) * 100;
      setProgress(progressPercent);
      setTimeRemaining(Math.ceil(duration - currentTime));
    };

    const handleEnded = () => {
      if (currentVideo === 'university') {
        setCurrentVideo('department');
        setProgress(0);
      } else {
        onComplete();
      }
    };

    const handleLoadedMetadata = () => {
      setTimeRemaining(Math.ceil(video.duration));
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [currentVideo, onComplete]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying && !videoPaused) {
      video.play().catch(console.error);
    } else {
      video.pause();
    }
  }, [isPlaying, videoPaused, currentVideo]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = isMuted;
    }
  }, [isMuted]);

  const startVideo = () => {
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    setVideoPaused(!videoPaused);
  };

  const skipVideo = () => {
    onComplete();
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  if (!isPlaying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-indigo-900">
        <div className="text-center text-white space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold mb-4">Welcome to Our University</h1>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto">
              Join our alumni community and stay connected with your alma mater. 
              Watch our introduction videos to get started.
            </p>
          </div>
          
          <Button 
            onClick={startVideo}
            size="lg"
            className="bg-white text-blue-900 hover:bg-blue-50 text-lg px-8 py-4 rounded-full"
          >
            <Play className="h-6 w-6 mr-2" />
            Start Video Presentation
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative">
      {/* Video Player */}
      <div className="w-full h-full flex items-center justify-center relative">
        <div className="w-full max-w-4xl aspect-video rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            src={videoSources[currentVideo]}
            className="w-full h-full object-cover"
            playsInline
            preload="metadata"
          />
        </div>

        {/* Video Controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 rounded-lg p-4 flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={togglePlayPause}
            className="text-white hover:bg-white hover:bg-opacity-20"
          >
            {videoPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMute}
            className="text-white hover:bg-white hover:bg-opacity-20"
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="w-48 bg-gray-600 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-white text-sm min-w-[3rem]">
              {timeRemaining}s
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={skipVideo}
            className="text-white hover:bg-white hover:bg-opacity-20"
          >
            Skip
          </Button>
        </div>
      </div>

      {/* Current Video Indicator */}
      <div className="absolute top-8 left-8 bg-black bg-opacity-70 rounded-lg p-3 text-white">
        <div className="text-sm">
          {currentVideo === 'university' ? 'Video 1 of 2' : 'Video 2 of 2'}
        </div>
        <div className="font-semibold">
          {currentVideo === 'university' ? 'University Introduction' : 'Department Infrastructure'}
        </div>
      </div>

      {/* Loading indicator when video is buffering */}
      {videoPaused && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-white text-lg">Video Paused</div>
        </div>
      )}
    </div>
  );
};

export default VideoIntro;