"use client";

import { useRef } from "react";
import { Camera, ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PhotoUpload({
  preview,
  onChange,
}: {
  preview: string | null;
  onChange: (dataUrl: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file?: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  }

  if (preview) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={preview}
          alt="Uploaded animal preview"
          className="h-64 w-full object-cover"
        />
        <button
          type="button"
          onClick={() => onChange(null)}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-10 text-center transition-colors hover:border-brand-300 hover:bg-brand-50/40"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-brand-600">
        <ImagePlus size={26} />
      </div>
      <div>
        <p className="font-medium text-ink-900">Upload a photo of the animal</p>
        <p className="text-sm text-gray-500">PNG or JPG, up to 10MB</p>
      </div>
      <Button type="button" variant="outline" size="sm" className="mt-1">
        <Camera size={14} /> Choose Photo
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
