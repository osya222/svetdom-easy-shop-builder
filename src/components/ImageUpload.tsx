import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onImageUpload: (url: string) => void;
  currentImage?: string;
  className?: string;
}

const ImageUpload = ({ onImageUpload, currentImage, className }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);
      setUploadProgress(0);

      // Создаем canvas для обрезки изображения до квадрата
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
      });

      // Устанавливаем размер canvas 400x400 (квадрат)
      const size = 400;
      canvas.width = size;
      canvas.height = size;

      // Вычисляем размеры для обрезки по центру
      const minDimension = Math.min(img.width, img.height);
      const startX = (img.width - minDimension) / 2;
      const startY = (img.height - minDimension) / 2;

      // Рисуем обрезанное изображение
      ctx?.drawImage(
        img,
        startX, startY, minDimension, minDimension,
        0, 0, size, size
      );

      // Преобразуем canvas в blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), 'image/webp', 0.8);
      });

      const fileName = `product-${Date.now()}.webp`;

      setUploadProgress(50);

      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, blob);

      if (error) throw error;

      setUploadProgress(100);

      // Получаем публичный URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(data.path);

      onImageUpload(publicUrl);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      alert('Ошибка загрузки изображения');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение');
      return;
    }

    uploadImage(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeImage = () => {
    onImageUpload('');
  };

  return (
    <div className={cn("space-y-4", className)}>
      {currentImage ? (
        <div className="relative">
          <img
            src={currentImage}
            alt="Текущее изображение"
            className="w-full h-48 object-cover rounded-lg border"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={removeImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
            dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25",
            "hover:border-primary hover:bg-primary/5"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium mb-2">Перетащите изображение сюда</p>
          <p className="text-muted-foreground mb-4">или</p>
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            Выбрать файл
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            JPG, PNG, WEBP до 10MB
          </p>
          <p className="text-xs text-muted-foreground">
            Изображение будет автоматически обрезано до квадрата
          </p>
        </div>
      )}

      {uploading && (
        <div className="space-y-2">
          <Progress value={uploadProgress} className="w-full" />
          <p className="text-sm text-muted-foreground text-center">
            Загрузка изображения...
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={(e) => handleFileSelect(e.target.files)}
      />
    </div>
  );
};

export default ImageUpload;