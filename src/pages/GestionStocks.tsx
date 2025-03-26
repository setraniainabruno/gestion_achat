
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import { StockChart } from '@/components/charts/StockChart';
import { StatusBadge } from '@/components/ui/status-badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, ArrowDownUp, DownloadCloud, Eye, Plus, Settings, UploadCloud } from 'lucide-react';
import { toast } from 'sonner';
import {Navigate, useNavigate } from 'react-router-dom';

// Interface pour les articles en stock
interface StockItem {
  id: string;
  categorie: string;
  nom: string;
  quantite: number;
  seuil: number;
  emplacement: string;
  dateMAJ: string;
  status: string;
}

// Données de démonstration
const stockData: StockItem[] = [
  { id: 'INV-001', categorie: 'Informatique', nom: 'Ordinateurs portables', quantite: 24, seuil: 10, emplacement: 'Entrepôt A2', dateMAJ: '2023-06-10', status: 'ok' },
  { id: 'INV-002', categorie: 'Informatique', nom: 'Écrans 24"', quantite: 32, seuil: 15, emplacement: 'Entrepôt A3', dateMAJ: '2023-06-08', status: 'ok' },
  { id: 'INV-003', categorie: 'Informatique', nom: 'Claviers sans fil', quantite: 45, seuil: 20, emplacement: 'Entrepôt A1', dateMAJ: '2023-06-12', status: 'ok' },
  { id: 'INV-004', categorie: 'Informatique', nom: 'Souris optiques', quantite: 38, seuil: 20, emplacement: 'Entrepôt A1', dateMAJ: '2023-06-12', status: 'ok' },
  { id: 'INV-005', categorie: 'Informatique', nom: 'Téléphones IP', quantite: 12, seuil: 8, emplacement: 'Entrepôt B2', dateMAJ: '2023-06-15', status: 'ok' },
  { id: 'INV-006', categorie: 'Informatique', nom: 'Imprimantes laser', quantite: 5, seuil: 4, emplacement: 'Entrepôt B1', dateMAJ: '2023-06-14', status: 'ok' },
  { id: 'INV-007', categorie: 'Informatique', nom: 'Disques durs SSD', quantite: 4, seuil: 5, emplacement: 'Entrepôt A4', dateMAJ: '2023-06-15', status: 'warning' },
  { id: 'INV-008', categorie: 'Fournitures', nom: 'Cartouches d\'encre', quantite: 3, seuil: 5, emplacement: 'Entrepôt C1', dateMAJ: '2023-06-15', status: 'warning' },
  { id: 'INV-009', categorie: 'Fournitures', nom: 'Papier A4', quantite: 2, seuil: 10, emplacement: 'Entrepôt C2', dateMAJ: '2023-06-16', status: 'critical' },
  { id: 'INV-010', categorie: 'Mobilier', nom: 'Chaises de bureau', quantite: 15, seuil: 8, emplacement: 'Entrepôt D1', dateMAJ: '2023-06-05', status: 'ok' },
];

// Données pour historique des mouvements
interface MouvementStock {
  id: string;
  date: string;
  article: string;
  quantite: number;
  type: 'entree' | 'sortie';
  utilisateur: string;
  reference: string;
}

