import { redirect } from "next/navigation";
import { createClient } from "@/core/supabase/server";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  // Fetch Current Theme
  const { data: theme } = await supabase
    .from("theme")
    .select("*")
    .eq("user_id", session.user.id)
    .single();

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto relative pt-12">
        <h1 className="text-2xl font-bold mb-6 text-foreground/90">Customization</h1>
        <SettingsForm initialTheme={theme} userId={session.user.id} />
      </div>
    </div>
  );
}
