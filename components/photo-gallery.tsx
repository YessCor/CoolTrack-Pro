'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { OrderPhoto } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface PhotoGalleryProps {
  photos: OrderPhoto[];
  onUpload?: (files: FileList) => void;
  canUpload?: boolean;
}

export function PhotoGallery({ photos, onUpload, canUpload = false }: PhotoGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<OrderPhoto | null>(null);

  const groupedPhotos = {
    before: photos.filter((p) => p.phase === 'before'),
    during: photos.filter((p) => p.phase === 'during'),
    after: photos.filter((p) => p.phase === 'after'),
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && onUpload) {
      onUpload(e.target.files);
    }
  };

  if (!photos || photos.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
        <p className="text-muted-foreground mb-4">Sin fotos registradas</p>
        {canUpload && (
          <label className="inline-block">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button as="span" variant="outline">
              Subir Fotos
            </Button>
          </label>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {canUpload && (
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
          <label className="cursor-pointer">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button className="bg-primary hover:bg-primary/90">
              + Subir Más Fotos
            </Button>
          </label>
        </div>
      )}

      {Object.entries(groupedPhotos).map(([phase, phasePhotos]) => {
        if (phasePhotos.length === 0) return null;

        const phaseLabel = {
          before: 'Antes',
          during: 'Durante',
          after: 'Después',
        }[phase as keyof typeof groupedPhotos];

        return (
          <div key={phase}>
            <h3 className="font-semibold text-foreground mb-3">{phaseLabel}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {phasePhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="relative aspect-square rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedImage(photo)}
                >
                  <Image
                    src={photo.url}
                    alt={photo.caption || 'Foto de orden'}
                    fill
                    className="object-cover"
                  />
                  {photo.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                      <p className="text-xs text-white">{photo.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full max-w-2xl aspect-video">
            <Image
              src={selectedImage.url}
              alt={selectedImage.caption || 'Foto de orden'}
              fill
              className="object-contain"
            />
            {selectedImage.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-white">{selectedImage.caption}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
