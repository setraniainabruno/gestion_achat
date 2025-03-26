
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BudgetChart } from '@/components/charts/BudgetChart';
import { StockChart } from '@/components/charts/StockChart';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { 
  BarChart3, 
  Download, 
  FileText, 
  LineChart, 
  PieChart, 
  Share2 
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart as RechartsLineChart, Line } from 'recharts';

// Types pour les rapports
interface RapportDemande {
  id: string;
  mois: string;
  nbDemandes: number;
  nbApprouvees: number;
  nbRejetees: number;
  montantTotal: number;
  tempsTraitement: number;
}

// Données pour les statistiques des demandes
const statsDemandesData: RapportDemande[] = [
  { id: '1', mois: 'Janvier', nbDemandes: 45, nbApprouvees: 38, nbRejetees: 7, montantTotal: 68000, tempsTraitement: 3.2 },
  { id: '2', mois: 'Février', nbDemandes: 52, nbApprouvees: 45, nbRejetees: 7, montantTotal: 73500, tempsTraitement: 3.5 },
  { id: '3', mois: 'Mars', nbDemandes: 48, nbApprouvees: 40, nbRejetees: 8, montantTotal: 65000, tempsTraitement: 2.8 },
  { id: '4', mois: 'Avril', nbDemandes: 56, nbApprouvees: 50, nbRejetees: 6, montantTotal: 82000, tempsTraitement: 2.5 },
  { id: '5', mois: 'Mai', nbDemandes: 62, nbApprouvees: 53, nbRejetees: 9, montantTotal: 91000, tempsTraitement: 2.2 },
  { id: '6', mois: 'Juin', nbDemandes: 58, nbApprouvees: 48, nbRejetees: 10, montantTotal: 85000, tempsTraitement: 2.0 },
];

// Données pour les graphiques
const repartitionCategorie = [
  { name: 'Informatique', value: 120000, color: '#4338ca' },
  { name: 'Mobilier', value: 45000, color: '#0ea5e9' },
  { name: 'Fournitures', value: 35000, color: '#10b981' },
  { name: 'Services', value: 95000, color: '#f59e0b' },
  { name: 'Autres', value: 25000, color: '#6b7280' },
];

// Données pour le graphique d'évolution des dépenses
const evolutionDepenses = [
  { mois: 'Jan', informatique: 12000, fournitures: 5000, services: 8000, mobilier: 3000, autres: 2000 },
  { mois: 'Fév', informatique: 15000, fournitures: 6000, services: 10000, mobilier: 5000, autres: 2500 },
  { mois: 'Mar', informatique: 11000, fournitures: 5500, services: 9000, mobilier: 2000, autres: 3000 },
  { mois: 'Avr', informatique: 16000, fournitures: 7000, services: 12000, mobilier: 6000, autres: 3500 },
  { mois: 'Mai', informatique: 18000, fournitures: 6500, services: 15000, mobilier: 8000, autres: 4000 },
  { mois: 'Juin', informatique: 16500, fournitures: 5000, services: 14000, mobilier: 7000, autres: 2500 },
];

// Données pour l'évolution du temps de traitement
const evolutionTraitement = [
  { mois: 'Jan', temps: 3.2, demandes: 45 },
  { mois: 'Fév', temps: 3.5, demandes: 52 },
  { mois: 'Mar', temps: 2.8, demandes: 48 },
  { mois: 'Avr', temps: 2.5, demandes: 56 },
  { mois: 'Mai', temps: 2.2, demandes: 62 },
  { mois: 'Juin', temps: 2.0, demandes: 58 },
];

// Données pour le top des demandeurs
const topDemandeurs = [
  { departement: 'Informatique', demandes: 85, montant: 120000, color: '#4338ca' },
  { departement: 'Marketing', demandes: 65, montant: 95000, color: '#0ea5e9' },
  { departement: 'Commercial', demandes: 55, montant: 85000, color: '#10b981' },
  { departement: 'R&D', demandes: 45, montant: 110000, color: '#f59e0b' },
  { departement: 'RH', demandes: 30, montant: 45000, color: '#6b7280' },
];

// Données pour les stocks
const stocksData = [
  { nom: 'Ordinateurs', quantite: 24, seuil: 10 },
  { nom: 'Écrans', quantite: 32, seuil: 15 },
  { nom: 'Claviers', quantite: 45, seuil: 20 },
  { nom: 'Souris', quantite: 38, seuil: 20 },
  { nom: 'Téléphones', quantite: 12, seuil: 8 },
  { nom: 'Imprimantes', quantite: 5, seuil: 4 },
];

