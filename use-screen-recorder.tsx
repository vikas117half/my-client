import { useState, useRef, useCallback, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { InsertRecording } from "@shared/schema";

export const useScreenRecorder = () => {
  const [isSharing, setIsSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [videoQuality, setVideoQuality] = useState("1280x720 • 30fps");
  const [audioLevel, setAudioLevel] = useState(0);
  const [fileSize, setFileSize] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const watchdogRef = useRef<NodeJS.Timeout | null>(null);
  const lastDataTimeRef = useRef<number>(0);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const saveRecordingMutation = useMutation({
    mutationFn: async (recordingData: InsertRecording) => {
      return apiRequest("POST", "/api/recordings", recordingData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recordings"] });
      toast({
        title: "Recording saved",
        description: "Your screen recording has been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save recording.",
        variant: "destructive",
      });
    },
  });

  const startScreenShare = useCallback(async () => {
    try {
      // Optimized capture settings - 720p for good quality with smaller file sizes
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          frameRate: { ideal: 24, max: 30 },
          // 720p ideal for balanced quality and file size
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
        },
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          sampleRate: 44100,
        },
      });

      mediaStreamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setIsSharing(true);
      
      // Get actual video track settings to display correct resolution
      const videoTrack = stream.getVideoTracks()[0];
      const settings = videoTrack.getSettings();
      const actualWidth = settings.width || 'unknown';
      const actualHeight = settings.height || 'unknown';
      setVideoQuality(`${actualWidth}x${actualHeight} • 24fps`);

      // Handle stream end (user stops sharing) - but preserve recording
      stream.getVideoTracks()[0].onended = () => {
        console.log("Screen share ended by user");
        if (isRecording) {
          toast({
            title: "Screen share ended",
            description: "Recording will continue to save. Please wait...",
          });
          // Give recording time to finish processing
          setTimeout(() => {
            stopAll();
          }, 2000);
        } else {
          stopAll();
        }
      };


      toast({
        title: "Screen sharing started",
        description: "Screen capture is now active.",
      });
    } catch (error) {
      console.error("Error starting screen share:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast({
        title: "Error",
        description: `Failed to start screen sharing: ${errorMessage}`,
        variant: "destructive",
      });
    }
  }, []);

  const startRecording = useCallback(async () => {
    if (!mediaStreamRef.current) {
      toast({
        title: "Error",
        description: "No screen share active. Please start screen sharing first.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Enhanced recording setup for DRM content - prioritize formats with better seeking
      const options = [
        { mimeType: 'video/mp4;codecs=h264,aac' },
        { mimeType: 'video/mp4' },
        { mimeType: 'video/webm;codecs=vp9,opus' },
        { mimeType: 'video/webm;codecs=vp8,opus' },
        { mimeType: 'video/webm;codecs=h264,opus' },
        { mimeType: 'video/webm' },
      ];
      
      let selectedOption = options[0];
      for (const option of options) {
        if (MediaRecorder.isTypeSupported(option.mimeType)) {
          selectedOption = option;
          break;
        }
      }

      const mediaRecorder = new MediaRecorder(mediaStreamRef.current, {
        ...selectedOption,
        // Optimized bitrate for 720p - good quality with smaller files
        videoBitsPerSecond: 1500000, // 1.5 Mbps - perfect for 720p
        audioBitsPerSecond: 96000,   // Good audio quality
        bitsPerSecond: 1596000,      // Total bitrate
      });


      recordedChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
          lastDataTimeRef.current = Date.now(); // Update last data timestamp
          
          // Update file size estimate
          const totalSize = recordedChunksRef.current.reduce((acc, chunk) => acc + chunk.size, 0);
          setFileSize(Math.round(totalSize / 1024 / 1024 * 100) / 100);
          
          // Memory management for long recordings - log progress
          if (recordedChunksRef.current.length % 100 === 0) {
            console.log(`Recording progress: ${recordedChunksRef.current.length} chunks, ${Math.round(totalSize / 1024 / 1024)} MB`);
          }
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error("MediaRecorder error:", event);
        toast({
          title: "Recording Error",
          description: "Recording encountered an error. Trying to save what was recorded...",
          variant: "destructive",
        });
        // Try to save whatever was recorded so far
        if (recordedChunksRef.current.length > 0) {
          const mimeType = selectedOption.mimeType || 'video/webm';
          const blob = new Blob(recordedChunksRef.current, { type: mimeType });
          downloadRecording(blob, mimeType);
          saveRecordingToDatabase(blob, mimeType);
        }
      };

      mediaRecorder.onstop = () => {
        console.log("Recording stopped, processing data...");
        if (recordedChunksRef.current.length > 0) {
          // Use the same MIME type that was used for recording
          const mimeType = selectedOption.mimeType || 'video/webm';
          const blob = new Blob(recordedChunksRef.current, { type: mimeType });
          downloadRecording(blob, mimeType);
          saveRecordingToDatabase(blob, mimeType);
        } else {
          toast({
            title: "No Data",
            description: "No recording data was captured.",
            variant: "destructive",
          });
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      // Use longer intervals for long recordings to reduce memory pressure
      mediaRecorder.start(5000); // 5 seconds - better for long recordings
      lastDataTimeRef.current = Date.now(); // Initialize timestamp

      setIsRecording(true);
      setRecordingDuration(0);
      setAudioLevel(1); // Simulate audio level

      // Start duration timer
      intervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);

      // Start watchdog timer to detect stalled recordings
      watchdogRef.current = setInterval(() => {
        const timeSinceLastData = Date.now() - lastDataTimeRef.current;
        if (timeSinceLastData > 10000) { // 10 seconds without data
          console.warn("Recording appears to be stalled, attempting to recover...");
          toast({
            title: "Recording Issue Detected",
            description: "Recording may have stalled. Attempting to save current progress...",
            variant: "destructive",
          });
          // Try to stop and save current recording
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
          }
        }
      }, 5000); // Check every 5 seconds

      toast({
        title: "Recording started",
        description: "Screen recording is now active.",
      });
    } catch (error) {
      console.error("Error starting recording:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast({
        title: "Error",
        description: `Failed to start recording: ${errorMessage}`,
        variant: "destructive",
      });
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (watchdogRef.current) {
      clearInterval(watchdogRef.current);
      watchdogRef.current = null;
    }

    setIsRecording(false);
    setAudioLevel(0);

    toast({
      title: "Recording stopped",
      description: "Your screen recording has been saved.",
    });
  }, [isRecording]);

  const stopAll = useCallback(() => {
    // Stop recording if active
    if (isRecording) {
      stopRecording();
    }

    // Stop screen sharing
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsSharing(false);
    setFileSize(0);
    setVideoQuality("");

    toast({
      title: "Session ended",
      description: "Screen sharing and recording have been stopped.",
    });
  }, [isRecording, stopRecording]);

  const downloadRecording = useCallback((blob: Blob, mimeType: string = 'video/webm') => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    // Use appropriate file extension based on format
    const extension = mimeType.includes('mp4') ? 'mp4' : 'webm';
    a.download = `screen-recording-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const saveRecordingToDatabase = useCallback((blob: Blob, mimeType: string = 'video/webm') => {
    const format = mimeType.includes('mp4') ? 'mp4' : 'webm';
    const extension = format;
    const recordingData: InsertRecording = {
      title: `Screen Recording ${new Date().toLocaleString()}`,
      filename: `screen-recording-${Date.now()}.${extension}`,
      fileSize: blob.size,
      duration: recordingDuration,
      format: format,
      quality: "720p",
      frameRate: 30,
      hasAudio: true,
      hasMicrophone: false,
    };

    saveRecordingMutation.mutate(recordingData);
  }, [recordingDuration, saveRecordingMutation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (watchdogRef.current) {
        clearInterval(watchdogRef.current);
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return {
    isSharing,
    isRecording,
    recordingDuration,
    videoQuality,
    audioLevel,
    fileSize,
    videoRef,
    startScreenShare,
    startRecording,
    stopRecording,
    stopAll,
  };
}
