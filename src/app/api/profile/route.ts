import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { nom } = body;

    if (!nom || nom.length < 2) {
      return NextResponse.json({ error: 'Nom invalide' }, { status: 400 });
    }

    // Mise à jour de l'utilisateur ID 1 (admin)
    const updatedUser = await db.user.update({
      where: { id: 1 },
      data: { nom },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Profil mis à jour',
      user: { nom: updatedUser.nom, email: updatedUser.email } 
    });

  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}