import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BudgetChart } from '@/components/charts/BudgetChart';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowDownUp, Download, Plus, RefreshCw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

// Types pour les données budgétaires
interface BudgetDepartement {
  id: string;
  departement: string;
  alloue: number;
  consomme: number;
  engage: number;
  disponible: number;
  previsionnel: number;
}

interface DepenseBudgetaire {
  id: string;
  date: string;
  reference: string;
  nature: string;
  departement: string;
  montant: number;
  categorie: string;
}

// Données de démonstration
const budgetsDepartements: BudgetDepartement[] = [
  { id: '1', departement: 'Informatique', alloue: 150000, consomme: 85000, engage: 20000, disponible: 45000, previsionnel: 130000 },
  { id: '2', departement: 'Marketing', alloue: 120000, consomme: 78000, engage: 25000, disponible: 17000, previsionnel: 115000 },
  { id: '3', departement: 'Logistique', alloue: 80000, consomme: 45000, engage: 10000, disponible: 25000, previsionnel: 65000 },
  { id: '4', departement: 'Finance', alloue: 70000, consomme: 35000, engage: 15000, disponible: 20000, previsionnel: 60000 },
  { id: '5', departement: 'Direction', alloue: 200000, consomme: 140000, engage: 30000, disponible: 30000, previsionnel: 190000 },

];

const depensesBudgetaires: DepenseBudgetaire[] = [
  { id: 'DEP-001', date: '2023-06-15', reference: 'DEM-2023-020', nature: 'Matériel photo professionnel', departement: 'Marketing', montant: 3500, categorie: 'Équipement' },
  { id: 'DEP-002', date: '2023-06-14', reference: 'DEM-2023-019', nature: 'Mobilier pour salle de conférence', departement: 'Logistique', montant: 8200, categorie: 'Mobilier' },
  { id: 'DEP-003', date: '2023-06-12', reference: 'DEM-2023-018', nature: 'Licences logicielles design', departement: 'Informatique', montant: 2800, categorie: 'Logiciels' },
  { id: 'DEP-004', date: '2023-06-11', reference: 'DEM-2023-017', nature: 'Contrat maintenance informatique', departement: 'Informatique', montant: 12000, categorie: 'Services' },
  { id: 'DEP-005', date: '2023-06-10', reference: 'DEM-2023-016', nature: 'Équipement de présentation', departement: 'Finance', montant: 1800, categorie: 'Équipement' },
  { id: 'DEP-006', date: '2023-06-09', reference: 'DEM-2023-015', nature: 'Matériel de laboratoire', departement: 'Logistique', montant: 5200, categorie: 'Équipement' },
  { id: 'DEP-007', date: '2023-06-08', reference: 'DEM-2023-014', nature: 'Abonnement plateforme marketing', departement: 'Marketing', montant: 4500, categorie: 'Services' },
  { id: 'DEP-008', date: '2023-06-07', reference: 'DEM-2023-013', nature: 'Équipement de visioconférence', departement: 'Direction', montant: 7500, categorie: 'Équipement' },
];

// Données pour les graphiques
const repartitionBudget = [
  { name: 'Informatique', value: 150000, color: '#4338ca' },
  { name: 'Marketing', value: 120000, color: '#0ea5e9' },
  { name: 'Logistique', value: 80000, color: '#10b981' },
  { name: 'Finance', value: 70000, color: '#f59e0b' },
  { name: 'Direction', value: 200000, color: '#ec4899' },
 
];

const repartitionDepenses = [
  { name: 'Équipement', value: 120000, color: '#4338ca' },
  { name: 'Logiciels', value: 85000, color: '#0ea5e9' },
  { name: 'Mobilier', value: 65000, color: '#10b981' },
  { name: 'Services', value: 180000, color: '#f59e0b' },
  { name: 'Fournitures', value: 35000, color: '#ec4899' },
  { name: 'Frais divers', value: 25000, color: '#6b7280' },
];

// Colonnes pour le tableau des budgets par département
const budgetColumns: ColumnDef<BudgetDepartement>[] = [
  {
    accessorKey: 'departement',
    header: ({ column }) => (
      <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Département <ArrowDownUp className="ml-2 h-4 w-4" />
      </div>
    ),
  },
  {
    accessorKey: 'alloue',
    header: 'Budget alloué',
    cell: ({ row }) => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'MGA',
        maximumFractionDigits: 0
      }).format(row.original.alloue);
    },
  },
  {
    accessorKey: 'consomme',
    header: 'Consommé',
    cell: ({ row }) => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'MGA',
        maximumFractionDigits: 0
      }).format(row.original.consomme);
    },
  },
  {
    accessorKey: 'engage',
    header: 'Engagé',
    cell: ({ row }) => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'MGA',
        maximumFractionDigits: 0
      }).format(row.original.engage);
    },
  },
  {
    accessorKey: 'disponible',
    header: 'Disponible',
    cell: ({ row }) => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'MGA',
        maximumFractionDigits: 0
      }).format(row.original.disponible);
    },
  },
  {
    id: 'progression',
    header: 'Progression',
    cell: ({ row }) => {
      const consomme = row.original.consomme;
      const alloue = row.original.alloue;
      const pourcentage = Math.round((consomme / alloue) * 100);
      
      let progressClass = 'bg-green-500';
      if (pourcentage >= 90) {
        progressClass = 'bg-red-500';
      } else if (pourcentage >= 75) {
        progressClass = 'bg-yellow-500';
      }
      
      return (
        <div className="w-full">
          <div className="flex justify-between items-center mb-1 text-xs">
            <span>{pourcentage}%</span>
            <span>{new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: 'MGA',
              maximumFractionDigits: 0
            }).format(consomme)} / {new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: 'MGA',
              maximumFractionDigits: 0
            }).format(alloue)}</span>
          </div>
          <Progress value={pourcentage} className="h-2" indicatorClassName={progressClass} />
        </div>
      );
    },
  },
];

