import { useMemo } from "react";
import { communes } from "../data/communes";
import {
  formatDateFr,
  getProchaineDateCollecte,
} from "../lib/collecte";
import { getCommuneFromPath } from "../lib/navigation";

export function useCommuneFromUrl(): string | null {
  return useMemo(() => {
    return getCommuneFromPath(window.location.pathname);
  }, []);
}

export function useNextCollectionDate(communeNom: string | null): string {
  return useMemo(() => {
    if (!communeNom) {
      return "";
    }

    const commune = communes.find((item) => item.nom === communeNom);

    if (!commune?.premierJourCollecte) {
      return "Aucune date";
    }

    const prochaineCollecte = getProchaineDateCollecte(
      commune.premierJourCollecte
    );

    return prochaineCollecte
      ? formatDateFr(prochaineCollecte)
      : "Aucune date";
  }, [communeNom]);
}