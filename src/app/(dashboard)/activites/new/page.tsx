import ActivityForm from '@/components/ActivityForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewActivitePage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-start sm:items-center gap-3 sm:gap-4">
        <Link href="/activites" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Nouvelle Activité</h1>
          <p className="text-muted-foreground">Ajouter un événement au plan annuel.</p>
        </div>
      </div>
      
      <ActivityForm />
    </div>
  );
}