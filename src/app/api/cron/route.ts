import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { genererMessageWhatsApp } from '@/lib/messages';
import { getDaysRemaining } from '@/lib/dates'; // Assure-toi que ce fichier existe

export async function GET() {
  try {
    // 1. Récupérer les activités à venir
    const activites = await db.activite.findMany({
      where: { statut: 'a_venir' },
    });

    let nouveauxRappels = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 2. Vérifier chaque activité
    for (const act of activites) {
      // Calculer les jours restants
      const jours = getDaysRemaining(act.dateActivite, act.type);

      // On s'intéresse aux rappels stratégiques : 7, 3, 1, 0 jours
      if (jours !== null && [7, 3, 1, 0].includes(jours)) {
        
        // Vérifier si on a déjà généré ce rappel aujourd'hui
        const exists = await db.rappelLog.findFirst({
          where: {
            activiteId: act.id,
            joursRestants: jours,
            envoyeLe: { gte: today }
          }
        });

        // Si pas encore fait, on le crée
        if (!exists) {
          const message = genererMessageWhatsApp(act, jours);
          
          await db.rappelLog.create({
            data: {
              activiteId: act.id,
              joursRestants: jours,
              message: message,
              mode: 'auto' // Marqué comme automatique
            }
          });
          nouveauxRappels++;
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Succès : ${nouveauxRappels} nouveaux rappels préparés.` 
    });

  } catch (error) {
    console.error('ERREUR CRON:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Erreur interne lors du traitement des rappels.' 
    }, { status: 500 });
  }
}