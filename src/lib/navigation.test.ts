import { describe, expect, it, beforeEach } from "vitest";
import {getCommuneFromPath, goToCommune, goToHome} from "./navigation";

describe("getCommuneFromPath", () => {
  it("retourne null pour la racine", () => {
    expect(getCommuneFromPath("/")).toBeNull();
  });

  it("retourne le nom de la commune", () => {
    expect(
      getCommuneFromPath("/PREVERANGES")
    ).toBe("PREVERANGES");
  });

  it("décode les espaces", () => {
    expect(
      getCommuneFromPath("/SAINT%20PIERRE")
    ).toBe("SAINT PIERRE");
  });

  it("décode les caractères accentués", () => {
    expect(
      getCommuneFromPath("/PR%C3%89VERANGES")
    ).toBe("PRÉVERANGES");
  });

  it("retourne une chaîne vide pour un pathname vide", () => {
    expect(
      getCommuneFromPath("")
    ).toBe("");
  });
});