// Colonnes pour le tableau des dépenses
const depensesColumns: ColumnDef<DepenseBudgetaire>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
  },
  {
    accessorKey: 'reference',
    header: 'Référence',
  },
  {
    accessorKey: 'nature',
    header: 'Nature',
  },
  {
    accessorKey: 'departement',
    header: 'Département',
  },
  {
    accessorKey: 'categorie',
    header: 'Catégorie',
  },
  {
    accessorKey: 'montant',
    header: ({ column }) => (
      <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Montant <ArrowDownUp className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'MGA'
      }).format(row.original.montant);
    },
  },
];

// Composant principal pour la gestion budgétaire
const Budgets = () => {
  const [selectedDepartement, setSelectedDepartement] = useState<string>('all');
  
  // Calcul des totaux
  const totalAlloue = budgetsDepartements.reduce((acc, curr) => acc + curr.alloue, 0);
  const totalConsomme = budgetsDepartements.reduce((acc, curr) => acc + curr.consomme, 0);
  const totalEngage = budgetsDepartements.reduce((acc, curr) => acc + curr.engage, 0);
  const totalDisponible = budgetsDepartements.reduce((acc, curr) => acc + curr.disponible, 0);
  const pourcentageConsomme = Math.round((totalConsomme / totalAlloue) * 100);
  
  // Filtrer les dépenses en fonction du département sélectionné
  const filteredDepenses = selectedDepartement === 'all'
    ? depensesBudgetaires
    : depensesBudgetaires.filter(d => d.departement === selectedDepartement);
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Gestion budgétaire</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle allocation
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Budget total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'MGA',
                maximumFractionDigits: 0
              }).format(totalAlloue)}
            </div>
            <p className="text-xs text-muted-foreground">Budget annuel alloué</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Consommé</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'MGA',
                maximumFractionDigits: 0
              }).format(totalConsomme)}
            </div>
            <p className="text-xs text-muted-foreground">{pourcentageConsomme}% du budget total</p>
            <Progress value={pourcentageConsomme} className="h-1.5 mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Engagé</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'MGA',
                maximumFractionDigits: 0
              }).format(totalEngage)}
            </div>
            <p className="text-xs text-muted-foreground">{Math.round((totalEngage / totalAlloue) * 100)}% du budget total</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Disponible</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'MGA',
                maximumFractionDigits: 0
              }).format(totalDisponible)}
            </div>
            <p className="text-xs text-muted-foreground">{Math.round((totalDisponible / totalAlloue) * 100)}% du budget total</p>
            
            <Button variant="link" className="p-0 h-auto text-xs mt-2">
              <RefreshCw className="h-3 w-3 mr-1" />
              Réallouer des fonds
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="repartition">
        <TabsList>
          <TabsTrigger value="repartition">Répartition budgétaire</TabsTrigger>
          <TabsTrigger value="departements">Par département</TabsTrigger>
          <TabsTrigger value="depenses">Dépenses</TabsTrigger>
          <TabsTrigger value="previsionnel">Prévisionnel</TabsTrigger>
        </TabsList>

        <TabsContent value="repartition" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <BudgetChart 
              data={repartitionBudget} 
              title="Répartition par département" 
              description="Budget alloué à chaque département"
            />
            
            <BudgetChart 
              data={repartitionDepenses} 
              title="Répartition par catégorie" 
              description="Dépenses par type de catégorie"
            />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Répartition budgétaire détaillée</CardTitle>
              <CardDescription>Vue d'ensemble des budgets par département</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable 
                columns={budgetColumns} 
                data={budgetsDepartements}
                searchColumn="departement"
                searchPlaceholder="Rechercher un département..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departements">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Budgets par département</CardTitle>
                  <CardDescription>Suivi détaillé par département</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-sm font-medium">Département:</div>
                  <select 
                    className="border rounded px-2 py-1 text-sm"
                    value={selectedDepartement}
                    onChange={(e) => setSelectedDepartement(e.target.value)}
                  >
                    <option value="all">Tous les départements</option>
                    {budgetsDepartements.map((dept) => (
                      <option key={dept.id} value={dept.departement}>
                        {dept.departement}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {(selectedDepartement === 'all' ? budgetsDepartements : budgetsDepartements.filter(d => d.departement === selectedDepartement)).map((dept) => (
                  <div key={dept.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">{dept.departement}</h3>
                      <div className="text-sm font-medium">
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'MGA',
                          maximumFractionDigits: 0
                        }).format(dept.consomme)} / {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'MGA',
                          maximumFractionDigits: 0
                        }).format(dept.alloue)}
                      </div>
                    </div>
                    
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 rounded-full bg-green-200 text-green-800">
                            {Math.round((dept.consomme / dept.alloue) * 100)}%
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold inline-block text-muted-foreground">
                            Disponible: {new Intl.NumberFormat('fr-FR', {
                              style: 'currency',
                              currency: 'MGA',
                              maximumFractionDigits: 0
                            }).format(dept.disponible)}
                          </span>
                        </div>
                      </div>
                      <div className="flex h-2 mb-4 overflow-hidden text-xs bg-muted rounded">
                        <div 
                          style={{ width: `${Math.round((dept.consomme / dept.alloue) * 100)}%` }}
                          className="flex flex-col justify-center text-center text-white bg-green-500 shadow-none whitespace-nowrap"
                        ></div>
                        <div 
                          style={{ width: `${Math.round((dept.engage / dept.alloue) * 100)}%` }}
                          className="flex flex-col justify-center text-center text-white bg-yellow-500 shadow-none whitespace-nowrap"
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Consommé: {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'MGA',
                          maximumFractionDigits: 0
                        }).format(dept.consomme)}</span>
                        <span>Engagé: {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'MGA',
                          maximumFractionDigits: 0
                        }).format(dept.engage)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="depenses">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Historique des dépenses</CardTitle>
                  <CardDescription>Ensemble des dépenses réalisées</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-sm font-medium">Filtrer par département:</div>
                  <select 
                    className="border rounded px-2 py-1 text-sm"
                    value={selectedDepartement}
                    onChange={(e) => setSelectedDepartement(e.target.value)}
                  >
                    <option value="all">Tous les départements</option>
                    {budgetsDepartements.map((dept) => (
                      <option key={dept.id} value={dept.departement}>
                        {dept.departement}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable 
                columns={depensesColumns} 
                data={filteredDepenses}
                searchColumn="nature"
                searchPlaceholder="Rechercher une dépense..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="previsionnel">
          <Card>
            <CardHeader>
              <CardTitle>Prévisions budgétaires</CardTitle>
              <CardDescription>Analyse des tendances et prévisions de dépenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {budgetsDepartements.map((dept) => (
                  <div key={dept.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">{dept.departement}</h3>
                      <div className="text-sm text-muted-foreground">Prévision: {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'MGA',
                        maximumFractionDigits: 0
                      }).format(dept.previsionnel)} / {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'MGA',
                        maximumFractionDigits: 0
                      }).format(dept.alloue)}</div>
                    </div>
                    
                    <div className="relative pt-1">
                      <div className="flex h-2 mb-1 overflow-hidden text-xs bg-muted rounded">
                        <div 
                          style={{ width: `${Math.round((dept.consomme / dept.alloue) * 100)}%` }}
                          className="flex flex-col justify-center text-center text-white bg-green-500 shadow-none whitespace-nowrap"
                        ></div>
                        <div 
                          style={{ width: `${Math.round((dept.engage / dept.alloue) * 100)}%` }}
                          className="flex flex-col justify-center text-center text-white bg-yellow-500 shadow-none whitespace-nowrap"
                        ></div>
                      </div>
                      <div className="mt-1 mb-2 h-2 w-full relative">
                        <div className="absolute h-2 w-px bg-gray-500 top-0" style={{ left: `${Math.round((dept.previsionnel / dept.alloue) * 100)}%` }}></div>
                        <div className="absolute -top-6 transform -translate-x-1/2 text-xs font-medium" style={{ left: `${Math.round((dept.previsionnel / dept.alloue) * 100)}%` }}>
                          Prévision
                        </div>
                        <div 
                          className={`absolute -bottom-5 transform -translate-x-1/2 text-xs ${dept.previsionnel > dept.alloue ? 'text-red-600' : 'text-green-600'}`} 
                          style={{ left: `${Math.round((dept.previsionnel / dept.alloue) * 100)}%` }}
                        >
                          {dept.previsionnel > dept.alloue 
                            ? `+${Math.round(((dept.previsionnel - dept.alloue) / dept.alloue) * 100)}%` 
                            : `-${Math.round(((dept.alloue - dept.previsionnel) / dept.alloue) * 100)}%`}
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-4">
                        <span>Réel: {Math.round(((dept.consomme + dept.engage) / dept.alloue) * 100)}%</span>
                        <span>Prévision: {Math.round((dept.previsionnel / dept.alloue) * 100)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Budgets;
