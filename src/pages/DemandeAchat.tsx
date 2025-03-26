import React, { useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DemandeForm } from "@/components/forms/DemandeForm";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Eye, FileText, MoreHorizontal, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { usePDF } from "react-to-pdf";

// Type pour les demandes d'achat
interface DemandeAchat {
  id: string;
  date: string;
  nature: string;
  departement: string;
  demandeur: string;
  quantite: number;
  urgence: number;
  impact: number;
  status: string;
}

// Données de test pour les demandes d'achat

// Données de test
const dummyDemandes: DemandeAchat[] = [
  {
    id: "DEM-2023-001",
    date: "2023-06-15T10:30:00",
    nature: "Ordinateurs portables",
    departement: "Informatique",
    demandeur: "Marie Lambert",
    quantite: 5,
    urgence: 4,
    impact: 4,
    status: "approved",
    validationDate: "2023-06-15T14:20:00",
    piecesJointes: [
      {
        nom: "devis_ordinateurs.pdf",
        url: "https://example.com/devis_ordinateurs.pdf",
        type: "application/pdf",
      },
    ],
  },
];



// Définition des colonnes pour le tableau
const columns: ColumnDef<DemandeAchat>[] = [
  {
    accessorKey: "id",
    header: "Référence",
    cell: ({ row }) => (
      <Link
        to={`/demande-achat/${row.original.id}`}
        className="font-medium hover:underline"
      >
        {row.original.id}
      </Link>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "nature",
    header: "Nature",
  },
  {
    accessorKey: "departement",
    header: "Département",
  },
  {
    accessorKey: "demandeur",
    header: "Demandeur",
  },
  {
    accessorKey: "quantite",
    header: "Qté",
  },
  {
    accessorKey: "urgence",
    header: "Urgence",
    cell: ({ row }) => (
      <div className="flex items-center">
        <span className="font-medium">{row.original.urgence}</span>
        <div className="ml-2 w-8 bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              row.original.urgence >= 4
                ? "bg-red-500"
                : row.original.urgence >= 3
                ? "bg-orange-500"
                : "bg-green-500"
            }`}
            style={{ width: `${row.original.urgence * 20}%` }}
          ></div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => <StatusBadge status={row.original.status as any} />,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link to={`/demande-achat/${row.original.id}`}>
              <Eye className="mr-2 h-4 w-4" />
              Voir les détails
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

// Composant détail d'une demande
const DemandeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Recherche de la demande dans les données de test
  const demande = dummyDemandes.find((d) => d.id === id);

  if (!demande) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <h2 className="text-2xl font-bold mb-4">Demande non trouvée</h2>
        <p className="text-muted-foreground mb-6">
          La demande que vous recherchez n'existe pas.
        </p>
        <Button onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
      </div>
    );
  }

  // Configuration PDF
  const { toPDF, targetRef } = usePDF({
    filename: `demande_achat_${demande.id}.pdf`,
    page: {
      margin: 20,
      format: "A4",
      orientation: "portrait",
    },
    overrides: {
      pdf: {
        compress: true,
      },
    },
  });

  const handleFileAction = (piece: PieceJointe) => {
    if (piece.type.startsWith("image/")) {
      // Ouvrir l'image dans un nouvel onglet
      window.open(piece.url, "_blank");
    } else {
      // Télécharger le fichier
      const link = document.createElement("a");
      link.href = piece.url;
      link.download = piece.nom;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getFileIcon = (type: string) => {
    return type.startsWith("image/") ? (
      <Image className="h-5 w-5 mr-2 text-blue-500" />
    ) : (
      <FileText className="h-5 w-5 mr-2 text-primary" />
    );
  };

  const getFileActionLabel = (type: string) => {
    return type.startsWith("image/") ? "Afficher" : "Télécharger";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            Demande {demande.id}
          </h1>
          <StatusBadge status={demande.status} className="ml-4" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toPDF()}>
            <FileText className="mr-2 h-4 w-4" />
            Exporter PDF
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>Mettre à jour</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleUpdateStatus("pending")}>
                En attente
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUpdateStatus("approved")}>
                Approuver
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUpdateStatus("rejected")}>
                Rejeter
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleUpdateStatus("processing")}
              >
                En traitement
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div ref={targetRef}>
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Date de demande
                  </dt>
                  <dd className="text-sm">
                    {new Date(demande.date).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Demandeur
                  </dt>
                  <dd className="text-sm">{demande.demandeur}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Département
                  </dt>
                  <dd className="text-sm">{demande.departement}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Nature
                  </dt>
                  <dd className="text-sm">{demande.nature}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Quantité
                  </dt>
                  <dd className="text-sm">{demande.quantite}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Évaluation</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Niveau d'urgence
                  </dt>
                  <dd className="flex items-center mt-1">
                    <span className="font-medium mr-2">
                      {demande.urgence}/5
                    </span>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          demande.urgence >= 4
                            ? "bg-red-500"
                            : demande.urgence >= 3
                            ? "bg-orange-500"
                            : "bg-green-500"
                        }`}
                        style={{ width: `${demande.urgence * 20}%` }}
                      />
                    </div>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Impact stratégique
                  </dt>
                  <dd className="flex items-center mt-1">
                    <span className="font-medium mr-2">{demande.impact}/5</span>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-blue-500"
                        style={{ width: `${demande.impact * 20}%` }}
                      />
                    </div>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Statut
                  </dt>
                  <dd className="mt-1">
                    <StatusBadge status={demande.status} />
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Workflow d'approbation</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="relative border-l border-muted">
                <li className="mb-6 ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full -left-3">
                    1
                  </span>
                  <h3 className="font-medium">Création de la demande</h3>
                  <p className="text-xs text-muted-foreground">
                    {new Date(demande.date).toLocaleString()}
                  </p>
                  <p className="text-sm">
                    Demande créée par {demande.demandeur}
                  </p>
                </li>
                <li className="mb-6 ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full -left-3">
                    2
                  </span>
                  <h3 className="font-medium">Validation responsable</h3>
                  <p className="text-xs text-muted-foreground">
                    {new Date(demande.validationDate).toLocaleString()}
                  </p>
                  <p className="text-sm">Approuvé par Jacques Moreau</p>
                </li>
                <li className="mb-6 ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-muted text-muted-foreground rounded-full -left-3">
                    3
                  </span>
                  <h3 className="font-medium">Validation financière</h3>
                  <p className="text-xs text-muted-foreground">En attente</p>
                </li>
                <li className="ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-muted text-muted-foreground rounded-full -left-3">
                    4
                  </span>
                  <h3 className="font-medium">Traitement</h3>
                  <p className="text-xs text-muted-foreground">En attente</p>
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Description et justification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Description</h3>
                <p className="mt-1 text-sm">
                  Acquisition de {demande.quantite} {demande.nature} pour le
                  département {demande.departement}. Modèle standard conforme
                  aux recommandations du service informatique.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="text-sm font-medium">Justification</h3>
                <p className="mt-1 text-sm">
                  Ces équipements sont nécessaires pour remplacer les modèles
                  obsolètes et améliorer la productivité de l'équipe.
                  L'acquisition entre dans le cadre du plan de modernisation des
                  équipements validé en début d'année.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Pièces justificatives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {demande.piecesJointes?.map((piece, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-muted rounded-md"
                >
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-primary" />
                    <span>{piece.nom}</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    Télécharger
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Composant principal pour la gestion des demandes d'achat
const DemandeAchat = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("liste");

  if (id) {
    return <DemandeDetail />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Demandes d'achat</h1>
      </div>

      <Tabs defaultValue="liste" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="liste">Liste des demandes</TabsTrigger>
          <TabsTrigger value="nouvelle">Nouvelle demande</TabsTrigger>
        </TabsList>
        <TabsContent value="liste" className="space-y-4">
          <DataTable
            columns={columns}
            data={dummyDemandes}
            searchColumn="nature"
            searchPlaceholder="Rechercher une demande..."
          />
        </TabsContent>
        <TabsContent value="nouvelle">
          <Card>
            <CardHeader>
              <CardTitle>Formulaire de demande d'achat</CardTitle>
              <CardDescription>
                Complétez ce formulaire pour soumettre une nouvelle demande
                d'achat.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DemandeForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DemandeAchat;
