import MissionsSystem from "@/components/Missions/MissionsSystem";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Angez | Daily Missions",
  description: "View, accept, and complete your daily missions to level up your character.",
};

export default function MissionsPage() {
  return <MissionsSystem />;
}