const mouvementsData: MouvementStock[] = [
  { id: 'MVT-001', date: '2023-06-16', article: 'Papier A4', quantite: 2, type: 'sortie', utilisateur: 'Marie Lambert', reference: 'DEM-2023-010' },
  { id: 'MVT-002', date: '2023-06-15', article: 'Cartouches d\'encre', quantite: 1, type: 'sortie', utilisateur: 'Thomas Dubois', reference: 'DEM-2023-009' },
  { id: 'MVT-003', date: '2023-06-15', article: 'Disques durs SSD', quantite: 2, type: 'sortie', utilisateur: 'Sophie Martin', reference: 'DEM-2023-008' },
  { id: 'MVT-004', date: '2023-06-14', article: 'Ordinateurs portables', quantite: 5, type: 'entree', utilisateur: 'Jean Dupont', reference: 'BON-2023-005' },
  { id: 'MVT-005', date: '2023-06-12', article: 'Claviers sans fil', quantite: 10, type: 'entree', utilisateur: 'Jean Dupont', reference: 'BON-2023-004' },
  { id: 'MVT-006', date: '2023-06-12', article: 'Souris optiques', quantite: 10, type: 'entree', utilisateur: 'Jean Dupont', reference: 'BON-2023-004' },
  { id: 'MVT-007', date: '2023-06-10', article: 'Téléphones IP', quantite: 3, type: 'sortie', utilisateur: 'Emilie Blanc', reference: 'DEM-2023-007' },
  { id: 'MVT-008', date: '2023-06-08', article: 'Papier A4', quantite: 20, type: 'entree', utilisateur: 'Jean Dupont', reference: 'BON-2023-003' },
];

// Définition des colonnes pour le tableau des stocks
const stockColumns: ColumnDef<StockItem>[] = [
  {
    accessorKey: 'nom',
    header: ({ column }) => (
      <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Article <ArrowDownUp className="ml-2 h-4 w-4" />
      </div>
    ),
  },
  {
    accessorKey: 'categorie',
    header: 'Catégorie',
  },
  {
    accessorKey: 'quantite',
    header: 'Quantité',
  },
  {
    accessorKey: 'seuil',
    header: 'Seuil',
  },
  {
    accessorKey: 'status',
    header: 'Statut',
    cell: ({ row }) => {
      const status = row.original.status;
      const quantite = row.original.quantite;
      const seuil = row.original.seuil;
      
      let statusDisplay = 'ok';
      if (quantite <= seuil * 0.5) {
        statusDisplay = 'critical';
      } else if (quantite <= seuil) {
        statusDisplay = 'warning';
      }
      
      let statusLabel = '';
      if (statusDisplay === 'critical') {
        statusLabel = 'Critique';
      } else if (statusDisplay === 'warning') {
        statusLabel = 'Alerte';
      } else {
        statusLabel = 'Normal';
      }
      
      return <StatusBadge status={statusDisplay as any} label={statusLabel} />;
    },
  },
  {
    accessorKey: 'emplacement',
    header: 'Emplacement',
  },
  {
    accessorKey: 'dateMAJ',
    header: 'Dernière MAJ',
  },
  {
    id: 'actions',
    cell: () => (
      <div className="flex gap-2">
        <Button variant="ghost" size="sm">Ajuster</Button>
      </div>
    ),
  },
];

