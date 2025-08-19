import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AudioSettings() {
  const [systemAudio, setSystemAudio] = useState(true);
  const [microphone, setMicrophone] = useState(false);
  const [systemVolume, setSystemVolume] = useState([80]);
  const [micGain, setMicGain] = useState([60]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.777L4.414 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.414l3.969-3.777a1 1 0 011 .053zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
          </svg>
          <span>Audio Settings</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* System Audio */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Checkbox
                checked={systemAudio}
                onCheckedChange={(checked) => setSystemAudio(checked === true)}
                id="system-audio"
                data-testid="checkbox-system-audio"
              />
              <label htmlFor="system-audio" className="text-sm font-medium text-gray-700">
                Capture System Audio
              </label>
            </div>
            {systemAudio && (
              <div className="ml-7 space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500 w-16">Volume:</span>
                  <Slider
                    value={systemVolume}
                    onValueChange={setSystemVolume}
                    max={100}
                    step={1}
                    className="flex-1"
                    data-testid="slider-system-volume"
                  />
                  <span className="text-xs text-gray-500 w-8">{systemVolume[0]}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    {/* Audio level bars */}
                    <div className="w-1 h-4 bg-success rounded-full"></div>
                    <div className="w-1 h-4 bg-success rounded-full"></div>
                    <div className="w-1 h-4 bg-success rounded-full"></div>
                    <div className="w-1 h-4 bg-gray-300 rounded-full"></div>
                    <div className="w-1 h-4 bg-gray-300 rounded-full"></div>
                  </div>
                  <span className="text-xs text-gray-500">Live Audio Level</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Microphone */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Checkbox
                checked={microphone}
                onCheckedChange={(checked) => setMicrophone(checked === true)}
                id="microphone"
                data-testid="checkbox-microphone"
              />
              <label htmlFor="microphone" className="text-sm font-medium text-gray-700">
                Include Microphone
              </label>
            </div>
            {microphone && (
              <div className="ml-7 space-y-2">
                <Select defaultValue="default" data-testid="select-microphone">
                  <SelectTrigger className="w-full text-sm">
                    <SelectValue placeholder="Select microphone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default Microphone</SelectItem>
                    <SelectItem value="usb">USB Microphone</SelectItem>
                    <SelectItem value="builtin">Built-in Microphone</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500 w-16">Gain:</span>
                  <Slider
                    value={micGain}
                    onValueChange={setMicGain}
                    max={100}
                    step={1}
                    className="flex-1"
                    data-testid="slider-mic-gain"
                  />
                  <span className="text-xs text-gray-500 w-8">{micGain[0]}%</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
