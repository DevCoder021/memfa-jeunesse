import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Assure-toi que le chemin est correct (ou '../../../lib/db' si lib est à la racine)

// 1. GET : Récupérer une activité spécifique par son ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);

    const activite = await db.activite.findUnique({
      where: { id },
    });

    if (!activite) {
      return NextResponse.json({ error: 'Activité non trouvée' }, { status: 404 });
    }

    return NextResponse.json(activite);
  } catch (error) {
    console.error('Erreur GET activite:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération' }, { status: 500 });
  }
}

// 2. PUT : Modifier une activité existante
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const id = parseInt(params.id);

    // Gestion de la date (si vide ou invalide, on met null)
    const dateActivite = body.date ? new Date(body.date) : null;

    const activiteUpdatee = await db.activite.update({
      where: { id },
      data: {
        nom: body.nom,
        type: body.type || 'ponctuelle',
        dateActivite: dateActivite,
        heure: body.heure,
        lieu: body.lieu,
        objectif: body.objectif,
        participants: body.participants,
        preparation: body.preparation,
        statut: body.statut,
      },
    });

    return NextResponse.json(activiteUpdatee);
  } catch (error) {
    console.error('Erreur PUT activite:', error);
    return NextResponse.json({ error: 'Erreur lors de la modification' }, { status: 500 });
  }
}

// 3. DELETE : Supprimer une activité
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);

    await db.activite.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Supprimé avec succès' });
  } catch (error) {
    console.error('Erreur DELETE activite:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
  }
}