"use client";

import { useState } from "react";
import { createClient } from "@/core/supabase/client";
import { useRouter } from "next/navigation";

export default function SettingsForm({ initialTheme, userId }: any) {
  const [theme, setTheme] = useState(initialTheme || {
    primary_color: "#8b5cf6",
    accent_color: "#6d28d9",
    background: "#0f172a",
    font_size: "16px"
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("theme")
        .upsert({
          user_id: userId,
          ...theme
        });
      
      if (error) throw error;
      
      // Reload page to re-fetch SSR theme on layout
      router.refresh();
      router.push("/dashboard");
    } catch(err: any) {
      alert("Error saving settings: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-6 space-y-6">
      
      <div>
        <label className="block text-sm font-semibold mb-2">Primary Color</label>
        <div className="flex items-center gap-3">
          <input 
            type="color" 
            value={theme.primary_color}
            onChange={(e) => setTheme({...theme, primary_color: e.target.value})}
            className="w-10 h-10 rounded border-0 cursor-pointer"
          />
          <span className="text-sm font-mono text-foreground/70">{theme.primary_color}</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Accent Color</label>
        <div className="flex items-center gap-3">
          <input 
            type="color" 
            value={theme.accent_color}
            onChange={(e) => setTheme({...theme, accent_color: e.target.value})}
            className="w-10 h-10 rounded border-0 cursor-pointer"
          />
          <span className="text-sm font-mono text-foreground/70">{theme.accent_color}</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Background Color</label>
        <div className="flex items-center gap-3">
          <input 
            type="color" 
            value={theme.background}
            onChange={(e) => setTheme({...theme, background: e.target.value})}
            className="w-10 h-10 rounded border-0 cursor-pointer"
          />
          <span className="text-sm font-mono text-foreground/70">{theme.background}</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Font Size (Base)</label>
        <select 
          value={theme.font_size}
          onChange={(e) => setTheme({...theme, font_size: e.target.value})}
          className="bg-background border border-cardBorder rounded px-3 py-2 text-sm w-full"
        >
          <option value="14px">Small (14px)</option>
          <option value="16px">Normal (16px)</option>
          <option value="18px">Large (18px)</option>
          <option value="20px">Extra Large (20px)</option>
        </select>
      </div>

      <div className="pt-4 flex gap-3">
        <button 
          onClick={handleSave} 
          disabled={loading}
          className="flex-1 bg-primary text-white font-bold py-2 rounded transition-colors hover:brightness-110"
        >
          {loading ? "Saving..." : "Apply Changes"}
        </button>
        <button 
          onClick={() => router.push("/dashboard")} 
          className="flex-1 bg-cardBorder text-foreground font-bold py-2 rounded transition-colors hover:bg-cardBorder/80"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
