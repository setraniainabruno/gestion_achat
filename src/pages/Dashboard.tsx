
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BudgetChart } from '@/components/charts/BudgetChart';
import { StockChart } from '@/components/charts/StockChart';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, Plus, ShoppingCart, Box, FileText, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

// Données pour les graphiques
const stockData = [
  { nom: 'Ordinateurs', quantite: 24, seuil: 10 },
  { nom: 'Écrans', quantite: 32, seuil: 15 },
  { nom: 'Claviers', quantite: 45, seuil: 20 },
  { nom: 'Souris', quantite: 38, seuil: 20 },
  { nom: 'Téléphones', quantite: 12, seuil: 8 },
  { nom: 'Imprimantes', quantite: 5, seuil: 4 },
];

const budgetData = [
  { name: 'Informatique', value: 45000, color: '#4338ca' },
  { name: 'Mobilier', value: 20000, color: '#0ea5e9' },
  { name: 'Fournitures', value: 15000, color: '#10b981' },
  { name: 'Services', value: 30000, color: '#f59e0b' },
  { name: 'Autres', value: 10000, color: '#6b7280' },
];

// Données pour les demandes récentes
const recentesDemandes = [
  { id: 'DEM-2023-001', date: '2023-06-15', nature: 'Ordinateurs portables', demandeur: 'Marie Lambert', status: 'approved' },
  { id: 'DEM-2023-002', date: '2023-06-14', nature: 'Mobilier de bureau', demandeur: 'Thomas Dubois', status: 'pending' },
  { id: 'DEM-2023-003', date: '2023-06-12', nature: 'Licences logicielles', demandeur: 'Sophie Martin', status: 'processing' },
  { id: 'DEM-2023-004', date: '2023-06-10', nature: 'Matériel réseau', demandeur: 'Lucas Petit', status: 'rejected' },
];

// Données pour les alertes stocks
const alertesStock = [
  { id: 1, produit: 'Cartouches d\'encre', quantite: 3, seuil: 5, status: 'warning' },
  { id: 2, produit: 'Papier A4', quantite: 2, seuil: 10, status: 'critical' },
  { id: 3, produit: 'Disques durs SSD', quantite: 4, seuil: 5, status: 'warning' },
];

// Composant de statistique
interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: string;
  trendValue?: string;
  trendUp?: boolean;
}

const StatCard = ({ title, value, description, icon, trend, trendValue, trendUp }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
      {trend && (
        <div className={`flex items-center mt-2 text-xs ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
          <span>{trendValue}</span>
          <span className="ml-1">{trend}</span>
        </div>
      )}
    </CardContent>
  </Card>
);

const Dashboard = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <Button asChild>
          <Link to="/demande-achat">
            <Plus className="mr-2 h-4 w-4" /> Nouvelle demande
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Demandes en cours"
          value="12"
          description="Demandes en attente de traitement"
          icon={<ShoppingCart className="h-4 w-4" />}
          trend="ce mois"
          trendValue="+4"
          trendUp={true}
        />
        <StatCard
          title="En attente de validation"
          value="8"
          description="Demandes nécessitant votre approbation"
          icon={<FileText className="h-4 w-4" />}
        />
        <StatCard
          title="Budget consommé"
          value="68%"
          description="Du budget annuel a été utilisé"
          icon={<Box className="h-4 w-4" />}
          trend="vs. prévision"
          trendValue="-5%"
          trendUp={true}
        />
        <StatCard
          title="Alertes stock"
          value="3"
          description="Produits sous le seuil minimal"
          icon={<AlertCircle className="h-4 w-4" />}
          trend="nouveau"
          trendValue="+1"
          trendUp={false}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <BudgetChart data={budgetData} title="Répartition budgétaire" description="Budget par catégorie" />
        <StockChart data={stockData} title="État des stocks" description="Quantités disponibles et seuils minimaux" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Demandes récentes</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/demande-achat">
                  Voir tout <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <CardDescription>Les dernières demandes d'achat soumises</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentesDemandes.map((demande) => (
                <div key={demande.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div>
                    <div className="font-medium">{demande.nature}</div>
                    <div className="text-sm text-muted-foreground">
                      {demande.demandeur} - {demande.date}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <StatusBadge status={demande.status as any} />
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/demande-achat/${demande.id}`}>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Alertes de stock</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/stocks">
                  Voir tout <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <CardDescription>Produits en dessous du seuil minimal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alertesStock.map((alerte) => (
                <div key={alerte.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div>
                    <div className="font-medium">{alerte.produit}</div>
                    <div className="text-sm text-muted-foreground">
                      Quantité: {alerte.quantite} (seuil: {alerte.seuil})
                    </div>
                  </div>
                  <div>
                    <StatusBadge status={alerte.status as any} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
