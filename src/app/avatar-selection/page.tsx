import AvatarSelection from "@/components/Onboarding/AvatarSelection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Angez | Choose Your Class",
  description: "Select your hero class. Your class defines your starting stats and unlocks specialized quests.",
};

export default function AvatarSelectionPage() {
  return <AvatarSelection />;
}
