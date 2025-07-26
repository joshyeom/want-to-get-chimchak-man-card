import { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface ImageUploaderProps {
  onImageUpload: (image: string) => void;
  currentImage: string | null;
}

export const ImageUploader = ({ onImageUpload, currentImage }: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error("이미지 파일만 업로드 가능합니다.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB
      toast.error("파일 크기는 10MB 이하여야 합니다.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onImageUpload(e.target.result as string);
        toast.success("이미지가 성공적으로 업로드되었습니다!");
      }
    };
    reader.readAsDataURL(file);
  }, [onImageUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const clearImage = useCallback(() => {
    onImageUpload("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast.success("이미지가 제거되었습니다.");
  }, [onImageUpload]);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-primary" />
          이미지 업로드
        </h3>

        {currentImage ? (
          <div className="relative group">
            <div className="relative overflow-hidden rounded-lg border border-border">
              <img 
                src={currentImage} 
                alt="Uploaded image" 
                className="w-full h-64 object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={clearImage}
                  className="opacity-90 hover:opacity-100"
                >
                  <X className="w-4 h-4 mr-2" />
                  제거
                </Button>
              </div>
            </div>
            
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              다른 이미지 선택
            </Button>
          </div>
        ) : (
          <div
            className={`upload-zone rounded-lg p-8 text-center cursor-pointer transition-all ${
              isDragging ? 'drag-over' : ''
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-12 h-12 text-primary mx-auto mb-4 animate-bounce" />
            <h4 className="text-lg font-medium mb-2">
              이미지를 여기에 드래그하거나 클릭하여 선택
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              PNG, JPG, JPEG, WebP 지원 (최대 10MB)
            </p>
            <p className="text-xs text-muted-foreground">
              권장 해상도: 660x921px
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
};