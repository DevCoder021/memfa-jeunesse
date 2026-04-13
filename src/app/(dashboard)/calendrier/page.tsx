import { db } from '@/lib/db';
import { format, getMonth, getYear } from 'date-fns';
import { CalendarDays, MapPin, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

// Noms des mois en français
const mois = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

export default async function CalendrierPage() {
  // Récupérer toutes les activités (Server Component)
  const activites = await db.activite.findMany({
    orderBy: { dateActivite: 'asc' },
  });

  // Année cible (2026 par défaut, ou année en cours)
  const anneeCible = 2026;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Calendrier {anneeCible}</h1>
          <p className="text-muted-foreground">Vue d&rsquo;ensemble des activités par mois.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground">
          <span className="w-3 h-3 rounded-full bg-primary"></span> À venir
          <span className="w-3 h-3 rounded-full bg-gray-400 ml-2"></span> Terminée
          <span className="w-3 h-3 rounded-full bg-red-500 ml-2"></span> Annulée
        </div>
      </div>

      {/* Grille des 12 mois */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mois.map((nomMois, index) => {
          // Filtrer les activités pour ce mois précis
          const activitesDuMois = activites.filter(act => {
            if (!act.dateActivite) return false;
            const date = new Date(act.dateActivite);
            return getMonth(date) === index && getYear(date) === anneeCible;
          });

          // Déterminer si le mois est le mois actuel (visuellement)
          const isCurrentMonth = new Date().getMonth() === index && new Date().getFullYear() === anneeCible;

          return (
            <div 
              key={index} 
              className={cn(
                "bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md",
                isCurrentMonth ? "ring-2 ring-primary ring-offset-2" : ""
              )}
            >
              {/* En-tête du mois */}
              <div className={cn(
                "p-4 flex items-center justify-between border-b",
                isCurrentMonth ? "bg-primary/5" : "bg-gray-50"
              )}>
                <h3 className={cn(
                  "font-bold text-lg",
                  isCurrentMonth ? "text-primary" : "text-gray-700"
                )}>
                  {nomMois}
                </h3>
                <span className={cn(
                  "text-xs font-semibold px-2 py-1 rounded-md",
                  isCurrentMonth ? "bg-primary text-white" : "bg-gray-200 text-gray-600"
                )}>
                  {activitesDuMois.length}
                </span>
              </div>

              {/* Liste des activités du mois */}
              <div className="p-4 flex-1 space-y-4 min-h-[150px]">
                {activitesDuMois.length > 0 ? (
                  activitesDuMois.map((act) => {
                    const dateObj = new Date(act.dateActivite!);
                    return (
                      <div key={act.id} className="group relative pl-4 border-l-2 border-gray-200 hover:border-primary transition-colors">
                        {/* Point sur la timeline */}
                        <div className={cn(
                          "absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white",
                          act.statut === 'annulee' ? 'bg-red-500' :
                          act.statut === 'terminee' ? 'bg-gray-400' : 'bg-primary'
                        )}></div>
                        
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors">
                            {act.nom}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <CalendarDays className="h-3 w-3" />
                              {format(dateObj, 'dd MMM')}
                            </span>
                            {act.heure && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {act.heure}
                              </span>
                            )}
                          </div>
                          {act.lieu && (
                            <p className="text-[10px] text-gray-500 truncate max-w-full sm:max-w-[180px] flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {act.lieu}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-xs italic">
                    Aucune activité
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}