"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarIcon, Clock, MapPin, Users, Target, Loader2 } from 'lucide-react';

// Schéma de validation
const activitySchema = z.object({
  nom: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  type: z.enum(['ponctuelle', 'recurring-2nd-sunday', 'recurring-2nd-saturday']),
  date: z.string().optional(),
  heure: z.string().optional(),
  lieu: z.string().min(3, "Le lieu est requis"),
  objectif: z.string().optional(),
  participants: z.string().default("Toute la jeunesse"),
  preparation: z.string().optional(),
  statut: z.enum(['a_venir', 'terminee', 'annulee']).default('a_venir'),
});

type ActivityFormValues = z.infer<typeof activitySchema>;

interface ActivityFormProps {
  initialData?: ActivityFormValues & { id?: number };
  isEdit?: boolean;
}

export default function ActivityForm({ initialData, isEdit = false }: ActivityFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: zodResolver(activitySchema),
    defaultValues: initialData || {
      type: 'ponctuelle',
      lieu: 'Temple MEMFA',
      participants: 'Toute la jeunesse',
      statut: 'a_venir',
    },
  });

  const typeActivite = watch('type');

  const onSubmit = async (data: ActivityFormValues) => {
    setIsLoading(true);
    try {
      const url = isEdit ? `/api/activites/${initialData?.id}` : '/api/activites';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push('/activites');
        router.refresh();
      } else {
        alert("Erreur lors de l&rsquo;enregistrement");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur réseau");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8 max-w-4xl">
      {/* Section Informations Générales */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border shadow-sm space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Informations Générales</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nom */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l&rsquo;activité</label>
            <input
              {...register('nom')}
              className={`w-full px-4 py-2 rounded-lg border ${errors.nom ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary/20 outline-none`}
              placeholder="Ex: Sortie détente à Moyekro"
            />
            {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom.message}</p>}
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type d&rsquo;activité</label>
            <select
              {...register('type')}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="ponctuelle">Ponctuelle (Date fixe)</option>
              <option value="recurring-2nd-sunday">Récurrente (2ème Dimanche)</option>
              <option value="recurring-2nd-saturday">Récurrente (2ème Samedi)</option>
            </select>
          </div>

          {/* Statut */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select
              {...register('statut')}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="a_venir">À venir</option>
              <option value="terminee">Terminée</option>
              <option value="annulee">Annulée</option>
            </select>
          </div>

          {/* Date (Affiché seulement si Ponctuelle) */}
          {typeActivite === 'ponctuelle' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  {...register('date')}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            </div>
          )}

          {/* Heure */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
            <div className="relative">
              <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="time"
                {...register('heure')}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section Détails & Lieux */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border shadow-sm space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Détails & Lieux</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Lieu */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Lieu</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                {...register('lieu')}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="Ex: Temple MEMFA, Moyekro..."
              />
            </div>
            {errors.lieu && <p className="text-red-500 text-xs mt-1">{errors.lieu.message}</p>}
          </div>

          {/* Participants */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Participants concernés</label>
            <div className="relative">
              <Users className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                {...register('participants')}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="Ex: Toute la jeunesse, Membres du bureau..."
              />
            </div>
          </div>

          {/* Objectif */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Objectif spirituel</label>
            <div className="relative">
              <Target className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <textarea
                {...register('objectif')}
                rows={3}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                placeholder="But de l&rsquo;activité..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 pt-2 sm:pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="w-full sm:w-auto px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isEdit ? 'Mettre à jour' : 'Enregistrer l&rsquo;activité'}
        </button>
      </div>
    </form>
  );
}