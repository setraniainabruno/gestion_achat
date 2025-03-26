
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { ColumnDef } from '@tanstack/react-table';
import { AlertCircle, CheckCircle2, Clock, FileText, MessageSquare, UserCheck, XCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// Interface pour les demandes à valider
interface DemandeValidation {
  id: string;
  date: string;
  demandeur: {
    nom: string;
    initiales: string;
    departement: string;
    email: string;
  };
  nature: string;
  montant: number;
  urgence: number;
  impact: number;
  status: string;
  deadline?: string;
}

// Données de test
const demandesAValider: DemandeValidation[] = [
  {
    id: '2025-020',
    date: '2025-03-25',
    demandeur: {
      nom: 'Raholiarivony Anjarakoloina',
      initiales: 'RA',
      departement: 'Informatique',
      email: 'raholiarivonyanjara@gmail.com'
    },
    nature: 'Matériel photo professionnel',
    montant: 3500,
    urgence: 4,
    impact: 4,
    status: 'pending',
    deadline: '2025-03-30'
  },
  {
    id: '2025-019',
    date: '2025-03-24',
    demandeur: {
      nom: 'Andrianantoandro Ianjarivo',
      initiales: 'AI',
      departement: 'Marketing',
      email: 'andrianantoandro@gmail.com'
    },
    nature: 'Mobilier pour salle de conférence',
    montant: 8200,
    urgence: 3,
    impact: 3,
    status: 'pending'
  },
 
];

const demandesTraitees: DemandeValidation[] = [
  
  {
    id: '2025-015',
    date: '2025-02-09',
    demandeur: {
      nom: 'Israel John',
      initiales: 'IJ',
      departement: 'Finance',
      email: 'israel@gmail.com'
    },
    nature: 'Matériel de laboratoire',
    montant: 5200,
    urgence: 2 ,
    impact: 4,
    status: 'rejected'
  },
  {
    id: '2025-014',
    date: '2025-03-08',
    demandeur: {
      nom: 'Henintsoa Jonica',
      initiales: 'HJ',
      departement: 'Marketing',
      email: 'jonica@gmail.com'
    },
    nature: 'Abonnement plateforme marketing',
    montant: 4500,
    urgence: 3,
    impact: 4,
    status: 'approved'
  },
  
];

// Définition des colonnes pour le tableau de validation
const validationColumns: ColumnDef<DemandeValidation>[] = [
  {
    accessorKey: 'id',
    header: 'Référence',
  },
  {
    accessorKey: 'date',
    header: 'Date',
  },
  {
    id: 'demandeur',
    header: 'Demandeur',
    cell: ({ row }) => {
      const demandeur = row.original.demandeur;
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {demandeur.initiales}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{demandeur.nom}</div>
            <div className="text-xs text-muted-foreground">{demandeur.departement}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'nature',
    header: 'Nature',
  },
  {
    accessorKey: 'montant',
    header: 'Montant',
    cell: ({ row }) => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'MGA'
      }).format(row.original.montant);
    },
  },
  {
    id: 'priorite',
    header: 'Priorité',
    cell: ({ row }) => {
      const urgence = row.original.urgence;
      const impact = row.original.impact;
      const priorite = Math.round((urgence + impact) / 2);
      
      let badgeClass = 'bg-gray-100 text-gray-800';
      if (priorite >= 4) {
        badgeClass = 'bg-red-100 text-red-800';
      } else if (priorite >= 3) {
        badgeClass = 'bg-orange-100 text-orange-800';
      } else {
        badgeClass = 'bg-green-100 text-green-800';
      }
      
      return (
        <div className="flex flex-col">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeClass} inline-block w-fit`}>
            Niveau {priorite}
          </span>
          {row.original.deadline && (
            <span className="text-xs text-red-600 flex items-center mt-1">
              <Clock className="h-3 w-3 mr-1" />
              Deadline: {row.original.deadline}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Statut',
    cell: ({ row }) => <StatusBadge status={row.original.status as any} />,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      if (row.original.status === 'pending') {
        return (
          <div className="flex gap-2">
            <ValidationDialog demande={row.original} type="approve" />
            <ValidationDialog demande={row.original} type="reject" />
          </div>
        );
      }
      
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">Détails</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Détails de la demande {row.original.id}</DialogTitle>
              <DialogDescription>
                Soumis par {row.original.demandeur.nom} le {row.original.date}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Nature</p>
                  <p className="text-sm">{row.original.nature}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Montant</p>
                  <p className="text-sm">{new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'MGA'
                  }).format(row.original.montant)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Urgence</p>
                  <p className="text-sm">{row.original.urgence}/5</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Impact</p>
                  <p className="text-sm">{row.original.impact}/5</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Statut</p>
                <StatusBadge status={row.original.status as any} />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      );
    },
  },
];

// Composant de dialogue de validation
interface ValidationDialogProps {
  demande: DemandeValidation;
  type: 'approve' | 'reject';
}

const ValidationDialog = ({ demande, type }: ValidationDialogProps) => {
  const [commentaire, setCommentaire] = useState('');
  const [open, setOpen] = useState(false);
  
  const handleSubmit = () => {
    if (type === 'approve') {
      toast.success(`Demande ${demande.id} approuvée avec succès`);
    } else {
      toast.success(`Demande ${demande.id} rejetée`);
    }
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {type === 'approve' ? (
          <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700">
            <CheckCircle2 className="h-4 w-4 mr-1" />
            Approuver
          </Button>
        ) : (
          <Button size="sm" variant="destructive">
            <XCircle className="h-4 w-4 mr-1" />
            Rejeter
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {type === 'approve' ? 'Approuver la demande' : 'Rejeter la demande'}
          </DialogTitle>
          <DialogDescription>
            {type === 'approve'
              ? 'Vous êtes sur le point d\'approuver cette demande d\'achat.'
              : 'Veuillez indiquer la raison du rejet de cette demande d\'achat.'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Référence</p>
              <p className="text-sm">{demande.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Demandeur</p>
              <p className="text-sm">{demande.demandeur.nom}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium">Nature</p>
            <p className="text-sm">{demande.nature}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Montant</p>
            <p className="text-sm">{new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: 'MGA'
            }).format(demande.montant)}</p>
          </div>
          <div>
            <label htmlFor="commentaire" className="text-sm font-medium">
              {type === 'approve' ? 'Commentaire (optionnel)' : 'Motif du rejet'}
            </label>
            <Textarea
              id="commentaire"
              placeholder={type === 'approve' ? 'Ajouter un commentaire...' : 'Veuillez expliquer la raison du rejet...'}
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              className="mt-1"
              required={type === 'reject'}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={type === 'reject' && !commentaire}
            variant={type === 'approve' ? 'default' : 'destructive'}
          >
            {type === 'approve' ? 'Confirmer l\'approbation' : 'Confirmer le rejet'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Composant principal de validation des demandes
const ValidationDemandes = () => {
  const [selectedTab, setSelectedTab] = useState('pending');
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Validation des demandes</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">À valider</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demandesAValider.length}</div>
            <p className="text-xs text-muted-foreground">Demandes en attente de votre validation</p>
            {demandesAValider.some(d => d.deadline) && (
              <div className="mt-2 text-xs text-red-600 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {demandesAValider.filter(d => d.deadline).length} demande(s) avec deadline
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Approuvées</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demandesTraitees.filter(d => d.status === 'approved').length}</div>
            <p className="text-xs text-muted-foreground">Demandes que vous avez approuvées</p>
            <div className="mt-2 text-xs text-green-600 flex items-center">
              <FileText className="h-3 w-3 mr-1" />
              Sur {demandesTraitees.length} demandes traitées
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Délégation</CardTitle>
            <UserCheck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Aucune</div>
            <p className="text-xs text-muted-foreground">Pas de délégation de validation active</p>
            <Button variant="link" className="p-0 h-auto text-xs mt-2">
              Configurer une délégation
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="pending">
            En attente <span className="ml-2 bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs">{demandesAValider.length}</span>
          </TabsTrigger>
          <TabsTrigger value="processed">Traitées</TabsTrigger>
          <TabsTrigger value="delegated">Déléguées</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <DataTable 
            columns={validationColumns} 
            data={demandesAValider}
            searchColumn="nature"
            searchPlaceholder="Rechercher une demande..."
          />
        </TabsContent>

        <TabsContent value="processed" className="space-y-4">
          <DataTable 
            columns={validationColumns} 
            data={demandesTraitees}
            searchColumn="nature"
            searchPlaceholder="Rechercher une demande traitée..."
          />
        </TabsContent>

        <TabsContent value="delegated">
          <Card>
            <CardHeader>
              <CardTitle>Délégations de validation</CardTitle>
              <CardDescription>
                Vous n'avez pas de délégation de validation configurée pour le moment.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-10">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucune délégation active</h3>
              <p className="text-sm text-muted-foreground text-center mb-6">
                Configurez une délégation de validation pour permettre à un collègue de traiter les demandes pendant votre absence.
              </p>
              <Button>Configurer une délégation</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ValidationDemandes;
