import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function BrowserCompatibility() {
  const browsers = [
    { name: "Chrome", icon: "🟨", supported: "Full DRM Support", color: "success" },
    { name: "Firefox", icon: "🟧", supported: "DRM Compatible", color: "success" },
    { name: "Edge", icon: "🔵", supported: "DRM Compatible", color: "success" },
    { name: "Safari", icon: "🔷", supported: "Basic Support", color: "warning" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
          </svg>
          <span>Browser Support</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {browsers.map((browser) => (
          <div key={browser.name} className="flex items-center justify-between" data-testid={`browser-${browser.name.toLowerCase()}`}>
            <div className="flex items-center space-x-2">
              <span className="text-lg">{browser.icon}</span>
              <span className="text-sm text-gray-700">{browser.name}</span>
            </div>
            <Badge
              variant={browser.color === "success" ? "default" : "secondary"}
              className={browser.color === "success" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}
            >
              {browser.supported}
            </Badge>
          </div>
        ))}
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-700">
            <svg className="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" clipRule="evenodd" />
            </svg>
            Optimized for Chrome tab recording - Choose "Chrome Tab" for best results
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
