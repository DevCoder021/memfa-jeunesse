"use client"

import { useState, useEffect } from 'react';
import { Plus, Search, Pencil, Trash2, CheckCircle, XCircle, MapPin, CalendarDays, Eye } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Types pour l'activité
interface Activite {
  id: number;
  nom: string;
  type: string;
  dateActivite: string | null;
  heure: string | null;
  lieu: string;
  objectif: string | null;
  participants: string;
  preparation: string | null;
  statut: string;
}

type FilterKey = 'all' | 'a_venir' | 'terminee' | 'annulee';

export default function ActivitesPage() {
  const [activites, setActivites] = useState<Activite[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterKey>('all');

  useEffect(() => {
    fetchActivites();
  }, []);

  const fetchActivites = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/activites');
      const data = await res.json();
      setActivites(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette activité ?')) return;
    
    try {
      await fetch(`/api/activites/${id}`, { method: 'DELETE' });
      fetchActivites(); // Rafraîchir la liste
    } catch {
      alert('Erreur lors de la suppression');
    }
  };

  const getComputedStatus = (act: Activite): FilterKey => {
    if (act.statut === 'annulee') return 'annulee';
    if (act.statut === 'terminee') return 'terminee';
    if (!act.dateActivite) return 'a_venir';

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const actDate = new Date(act.dateActivite);
    actDate.setHours(0, 0, 0, 0);

    return actDate < today ? 'terminee' : 'a_venir';
  };

  const filterOptions: { id: FilterKey; label: string; count: number }[] = [
    { id: 'all', label: 'Toutes', count: activites.length },
    { id: 'a_venir', label: 'À venir', count: activites.filter((a) => getComputedStatus(a) === 'a_venir').length },
    { id: 'terminee', label: 'Terminées', count: activites.filter((a) => getComputedStatus(a) === 'terminee').length },
    { id: 'annulee', label: 'Annulées', count: activites.filter((a) => getComputedStatus(a) === 'annulee').length },
  ];

  // Filtrage et recherche dynamiques
  const filteredActivites = activites.filter(act => {
    const matchSearch = act.nom.toLowerCase().includes(search.toLowerCase()) || 
                        act.lieu.toLowerCase().includes(search.toLowerCase());
    const computedStatus = getComputedStatus(act);
    const matchFilter = filter === 'all' ? true : computedStatus === filter;
    return matchSearch && matchFilter;
  });
  const listAnimationKey = `${filter}-${search.trim().toLowerCase()}-${filteredActivites.length}`;

  // Helper pour les badges
  const getStatusBadge = (statut: string, date: string | null) => {
    // Si c'est terminé ou annulé, on respecte le statut
    if (statut === 'terminee') return <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-200"><CheckCircle className="w-3 h-3 mr-1" /> Terminée</Badge>;
    if (statut === 'annulee') return <Badge className="bg-red-50 text-red-600 hover:bg-red-100"><XCircle className="w-3 h-3 mr-1" /> Annulée</Badge>;
    
    // Sinon, on regarde la date
    if (!date) return <Badge variant="outline">Indéterminé</Badge>;
    
    const today = new Date();
    today.setHours(0,0,0,0);
    const actDate = new Date(date);
    const diffTime = actDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return <Badge variant="secondary">Passée</Badge>;
    if (diffDays === 0) return <Badge className="bg-red-100 text-red-700 hover:bg-red-200">Aujourd&rsquo;hui</Badge>;
    if (diffDays <= 2) return <Badge className="bg-red-50 text-red-600 hover:bg-red-100">Urgent (J-{diffDays})</Badge>;
    if (diffDays <= 7) return <Badge className="bg-orange-50 text-orange-600 hover:bg-orange-100">J-{diffDays}</Badge>;
    
    return <Badge className="bg-green-50 text-green-600 hover:bg-green-100">À venir</Badge>;
  };

  return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Activités</h1>
          <p className="text-muted-foreground">Gérez le plan annuel et le suivi des événements.</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link href="/activites/new">
            <Plus className="mr-2 h-4 w-4" /> Nouvelle activité
          </Link>
        </Button>
      </div>

      {/* Filtres et Recherche */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border shadow-sm">
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {filterOptions.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap",
                filter === f.id 
                  ? "bg-primary text-white shadow-sm" 
                  : "text-muted-foreground hover:bg-gray-100"
              )}
            >
              {f.label} <span className="ml-1 opacity-80">({f.count})</span>
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une activité..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Chargement des données...</div>
        ) : filteredActivites.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <CalendarDays className="mx-auto h-10 w-10 mb-3 opacity-20" />
            <p>Aucune activité trouvée.</p>
          </div>
        ) : (
          <>
          <div className="md:hidden space-y-3 p-3">
            {filteredActivites.map((act, index) => (
              <div
                key={`${listAnimationKey}-mobile-${act.id}`}
                className="rounded-xl border bg-white p-4 space-y-3 curtain-row-reveal"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{act.nom}</p>
                    <p className="text-xs text-muted-foreground">{act.participants}</p>
                  </div>
                  {getStatusBadge(act.statut, act.dateActivite)}
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>
                    {act.dateActivite
                      ? new Date(act.dateActivite).toLocaleDateString('fr-FR')
                      : 'Date indéfinie'}
                    {act.heure ? ` • ${act.heure}` : ''}
                  </p>
                  <p className="truncate">{act.lieu}</p>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Link href={`/activites/${act.id}`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/activites/${act.id}/edit`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(act.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-gray-50/50 border-b">
                <tr>
                  <th className="px-6 py-4 font-semibold">Activité</th>
                  <th className="px-6 py-4 font-semibold">Date & Heure</th>
                  <th className="px-6 py-4 font-semibold">Lieu</th>
                  <th className="px-6 py-4 font-semibold">Statut</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody key={listAnimationKey} className="divide-y">
                {filteredActivites.map((act, index) => (
                  <tr
                    key={`${listAnimationKey}-${act.id}`}
                    className="hover:bg-gray-50/50 transition-colors group curtain-row-reveal"
                    style={{ animationDelay: `${index * 120}ms` }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <CalendarDays className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{act.nom}</p>
                          <p className="text-xs text-muted-foreground">{act.participants}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {act.dateActivite ? (
                        <div>
                          <p className="font-medium text-gray-900">
                            {new Date(act.dateActivite).toLocaleDateString('fr-FR')}
                          </p>
                          {act.heure && <p className="text-xs text-muted-foreground">{act.heure}</p>}
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic">Date indéfinie</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span className="truncate max-w-[150px]">{act.lieu}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(act.statut, act.dateActivite)}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <Link href={`/activites/${act.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/activites/${act.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                            <Pencil className="h-4 w-4" />
                        </Button>
                        </Link>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(act.id)}>
                        <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </>
        )}
      </div>
    </div>
  );
}