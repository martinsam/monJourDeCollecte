import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { communes } from "./data/communes";
import { subscribeToPush } from "./lib/push";

//const DEFAULT_COMMUNE = "PREVERANGES";

console.log(import.meta.env.VITE_VAPID_PUBLIC_KEY);


function formatDateFr(date: Date): string {
  const dateFormatee = date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return dateFormatee.charAt(0).toUpperCase() + dateFormatee.slice(1);
}

function ajouterJours(date: Date, jours: number): Date {
  const nouvelleDate = new Date(date);
  nouvelleDate.setDate(nouvelleDate.getDate() + jours);
  return nouvelleDate;
}

function getProchaineDateCollecte(premierJourCollecte: string): Date | null {
  const aujourdHui = new Date();
  aujourdHui.setHours(0, 0, 0, 0);

  let dateCollecte = new Date(premierJourCollecte);
  dateCollecte.setHours(0, 0, 0, 0);

  if (Number.isNaN(dateCollecte.getTime())) {
    return null;
  }

  while (dateCollecte < aujourdHui) {
    dateCollecte = ajouterJours(dateCollecte, 14);
  }

  return dateCollecte;
}

function getCommuneFromPath(): string | null {
  const pathname = window.location.pathname;

  if (pathname === "/") {
    return null;
  }

  return decodeURIComponent(pathname.replace("/", ""));
}

function App() {
  const communeDepuisUrl = useMemo(() => getCommuneFromPath(), []);

  const [communeChoisie, setCommuneChoisie] = useState("");
  const [prochaineDate, setProchaineDate] = useState("");

  useEffect(() => {
    if (!communeDepuisUrl) {
      return;
    }

    const commune = communes.find(
      (item) => item.nom === communeDepuisUrl
    );

    if (!commune?.premierJourCollecte) {
      setProchaineDate("Aucune date");
      return;
    }

    const prochaineCollecte = getProchaineDateCollecte(
      commune.premierJourCollecte
    );

    setProchaineDate(
      prochaineCollecte
        ? formatDateFr(prochaineCollecte)
        : "Aucune date"
    );
  }, [communeDepuisUrl]);

  function accederJourCollecte() {
    const commune = communes.find(
      (item) => item.nom === communeChoisie
    );

    if (!commune) {
      alert("Merci de choisir une commune dans la liste.");
      return;
    }

    window.location.href = `/${encodeURIComponent(commune.nom)}`;
  }

  // async function testerNotification() {
  //   if (!("serviceWorker" in navigator)) {
  //     alert("Service worker non supporté.");
  //     return;
  //   }

  //   if (!("Notification" in window)) {
  //     alert("Notifications non supportées.");
  //     return;
  //   }

  //   const permission = await Notification.requestPermission();

  //   if (permission !== "granted") {
  //     alert("Permission refusée.");
  //     return;
  //   }

  //   const registration = await navigator.serviceWorker.register("/sw.js");

  //   await registration.showNotification("Prochain passage", {
  //     body: `Collecte prévue : ${prochaineDate}. Pensez à sortir votre bac.`,
  //     icon: "/vite.svg",
  //     badge: "/vite.svg",
  //   });
  // }

  if (communeDepuisUrl) {
    return (
      <main className="app">
        <section className="card">
          <p className="label">Prochain passage à {communeDepuisUrl}</p>

          <h1>{prochaineDate}</h1>

          <p className="description">
            Pensez à sortir votre bac la veille au soir.
          </p>

          {/* <button onClick={testerNotification}>
            Tester la notification
          </button> */}

          <button onClick={() => (window.location.href = "/")}>
            Changer de commune
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="app">
      <section className="card">
        <p className="label">CollecteInfo</p>

            <button onClick={subscribeToPush}>
    Activer notifications
    </button>

        <h1>Choisir une commune</h1>

        <div className="commune-form">

  <label
    htmlFor="commune-input"
    className="commune-label"
  >
    Votre commune
  </label>

  <input
    id="commune-input"
    className="commune-input"
    list="communes"
    value={communeChoisie}
    onChange={(event) =>
      setCommuneChoisie(event.target.value)
    }
    placeholder="Ex : PREVERANGES"
  />

  <datalist id="communes">
    {communes.map((commune) => (
      <option
        key={commune.nom}
        value={commune.nom}
      />
    ))}
  </datalist>

  <button
    className="commune-button"
    onClick={accederJourCollecte}
  >
    Accéder au jour de collecte
  </button>

</div>
      </section>
    </main>
  );
}

export default App;