// Colonnes pour le tableau des statistiques des demandes
const statsDemandesColumns: ColumnDef<RapportDemande>[] = [
  {
    accessorKey: 'mois',
    header: 'Mois',
  },
  {
    accessorKey: 'nbDemandes',
    header: 'Demandes',
  },
  {
    accessorKey: 'nbApprouvees',
    header: 'Approuvées',
    cell: ({ row }) => {
      const approuvees = row.original.nbApprouvees;
      const total = row.original.nbDemandes;
      const pourcentage = Math.round((approuvees / total) * 100);
      
      return (
        <div>
          <span>{approuvees}</span>
          <span className="text-xs text-muted-foreground ml-1">({pourcentage}%)</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'nbRejetees',
    header: 'Rejetées',
    cell: ({ row }) => {
      const rejetees = row.original.nbRejetees;
      const total = row.original.nbDemandes;
      const pourcentage = Math.round((rejetees / total) * 100);
      
      return (
        <div>
          <span>{rejetees}</span>
          <span className="text-xs text-muted-foreground ml-1">({pourcentage}%)</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'montantTotal',
    header: 'Montant total',
    cell: ({ row }) => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0
      }).format(row.original.montantTotal);
    },
  },
  {
    accessorKey: 'tempsTraitement',
    header: 'Temps moyen (jours)',
  },
];

// Composant pour le graphique d'évolution des dépenses
const DepensesEvolutionChart = () => (
  <Card>
    <CardHeader>
      <CardTitle>Évolution des dépenses par catégorie</CardTitle>
      <CardDescription>Répartition mensuelle des dépenses</CardDescription>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={evolutionDepenses}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mois" />
          <YAxis />
          <Tooltip formatter={(value) => new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
          }).format(value as number)} />
          <Legend />
          <Bar dataKey="informatique" name="Informatique" stackId="a" fill="#4338ca" />
          <Bar dataKey="fournitures" name="Fournitures" stackId="a" fill="#0ea5e9" />
          <Bar dataKey="services" name="Services" stackId="a" fill="#10b981" />
          <Bar dataKey="mobilier" name="Mobilier" stackId="a" fill="#f59e0b" />
          <Bar dataKey="autres" name="Autres" stackId="a" fill="#6b7280" />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

