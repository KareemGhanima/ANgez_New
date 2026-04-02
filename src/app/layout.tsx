import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { createClient } from "@/core/supabase/server";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Angez | Gamified Productivity",
  description: "Level up your life with gamified productivity.",
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
        "--accent-color": theme.accent_color,
        "--background": theme.background,
        fontSize: theme.font_size, // this will scale rems
      } as React.CSSProperties;
    }
  }

  return (
    <html lang="en">
      <body className={inter.className} style={themeStyle}>
        {children}
      </body>
    </html>
  );
}
