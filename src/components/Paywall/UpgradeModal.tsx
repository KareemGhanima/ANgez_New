"use client";

import { useState } from "react";
import { createClient } from "@/core/supabase/client";
import { X, UploadCloud, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function UpgradeModal({ onClose }: { onClose: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [transactionId, setTransactionId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const { t } = useTranslation();

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a screenshot to upload.");
      return;
    }
    setUploading(true);
    setError(null);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // 1. Upload file to Supabase Storage
    const fileExt = file.name.split(".").pop();
    const fileName = `${session.user.id}_${Date.now()}.${fileExt}`;
    
    // Note: The storage bucket 'receipts' needs to exist in Supabase.
    // If it fails, fallback gracefully or inform the user.
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("receipts")
      .upload(fileName, file);

    if (uploadError) {
      setError("Failed to upload screenshot: " + uploadError.message);
      setUploading(false);
      return;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage.from("receipts").getPublicUrl(fileName);

    // 2. Insert into payment_requests table
    const { error: insertError } = await supabase
      .from("payment_requests")
      .insert({
        user_id: session.user.id,
        transaction_id: transactionId,
        screenshot_url: publicUrl,
        status: "pending"
      });

    setUploading(false);

    if (insertError) {
      setError("Failed to submit request.");
    } else {
      setSuccess(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="glass-panel w-full max-w-md relative p-6 border-yellow-500/50 shadow-[0_0_40px_rgba(251,191,36,0.15)]">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mb-4 neon-yellow">
            <span className="text-3xl text-white">🔒</span>
          </div>
          <h2 className="font-orbitron text-xl font-bold text-yellow-400 mb-2 uppercase tracking-widest">
            {t("paywall.upgrade_now")}
          </h2>
          <p className="text-sm text-slate-300">{t("paywall.unlock_features")}</p>
        </div>

        {success ? (
          <div className="text-center p-6 bg-green-500/10 border border-green-500/30 rounded-xl">
            <CheckCircle className="mx-auto text-green-400 mb-2" size={32} />
            <h3 className="font-bold text-green-400">Request Submitted!</h3>
            <p className="text-sm text-slate-400 mt-2">{t("paywall.pending")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-center">
              <p className="text-xs text-slate-400 mb-2 uppercase tracking-wider">{t("paywall.scan_qr")}</p>
              {/* Dynamic QR code fetched from Supabase Storage */}
              <div className="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center p-2 mb-2">
                 <img 
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/assets/global_qr.png?t=${Date.now()}`} 
                    alt="InstaPay QR" 
                    className="w-full h-full object-contain"
                    onError={(e: any) => { e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg'; }} 
                 />
              </div>
              <p className="text-xs font-bold text-yellow-400">InstaPay Address: <span className="text-white select-all">OWNER_PAY_ID</span></p>
            </div>

            {error && <div className="text-red-400 text-sm text-center bg-red-900/20 py-2 rounded">{error}</div>}

            <div>
               <label className="block text-xs font-bold text-slate-400 uppercase mb-1">{t("paywall.transaction_id")}</label>
               <input 
                 type="text" 
                 placeholder="Optional: Enter Reference Number"
                 value={transactionId}
                 onChange={(e) => setTransactionId(e.target.value)}
                 className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:border-yellow-500 focus:outline-none"
               />
            </div>

            <div>
               <label className="block text-xs font-bold text-slate-400 uppercase mb-1">{t("paywall.upload_screenshot")} *</label>
               <label className="flex flex-col items-center justify-center w-full h-24 bg-slate-900 border-2 border-dashed border-slate-700 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors">
                 <div className="flex flex-col items-center justify-center pt-5 pb-6">
                   <UploadCloud size={24} className="text-slate-400 mb-2" />
                   <p className="text-xs text-slate-400">{file ? file.name : "Click to upload your receipt"}</p>
                 </div>
                 <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                       setFile(e.target.files[0]);
                    }
                 }} />
               </label>
            </div>

            <button
               onClick={handleUpload}
               disabled={uploading || !file}
               className="w-full py-3 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-orbitron font-bold uppercase tracking-widest hover:from-yellow-400 hover:to-yellow-500 disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(251,191,36,0.3)]"
            >
               {uploading ? "Submitting..." : t("paywall.submit")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
