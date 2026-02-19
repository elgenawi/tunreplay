"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Link as LinkIcon, X } from "lucide-react";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}

export default function ImageUploader({ value, onChange, folder }: ImageUploaderProps) {
  const [mode, setMode] = useState<"idle" | "file" | "url">("idle");
  const [remoteUrl, setRemoteUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const uploadUrl = folder ? `/api/admin/upload?folder=${folder}` : "/api/admin/upload";

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(uploadUrl, { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onChange(data.url);
      setMode("idle");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoteImport = async () => {
    if (!remoteUrl.trim()) return;
    setUploading(true);
    setError(null);
    try {
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: remoteUrl.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Import failed");
      onChange(data.url);
      setRemoteUrl("");
      setMode("idle");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    onChange("");
    setMode("idle");
    setError(null);
  };

  return (
    <div className="space-y-2">
      {value && (
        <div className="flex items-center gap-3">
          <img
            src={value}
            alt="Preview"
            className="w-16 h-20 object-cover rounded border border-border"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground truncate">{value}</p>
          </div>
          <Button type="button" variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={handleClear}>
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}

      {mode === "idle" && (
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => setMode("file")}>
            <Upload className="h-3.5 w-3.5 mr-1" /> Upload File
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => setMode("url")}>
            <LinkIcon className="h-3.5 w-3.5 mr-1" /> From URL
          </Button>
        </div>
      )}

      {mode === "file" && (
        <div className="flex gap-2 items-center">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="text-xs file:mr-2 file:px-3 file:py-1.5 file:rounded file:border-0 file:bg-muted file:text-xs file:text-foreground file:cursor-pointer"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFileUpload(f);
            }}
            disabled={uploading}
          />
          <Button type="button" variant="ghost" size="sm" onClick={() => setMode("idle")} disabled={uploading}>
            Cancel
          </Button>
        </div>
      )}

      {mode === "url" && (
        <div className="flex gap-2">
          <Input
            placeholder="https://example.com/image.jpg"
            value={remoteUrl}
            onChange={(e) => setRemoteUrl(e.target.value)}
            className="flex-1"
            disabled={uploading}
          />
          <Button type="button" size="sm" onClick={handleRemoteImport} disabled={uploading || !remoteUrl.trim()}>
            {uploading ? "..." : "Import"}
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => setMode("idle")} disabled={uploading}>
            Cancel
          </Button>
        </div>
      )}

      {uploading && <p className="text-xs text-muted-foreground">Uploading to Directus...</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
