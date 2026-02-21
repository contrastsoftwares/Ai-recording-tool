"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Monitor,
  CheckCircle,
  Download,
  FileText,
  AlertCircle,
  Mic,
  MicOff,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RecordingControls } from "./recording-controls";
import { useRouter } from "next/navigation";
import { useUploadStore } from "@/stores/upload-store";

type RecordingStatus = "idle" | "recording" | "paused" | "stopped";

export function ScreenRecorder() {
  const router = useRouter();
  const [status, setStatus] = useState<RecordingStatus>("idle");
  const [duration, setDuration] = useState(0);
  const [includeMicrophone, setIncludeMicrophone] = useState(false);
  const [quality, setQuality] = useState<"720p" | "1080p">("1080p");
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const blobRef = useRef<Blob | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (status === "recording") {
      interval = setInterval(() => setDuration((prev) => prev + 1), 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [status]);

  useEffect(() => {
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
      if (micStreamRef.current) micStreamRef.current.getTracks().forEach((t) => t.stop());
      if (audioContextRef.current) audioContextRef.current.close().catch(() => {});
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl]);

  const handleStart = useCallback(async () => {
    setError(null);
    setDuration(0);
    chunksRef.current = [];
    blobRef.current = null;
    if (videoUrl) { URL.revokeObjectURL(videoUrl); setVideoUrl(null); }

    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: quality === "1080p" ? { ideal: 1920 } : { ideal: 1280 },
          height: quality === "1080p" ? { ideal: 1080 } : { ideal: 720 },
        },
        audio: true,
      });

      const videoTrack = displayStream.getVideoTracks()[0];
      const systemAudioTracks = displayStream.getAudioTracks();

      // Use AudioContext to properly mix audio streams
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      const destination = audioContext.createMediaStreamDestination();

      if (systemAudioTracks.length > 0) {
        const systemSource = audioContext.createMediaStreamSource(new MediaStream(systemAudioTracks));
        systemSource.connect(destination);
      }

      if (includeMicrophone) {
        try {
          const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          micStreamRef.current = micStream;
          const micSource = audioContext.createMediaStreamSource(micStream);
          micSource.connect(destination);
        } catch { /* proceed without mic */ }
      }

      const combinedStream = new MediaStream([videoTrack, ...destination.stream.getAudioTracks()]);
      streamRef.current = combinedStream;

      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = displayStream;
        videoPreviewRef.current.play().catch(() => {});
      }

      const mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType: MediaRecorder.isTypeSupported("video/webm;codecs=vp9") ? "video/webm;codecs=vp9" : "video/webm",
      });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        blobRef.current = blob;
        setVideoUrl(URL.createObjectURL(blob));
        if (streamRef.current) { streamRef.current.getTracks().forEach((t) => t.stop()); streamRef.current = null; }
        if (micStreamRef.current) { micStreamRef.current.getTracks().forEach((t) => t.stop()); micStreamRef.current = null; }
        if (audioContextRef.current) { audioContextRef.current.close().catch(() => {}); audioContextRef.current = null; }
        if (videoPreviewRef.current) videoPreviewRef.current.srcObject = null;
      };

      displayStream.getVideoTracks().forEach((track) => {
        track.onended = () => {
          if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") mediaRecorderRef.current.stop();
          setStatus("stopped");
        };
      });

      mediaRecorder.start(100);
      setStatus("recording");
    } catch (err) {
      if (err instanceof DOMException && err.name === "NotAllowedError") {
        setError("Screen sharing was cancelled or denied. Please allow screen sharing to record.");
      } else {
        setError("An unexpected error occurred while starting screen recording.");
      }
    }
  }, [videoUrl, includeMicrophone, quality]);

  const handlePause = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") mediaRecorderRef.current.pause();
    setStatus("paused");
  }, []);

  const handleResume = useCallback(() => {
    if (mediaRecorderRef.current?.state === "paused") mediaRecorderRef.current.resume();
    setStatus("recording");
  }, []);

  const handleStop = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") mediaRecorderRef.current.stop();
    setStatus("stopped");
  }, []);

  const handleReset = useCallback(() => {
    if (streamRef.current) { streamRef.current.getTracks().forEach((t) => t.stop()); streamRef.current = null; }
    if (micStreamRef.current) { micStreamRef.current.getTracks().forEach((t) => t.stop()); micStreamRef.current = null; }
    if (audioContextRef.current) { audioContextRef.current.close().catch(() => {}); audioContextRef.current = null; }
    if (videoPreviewRef.current) videoPreviewRef.current.srcObject = null;
    if (videoUrl) { URL.revokeObjectURL(videoUrl); setVideoUrl(null); }
    mediaRecorderRef.current = null;
    chunksRef.current = [];
    blobRef.current = null;
    setStatus("idle");
    setDuration(0);
    setError(null);
  }, [videoUrl]);

  const handleDownload = useCallback(() => {
    if (!videoUrl) return;
    const a = document.createElement("a");
    a.href = videoUrl;
    a.download = `screen-recording-${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [videoUrl]);

  const handleGenerateNotes = useCallback(() => {
    if (!blobRef.current) return;
    const file = new File([blobRef.current], `screen-recording-${Date.now()}.webm`, { type: "video/webm" });
    useUploadStore.getState().setFile(file);
    router.push("/notes/new?source=recording");
  }, [router]);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* System audio warning */}
      {status === "idle" && (
        <div className="flex w-full items-start gap-3 rounded-lg border border-amber-500/50 bg-amber-500/10 px-4 py-3">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">System audio tip</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              When the browser asks you to share your screen, make sure to check the &quot;Share audio&quot; or &quot;Share tab audio&quot; checkbox to capture system/tab audio in your recording.
            </p>
          </div>
        </div>
      )}

      <Card className="w-full overflow-hidden">
        <CardContent className="p-0">
          <div className={cn("relative flex aspect-video w-full items-center justify-center bg-muted/50", status === "recording" && "ring-2 ring-red-500/50")}>
            {status === "stopped" ? (
              <div className="flex flex-col items-center gap-4 text-center p-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Recording saved!</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Your screen recording has been saved successfully.</p>
                </div>
                {videoUrl && <video controls src={videoUrl} className="w-full max-w-lg rounded-lg" />}
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Button onClick={handleGenerateNotes} className="gap-2">
                    <FileText className="h-4 w-4" />
                    Generate Notes
                  </Button>
                  <Button variant="outline" className="gap-2" onClick={handleDownload}>
                    <Download className="h-4 w-4" />
                    Download Recording
                  </Button>
                  <Button variant="outline" className="gap-2" onClick={handleReset}>
                    <RotateCcw className="h-4 w-4" />
                    New Recording
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <video ref={videoPreviewRef} muted playsInline className={cn("absolute inset-0 h-full w-full object-contain", status !== "recording" && status !== "paused" && "hidden")} />
                {status === "idle" && (
                  <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <Monitor className="h-12 w-12" />
                    <p className="text-sm font-medium">Your screen will appear here</p>
                  </div>
                )}
                {status === "paused" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <p className="rounded-lg bg-background/90 px-4 py-2 text-sm font-medium text-foreground">Recording paused</p>
                  </div>
                )}
                {status === "recording" && (
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-red-500 px-2.5 py-1 text-xs font-medium text-white">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                    REC
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="flex w-full items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3">
          <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {status !== "stopped" && (
        <RecordingControls status={status} onStart={handleStart} onPause={handlePause} onResume={handleResume} onStop={handleStop} duration={duration} variant="screen" />
      )}

      {status === "idle" && (
        <div className="flex w-full flex-wrap items-center justify-center gap-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <span className="text-sm font-medium text-foreground flex items-center gap-1.5">
              {includeMicrophone ? <Mic className="h-4 w-4 text-primary" /> : <MicOff className="h-4 w-4 text-muted-foreground" />}
              Microphone
            </span>
            <button type="button" role="switch" aria-checked={includeMicrophone} onClick={() => setIncludeMicrophone(!includeMicrophone)}
              className={cn("relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", includeMicrophone ? "bg-primary" : "bg-muted")}>
              <span className={cn("pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out", includeMicrophone ? "translate-x-5" : "translate-x-0")} />
            </button>
          </label>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-foreground">Quality</span>
            <select value={quality} onChange={(e) => setQuality(e.target.value as "720p" | "1080p")}
              className="rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <option value="720p">720p</option>
              <option value="1080p">1080p</option>
            </select>
          </div>
        </div>
      )}

      {status === "idle" && (
        <p className="text-xs text-muted-foreground text-center">
          System/tab audio is captured when you enable &quot;Share audio&quot; in the browser dialog. Toggle microphone to also record your voice.
        </p>
      )}
    </div>
  );
}
