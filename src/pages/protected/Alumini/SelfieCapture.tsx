import { useState, useRef, useCallback } from "react";
import { Camera, RotateCcw, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAlumniStore } from "@/global/useAlumniStore";

interface SelfieCaptureProps {
  onCapture: (selfieDataUrl: string) => void;
}

const SelfieCapture = ({ onCapture }: SelfieCaptureProps) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string>("");
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please ensure camera permissions are granted.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(dataUrl);
        setIsCapturing(false);
        stopCamera();
      }
    }
  }, [stopCamera]);

  const retakePhoto = () => {
    setCapturedImage("");
    setIsCapturing(true);
    startCamera();
  };

  const confirmPhoto = () => {
    if (capturedImage) {
      useAlumniStore.getState().setSelfie(capturedImage);
      onCapture(capturedImage);
    }
  };

  const handleStartCapture = () => {
    setIsCapturing(true);
    startCamera();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2 text-2xl">
            <Camera className="h-8 w-8 text-blue-600" />
            <span>Alumni Selfie Space</span>
          </CardTitle>
          <p className="text-gray-600">
            Take a selfie to personalize your alumni profile
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {!isCapturing && !capturedImage && (
            <div className="text-center space-y-4">
              <div className="w-64 h-64 mx-auto bg-gray-100 rounded-full flex items-center justify-center border-4 border-dashed border-gray-300">
                <Camera className="h-16 w-16 text-gray-400" />
              </div>
              <Button onClick={handleStartCapture} size="lg" className="w-full">
                <Camera className="h-5 w-5 mr-2" />
                Start Camera
              </Button>
            </div>
          )}

          {isCapturing && (
            <div className="space-y-4">
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full rounded-lg shadow-lg"
                />
                <div className="absolute inset-0 border-4 border-blue-500 rounded-lg pointer-events-none" />
              </div>

              <div className="flex justify-center space-x-4">
                <Button
                  onClick={capturePhoto}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Camera className="h-5 w-5 mr-2" />
                  Capture Photo
                </Button>
                <Button
                  onClick={() => {
                    setIsCapturing(false);
                    stopCamera();
                  }}
                  variant="outline"
                  size="lg"
                >
                  <X className="h-5 w-5 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {capturedImage && (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={capturedImage}
                  alt="Captured selfie"
                  className="w-full rounded-lg shadow-lg"
                />
              </div>

              <div className="flex justify-center space-x-4">
                <Button
                  onClick={confirmPhoto}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="h-5 w-5 mr-2" />
                  Confirm & Continue
                </Button>
                <Button
                  onClick={retakePhoto}
                  variant="outline"
                  size="lg"
                >
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Retake Photo
                </Button>
              </div>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </CardContent>
      </Card>
    </div>
  );
};

export default SelfieCapture;