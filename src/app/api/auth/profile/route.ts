import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: parseInt(session.user.id) },
      select: { nom: true, email: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Erreur récupération profil:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { nom } = body;

    if (!nom || nom.length < 2) {
      return NextResponse.json({ error: 'Le nom doit contenir au moins 2 caractères' }, { status: 400 });
    }

    const updatedUser = await db.user.update({
      where: { id: parseInt(session.user.id) },
      data: { nom },
    });

    return NextResponse.json({ 
      success: true, 
      user: { nom: updatedUser.nom, email: updatedUser.email } 
    });

  } catch (error) {
    console.error('Erreur update profil:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}