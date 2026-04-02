"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/core/supabase/client";
import { Check, X, Eye, Clock } from "lucide-react";

export default function PaymentManager() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const supabase = createClient();

  const fetchRequests = async () => {
    setLoading(true);
    // Join with users table to get emails/paths if possible. Let's do a simple fetch for now and assume users table is queryable block by RLS
    const { data, error } = await supabase
      .from("payment_requests")
      .select(`
        id,
        user_id,
        transaction_id,
        screenshot_url,
        status,
        created_at,
        users ( path )
      `)
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setRequests(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (requestId: string, userId: string, action: "approved" | "rejected") => {
    // 1. Update payment request status
    await supabase.from("payment_requests").update({ status: action }).eq("id", requestId);

    if (action === "approved") {
      // 2. Grant premium if approved
      await supabase.from("users").update({ subscription_status: true }).eq("id", userId);
    }

    // Update UI directly for snap response
    setRequests(prev => prev.filter(req => req.id !== requestId));
  };

  return (
    <div className="glass-panel p-6">
      <h2 className="font-orbitron text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2 uppercase tracking-widest">
        <Clock /> Pending Upgrades
      </h2>

      {loading ? (
        <div className="text-slate-400 animate-pulse text-sm">Scanning transaction vectors...</div>
      ) : requests.length === 0 ? (
        <div className="text-slate-500 text-sm">No pending payments. The frontier is quiet.</div>
      ) : (
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          {requests.map(req => (
            <div key={req.id} className="bg-slate-900 border border-slate-700/50 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between transition-hover hover:border-yellow-500/30">
               <div>
                  <div className="text-xs text-slate-500 mb-1">UID: <span className="font-mono text-[10px] text-slate-400">{req.user_id}</span></div>
                  <div className="text-sm text-yellow-300 font-mono tracking-widest">REF: {req.transaction_id || "NOT PROVIDED"}</div>
                  <div className="text-[10px] text-violet-400 uppercase mt-1">Class: {req.users?.path || "Unknown"}</div>
               </div>

               <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
                  <button 
                    onClick={() => setSelectedReceipt(req.screenshot_url)}
                    className="flex-1 sm:flex-none px-3 py-1.5 bg-slate-800 text-slate-300 text-xs font-bold rounded flex items-center justify-center gap-1 hover:bg-slate-700 border border-slate-600"
                  >
                     <Eye size={14} /> View Receipt
                  </button>
                  <button 
                    onClick={() => handleAction(req.id, req.user_id, "approved")}
                    className="flex-1 sm:flex-none px-3 py-1.5 bg-green-500/20 text-green-400 text-xs font-bold rounded flex items-center justify-center gap-1 hover:bg-green-500/30 border border-green-500/50"
                  >
                     <Check size={14} /> Approve
                  </button>
                  <button 
                     onClick={() => handleAction(req.id, req.user_id, "rejected")}
                    className="flex-1 sm:flex-none px-3 py-1.5 bg-red-500/20 text-red-400 text-xs font-bold rounded flex items-center justify-center gap-1 hover:bg-red-500/30 border border-red-500/50"
                  >
                     <X size={14} /> Reject
                  </button>
               </div>
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen Receipt Modal within Component */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4" onClick={() => setSelectedReceipt(null)}>
           <button className="absolute top-6 right-6 text-white bg-slate-800 p-2 rounded-full cursor-pointer hover:bg-slate-700">
             <X />
           </button>
           <img src={selectedReceipt} alt="Receipt" className="max-w-full max-h-[90vh] object-contain rounded border-2 border-slate-700 shadow-2xl" />
        </div>
      )}
    </div>
  );
}