// Composant pour le graphique d'évolution du temps de traitement
const TraitementEvolutionChart = () => (
  <Card>
    <CardHeader>
      <CardTitle>Évolution du temps de traitement</CardTitle>
      <CardDescription>Temps moyen de traitement des demandes</CardDescription>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={350}>
        <RechartsLineChart
          data={evolutionTraitement}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mois" />
          <YAxis yAxisId="left" orientation="left" stroke="#4338ca" domain={[0, 5]} />
          <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" domain={[0, 80]} />
          <Tooltip />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="temps" name="Temps moyen (jours)" stroke="#4338ca" activeDot={{ r: 8 }} />
          <Line yAxisId="right" type="monotone" dataKey="demandes" name="Nombre de demandes" stroke="#f59e0b" />
        </RechartsLineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

// Composant principal pour le reporting
const Reporting = () => {
  const [periode, setPeriode] = useState('6mois');
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tableaux de bord et reporting</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Partager
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Exporter PDF
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium">Période:</div>
            <Select value={periode} onValueChange={setPeriode}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sélectionner une période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1mois">Dernier mois</SelectItem>
                <SelectItem value="3mois">3 derniers mois</SelectItem>
                <SelectItem value="6mois">6 derniers mois</SelectItem>
                <SelectItem value="12mois">12 derniers mois</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <BarChart3 className="mr-2 h-4 w-4" />
            Graphiques
          </Button>
          <Button variant="outline" size="sm">
            <PieChart className="mr-2 h-4 w-4" />
            Camemberts
          </Button>
          <Button variant="outline" size="sm">
            <LineChart className="mr-2 h-4 w-4" />
            Courbes
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Tableaux
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total demandes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">321</div>
            <p className="text-xs text-muted-foreground">Sur les 6 derniers mois</p>
            <div className="text-xs text-green-600 mt-1">+8% vs période précédente</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Taux d'approbation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85.4%</div>
            <p className="text-xs text-muted-foreground">274 demandes approuvées</p>
            <div className="text-xs text-green-600 mt-1">+2.1% vs période précédente</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Temps moyen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.7 jours</div>
            <p className="text-xs text-muted-foreground">Temps de traitement moyen</p>
            <div className="text-xs text-green-600 mt-1">-0.5 jour vs période précédente</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Montant total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'EUR',
                maximumFractionDigits: 0
              }).format(464500)}
            </div>
            <p className="text-xs text-muted-foreground">Dépenses approuvées</p>
            <div className="text-xs text-red-600 mt-1">+12% vs période précédente</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">Vue générale</TabsTrigger>
          <TabsTrigger value="demandes">Demandes</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="stocks">Stocks</TabsTrigger>
          <TabsTrigger value="performances">Performances</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <BudgetChart 
              data={repartitionCategorie} 
              title="Répartition des dépenses par catégorie" 
              description="Cumul sur la période sélectionnée"
            />
            
            <DepensesEvolutionChart />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top des départements demandeurs</CardTitle>
                <CardDescription>Nombre de demandes et montants</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topDemandeurs.map((dept, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.color }}></div>
                        <div className="font-medium">{dept.departement}</div>
                      </div>
                      <div className="flex gap-8">
                        <div>
                          <div className="text-sm font-medium text-right">{dept.demandes}</div>
                          <div className="text-xs text-muted-foreground text-right">demandes</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-right">
                            {new Intl.NumberFormat('fr-FR', {
                              style: 'currency',
                              currency: 'EUR',
                              maximumFractionDigits: 0
                            }).format(dept.montant)}
                          </div>
                          <div className="text-xs text-muted-foreground text-right">montant</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <TraitementEvolutionChart />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Statistiques mensuelles des demandes</CardTitle>
              <CardDescription>Données pour les 6 derniers mois</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable 
                columns={statsDemandesColumns} 
                data={statsDemandesData}
                searchColumn="mois"
                searchPlaceholder="Rechercher un mois..."
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="demandes">
          <Card>
            <CardHeader>
              <CardTitle>Analyse détaillée des demandes</CardTitle>
              <CardDescription>Tendances et statistiques sur les demandes d'achat</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-medium mb-4">Évolution des demandes</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsLineChart
                      data={statsDemandesData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mois" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="nbDemandes" name="Total demandes" stroke="#4338ca" />
                      <Line type="monotone" dataKey="nbApprouvees" name="Approuvées" stroke="#10b981" />
                      <Line type="monotone" dataKey="nbRejetees" name="Rejetées" stroke="#ef4444" />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Évolution des montants</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={statsDemandesData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mois" />
                      <YAxis />
                      <Tooltip formatter={(value) => new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'EUR'
                      }).format(value as number)} />
                      <Legend />
                      <Bar dataKey="montantTotal" name="Montant total" fill="#4338ca" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Données détaillées</h3>
                <DataTable 
                  columns={statsDemandesColumns} 
                  data={statsDemandesData}
                  searchColumn="mois"
                  searchPlaceholder="Rechercher un mois..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="budget" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <BudgetChart 
              data={repartitionCategorie} 
              title="Répartition des dépenses par catégorie" 
              description="Cumul sur la période sélectionnée"
            />
            
            <DepensesEvolutionChart />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Progression budgétaire</CardTitle>
              <CardDescription>Consommation des budgets par département</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {topDemandeurs.map((dept, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium">{dept.departement}</h3>
                      <div className="text-sm">
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'EUR',
                          maximumFractionDigits: 0
                        }).format(dept.montant)} / {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'EUR',
                          maximumFractionDigits: 0
                        }).format(dept.montant * 1.5)}
                      </div>
                    </div>
                    
                    <div className="relative pt-1">
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-muted">
                        <div 
                          style={{ width: `${Math.round((dept.montant / (dept.montant * 1.5)) * 100)}%` }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>{Math.round((dept.montant / (dept.montant * 1.5)) * 100)}% consommé</span>
                        <span>{dept.demandes} demandes</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stocks">
          <Card>
            <CardHeader>
              <CardTitle>Analyse des stocks</CardTitle>
              <CardDescription>État actuel et mouvements des stocks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <StockChart 
                data={stocksData} 
                title="État des stocks" 
                description="Quantités disponibles et seuils minimaux"
              />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Mouvements de stock récents</h3>
                <div className="border rounded-md">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">Article</th>
                        <th className="px-4 py-2 text-left">Type</th>
                        <th className="px-4 py-2 text-left">Quantité</th>
                        <th className="px-4 py-2 text-left">Référence</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="px-4 py-2">16/06/2023</td>
                        <td className="px-4 py-2">Ordinateurs portables</td>
                        <td className="px-4 py-2">
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Entrée</span>
                        </td>
                        <td className="px-4 py-2">5</td>
                        <td className="px-4 py-2">BON-2023-008</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2">15/06/2023</td>
                        <td className="px-4 py-2">Écrans 24"</td>
                        <td className="px-4 py-2">
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Sortie</span>
                        </td>
                        <td className="px-4 py-2">2</td>
                        <td className="px-4 py-2">DEM-2023-020</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2">14/06/2023</td>
                        <td className="px-4 py-2">Claviers sans fil</td>
                        <td className="px-4 py-2">
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Sortie</span>
                        </td>
                        <td className="px-4 py-2">3</td>
                        <td className="px-4 py-2">DEM-2023-019</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2">12/06/2023</td>
                        <td className="px-4 py-2">Souris optiques</td>
                        <td className="px-4 py-2">
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Sortie</span>
                        </td>
                        <td className="px-4 py-2">3</td>
                        <td className="px-4 py-2">DEM-2023-019</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Alertes de stock</h3>
                <div className="border rounded-md p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-md">
                      <div className="flex items-center">
                        <div className="h-2 w-2 bg-red-500 rounded-full mr-2"></div>
                        <span>Papier A4</span>
                      </div>
                      <div className="text-sm">
                        Quantité: <span className="font-medium">2</span> (seuil: 10)
                      </div>
                      <Button size="sm" variant="outline">Commander</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-100 rounded-md">
                      <div className="flex items-center">
                        <div className="h-2 w-2 bg-yellow-500 rounded-full mr-2"></div>
                        <span>Cartouches d'encre</span>
                      </div>
                      <div className="text-sm">
                        Quantité: <span className="font-medium">3</span> (seuil: 5)
                      </div>
                      <Button size="sm" variant="outline">Commander</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-100 rounded-md">
                      <div className="flex items-center">
                        <div className="h-2 w-2 bg-yellow-500 rounded-full mr-2"></div>
                        <span>Disques durs SSD</span>
                      </div>
                      <div className="text-sm">
                        Quantité: <span className="font-medium">4</span> (seuil: 5)
                      </div>
                      <Button size="sm" variant="outline">Commander</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performances">
          <Card>
            <CardHeader>
              <CardTitle>Indicateurs de performance</CardTitle>
              <CardDescription>Analyse des KPIs du processus d'achat</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Temps moyen de traitement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2.7 jours</div>
                    <div className="mt-1 text-xs text-green-600">-18.2% par rapport à l'année précédente</div>
                    <div className="h-1 w-full bg-muted mt-3 rounded">
                      <div className="h-1 bg-green-500 rounded" style={{ width: '65%' }}></div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Objectif: 2.5 jours</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Taux d'approbation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">85.4%</div>
                    <div className="mt-1 text-xs text-green-600">+2.1% par rapport à l'année précédente</div>
                    <div className="h-1 w-full bg-muted mt-3 rounded">
                      <div className="h-1 bg-green-500 rounded" style={{ width: '85%' }}></div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Objectif: 90%</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Conformité budgétaire</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">92.7%</div>
                    <div className="mt-1 text-xs text-green-600">+1.4% par rapport à l'année précédente</div>
                    <div className="h-1 w-full bg-muted mt-3 rounded">
                      <div className="h-1 bg-green-500 rounded" style={{ width: '92%' }}></div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Objectif: 95%</div>
                  </CardContent>
                </Card>
              </div>
              
              <TraitementEvolutionChart />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Efficacité du processus</h3>
                <div className="border rounded-md p-4">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Demandes traitées dans les délais</span>
                        <span className="text-sm font-medium">87%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '87%' }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Demandes avec tous les justificatifs</span>
                        <span className="text-sm font-medium">92%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Satisfaction des utilisateurs</span>
                        <span className="text-sm font-medium">4.2/5</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '84%' }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">ROI moyen des demandes</span>
                        <span className="text-sm font-medium">3.8x</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '76%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reporting;
