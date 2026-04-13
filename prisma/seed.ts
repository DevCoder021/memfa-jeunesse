import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Démarrage du seed...');

  // Créer l'utilisateur admin
  const hashedPassword = await bcrypt.hash('memfa2026', 10);
  
  await prisma.user.upsert({
    where: { email: 'admin@memfa.ci' },
    update: {},
    create: {
      nom: 'Administrateur',
      email: 'admin@memfa.ci',
      password: hashedPassword,
      role: 'admin',
    },
  });
  console.log('✅ Utilisateur admin créé');

  // Activités du plan annuel 2026
  const activites = [
    {
      nom: 'Rencontre bureau avec le Révérend',
      type: 'ponctuelle',
      dateActivite: new Date('2026-03-15T10:00:00'),
      heure: '10:00',
      lieu: 'Bureau du Révérend, temple MEMFA',
      objectif: 'Planification des activités du trimestre',
      participants: 'Membres du bureau et le Révérend',
      preparation: '2 semaines',
      statut: 'a_venir',
    },
    {
      nom: 'Veillées de prière',
      type: 'ponctuelle',
      dateActivite: new Date('2026-03-20T20:00:00'),
      heure: '20:00',
      lieu: 'Au temple MEMFA',
      objectif: 'Prière et intercession pour la jeunesse',
      participants: 'Toute la jeunesse',
      preparation: '1 mois',
      statut: 'a_venir',
    },
    {
      nom: 'Sortie détente — Lundi de Pâques (Moyekro)',
      type: 'ponctuelle',
      dateActivite: new Date('2026-04-06T08:00:00'),
      heure: '08:00',
      lieu: 'Moyekro',
      objectif: 'Détente et fraternité',
      participants: 'Toute la jeunesse',
      preparation: '2 mois',
      statut: 'a_venir',
    },
    {
      nom: "Veillées d'intercession",
      type: 'ponctuelle',
      dateActivite: new Date('2026-05-01T20:00:00'),
      heure: '20:00',
      lieu: 'Temple MEMFA',
      objectif: "Veillée d'intercession pour la nation",
      participants: 'Toute la jeunesse',
      preparation: 'Indéterminé',
      statut: 'a_venir',
    },
    {
      nom: 'Conférence sur le mariage',
      type: 'ponctuelle',
      dateActivite: new Date('2026-05-14T14:00:00'),
      heure: '14:00',
      lieu: 'Temple MEMFA',
      objectif: 'Enseignement sur le mariage chrétien',
      participants: 'Toute la jeunesse et les jeunes couples',
      preparation: '3 mois',
      statut: 'a_venir',
    },
    {
      nom: 'Sortie détente — Basilique de Yamoussoukro',
      type: 'ponctuelle',
      dateActivite: new Date('2026-05-25T07:00:00'),
      heure: '07:00',
      lieu: 'Basilique de Yamoussoukro',
      objectif: 'Pèlerinage et détente',
      participants: 'Toute la jeunesse',
      preparation: '2 mois',
      statut: 'a_venir',
    },
    {
      nom: 'Prière du bureau de la jeunesse',
      type: 'ponctuelle',
      dateActivite: new Date('2026-06-15T18:00:00'),
      heure: '18:00',
      lieu: 'Temple MEMFA',
      objectif: 'Prière et coordination',
      participants: 'Membres du bureau',
      preparation: '1 mois',
      statut: 'a_venir',
    },
    {
      nom: 'Conférence sur l\'équilibre de vie chrétienne',
      type: 'ponctuelle',
      dateActivite: new Date('2026-08-15T14:00:00'),
      heure: '14:00',
      lieu: 'Temple MEMFA',
      objectif: 'Enseignement sur l\'équilibre spirituel',
      participants: 'Toute la jeunesse',
      preparation: '2 mois',
      statut: 'a_venir',
    },
    {
      nom: 'Réunion mensuelle de la jeunesse',
      type: 'recurring-2nd-sunday',
      dateActivite: null,
      heure: '10:00',
      lieu: 'Temple MEMFA',
      objectif: 'Réunion mensuelle régulière',
      participants: 'Toute la jeunesse',
      preparation: '1 mois',
      statut: 'a_venir',
    },
    {
      nom: 'Prière de la jeunesse (18h)',
      type: 'recurring-2nd-saturday',
      dateActivite: null,
      heure: '18:00',
      lieu: 'Temple MEMFA',
      objectif: 'Prière bi-mensuelle',
      participants: 'Tous les jeunes',
      preparation: '1 mois',
      statut: 'a_venir',
    },
  ];

  for (const activite of activites) {
    await prisma.activite.create({
      data: activite,
    });
  }
  console.log('✅ 10 activités créées');

  console.log('🎉 Seed terminé avec succès !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });