import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function RecordingSettings() {
  const [autoSave, setAutoSave] = useState(true);
  const [stealthMode, setStealthMode] = useState(true);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          <span>Recording Settings</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Video Quality */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Video Quality</label>
          <Select defaultValue="720p" data-testid="select-video-quality">
            <SelectTrigger className="w-full text-sm">
              <SelectValue placeholder="Select quality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="720p">720p (1280x720) - Recommended</SelectItem>
              <SelectItem value="1080p">1080p (1920x1080) - High Quality</SelectItem>
              <SelectItem value="480p">480p (854x480) - Compact</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Frame Rate */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Frame Rate</label>
          <Select defaultValue="30" data-testid="select-frame-rate">
            <SelectTrigger className="w-full text-sm">
              <SelectValue placeholder="Select frame rate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 FPS</SelectItem>
              <SelectItem value="60">60 FPS</SelectItem>
              <SelectItem value="24">24 FPS</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Output Format */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Output Format</label>
          <Select defaultValue="mp4" data-testid="select-output-format">
            <SelectTrigger className="w-full text-sm">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mp4">MP4 - Best Seeking</SelectItem>
              <SelectItem value="webm">WebM - Smaller Size</SelectItem>
              <SelectItem value="mov">MOV</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Auto-save */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Auto-save recordings</span>
          <Switch
            checked={autoSave}
            onCheckedChange={setAutoSave}
            data-testid="switch-auto-save"
          />
        </div>
        
        {/* Stealth Mode */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Stealth Mode</span>
            <div className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full font-medium">
              DRM Bypass
            </div>
          </div>
          <Switch
            checked={stealthMode}
            onCheckedChange={setStealthMode}
            data-testid="switch-stealth-mode"
          />
        </div>
        
        {stealthMode && (
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-xs text-green-700">
              <svg className="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" clipRule="evenodd" />
              </svg>
              Stealth mode active: Records DRM-protected content without triggering website alarms
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
