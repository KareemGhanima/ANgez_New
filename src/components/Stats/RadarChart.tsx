"use client";

import { useMemo } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

export default function RechartsRadarChart({ stats }: { stats: { academic: number; fitness: number; discipline: number; social: number } }) {
  const data = useMemo(() => {
     return [
       { subject: "ACADEMIC", A: stats.academic, fullMark: 100 },
       { subject: "FITNESS", A: stats.fitness, fullMark: 100 },
       { subject: "DISCIPLINE", A: stats.discipline, fullMark: 100 },
       { subject: "SOCIAL", A: stats.social, fullMark: 100 },
     ];
  }, [stats]);

  const maxVal = useMemo(() => {
     const max = Math.max(stats.academic, stats.fitness, stats.discipline, stats.social);
     return Math.ceil(Math.max(100, max) / 100) * 100;
  }, [stats]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
        <PolarGrid stroke="rgba(0, 255, 255, 0.15)" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: "#e2e8f0", fontSize: 10, fontFamily: "Orbitron" }} />
        <PolarRadiusAxis angle={30} domain={[0, maxVal]} tick={false} axisLine={false} />
        
        {/* Holographic Glowing Lines */}
        <Radar
          name="Attributes"
          dataKey="A"
          stroke="#00FFFF"
          strokeWidth={2}
          fill="url(#cyanGlow)"
          fillOpacity={0.6}
          dot={{ r: 3, fill: "#39FF14", strokeWidth: 1, stroke: "#00FFFF" }}
        />
        
        {/* SVG Definition for Neon Glow Fill */}
        <defs>
           <radialGradient id="cyanGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00FFFF" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#00FFFF" stopOpacity={0.1} />
           </radialGradient>
        </defs>
      </RadarChart>
    </ResponsiveContainer>
  );
}
