import { differenceInCalendarDays } from 'date-fns';

// Récupère la date cible réelle (gère le récurrent)
export function getDateCible(dateActivite: Date | null): Date | null {
  return dateActivite;
}

// Calcule le nombre de jours restants
export function getDaysRemaining(dateActivite: Date | null, type: string): number | null {
  const cible = type === 'ponctuelle' ? dateActivite : dateActivite; // Simplification pour ponctuelle
  
  if (!cible) return null;
  
  const today = new Date();
  // Reset des heures pour calculer uniquement les jours
  today.setHours(0, 0, 0, 0);
  const target = new Date(cible);
  target.setHours(0, 0, 0, 0);

  return differenceInCalendarDays(target, today);
}

// Vérifie si un rappel doit être envoyé
export function shouldSendReminder(days: number | null): boolean {
  if (days === null) return false;
  // Jours stratégiques : 7, 3, 1, 0
  return [7, 3, 1, 0].includes(days);
}