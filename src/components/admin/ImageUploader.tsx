"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type ImageUploaderProps = {
  images: string[];
  onChange: (images: string[]) => void;
  max?: number;
};

function SortableImage({
  url,
  onDelete,
}: {
  url: string;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: url,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
      <Image src={url} alt="" fill className="object-cover" sizes="120px" unoptimized />
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="absolute left-1 top-1 rounded bg-black/50 px-1.5 py-0.5 text-xs text-white cursor-grab"
        aria-label="Kéo để sắp xếp"
      >
        ⋮⋮
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="absolute right-1 top-1 rounded bg-red-600 px-1.5 py-0.5 text-xs text-white opacity-0 group-hover:opacity-100"
        aria-label="Xóa ảnh"
      >
        ×
      </button>
    </div>
  );
}

export default function ImageUploader({ images, onChange, max = 20 }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const remaining = max - images.length;

  const uploadFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const files = Array.from(fileList);
      if (files.length === 0) return;

      const oversized = files.filter((f) => f.size > 5 * 1024 * 1024);
      if (oversized.length > 0) {
        setError(`File "${oversized[0].name}" vượt quá 5MB`);
        return;
      }

      const allowed = files.slice(0, remaining);
      if (allowed.length === 0) {
        setError(`Tối đa ${max} ảnh`);
        return;
      }

      setError(null);
      setUploading(true);

      try {
        const formData = new FormData();
        allowed.forEach((file) => formData.append("files", file));

        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Upload thất bại");
          return;
        }

        onChange([...images, ...(data.urls as string[])].slice(0, max));
      } catch {
        setError("Upload thất bại");
      } finally {
        setUploading(false);
      }
    },
    [images, max, onChange, remaining]
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = images.indexOf(String(active.id));
    const newIndex = images.indexOf(String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;
    onChange(arrayMove(images, oldIndex, newIndex));
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (uploading || remaining <= 0) return;
    uploadFiles(e.dataTransfer.files);
  }

  return (
    <div className="space-y-3">
      {remaining > 0 && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`relative rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors ${
            dragOver ? "border-brand bg-brand/5" : "border-gray-300 bg-gray-50"
          } ${uploading ? "pointer-events-none opacity-60" : ""}`}
        >
          <p className="text-sm text-gray-600">
            {uploading ? "Đang tải lên..." : "Kéo thả ảnh hoặc chọn file"}
          </p>
          <p className="mt-1 text-xs text-gray-400">Tối đa 5MB/ảnh · còn {remaining} slot</p>
          <label className="mt-3 inline-block cursor-pointer rounded-lg bg-brand px-4 py-2 text-sm text-white hover:bg-brand-dark">
            Chọn ảnh
            <input
              type="file"
              accept="image/*"
              multiple={max > 1}
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                if (e.target.files) uploadFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </label>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {images.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={images} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
              {images.map((url) => (
                <SortableImage
                  key={url}
                  url={url}
                  onDelete={() => onChange(images.filter((u) => u !== url))}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
