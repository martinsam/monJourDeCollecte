function createDate(year: number, month: number, day: number): Date {
  return new Date(year, month - 1, day);
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function isSameOrAfter(date: Date, reference: Date): boolean {
  return date.getTime() >= reference.getTime();
}

function isSameOrBefore(date: Date, reference: Date): boolean {
  return date.getTime() <= reference.getTime();
}

export function parseDate(date: string): Date {
  const [year, month, day] = date.split("-").map(Number);
  return createDate(year, month, day);
}

export function formatDateIso(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function formatDateFr(date: Date): string {
  let formatted = date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function joursFeries(year: number): Date[] {
  return [
    createDate(year, 1, 1),   // Jour de l'an
    createDate(year, 4, 6),   // Lundi de Pâques 2026
    createDate(year, 5, 1),   // Fête du travail
    createDate(year, 5, 8),   // Victoire 1945
    createDate(year, 5, 14),  // Ascension 2026
    createDate(year, 5, 25),  // Lundi de Pentecôte 2026
    createDate(year, 7, 14),  // Fête nationale
    createDate(year, 8, 15),  // Assomption
    createDate(year, 11, 1),  // Toussaint
    createDate(year, 11, 11), // Armistice
    createDate(year, 12, 25), // Noël
  ];
}

function lundiDeLaSemaine(date: Date): Date {
  const day = date.getDay();

  const decalage = day === 0 ? 6 : day - 1;

  return addDays(date, -decalage);
}

function corrigerSiJourFerieAvantDansSemaine(dateCollecte: Date): Date {
  const lundi = lundiDeLaSemaine(dateCollecte);
  const feries = joursFeries(dateCollecte.getFullYear());

  const doitDecaler = feries.some((jourFerie) => {
    return (
      isSameOrAfter(jourFerie, lundi) &&
      isSameOrBefore(jourFerie, dateCollecte)
    );
  });

  if (doitDecaler) {
    return addDays(dateCollecte, 1);
  }

  return dateCollecte;
}

export function genererDatesCollecte(premierJourCollecte: string): Date[] {
  const premierJour = parseDate(premierJourCollecte);
  const finAnnee = createDate(premierJour.getFullYear(), 12, 31);

  const dates: Date[] = [];

  let current = premierJour;

  while (isSameOrBefore(current, finAnnee)) {
    const dateCorrigee = corrigerSiJourFerieAvantDansSemaine(current);

    dates.push(dateCorrigee);

    current = addDays(current, 14);
  }

  return dates;
}

export function getProchaineDateCollecte(
  premierJourCollecte: string,
  dateDuJour = new Date()
): Date | null {
  const dates = genererDatesCollecte(premierJourCollecte);

  const aujourdHui = createDate(
    dateDuJour.getFullYear(),
    dateDuJour.getMonth() + 1,
    dateDuJour.getDate()
  );

  return dates.find((date) => isSameOrAfter(date, aujourdHui)) ?? null;
}