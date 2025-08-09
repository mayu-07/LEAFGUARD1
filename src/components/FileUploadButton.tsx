import React, { useRef, useState, useCallback } from 'react';
import { Upload, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/sonner';

interface FileUploadButtonProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number; // in MB
  multiple?: boolean;
  className?: string;
  disabled?: boolean;
}

export const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  onFileSelect,
  accept = "image/*",
  maxSize = 5,
  multiple = false,
  className,
  disabled = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // File validation
  const validateFile = useCallback((file: File): string | null => {
    // Check file type
    if (accept === "image/*" && !file.type.startsWith('image/')) {
      return 'केवल इमेज फाइलें अपलोड करें (JPG, PNG, GIF)';
    }

    // Check file size
    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `फाइल साइज़ ${maxSize}MB से कम होना चाहिए`;
    }

    return null;
  }, [accept, maxSize]);

  // Handle file selection
  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const validationError = validateFile(file);

    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    setError(null);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Process file
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUploadProgress(100);
      onFileSelect(file);
      
      toast.success('फाइल सफलतापूर्वक अपलोड हुई');
      
      // Reset after success
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);

    } catch (err) {
      setError('फाइल अपलोड में त्रुटि हुई');
      toast.error('फाइल अपलोड में त्रुटि हुई');
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [validateFile, onFileSelect]);

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  }, [handleFileSelect]);

  // Handle button click
  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Handle keyboard events
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleButtonClick();
    }
  }, [handleButtonClick]);

  return (
    <div className={className}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
        aria-label="फाइल चुनें"
      />

      {/* Upload area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300
          ${dragActive 
            ? 'border-primary bg-primary/5 scale-105' 
            : 'border-border hover:border-primary hover:bg-muted/50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={!disabled ? handleButtonClick : undefined}
        onKeyDown={!disabled ? handleKeyDown : undefined}
        tabIndex={disabled ? -1 : 0}
        role="button"
        aria-label="फाइल अपलोड करने के लिए क्लिक करें या ड्रैग करें"
        aria-disabled={disabled}
      >
        {isUploading ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">अपलोड हो रहा है...</p>
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-xs text-muted-foreground">{uploadProgress}%</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <Upload className={`h-8 w-8 ${dragActive ? 'text-primary' : 'text-muted-foreground'}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-1">
                यहाँ क्लिक करें या फोटो ड्रैग करें
              </p>
              <p className="text-xs text-muted-foreground">
                JPG, PNG, GIF - अधिकतम {maxSize}MB
              </p>
            </div>
          </div>
        )}

        {/* Success indicator */}
        {uploadProgress === 100 && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
            <div className="flex items-center gap-2 text-success">
              <CheckCircle2 className="h-6 w-6" />
              <span className="text-sm font-medium">अपलोड सफल!</span>
            </div>
          </div>
        )}
      </div>

      {/* Upload button */}
      <div className="mt-4 flex gap-2">
        <EnhancedButton
          variant="hero"
          onClick={handleButtonClick}
          disabled={disabled || isUploading}
          loading={isUploading}
          loadingText="अपलोड हो रहा है..."
          trackingAction="file_upload_button_click"
          className="flex-1"
          aria-label="फाइल चुनने के लिए ब्राउज़ करें"
        >
          <Upload className="h-4 w-4" />
          फाइल चुनें
        </EnhancedButton>

        {error && (
          <EnhancedButton
            variant="ghost"
            size="icon"
            onClick={() => setError(null)}
            aria-label="त्रुटि संदेश बंद करें"
          >
            <X className="h-4 w-4" />
          </EnhancedButton>
        )}
      </div>

      {/* Error display */}
      {error && (
        <Alert className="mt-4" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};