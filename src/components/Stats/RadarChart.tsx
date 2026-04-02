"use client";

import { useMemo } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

interface StatsProps {
  stats: {
    academic: number;
    fitness: number;
    discipline: number;
    social: number;
  };
  className?: string;
}

export default function RechartsRadarChart({ stats, className = "" }: StatsProps) {
  // Dynamically calculate the maximum domain to scale the chart based on the user's highest XP.
  // The axis expands per 1000 XP increment basically.
  const maxStat = Math.max(stats.academic, stats.fitness, stats.discipline, stats.social, 100);
  const domainMax = Math.ceil(maxStat / 1000) * 1000;

  const data = useMemo(() => [
    { subject: "Academic", A: stats.academic, fullMark: domainMax },
    { subject: "Fitness", A: stats.fitness, fullMark: domainMax },
    { subject: "Discipline", A: stats.discipline, fullMark: domainMax },
    { subject: "Social", A: stats.social, fullMark: domainMax },
  ], [stats, domainMax]);

  return (
    <div className={`w-full h-full relative ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="rgba(139, 92, 246, 0.3)" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: "#a855f7", fontSize: 12, fontFamily: "Orbitron" }} 
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, domainMax]} 
            tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
            axisLine={false}
          />
          <Radar
            name="XP Stats"
            dataKey="A"
            stroke="#8b5cf6"
            strokeWidth={2}
            fill="#8b5cf6"
            fillOpacity={0.5}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
