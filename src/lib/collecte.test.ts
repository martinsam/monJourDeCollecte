import { describe, expect, it } from "vitest";
import {
  parseDate,
  formatDateIso,
  formatDateFr,
  genererDatesCollecte,
  getProchaineDateCollecte,
} from "./collecte";

describe("collecte", () => {
  it("parse une date ISO yyyy-mm-dd", () => {
    const date = parseDate("2026-06-02");

    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(5); // juin = 5 en JS
    expect(date.getDate()).toBe(2);
  });

  it("formate une date au format ISO", () => {
    const date = new Date(2026, 5, 2);

    expect(formatDateIso(date)).toBe("2026-06-02");
  });

  it("formate une date en français", () => {
    const date = new Date(2026, 5, 2);

    expect(formatDateFr(date)).toBe("Mardi 2 juin");
  });

  it("génère des collectes tous les 14 jours", () => {
    const dates = genererDatesCollecte("2026-06-02");

    expect(formatDateIso(dates[0])).toBe("2026-06-02");
    expect(formatDateIso(dates[1])).toBe("2026-06-16");
    expect(formatDateIso(dates[2])).toBe("2026-06-30");
  });

  it("génère les collectes jusqu'à la fin de l'année", () => {
    const dates = genererDatesCollecte("2026-12-01");

    expect(dates.map(formatDateIso)).toEqual([
      "2026-12-01",
      "2026-12-15",
      "2026-12-29",
    ]);
  });

  it("retourne la prochaine collecte après aujourd'hui", () => {
    const prochaine = getProchaineDateCollecte(
      "2026-06-02",
      new Date(2026, 5, 10)
    );

    expect(prochaine).not.toBeNull();
    expect(formatDateIso(prochaine!)).toBe("2026-06-16");
  });

  it("retourne la collecte du jour si elle tombe aujourd'hui", () => {
    const prochaine = getProchaineDateCollecte(
      "2026-06-02",
      new Date(2026, 5, 2)
    );

    expect(prochaine).not.toBeNull();
    expect(formatDateIso(prochaine!)).toBe("2026-06-02");
  });

  it("retourne null s'il n'y a plus de collecte dans l'année", () => {
    const prochaine = getProchaineDateCollecte(
      "2026-01-01",
      new Date(2027, 0, 1)
    );

    expect(prochaine).toBeNull();
  });

  it("décale la collecte d'un jour si un jour férié est présent avant dans la semaine", () => {
    // Mardi 14 juillet 2026 est férié.
    // Une collecte prévue jeudi 16 juillet est donc décalée au vendredi 17.
    const dates = genererDatesCollecte("2026-07-16");

    expect(formatDateIso(dates[0])).toBe("2026-07-17");
  });

  it("décale aussi la collecte si elle tombe directement un jour férié", () => {
    const dates = genererDatesCollecte("2026-05-01");

    expect(formatDateIso(dates[0])).toBe("2026-05-02");
  });
});