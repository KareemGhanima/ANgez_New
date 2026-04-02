"use client";

import { useState } from "react";
import { createClient } from "@/core/supabase/client";
import { QrCode, UploadCloud, CheckCircle } from "lucide-react";

export default function QRManager() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  
  // Predict URL format (adjust depending on how bucket is setup)
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const currentQRUrl = `${envUrl}/storage/v1/object/public/assets/global_qr.png`;

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    setSuccess(false);

    // Upsert acts as a replace for the existing file so it overrides the same URL
    const { error: uploadError } = await supabase.storage
      .from("assets")
      .upload("global_qr.png", file, { upsert: true, cacheControl: "0" });

    setUploading(false);

    if (uploadError) {
      setError("Failed to update QR: " + uploadError.message);
    } else {
      setSuccess(true);
      setFile(null);
    }
  };

  return (
    <div className="glass-panel p-6">
      <h2 className="font-orbitron text-xl font-bold text-slate-300 mb-4 flex items-center gap-2 uppercase tracking-widest">
        <QrCode /> Global InstaPay QR
      </h2>

      <div className="mb-4">
         <p className="text-xs text-slate-400 mb-2">Current QR (Public Facing):</p>
         <div className="bg-white p-2 rounded w-24 h-24 mx-auto">
             {/* Bypass cache to show latest if successfully uploaded */}
             <img src={`${currentQRUrl}?t=${Date.now()}`} alt="Current Global QR" 
                  className="w-full h-full object-contain"
                  onError={(e) => { e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg'; }} />
         </div>
      </div>

      <div className="space-y-4">
         <label className="flex flex-col items-center justify-center w-full h-20 bg-slate-900 border-2 border-dashed border-slate-700 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors">
            <div className="flex flex-col items-center justify-center">
              <UploadCloud size={20} className="text-slate-400 mb-1" />
              <p className="text-[10px] text-slate-400">{file ? file.name : "Select new QR Code PNG"}</p>
            </div>
            <input type="file" className="hidden" accept="image/png, image/jpeg" onChange={(e) => {
               if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
            }} />
         </label>

         {error && <div className="text-xs text-red-400 bg-red-900/20 p-2 rounded">{error}</div>}
         {success && <div className="text-xs text-green-400 bg-green-500/20 p-2 rounded flex items-center gap-1"><CheckCircle size={14}/> Updated across network!</div>}

         <button
            onClick={handleUpload}
            disabled={uploading || !file}
            className="w-full py-2 bg-slate-800 border border-slate-600 rounded text-xs uppercase tracking-widest font-bold hover:bg-slate-700 disabled:opacity-50"
         >
            {uploading ? "Broadcasting..." : "Deploy New QR"}
         </button>
      </div>
    </div>
  );
}
