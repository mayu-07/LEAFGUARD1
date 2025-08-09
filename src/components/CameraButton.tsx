import React, { useState, useRef, useCallback } from 'react';
import { Camera, CameraOff, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';

interface CameraButtonProps {
  onCapture: (imageData: string) => void;
  className?: string;
  disabled?: boolean;
}

export const CameraButton: React.FC<CameraButtonProps> = ({
  onCapture,
  className,
  disabled = false
}) => {
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Check camera permission
  const checkCameraPermission = useCallback(async () => {
    try {
      const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
      setHasPermission(permission.state === 'granted');
      
      permission.addEventListener('change', () => {
        setHasPermission(permission.state === 'granted');
      });
    } catch (err) {
      console.warn('Permission API not supported');
    }
  }, []);

  // Initialize camera
  const initializeCamera = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment' // Use back camera on mobile
        }
      });

      setStream(mediaStream);
      setHasPermission(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
      
      setIsActive(true);
      toast.success('कैमरा सफलतापूर्वक चालू हुआ');
      
    } catch (err: any) {
      let errorMessage = 'कैमरा एक्सेस में त्रुटि';
      
      if (err.name === 'NotAllowedError') {
        errorMessage = 'कैमरा की अनुमति दें';
        setHasPermission(false);
      } else if (err.name === 'NotFoundError') {
        errorMessage = 'कैमरा नहीं मिला';
      } else if (err.name === 'NotReadableError') {
        errorMessage = 'कैमरा उपयोग में है';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsActive(false);
    toast.info('कैमरा बंद किया गया');
  }, [stream]);

  // Capture photo
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    
    onCapture(imageData);
    stopCamera();
    
    toast.success('फोटो कैप्चर की गई');
  }, [onCapture, stopCamera]);

  // Handle keyboard events
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (isActive) {
        capturePhoto();
      } else {
        initializeCamera();
      }
    } else if (e.key === 'Escape' && isActive) {
      stopCamera();
    }
  }, [isActive, capturePhoto, initializeCamera, stopCamera]);

  // Initialize permission check on mount
  React.useEffect(() => {
    checkCameraPermission();
  }, [checkCameraPermission]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className={className}>
      {/* Camera preview */}
      {isActive && (
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="relative">
              <video
                ref={videoRef}
                className="w-full h-64 object-cover rounded-lg bg-black"
                playsInline
                muted
                aria-label="कैमरा प्रीव्यू"
              />
              
              {/* Capture overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-white/50 rounded-lg"></div>
              </div>
              
              {/* Instructions */}
              <div className="absolute bottom-2 left-2 right-2 bg-black/50 text-white text-sm p-2 rounded">
                पौधे को फ्रेम के अंदर रखें और फोटो लें
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Control buttons */}
      <div className="flex gap-2">
        {!isActive ? (
          <EnhancedButton
            variant="hero"
            onClick={initializeCamera}
            disabled={disabled || isLoading}
            loading={isLoading}
            loadingText="कैमरा चालू हो रहा है..."
            trackingAction="camera_start"
            className="flex-1"
            onKeyDown={handleKeyDown}
            aria-label="कैमरा चालू करें"
          >
            <Camera className="h-4 w-4" />
            कैमरा चालू करें
          </EnhancedButton>
        ) : (
          <>
            <EnhancedButton
              variant="success"
              onClick={capturePhoto}
              trackingAction="photo_capture"
              className="flex-1"
              onKeyDown={handleKeyDown}
              aria-label="फोटो लें"
            >
              <Camera className="h-4 w-4" />
              फोटो लें
            </EnhancedButton>
            
            <EnhancedButton
              variant="outline"
              onClick={stopCamera}
              trackingAction="camera_stop"
              aria-label="कैमरा बंद करें"
            >
              <CameraOff className="h-4 w-4" />
            </EnhancedButton>
          </>
        )}
      </div>

      {/* Error display */}
      {error && (
        <Alert className="mt-4" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            {hasPermission === false && (
              <div className="mt-2">
                <EnhancedButton
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                  trackingAction="camera_permission_retry"
                >
                  दोबारा कोशिश करें
                </EnhancedButton>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Permission status */}
      {hasPermission === true && !isActive && !error && (
        <Alert className="mt-4">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            कैमरा की अनुमति मिली है। फोटो लेने के लिए तैयार।
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};