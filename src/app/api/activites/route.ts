import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const activites = await db.activite.findMany({
      orderBy: { dateActivite: 'asc' },
    });
    return NextResponse.json(activites);
  } catch {
    return NextResponse.json({ error: 'Erreur lors de la récupération' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Gestion de la date (si vide ou invalide, on met null)
    const dateActivite = body.date ? new Date(body.date) : null;

    const nouvelleActivite = await db.activite.create({
      data: {
        nom: body.nom,
        type: body.type || 'ponctuelle',
        dateActivite: dateActivite,
        heure: body.heure,
        lieu: body.lieu,
        objectif: body.objectif,
        participants: body.participants,
        preparation: body.preparation,
        statut: body.statut || 'a_venir',
      },
    });

    return NextResponse.json(nouvelleActivite);
  } catch {
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 });
  }
}