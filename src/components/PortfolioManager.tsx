"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { 
  UploadCloud, Trash2, RefreshCw, AlertCircle, CheckCircle2, 
  X, Image as ImageIcon, Calendar, Layers, ExternalLink, AlertTriangle
} from "lucide-react";
import { CloudinaryImage } from "./GalleryModal";

export default function PortfolioManager() {
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Upload states
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: "pending" | "uploading" | "done" | "error" }>({});
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Deletion state
  const [imageToDelete, setImageToDelete] = useState<CloudinaryImage | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch images from Cloudinary API
  const fetchImages = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/gallery", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch gallery images.");
      const data = await res.json();
      setImages(data.images || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load portfolio images from Cloudinary. Verify your credentials.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchImages();
  }, [fetchImages]);

  // Flash toast message
  const triggerSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 4000);
  };

  // Thumbnail optimizer helper
  const getOptimizedThumb = (url: string) => {
    return url.replace("/upload/", "/upload/c_fill,w_600,f_auto,q_auto/");
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesSelected(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFilesSelected(Array.from(e.target.files));
    }
  };

  const handleFilesSelected = (files: File[]) => {
    const validImages: File[] = [];
    let invalidFound = false;

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        invalidFound = true;
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError(`File "${file.name}" exceeds 10MB limit.`);
        return;
      }
      validImages.push(file);
    }

    if (invalidFound) {
      setError("Only image files (JPG, PNG, WebP, AVIF, GIF, SVG) are accepted.");
    } else {
      setError(null);
    }

    setSelectedFiles(prev => [...prev, ...validImages]);
  };

  const removeFileFromQueue = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Upload execution
  const handleUploadAll = async () => {
    if (selectedFiles.length === 0) return;
    setIsUploading(true);
    setError(null);

    const initialProgress: { [key: string]: "uploading" } = {};
    selectedFiles.forEach((f) => {
      initialProgress[f.name] = "uploading";
    });
    setUploadProgress(initialProgress);

    try {
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append("files", file);
      });

      const res = await fetch("/api/gallery", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed.");
      }

      triggerSuccess(`Successfully uploaded ${data.uploaded?.length || selectedFiles.length} image(s) to portfolio.`);
      setSelectedFiles([]);
      setUploadProgress({});
      await fetchImages();
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : "An error occurred during upload.";
      setError(message);
    } finally {
      setIsUploading(false);
    }
  };

  // Deletion execution
  const handleDeleteConfirm = async () => {
    if (!imageToDelete) return;
    setIsDeleting(true);
    setError(null);

    try {
      const res = await fetch("/api/gallery", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_id: imageToDelete.public_id }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Delete failed.");
      }

      triggerSuccess("Portfolio image deleted successfully.");
      setImageToDelete(null);
      await fetchImages();
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Failed to delete image.";
      setError(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Header Info & Refresh */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/5 p-6 rounded-2xl border border-white/10">
        <div>
          <h2 className="font-outfit text-xl font-bold text-white flex items-center gap-2">
            <ImageIcon className="text-solar" size={22} />
            Cloudinary Portfolio Gallery
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Images in the <span className="text-amber font-mono font-bold">folder:MjSolar</span> namespace displayed in the live project gallery.
          </p>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center">
          <span className="text-xs bg-white/10 text-slate-300 px-3 py-1.5 rounded-full font-medium border border-white/10">
            {images.length} Image{images.length === 1 ? "" : "s"}
          </span>
          <button
            onClick={fetchImages}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/10 disabled:opacity-50"
            title="Refresh Portfolio"
            aria-label="Refresh Portfolio"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin text-solar" : ""} />
          </button>
        </div>
      </div>

      {/* Notifications */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-xl flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-3">
              <AlertCircle size={20} className="shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-white" aria-label="Dismiss error">
              <X size={16} />
            </button>
          </motion.div>
        )}

        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-green-500/10 border border-green-500/30 text-green-300 p-4 rounded-xl flex items-center justify-between text-sm font-medium"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 size={20} className="shrink-0 text-green-400" />
              <span>{successMessage}</span>
            </div>
            <button onClick={() => setSuccessMessage(null)} className="text-green-400 hover:text-white" aria-label="Dismiss message">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Dropzone Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-outfit font-bold text-white flex items-center gap-2">
          <UploadCloud size={20} className="text-rose" />
          Upload New Portfolio Photos
        </h3>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-3 ${
            isDragging
              ? "border-solar bg-solar/10 scale-[1.01]"
              : "border-white/20 bg-white/[0.02] hover:border-white/40 hover:bg-white/[0.04]"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-solar shadow-inner group-hover:scale-110 transition-transform">
            <UploadCloud size={28} />
          </div>

          <div>
            <p className="text-white font-medium text-sm">
              Drag and drop high-resolution solar project images here, or <span className="text-amber underline">browse files</span>
            </p>
            <p className="text-slate-500 text-xs mt-1">
              Supports JPEG, PNG, WebP, AVIF up to 10MB per file.
            </p>
          </div>
        </div>

        {/* Selected Files Queue */}
        {selectedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-4"
          >
            <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-slate-400">
              <span>Ready for Upload ({selectedFiles.length})</span>
              <button
                onClick={() => setSelectedFiles([])}
                className="text-rose hover:text-white transition-colors"
                disabled={isUploading}
              >
                Clear Queue
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
              {selectedFiles.map((file, idx) => (
                <div
                  key={`${file.name}-${idx}`}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <ImageIcon size={16} className="text-amber shrink-0" />
                    <div className="truncate">
                      <p className="text-white truncate font-medium">{file.name}</p>
                      <p className="text-slate-500 text-[10px]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>

                  {!isUploading && (
                    <button
                      onClick={() => removeFileFromQueue(idx)}
                      className="text-slate-400 hover:text-rose p-1 transition-colors"
                      aria-label={`Remove ${file.name}`}
                    >
                      <X size={14} />
                    </button>
                  )}

                  {isUploading && (
                    <span className="text-[10px] text-amber animate-pulse">
                      {uploadProgress[file.name] === "uploading" ? "Uploading..." : "Queued"}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleUploadAll}
                disabled={isUploading}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-solar to-amber text-obsidian rounded-xl font-bold text-sm hover:scale-105 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(255,96,0,0.4)]"
              >
                {isUploading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Uploading to Cloudinary...
                  </>
                ) : (
                  <>
                    <UploadCloud size={16} />
                    Upload {selectedFiles.length} Image{selectedFiles.length === 1 ? "" : "s"}
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Existing Portfolio Grid Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-outfit font-bold text-white flex items-center gap-2">
          <Layers size={20} className="text-solar" />
          Active Portfolio Gallery ({images.length})
        </h3>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-white/5 rounded-2xl animate-pulse border border-white/10" />
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="p-12 text-center bg-white/[0.02] border border-white/10 rounded-2xl">
            <ImageIcon size={48} className="text-slate-600 mx-auto mb-3" />
            <h4 className="text-white font-outfit text-base font-bold">No images in Cloudinary</h4>
            <p className="text-slate-400 text-xs mt-1 max-w-sm mx-auto">
              Upload photos using the dropzone above to display them in the portfolio gallery on the homepage.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {images.map((image) => (
              <div
                key={image.id}
                className="group relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 flex flex-col hover:border-white/30 transition-all duration-300"
              >
                {/* Thumbnail */}
                <div className="relative aspect-square w-full overflow-hidden bg-black/40">
                  <Image
                    src={getOptimizedThumb(image.secure_url)}
                    alt={image.public_id}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Format & Dimension Badges */}
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="bg-obsidian/80 backdrop-blur-md text-[10px] font-bold text-amber px-2 py-0.5 rounded-full border border-amber/30 uppercase">
                      {image.format}
                    </span>
                    <span className="bg-obsidian/80 backdrop-blur-md text-[10px] text-slate-300 px-2 py-0.5 rounded-full border border-white/10">
                      {image.width} × {image.height}
                    </span>
                  </div>

                  {/* External preview link */}
                  <a
                    href={image.secure_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-obsidian/80 hover:bg-white text-slate-300 hover:text-obsidian transition-colors backdrop-blur-md"
                    title="Open Full Image"
                    aria-label="Open Full Image in new tab"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>

                {/* Metadata & Actions */}
                <div className="p-4 flex flex-col justify-between flex-1 gap-3 bg-obsidian/90">
                  <div className="space-y-1">
                    <p className="text-white text-xs font-mono truncate" title={image.public_id}>
                      {image.public_id.replace("MjSolar/", "")}
                    </p>
                    <p className="text-slate-500 text-[10px] flex items-center gap-1.5">
                      <Calendar size={12} />
                      {new Date(image.created_at).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  <button
                    onClick={() => setImageToDelete(image)}
                    className="w-full py-2 bg-rose/10 hover:bg-rose/20 text-rose border border-rose/30 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Trash2 size={14} /> Delete Image
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {imageToDelete && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-obsidian/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-obsidian border border-rose/30 rounded-3xl p-6 shadow-2xl space-y-6"
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-dialog-title"
            >
              <div className="flex items-center gap-3 text-rose">
                <div className="w-12 h-12 rounded-full bg-rose/10 border border-rose/20 flex items-center justify-center shrink-0">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h4 id="delete-dialog-title" className="font-outfit text-xl font-bold text-white">
                    Delete Portfolio Photo?
                  </h4>
                  <p className="text-slate-400 text-xs">This action is permanent and immediate.</p>
                </div>
              </div>

              {/* Preview */}
              <div className="relative h-40 w-full rounded-2xl overflow-hidden border border-white/10 bg-black/40">
                <Image
                  src={getOptimizedThumb(imageToDelete.secure_url)}
                  alt={imageToDelete.public_id}
                  fill
                  className="object-cover"
                />
              </div>

              <p className="text-slate-300 text-xs leading-relaxed">
                Are you sure you want to delete <span className="text-white font-mono">{imageToDelete.public_id}</span> from Cloudinary? It will be removed from the public website gallery.
              </p>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={() => setImageToDelete(null)}
                  disabled={isDeleting}
                  className="px-5 py-2.5 rounded-xl border border-white/20 text-white font-medium text-xs hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="px-5 py-2.5 rounded-xl bg-rose text-white font-bold text-xs hover:bg-rose/80 transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(224,83,117,0.4)]"
                >
                  {isDeleting ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={14} />
                      Confirm Delete
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
