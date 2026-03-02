import React, { useEffect, useRef, useState } from "react";
import { LuX, LuDownload, LuExternalLink, LuZoomIn, LuZoomOut } from "react-icons/lu";
import { FaFilePdf, FaFileImage } from "react-icons/fa";
import toast from "react-hot-toast";

const FilePreviewModal = ({ file, onClose }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [pdfError, setPdfError] = useState(false);
  const [scale, setScale] = useState(1);
  const [isDownloading, setIsDownloading] = useState(false);

  const touchStartY = useRef(null);
  const touchStartX = useRef(null);
  const overlayRef = useRef(null);

  // Lock body scroll
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = original; };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Reset state when file changes
  useEffect(() => {
    setScale(1);
    setImgLoaded(false);
    setImgError(false);
    setPdfError(false);
  }, [file]);

  // Swipe-down or swipe-right to close
  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartY.current === null) return;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (deltaY > 80 || deltaX > 80) onClose();
    touchStartY.current = null;
    touchStartX.current = null;
  };

  // Tap backdrop to close
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(file.fileUrl);
      if (!response.ok) throw new Error("Network error");
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      toast.success("Download started");
    } catch {
      toast.error("Failed to download file");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleOpenNewTab = () =>
    window.open(file.fileUrl, "_blank", "noopener,noreferrer");

  const isImage = file.fileType === "image";
  const isPdf = file.fileType === "pdf";

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex flex-col bg-black/90"
      onClick={handleOverlayClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── Top Bar ── */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-3 py-2 bg-black/60 backdrop-blur-sm"
        style={{ paddingTop: "max(env(safe-area-inset-top), 8px)" }}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1 mr-3">
          {isPdf
            ? <FaFilePdf className="flex-shrink-0 text-red-400 text-lg" />
            : <FaFileImage className="flex-shrink-0 text-purple-400 text-lg" />
          }
          <span
            className="text-white text-sm font-medium truncate"
            title={file.name}
          >
            {file.name}
          </span>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {isImage && imgLoaded && (
            <>
              <button
                onClick={() => setScale((s) => Math.max(0.5, +(s - 0.25).toFixed(2)))}
                className="p-2 rounded-full text-white hover:bg-white/20 active:bg-white/30 cursor-pointer"
                title="Zoom out"
              >
                <LuZoomOut className="text-lg" />
              </button>
              <button
                onClick={() => setScale((s) => Math.min(4, +(s + 0.25).toFixed(2)))}
                className="p-2 rounded-full text-white hover:bg-white/20 active:bg-white/30 cursor-pointer"
                title="Zoom in"
              >
                <LuZoomIn className="text-lg" />
              </button>
            </>
          )}
          <button
            onClick={handleOpenNewTab}
            className="p-2 rounded-full text-white hover:bg-white/20 active:bg-white/30 cursor-pointer"
            title="Open in new tab"
          >
            <LuExternalLink className="text-lg" />
          </button>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="p-2 rounded-full text-white hover:bg-white/20 active:bg-white/30 disabled:opacity-50 cursor-pointer"
            title="Download"
          >
            <LuDownload className="text-lg" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-white hover:bg-white/20 active:bg-white/30 cursor-pointer"
            title="Close"
          >
            <LuX className="text-xl" />
          </button>
        </div>
      </div>

      {/* Swipe hint pill */}
      <div className="flex-shrink-0 flex justify-center pb-1">
        <div className="w-10 h-1 rounded-full bg-white/30" />
      </div>

      {/* ── Preview Area ── */}
      <div className="flex-1 overflow-auto flex items-center justify-center min-h-0">

        {/* IMAGE */}
        {isImage && (
          <div className="relative flex items-center justify-center w-full h-full p-2">
            {!imgLoaded && !imgError && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}
            {imgError && (
              <div className="flex flex-col items-center gap-3 text-white/70">
                <FaFileImage className="text-5xl" />
                <p className="text-sm">Failed to load image</p>
                <button
                  onClick={handleOpenNewTab}
                  className="flex items-center gap-1.5 text-sm text-white bg-white/20 px-4 py-2 rounded-lg cursor-pointer"
                >
                  <LuExternalLink /> Open in browser
                </button>
              </div>
            )}
            {!imgError && (
              <img
                src={file.fileUrl}
                alt={file.name}
                onLoad={() => setImgLoaded(true)}
                onError={() => { setImgError(true); setImgLoaded(false); }}
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: "center center",
                  transition: "transform 0.2s ease",
                  // KEY FIX: both axes constrained so landscape images fit without cropping
                  maxWidth: "100%",
                  maxHeight: "100%",
                  width: "auto",
                  height: "auto",
                  objectFit: "contain",
                  display: imgLoaded ? "block" : "none",
                  touchAction: scale > 1 ? "auto" : "pan-y",
                }}
              />
            )}
          </div>
        )}

        {/* PDF */}
        {isPdf && (
          <div className="w-full h-full flex flex-col">
            {!pdfError ? (
              <iframe
                src={file.fileUrl}
                title={file.name}
                className="w-full flex-1 bg-white"
                onError={() => setPdfError(true)}
              />
            ) : (
              // Fallback for iOS Safari and unsupported browsers
              <div className="flex-1 flex flex-col items-center justify-center gap-5 px-6 text-white/80">
                <FaFilePdf className="text-6xl text-red-400" />
                <p className="text-base font-medium text-center">
                  PDF preview isn't supported in this browser
                </p>
                <p className="text-sm text-white/50 text-center">
                  Use one of the options below to view this file
                </p>
                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                  <button
                    onClick={handleOpenNewTab}
                    className="flex-1 flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white text-sm font-medium px-4 py-3 rounded-xl cursor-pointer"
                  >
                    <LuExternalLink /> Open in browser
                  </button>
                  <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary/80 text-white text-sm font-medium px-4 py-3 rounded-xl disabled:opacity-50 cursor-pointer"
                  >
                    <LuDownload /> {isDownloading ? "Downloading…" : "Download"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom safe-area spacer for notched devices */}
      <div
        className="flex-shrink-0 bg-black/60"
        style={{ height: "env(safe-area-inset-bottom, 0px)" }}
      />
    </div>
  );
};

export default FilePreviewModal;