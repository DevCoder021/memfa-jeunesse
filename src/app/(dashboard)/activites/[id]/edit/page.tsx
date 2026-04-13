import ActivityForm from '@/components/ActivityForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

async function getActivite(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/activites/${id}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function EditActivitePage({ params }: { params: { id: string } }) {
  const activite = await getActivite(params.id);
  
  if (!activite) {
    notFound();
  }

  // On prépare les données pour le formulaire
  // L'API renvoie une date sérialisée (string), on normalise pour l'input type="date".
  const normalizedDate = activite.dateActivite
    ? new Date(activite.dateActivite).toISOString().split('T')[0]
    : undefined;
  const initialData = {
    ...activite,
    date: normalizedDate,
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/activites" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Modifier l&rsquo;activité</h1>
          <p className="text-muted-foreground">Mettre à jour les informations de « {activite.nom} ».</p>
        </div>
      </div>
      
      <ActivityForm initialData={initialData} isEdit={true} />
    </div>
  );
}