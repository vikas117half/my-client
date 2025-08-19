import { useState, useEffect } from "react";

export default function StatusBar() {
  const [permissions, setPermissions] = useState({
    screen: false,
    audio: false,
  });

  useEffect(() => {
    // Check permissions on mount
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    try {
      // Check screen capture permission (this is approximate)
      const hasScreen = navigator.mediaDevices && 'getDisplayMedia' in navigator.mediaDevices;
      
      // Check microphone permission
      let hasAudio = false;
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        hasAudio = permissionStatus.state === 'granted';
      } catch (error) {
        // Fallback check
        hasAudio = navigator.mediaDevices && 'getUserMedia' in navigator.mediaDevices;
      }

      setPermissions({
        screen: hasScreen,
        audio: hasAudio,
      });
    } catch (error) {
      console.error('Error checking permissions:', error);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1" data-testid="status-connection">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span>Connected</span>
          </div>
          <div className="flex items-center space-x-1" data-testid="status-permissions">
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>
              Permissions: Screen {permissions.screen ? '✓' : '✗'} Audio {permissions.audio ? '✓' : '✗'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div data-testid="status-storage">Storage: 0 MB / 2 GB</div>
          <div data-testid="status-network">Network: Good</div>
        </div>
      </div>
    </div>
  );
}
