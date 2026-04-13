export interface User {
  id: string;
  email: string;
  nom: string;
  role: string;
}

export interface Activite {
  id: number;
  nom: string;
  type: 'ponctuelle' | 'recurring-2nd-sunday' | 'recurring-2nd-saturday';
  dateActivite: Date | null;
  heure: string | null;
  lieu: string;
  objectif: string | null;
  participants: string;
  preparation: string | null;
  statut: 'a_venir' | 'terminee' | 'annulee';
  createdAt: Date;
  updatedAt: Date;
}

export interface RappelLog {
  id: number;
  activiteId: number;
  joursRestants: number;
  message: string;
  mode: 'auto' | 'manuel';
  envoyeLe: Date;
}

export type StatutBadge = {
  label: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
};

export type StatCards = {
  total: number;
  aVenir: number;
  cetteSemaine: number;
  urgentes: number;
  passees: number;
};