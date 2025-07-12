import { useState, useEffect } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoIntroProps {
  onComplete: () => void;
}

const VideoIntro = ({ onComplete }: VideoIntroProps) => {
  const [currentVideo, setCurrentVideo] = useState<'university' | 'department'>('university');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(5);

  useEffect(() => {
    if (isPlaying) {
      const duration = currentVideo === 'university' ? 5 : 30;
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + (100 / duration);
          setTimeRemaining(Math.ceil(duration - (newProgress / 100) * duration));
          
          if (newProgress >= 100) {
            if (currentVideo === 'university') {
              setCurrentVideo('department');
              setProgress(0);
              setTimeRemaining(30);
              return 0;
            } else {
              onComplete();
              return 100;
            }
          }
          return newProgress;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPlaying, currentVideo, onComplete]);

  const startVideo = () => {
    setIsPlaying(true);
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
      {/* Video Placeholder */}
      <div className="w-full h-full flex items-center justify-center relative">
        <div className="w-full max-w-4xl aspect-video bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center text-white">
          <div className="text-center space-y-4">
            <div className="text-4xl font-bold">
              {currentVideo === 'university' ? '🏛️ University Introduction' : '🏢 Department Infrastructure'}
            </div>
            <div className="text-xl">
              {currentVideo === 'university' 
                ? 'Showcasing our prestigious university heritage and values'
                : 'Exploring our state-of-the-art department facilities and labs'
              }
            </div>
            <div className="text-lg text-blue-200">
              {currentVideo === 'university' ? '5 seconds video' : '30 seconds video'}
            </div>
          </div>
        </div>

        {/* Video Controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 rounded-lg p-4 flex items-center space-x-4">
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
                className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
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
    </div>
  );
};

export default VideoIntro;