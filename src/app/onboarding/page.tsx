import HeroJourney from "@/components/Onboarding/HeroJourney";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Angez | Hero's Journey",
};

export default function OnboardingPage() {
  return <HeroJourney />;
}
