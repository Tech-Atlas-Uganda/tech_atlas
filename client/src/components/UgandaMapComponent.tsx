import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Building2, Users, Rocket, ExternalLink, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface MapMarker {
  id: string;
  name: string;
  type: "hub" | "community" | "startup" | "event";
  location: string;
  coordinates: [number, number]; // [lat, lng]
  description?: string;
  website?: string;
  category?: string;
}

// Sample markers for Uganda tech ecosystem
const sampleMarkers: MapMarker[] = [
  {
    id: "1",
    name: "Outbox Hub",
    type: "hub",
    location: "Kampala",
    coordinates: [0.3476, 32.5825],
    description: "Leading tech hub and incubator in Uganda",
    website: "https://outbox.co.ug",
    category: "Tech Hub"
  },
  {
    id: "2", 
    name: "Innovation Village",
    type: "hub",
    location: "Ntinda, Kampala",
    coordinates: [0.3634, 32.6089],
    description: "Technology and innovation hub",
    website: "https://innovationvillage.co.ug",
    category: "Innovation Hub"
  },
  {
    id: "3",
    name: "Refactory",
    type: "hub", 
    location: "Kampala",
    coordinates: [0.3152, 32.5811],
    description: "Software development bootcamp and tech community",
    website: "https://refactory.ug",
    category: "Bootcamp"
  },
  {
    id: "4",
    name: "Kampala Flutter Community",
    type: "community",
    location: "Kampala",
    coordinates: [0.3476, 32.5825],
    description: "Flutter developers community in Kampala",
    category: "Mobile Development"
  },
  {
    id: "5",
    name: "SafeBoda",
    type: "startup",
    location: "Kampala",
    coordinates: [0.3476, 32.5825],
    description: "Motorcycle taxi booking platform",
    website: "https://safeboda.com",
    category: "Transportation"
  },
  {
    id: "6",
    name: "Jinja Tech Hub",
    type: "hub",
    location: "Jinja",
    coordinates: [0.4312, 33.2041],
    description: "Eastern Uganda's premier tech space",
    category: "Tech Hub"
  },
  {
    id: "7",
    name: "Mbarara Innovation Lab",
    type: "hub",
    location: "Mbarara",
    coordinates: [-0.6107, 30.6591],
    description: "Western Uganda tech innovation center",
    category: "Innovation Lab"
  },
  {
    id: "8",
    name: "Gulu Tech Community",
    type: "community",
    location: "Gulu",
    coordinates: [2.7856, 32.2998],
    description: "Northern Uganda developer community",
    category: "Developer Community"
  }
];

