"use client";

import { useEffect, useRef } from "react";
import { useGameStore } from "@/store/gameStore";

/**
 * Triggers Zustand persist rehydration safely on the client only.
 * Mount this once near the top of the app (inside I18nProvider or layout body).
 * This avoids the SSR crash from reading localStorage during server render.
 */
export function StoreHydrator() {
  const hydrated = useRef(false);

  useEffect(() => {
    if (!hydrated.current) {
      hydrated.current = true;
      // Trigger manual rehydration from localStorage
      useGameStore.persist.rehydrate();
    }
  }, []);

  return null;
}