// Colonnes pour l'historique des mouvements
const mouvementColumns: ColumnDef<MouvementStock>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
  },
  {
    accessorKey: 'article',
    header: 'Article',
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.original.type;
      return (
        <div className="flex items-center">
          {type === 'entree' ? (
            <>
              <DownloadCloud className="h-4 w-4 mr-2 text-green-500" />
              <span>Entrée</span>
            </>
          ) : (
            <>
              <UploadCloud className="h-4 w-4 mr-2 text-red-500" />
              <span>Sortie</span>
            </>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'quantite',
    header: 'Quantité',
  },
  {
    accessorKey: 'utilisateur',
    header: 'Utilisateur',
  },
  {
    accessorKey: 'reference',
    header: 'Référence',
  },
];


// Formulaire d'ajustement de stock
const StockAjustementForm = () => {
  const [article, setArticle] = useState('');
  const [quantite, setQuantite] = useState('');
  const [type, setType] = useState('entree');
  const [reference, setReference] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simuler l'ajustement du stock
    toast.success(`Stock ajusté: ${type === 'entree' ? '+' : '-'}${quantite} ${article}`);
    
    // Réinitialiser le formulaire
    setArticle('');
    setQuantite('');
    setType('entree');
    setReference('');
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="article" className="text-sm font-medium">Article</label>
          <Select value={article} onValueChange={setArticle} required>
            <SelectTrigger id="article">
              <SelectValue placeholder="Sélectionner un article" />
            </SelectTrigger>
            <SelectContent>
              {stockData.map((item) => (
                <SelectItem key={item.id} value={item.nom}>
                  {item.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="type" className="text-sm font-medium">Type de mouvement</label>
          <Select value={type} onValueChange={setType} required>
            <SelectTrigger id="type">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="entree">Entrée</SelectItem>
              <SelectItem value="sortie">Sortie</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <label htmlFor="quantite" className="text-sm font-medium">Quantité</label>
          <Input 
            id="quantite" 
            type="number" 
            min="1" 
            value={quantite} 
            onChange={(e) => setQuantite(e.target.value)} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="reference" className="text-sm font-medium">Référence (optionnel)</label>
          <Input 
            id="reference" 
            value={reference} 
            onChange={(e) => setReference(e.target.value)} 
            placeholder="Bon de commande, demande..." 
          />
        </div>
      </div>
      
      <Button type="submit" className="w-full">Valider l'ajustement</Button>
    </form>
  );
};

// Composant principal de gestion des stocks
const GestionStocks = () => {
  // Filtrer pour les alertes de stock
  const alertStock = stockData.filter(item => item.quantite <= item.seuil);
  
  // Données pour le graphique
  const chartData = [...stockData].sort((a, b) => a.quantite - b.quantite).slice(0, 8);
  

  const navigate = useNavigate(); // Initialisation du hook

  // Exemple d'utilisation pour rediriger après une action
 
  const handleClickArticle = () => {
    navigate("/articles")
  }
  const handleClickDemande = () => {
    navigate("/demandes")
  }


  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Gestion des stocks</h1>
        <div className="flex gap-2">
          <Button onClick={handleClickDemande}>
            <Eye className="mr-2 h-4 w-4" />
            Voir Demande
          </Button>
          <Button onClick={handleClickArticle}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle article
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Articles en stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockData.length}</div>
            <p className="text-xs text-muted-foreground">Types d'articles dans l'inventaire</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Alertes de stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alertStock.length}</div>
            <p className="text-xs text-muted-foreground">Articles sous le seuil minimal</p>
            {alertStock.length > 0 && (
              <div className="mt-2 text-xs text-red-600 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {alertStock.filter(i => i.status === 'critical').length} article(s) en état critique
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Mouvements récents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mouvementsData.length}</div>
            <p className="text-xs text-muted-foreground">Dans les 30 derniers jours</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="inventaire">
        <TabsList>
          <TabsTrigger value="inventaire">Inventaire</TabsTrigger>
          <TabsTrigger value="ajustement">Ajustement de stock</TabsTrigger>
          <TabsTrigger value="mouvements">Historique des mouvements</TabsTrigger>
          <TabsTrigger value="alertes">Alertes de stock ({alertStock.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="inventaire" className="space-y-4">
          <StockChart 
            data={chartData} 
            title="Vue d'ensemble des stocks" 
            description="Articles avec les stocks les plus bas"
          />
          
          <DataTable 
            columns={stockColumns} 
            data={stockData}
            searchColumn="nom"
            searchPlaceholder="Rechercher un article..."
          />
        </TabsContent>

        <TabsContent value="ajustement">
          <Card>
            <CardHeader>
              <CardTitle>Ajustement de stock</CardTitle>
              <CardDescription>
                Utilisez ce formulaire pour enregistrer une entrée ou une sortie de stock.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StockAjustementForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mouvements">
          <DataTable 
            columns={mouvementColumns} 
            data={mouvementsData}
            searchColumn="article"
            searchPlaceholder="Rechercher un mouvement..."
          />
        </TabsContent>

        <TabsContent value="alertes">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Articles sous le seuil minimal</CardTitle>
              <CardDescription>
                Ces articles nécessitent une attention particulière et doivent être réapprovisionnés.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable 
                columns={stockColumns}

                data={alertStock}
                searchColumn="nom"
                searchPlaceholder="Rechercher un article en alerte..."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GestionStocks;
