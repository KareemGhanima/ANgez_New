"use client";

import { useMemo } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { useTranslation } from "react-i18next";

function CustomTick({ payload, x, y, textAnchor }: any) {
  const { t, i18n } = useTranslation();
  const baseKey = payload.value.toLowerCase();
  const primaryText = t(`dashboard.${baseKey}`, payload.value) as string;
  const secondaryText = i18n.language !== 'en' ? t(`dashboard.${baseKey}`, { lng: 'en' }) as string : t(`dashboard.${baseKey}`, { lng: 'ar' }) as string;

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={0} textAnchor={textAnchor} fill="#e2e8f0" fontSize={11} fontFamily="Rajdhani" fontWeight="bold">
        {primaryText}
      </text>
      <text x={0} y={14} dy={0} textAnchor={textAnchor} fill="#00FFFF" fontSize={9} fontFamily="Rajdhani" opacity={0.8} fontWeight="bold">
        ({secondaryText})
      </text>
    </g>
  );
}

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
      <RadarChart cx="50%" cy="50%" outerRadius="65%" data={data}>
        <PolarGrid stroke="rgba(0, 255, 255, 0.15)" strokeDasharray="3 3" />
        <PolarAngleAxis dataKey="subject" tick={<CustomTick />} />
        <PolarRadiusAxis angle={30} domain={[0, maxVal]} tick={false} axisLine={false} />
        
        {/* Holographic Glowing Lines with Gradient */}
        <Radar
          name="Attributes"
          dataKey="A"
          stroke="url(#radarGradient)"
          strokeWidth={3}
          fill="url(#radarGradient)"
          fillOpacity={0.4}
          dot={{ r: 4, fill: "#39FF14", strokeWidth: 1, stroke: "#00FFFF" }}
        />
        
        {/* SVG Definition for Neon Color Gradient */}
        <defs>
           <linearGradient id="radarGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#00FFFF" />
              <stop offset="100%" stopColor="#FF00FF" />
           </linearGradient>
        </defs>
      </RadarChart>
    </ResponsiveContainer>
  );
}
