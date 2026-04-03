import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import "./globals.css";
import { createClient } from "@/core/supabase/server";
import I18nProvider from "@/core/i18n/I18nProvider";
import { cn } from "@/lib/utils";
import { AngezProvider } from "@/context/AngezContext";
import NavBar from "@/components/ui/NavBar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cairo = Cairo({ subsets: ["arabic"], variable: "--font-cairo", display: "swap" });

export const metadata: Metadata = {
  title: "Angez | Life RPG",
  description: "Level up your life. The gamified productivity engine.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  let themeStyle = {};
  if (session) {
    const { data: theme } = await supabase
      .from("theme")
      .select("*")
      .eq("user_id", session.user.id)
      .single();
    if (theme) {
      themeStyle = {
        "--primary-color": theme.primary_color,
        "--accent-color":  theme.accent_color,
        "--background":    theme.background,
        fontSize:          theme.font_size,
      } as React.CSSProperties;
    }
  }

  return (
    <html lang="en" className={cn("ltr", inter.variable, cairo.variable)}>
      <body className={cn(inter.className, "bg-brand-black")}>
        <AngezProvider>
          <div className="flex">
            <NavBar />
            <main className="flex-1 lg:ml-64 min-h-screen relative overflow-x-hidden">
              <I18nProvider>
                {children}
              </I18nProvider>
            </main>
          </div>
        </AngezProvider>
      </body>
    </html>
  );
}
