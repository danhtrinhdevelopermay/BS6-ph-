import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Download, ZoomIn, ZoomOut, RotateCcw, Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaUrl: string;
  mediaType: "image" | "video";
  thumbnailUrl?: string;
}

export function MediaModal({ isOpen, onClose, mediaUrl, mediaType, thumbnailUrl }: MediaModalProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setZoom(1);
      setRotation(0);
      setIsPlaying(false);
    }
  }, [isOpen]);

  const handleDownload = async () => {
    try {
      const response = await fetch(mediaUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `media-${Date.now()}.${mediaType === 'image' ? 'jpg' : 'mp4'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const togglePlayPause = () => {
    if (videoRef) {
      if (isPlaying) {
        videoRef.pause();
      } else {
        videoRef.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef) {
      videoRef.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef) {
      if (videoRef.requestFullscreen) {
        videoRef.requestFullscreen();
      } else if ((videoRef as any).webkitRequestFullscreen) {
        (videoRef as any).webkitRequestFullscreen();
      }
    }
  };

  const zoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const zoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const resetZoom = () => setZoom(1);
  const rotate = () => setRotation(prev => (prev + 90) % 360);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-none w-full h-full p-0 bg-black/95 border-none">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 z-50 text-white hover:bg-white/20 rounded-full"
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Media Controls Toolbar */}
          <div className="absolute top-4 left-4 z-50 flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDownload}
              className="text-white hover:bg-white/20 rounded-full"
            >
              <Download className="h-5 w-5" />
            </Button>
            
            {mediaType === "image" && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={zoomIn}
                  className="text-white hover:bg-white/20 rounded-full"
                >
                  <ZoomIn className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={zoomOut}
                  className="text-white hover:bg-white/20 rounded-full"
                >
                  <ZoomOut className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={rotate}
                  className="text-white hover:bg-white/20 rounded-full"
                >
                  <RotateCcw className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={resetZoom}
                  className="text-white hover:bg-white/20 rounded-full text-xs px-3"
                >
                  {Math.round(zoom * 100)}%
                </Button>
              </>
            )}
          </div>

          {/* Media Content */}
          <div className="w-full h-full flex items-center justify-center p-8">
            {mediaType === "image" ? (
              <img
                src={mediaUrl}
                alt="Media"
                className="max-w-full max-h-full object-contain cursor-grab active:cursor-grabbing transition-transform duration-200"
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                }}
                draggable={false}
              />
            ) : (
              <div className="relative w-full h-full flex items-center justify-center">
                <video
                  ref={setVideoRef}
                  src={mediaUrl}
                  poster={thumbnailUrl}
                  className="max-w-full max-h-full object-contain rounded-lg"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onVolumeChange={(e) => {
                    const video = e.target as HTMLVideoElement;
                    setIsMuted(video.muted);
                  }}
                  controls={false}
                  autoPlay
                />
                
                {/* Custom Video Controls */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm rounded-full px-6 py-3 flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={togglePlayPause}
                    className="text-white hover:bg-white/20 rounded-full"
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    className="text-white hover:bg-white/20 rounded-full"
                  >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleFullscreen}
                    className="text-white hover:bg-white/20 rounded-full"
                  >
                    <Maximize className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Background Click to Close */}
          <div 
            className="absolute inset-0 -z-10"
            onClick={onClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}