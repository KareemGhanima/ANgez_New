"use client";

import { useState } from "react";
import { createClient } from "@/core/supabase/client";
import { X, UploadCloud, CheckCircle, Shield, Zap } from "lucide-react";
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
      setError("UPLOAD FAILED: No visual data provided.");
      return;
    }
    setUploading(true);
    setError(null);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const fileExt = file.name.split(".").pop();
    const fileName = `${session.user.id}_${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from("receipts")
      .upload(fileName, file);

    if (uploadError) {
      setError("TRANSMISSION ERROR: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from("receipts").getPublicUrl(fileName);

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
      setError("PACKET LOST: Failed to route clearance request.");
    } else {
      setSuccess(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300 font-orbitron">
      <div className="bg-brand-dark/95 border-2 border-neon-gold w-full max-w-md relative p-6 shadow-shield drop-shadow-[0_0_50px_rgba(255,215,0,0.2)] rounded-lg overflow-hidden">
        
        {/* Holographic background traces */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-neon-gold/10 blur-[50px] -z-10 rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-neon-cyan/10 blur-[50px] -z-10 rounded-full"></div>

        <button onClick={onClose} className="absolute top-4 right-4 text-neon-gold/50 hover:text-neon-gold transition-colors z-20">
          <X size={24} />
        </button>

        <div className="text-center mb-6 relative z-10">
          <div className="w-16 h-16 mx-auto bg-brand-black border border-neon-gold shadow-[0_0_20px_rgba(255,215,0,0.4)] rounded-full flex items-center justify-center mb-4">
            <Shield size={32} className="text-neon-gold drop-shadow-md" />
          </div>
          <h2 className="text-xl font-black text-neon-gold mb-1 uppercase tracking-widest drop-shadow-[0_0_5px_rgba(255,215,0,0.8)]">
            OVERRIDE PROTOCOL
          </h2>
          <p className="text-[10px] text-neon-cyan/70 font-bold tracking-[0.2em] uppercase">Authenticate to unlock subsystem</p>
        </div>

        {success ? (
          <div className="text-center p-6 bg-neon-green/10 border border-neon-green rounded-xl shadow-[0_0_15px_rgba(57,255,20,0.2)]">
            <CheckCircle className="mx-auto text-neon-green mb-3 drop-shadow-[0_0_8px_rgba(57,255,20,0.8)]" size={40} />
            <h3 className="font-black text-neon-green uppercase tracking-widest mb-1">Clearance Requested</h3>
            <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">{t("paywall.pending", "Awaiting admin confirmation...")}</p>
          </div>
        ) : (
          <div className="space-y-5 relative z-10">
            {/* Dynamic QR Display */}
            <div className="bg-[#050A14] border border-cardBorder rounded-lg p-4 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-neon-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <p className="text-[10px] text-neon-cyan font-bold mb-3 uppercase tracking-widest flex items-center justify-center gap-1">
                 <Zap size={12} /> Scan Target Array <Zap size={12} />
              </p>
              <div className="w-48 h-48 mx-auto bg-white rounded flex items-center justify-center p-2 mb-3 shadow-[0_0_20px_rgba(0,255,255,0.4)]">
                 <img 
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/assets/global_qr.png?t=${Date.now()}`} 
                    alt="InstaPay QR" 
                    className="w-full h-full object-contain"
                    onError={(e: any) => { e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg'; }} 
                 />
              </div>
              <p className="text-[10px] font-bold text-neon-gold uppercase tracking-widest">Target Wallet: <span className="text-white select-all">OWNER_PAY_ID</span></p>
            </div>

            {error && <div className="text-red-400 text-[10px] font-bold uppercase tracking-widest text-center bg-red-500/10 border border-red-500 py-2 rounded shadow-[0_0_10px_rgba(239,68,68,0.4)]">{error}</div>}

            <div>
               <label className="block text-[10px] font-bold text-neon-cyan uppercase mb-1 tracking-widest">TRANSACTION HASH (Optional)</label>
               <input 
                 type="text" 
                 placeholder="0x..."
                 value={transactionId}
                 onChange={(e) => setTransactionId(e.target.value)}
                 className="w-full bg-[#050A14] border border-cardBorder rounded px-3 py-3 text-xs text-neon-cyan placeholder-slate-600 focus:border-neon-cyan focus:outline-none focus:shadow-[0_0_10px_rgba(0,255,255,0.3)] transition-all"
               />
            </div>

            <div>
               <label className="block text-[10px] font-bold text-neon-cyan uppercase mb-1 tracking-widest">UPLOAD RECEIPT *</label>
               <label className="flex flex-col items-center justify-center w-full h-20 bg-[#050A14] border border-dashed border-cardBorder hover:border-neon-cyan rounded cursor-pointer transition-colors group">
                 <div className="flex flex-col items-center justify-center pt-2 pb-2">
                   <UploadCloud size={20} className="text-slate-500 group-hover:text-neon-cyan transition-colors mb-1" />
                   <p className="text-[10px] text-slate-500 group-hover:text-neon-cyan transition-colors uppercase tracking-widest">{file ? file.name : "Select Image Data"}</p>
                 </div>
                 <input type="file" className="hidden" accept="image/*" onChange={(e: any) => {
                    if (e.target.files && e.target.files[0]) {
                       setFile(e.target.files[0]);
                    }
                 }} />
               </label>
            </div>

            <button
               onClick={handleUpload}
               disabled={uploading || !file}
               className="w-full py-3 bg-neon-gold text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-yellow-400 disabled:opacity-50 transition-all shadow-[0_0_20px_rgba(255,215,0,0.6)] hover:shadow-[0_0_30px_rgba(255,215,0,0.9)]"
            >
               {uploading ? "TRANSMITTING..." : "INITIATE OVERRIDE"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
