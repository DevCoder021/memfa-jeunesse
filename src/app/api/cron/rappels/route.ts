import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { genererMessageWhatsApp } from '@/lib/messages';
import { getDaysRemaining } from '@/lib/dates';

export async function GET() {
  try {
    const activites = await db.activite.findMany({
      where: { statut: 'a_venir' },
    });

    let nouveauxRappels = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const act of activites) {
      const jours = getDaysRemaining(act.dateActivite, act.type);

      if (jours !== null && [7, 3, 1, 0].includes(jours)) {
        const exists = await db.rappelLog.findFirst({
          where: {
            activiteId: act.id,
            joursRestants: jours,
            envoyeLe: { gte: today },
          },
        });

        if (!exists) {
          const message = genererMessageWhatsApp(act, jours);

          await db.rappelLog.create({
            data: {
              activiteId: act.id,
              joursRestants: jours,
              message,
              mode: 'auto',
            },
          });
          nouveauxRappels++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Succès : ${nouveauxRappels} nouveaux rappels préparés.`,
    });
  } catch (error) {
    console.error('ERREUR CRON:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur interne lors du traitement des rappels.',
      },
      { status: 500 }
    );
  }
}