export default function UgandaMapComponent() {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case "hub": return Building2;
      case "community": return Users;
      case "startup": return Rocket;
      default: return MapPin;
    }
  };

  // Convert real coordinates to SVG positions
  const coordToSVG = (lat: number, lng: number) => {
    // Uganda bounds: lat: -1.4823 to 4.2144, lng: 29.5732 to 35.0078
    const x = ((lng - 29.5732) / (35.0078 - 29.5732)) * 300 + 50;
    const y = ((4.2144 - lat) / (4.2144 - (-1.4823))) * 400 + 50;
    return { x, y };
  };

  return (
    <div className="space-y-6">
      {/* Digital Uganda Map */}
      <Card className="h-[600px] relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 dark:from-slate-950 dark:via-blue-950 dark:to-purple-950">
        <div className="absolute inset-0">
          {/* Animated background grid */}
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-blue-400"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Digital Uganda Map SVG */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 400 500" className="w-full h-full max-w-md">
              <defs>
                <linearGradient id="ugandaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
                  <stop offset="50%" stopColor="rgba(139, 92, 246, 0.3)" />
                  <stop offset="100%" stopColor="rgba(236, 72, 153, 0.3)" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Accurate Uganda outline with Lake Victoria */}
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                d="M 160 80
                   L 180 75
                   L 200 78
                   L 220 85
                   L 240 95
                   L 255 110
                   L 270 130
                   L 280 150
                   L 285 170
                   L 288 190
                   L 285 210
                   L 280 230
                   L 270 250
                   L 255 265
                   L 240 275
                   L 220 280
                   L 200 282
                   L 180 280
                   L 160 275
                   L 145 265
                   L 135 250
                   L 130 230
                   L 128 210
                   L 130 190
                   L 135 170
                   L 145 150
                   L 155 130
                   L 160 110
                   L 158 95
                   Z
                   
                   M 170 240
                   C 180 245, 200 248, 220 245
                   C 235 242, 245 235, 250 225
                   C 248 215, 240 210, 225 212
                   C 210 214, 190 218, 175 225
                   C 165 230, 168 238, 170 240
                   Z"
                fill="url(#ugandaGradient)"
                stroke="rgba(59, 130, 246, 0.8)"
                strokeWidth="2"
                filter="url(#glow)"
                className="drop-shadow-lg"
                fillRule="evenodd"
              />

              {/* Regional divisions - positioned according to actual Uganda geography */}
              <g className="opacity-60">
                {/* Central Region - around Kampala/Lake Victoria area */}
                <motion.circle
                  cx="200" cy="220"
                  r="25"
                  fill="rgba(59, 130, 246, 0.2)"
                  stroke="rgba(59, 130, 246, 0.6)"
                  strokeWidth="1"
                  strokeDasharray="5,5"
                  onMouseEnter={() => setHoveredRegion('Central')}
                  onMouseLeave={() => setHoveredRegion(null)}
                  className="cursor-pointer"
                />
                
                {/* Eastern Region - right side */}
                <motion.circle
                  cx="250" cy="180"
                  r="20"
                  fill="rgba(139, 92, 246, 0.2)"
                  stroke="rgba(139, 92, 246, 0.6)"
                  strokeWidth="1"
                  strokeDasharray="5,5"
                  onMouseEnter={() => setHoveredRegion('Eastern')}
                  onMouseLeave={() => setHoveredRegion(null)}
                  className="cursor-pointer"
                />
                
                {/* Northern Region - top */}
                <motion.circle
                  cx="200" cy="120"
                  r="22"
                  fill="rgba(236, 72, 153, 0.2)"
                  stroke="rgba(236, 72, 153, 0.6)"
                  strokeWidth="1"
                  strokeDasharray="5,5"
                  onMouseEnter={() => setHoveredRegion('Northern')}
                  onMouseLeave={() => setHoveredRegion(null)}
                  className="cursor-pointer"
                />
                
                {/* Western Region - left side */}
                <motion.circle
                  cx="150" cy="190"
                  r="18"
                  fill="rgba(16, 185, 129, 0.2)"
                  stroke="rgba(16, 185, 129, 0.6)"
                  strokeWidth="1"
                  strokeDasharray="5,5"
                  onMouseEnter={() => setHoveredRegion('Western')}
                  onMouseLeave={() => setHoveredRegion(null)}
                  className="cursor-pointer"
                />
              </g>

              {/* Tech ecosystem markers - showing all sample data */}
              {sampleMarkers.map((marker, index) => {
                const Icon = getMarkerIcon(marker.type);
                const pos = coordToSVG(marker.coordinates[0], marker.coordinates[1]);
                
                return (
                  <motion.g
                    key={marker.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.2, duration: 0.5 }}
                    className="cursor-pointer"
                  >
                    {/* Pulsing circle */}
                    <motion.circle
                      cx={pos.x}
                      cy={pos.y}
                      r="12"
                      fill={marker.type === 'hub' ? 'rgba(59, 130, 246, 0.3)' : 
                            marker.type === 'community' ? 'rgba(139, 92, 246, 0.3)' : 
                            'rgba(236, 72, 153, 0.3)'}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    
                    {/* Main marker */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="8"
                      fill={marker.type === 'hub' ? '#3b82f6' : 
                            marker.type === 'community' ? '#8b5cf6' : 
                            '#ec4899'}
                      stroke="white"
                      strokeWidth="2"
                      filter="url(#glow)"
                    />
                    
                    {/* Icon */}
                    <foreignObject x={pos.x - 6} y={pos.y - 6} width="12" height="12">
                      <Icon className="w-3 h-3 text-white" />
                    </foreignObject>
                    
                    {/* Label */}
                    <text
                      x={pos.x}
                      y={pos.y + 20}
                      textAnchor="middle"
                      className="fill-white text-xs font-medium"
                      style={{ textShadow: '0 0 4px rgba(0,0,0,0.8)' }}
                    >
                      {marker.name}
                    </text>
                  </motion.g>
                );
              })}

              {/* Connection lines between markers */}
              <g className="opacity-30">
                {sampleMarkers.map((marker, i) => 
                  sampleMarkers.slice(i + 1).map((otherMarker, j) => {
                    const pos1 = coordToSVG(marker.coordinates[0], marker.coordinates[1]);
                    const pos2 = coordToSVG(otherMarker.coordinates[0], otherMarker.coordinates[1]);
                    return (
                      <motion.line
                        key={`${marker.id}-${otherMarker.id}`}
                        x1={pos1.x} y1={pos1.y}
                        x2={pos2.x} y2={pos2.y}
                        stroke="rgba(59, 130, 246, 0.3)"
                        strokeWidth="1"
                        strokeDasharray="2,4"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: (i + j) * 0.1, duration: 1 }}
                      />
                    );
                  })
                )}
              </g>
            </svg>
          </div>

          {/* Digital HUD Elements */}
          <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-sm rounded-lg p-3 border border-blue-500/30">
            <div className="flex items-center gap-2 text-blue-400 mb-2">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-mono">TECH ATLAS</span>
            </div>
            <div className="text-xs text-blue-300 font-mono">
              UGANDA ECOSYSTEM MAP
            </div>
          </div>

          {/* Region Info Display */}
          {hoveredRegion && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-purple-500/30"
            >
              <div className="text-purple-400 font-mono text-sm">
                {hoveredRegion} Region
              </div>
              <div className="text-xs text-purple-300">
                {sampleMarkers.filter(m => {
                  if (hoveredRegion === 'Central') return m.location.includes('Kampala');
                  if (hoveredRegion === 'Eastern') return m.location.includes('Jinja');
                  if (hoveredRegion === 'Western') return m.location.includes('Mbarara');
                  if (hoveredRegion === 'Northern') return m.location.includes('Gulu');
                  return false;
                }).length} entities
              </div>
            </motion.div>
          )}

          {/* Digital Legend */}
          <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-sm rounded-lg p-3 border border-green-500/30">
            <h4 className="font-mono text-sm text-green-400 mb-2">LEGEND</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-blue-300 font-mono">HUBS</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-purple-300 font-mono">COMMUNITIES</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                <span className="text-pink-300 font-mono">STARTUPS</span>
              </div>
            </div>
          </div>

          {/* Scanning line animation */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ y: -100 }}
            animate={{ y: 700 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60"></div>
          </motion.div>
        </div>
      </Card>

      {/* Digital Status Bar */}
      <Card className="bg-gradient-to-r from-slate-900 to-blue-900 border-blue-500/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4 text-blue-300 font-mono">
              <span>STATUS: ONLINE</span>
              <span>ENTITIES: {sampleMarkers.length}</span>
              <span>REGIONS: 4</span>
            </div>
            <div className="text-blue-400 font-mono">
              UGANDA TECH ECOSYSTEM v2.0
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}