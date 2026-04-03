import ArmorySystem from "@/components/Armory/ArmorySystem";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Angez | Hero Armory",
  description: "Equip items to boost your stats and customize your loadout.",
};

export default function ArmoryPage() {
  return <ArmorySystem />;
}
