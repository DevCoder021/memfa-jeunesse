"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CalendarDays, MapPin, Users, FileText, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type ActiviteDetail = {
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
};

export default function ActiviteDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [activite, setActivite] = useState<ActiviteDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivite = async () => {
      try {
        const res = await fetch(`/api/activites/${params.id}`);
        if (!res.ok) throw new Error("Activité introuvable");
        const data = (await res.json()) as ActiviteDetail;
        setActivite(data);
      } catch {
        setActivite(null);
      } finally {
        setLoading(false);
      }
    };

    fetchActivite();
  }, [params.id]);

  if (loading) {
    return <div className="p-6 lg:p-8 text-muted-foreground">Chargement de l&rsquo;activité...</div>;
  }

  if (!activite) {
    return (
      <div className="p-6 lg:p-8 space-y-4">
        <p className="text-red-600 font-medium">Activité introuvable.</p>
        <Button onClick={() => router.push("/activites")} variant="outline">
          Retour à la liste
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline">
            <Link href="/activites">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">{activite.nom}</h1>
        </div>
        <Button asChild>
          <Link href={`/activites/${activite.id}/edit`}>
            <Pencil className="h-4 w-4 mr-2" />
            Modifier
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Badge variant="outline">{activite.type}</Badge>
          <Badge>{activite.statut}</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-2">
            <CalendarDays className="h-4 w-4 mt-0.5 text-primary" />
            <div>
              <p className="font-medium">Date & heure</p>
              <p className="text-muted-foreground">
                {activite.dateActivite
                  ? new Date(activite.dateActivite).toLocaleDateString("fr-FR")
                  : "Date indéfinie"}
                {activite.heure ? ` • ${activite.heure}` : ""}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 mt-0.5 text-primary" />
            <div>
              <p className="font-medium">Lieu</p>
              <p className="text-muted-foreground">{activite.lieu}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Users className="h-4 w-4 mt-0.5 text-primary" />
            <div>
              <p className="font-medium">Participants</p>
              <p className="text-muted-foreground">{activite.participants}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <FileText className="h-4 w-4 mt-0.5 text-primary" />
            <div>
              <p className="font-medium">Objectif</p>
              <p className="text-muted-foreground">{activite.objectif || "Non défini"}</p>
            </div>
          </div>
        </div>

        <div>
          <p className="font-medium mb-1">Préparation</p>
          <p className="text-sm text-muted-foreground">{activite.preparation || "Aucune préparation renseignée."}</p>
        </div>
      </div>
    </div>
  );
}
