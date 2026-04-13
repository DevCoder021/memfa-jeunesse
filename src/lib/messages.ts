import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ActiviteMessage {
  nom: string;
  dateActivite: string | Date | null;
  heure?: string | null;
  lieu: string;
  participants: string;
}

export function genererMessageWhatsApp(activite: ActiviteMessage, joursRestants: number | null): string {
  // Formatage de la date en français
  const dateFormat = activite.dateActivite 
    ? format(new Date(activite.dateActivite), "EEEE dd MMMM yyyy", { locale: fr })
    : "Date à confirmer";

  // Formatage de l'heure
  const heureFormat = activite.heure || "À préciser";

  // Message d'introduction selon l'urgence
  let introduction = "";
  if (joursRestants === 7) {
    introduction = "RAPPEL — 7 JOURS AVANT L'ACTIVITÉ\n\n";
  } else if (joursRestants && joursRestants >= 3 && joursRestants <= 6) {
    introduction = `RAPPEL — J-${joursRestants}\n\n`;
  } else if (joursRestants && joursRestants >= 1 && joursRestants <= 2) {
    introduction = `RAPPEL URGENT — J-${joursRestants}\n\n`;
  } else if (joursRestants === 0) {
    introduction = "C'EST AUJOURD'HUI !\n\n";
  }

  // Construction du message principal
  const message = `${introduction}Activité : ${activite.nom}
Date : ${dateFormat}
Heure : ${heureFormat}
Lieu : ${activite.lieu}

Participants concernés : ${activite.participants}

Nous vous prions de bien vouloir vous préparer et de confirmer votre présence.

Pour toute information complémentaire, veuillez contacter le bureau de la jeunesse.

─────────────────────
Mission Évangélique Maranatha
Foi et Action (MEMFA)
Département de la Jeunesse`;

  return message;
}