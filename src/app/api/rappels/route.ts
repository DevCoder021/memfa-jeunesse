import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Récupérer l'historique des rappels
export async function GET() {
  try {
    const logs = await db.rappelLog.findMany({
      include: {
        activite: {
          select: { nom: true, lieu: true }
        }
      },
      orderBy: {
        envoyeLe: 'desc'
      },
      take: 50 // Les 50 derniers
    });
    return NextResponse.json(logs);
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// Sauvegarder un rappel envoyé
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const log = await db.rappelLog.create({
      data: {  // ← Ici c'est "data:" pas juste "{"
        activiteId: body.activiteId,
        joursRestants: body.joursRestants,
        message: body.message,
        mode: body.mode || 'manuel',
      },
    });
    
    return NextResponse.json(log);
  } catch (error) {
    console.error('Erreur sauvegarde rappel:', error);
    return NextResponse.json({ error: 'Erreur lors de la sauvegarde' }, { status: 500 });
  }
}