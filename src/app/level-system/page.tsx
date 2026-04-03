import LevelSystem from "@/components/Stats/LevelSystem";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Angez | Level System",
  description: "Track your character progress and level up.",
};

export default function LevelSystemPage() {
  return <LevelSystem />;
}
