import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";
import type { Recording } from "@shared/schema";

export default function RecordingsList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: recordings = [], isLoading } = useQuery<Recording[]>({
    queryKey: ["/api/recordings"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/recordings/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recordings"] });
      toast({
        title: "Recording deleted",
        description: "The recording has been successfully deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete recording.",
        variant: "destructive",
      });
    },
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const downloadRecording = (recording: Recording) => {
    // In a real implementation, this would download the actual file
    toast({
      title: "Download started",
      description: `Downloading ${recording.title}...`,
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
            </svg>
            <span>Recent Recordings</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Loading recordings...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
          </svg>
          <span>Recent Recordings</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {recordings.length === 0 ? (
          <div className="text-center py-6" data-testid="empty-recordings">
            <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V2a1 1 0 011-1h2a1 1 0 011 1v2m0 0v14a2 2 0 01-2 2H5a2 2 0 01-2-2V4h14z" />
            </svg>
            <p className="text-sm text-gray-500">No recordings yet</p>
            <p className="text-xs text-gray-400 mt-1">Start recording to see your files here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recordings.slice(0, 3).map((recording) => (
              <div key={recording.id} className="border border-gray-100 rounded-lg p-3" data-testid={`recording-${recording.id}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900" data-testid={`text-title-${recording.id}`}>
                      {recording.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1" data-testid={`text-details-${recording.id}`}>
                      {formatFileSize(recording.fileSize)} • {formatDuration(recording.duration)} • {recording.format.toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-400" data-testid={`text-date-${recording.id}`}>
                      {formatDistanceToNow(new Date(recording.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => downloadRecording(recording)}
                      data-testid={`button-download-${recording.id}`}
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMutation.mutate(recording.id)}
                      disabled={deleteMutation.isPending}
                      data-testid={`button-delete-${recording.id}`}
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {recordings.length > 3 && (
              <Button
                variant="ghost"
                className="w-full text-center text-sm text-primary hover:text-blue-700"
                data-testid="button-show-all"
              >
                View All Recordings ({recordings.length})
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
