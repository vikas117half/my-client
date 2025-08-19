import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useScreenRecorder } from "@/hooks/use-screen-recorder";

export default function ScreenRecorder() {
  const {
    isSharing,
    isRecording,
    recordingDuration,
    videoRef,
    startScreenShare,
    startRecording,
    stopRecording,
    stopAll,
    videoQuality,
    audioLevel,
    fileSize,
  } = useScreenRecorder();

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 border-b border-gray-100 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg font-semibold text-gray-900">Screen Preview</CardTitle>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className={`w-2 h-2 rounded-full ${isSharing ? 'bg-success' : 'bg-gray-400'}`}></div>
            <span data-testid="text-status">
              {isRecording ? 'Recording' : isSharing ? 'Sharing' : 'Ready to Share'}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Video Preview Area */}
        <div className="relative bg-gray-900 aspect-video flex items-center justify-center min-h-[400px]">
          <video
            ref={videoRef}
            className={`w-full h-full object-contain ${isSharing ? 'block' : 'hidden'}`}
            autoPlay
            muted
            data-testid="video-preview"
          />
          
          {/* Placeholder when no screen sharing */}
          {!isSharing && (
            <div className="text-center text-gray-400" data-testid="placeholder-content">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
              </svg>
              <p className="text-lg mb-2">No screen shared yet</p>
              <p className="text-sm opacity-75">Click "Start Screen Share" to begin</p>
            </div>
          )}
          
          {/* Recording indicator overlay */}
          {isRecording && (
            <div className="absolute top-4 right-4" data-testid="recording-indicator">
              <div className="bg-error text-white px-3 py-1 rounded-full flex items-center space-x-2 text-sm font-medium">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span>REC {formatDuration(recordingDuration)}</span>
              </div>
            </div>
          )}
          
          {/* Quality indicator */}
          {isSharing && (
            <div className="absolute top-4 left-4" data-testid="quality-indicator">
              <div className="bg-black/50 text-white px-2 py-1 rounded text-xs">
                {videoQuality}
              </div>
            </div>
          )}
        </div>
        
        {/* Control Bar */}
        <div className="p-4 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Start Screen Share Button */}
            <Button
              onClick={startScreenShare}
              disabled={isSharing}
              className="bg-primary hover:bg-blue-700"
              data-testid="button-start-share"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M15.707 4.293a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 011.414-1.414L9 7.586l3.293-3.293a1 1 0 011.414 0zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              {isSharing ? 'Sharing...' : 'Start Screen Share'}
            </Button>
            
            {/* Record Button */}
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={!isSharing}
              className={isRecording ? "bg-error hover:bg-red-600" : "bg-success hover:bg-green-600"}
              data-testid="button-toggle-recording"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                {isRecording ? (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                ) : (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                )}
              </svg>
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </Button>
            
            {/* Stop All Button */}
            <Button
              onClick={stopAll}
              disabled={!isSharing && !isRecording}
              variant="destructive"
              data-testid="button-stop-all"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
              </svg>
              Stop All
            </Button>
          </div>
          
          {/* Recording Info */}
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1" data-testid="text-audio-level">
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.777L4.414 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.414l3.969-3.777a1 1 0 011 .0z" clipRule="evenodd" />
              </svg>
              <span>Audio: {audioLevel > 0 ? 'On' : 'Off'}</span>
            </div>
            <div className="flex items-center space-x-1" data-testid="text-file-size">
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 01.707.293L10.414 5H15a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" clipRule="evenodd" />
              </svg>
              <span>Size: {fileSize} MB</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
