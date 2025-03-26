import React, { useState } from 'react';
import { FileText, Download, Search, Filter, Plus, MoreHorizontal } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import PageHeader from '@/components/layout/PageHeader';

// Données de démonstration pour les factures
const FACTURES = [
  {
    id: "FAC-2023-001",
    date: "2023-11-15",
    fournisseur: "TechPro Solutions",
    montant: 3850.75,
    statut: "Payée",
    echeance: "2023-12-15",
    materiel: "Ordinateurs portables (x5)",
    departement: "IT"
  },
  {
    id: "FAC-2023-002",
    date: "2023-11-20",
    fournisseur: "Bureau Express",
    montant: 1250.30,
    statut: "En attente",
    echeance: "2023-12-20",
    materiel: "Mobilier de bureau",
    departement: "Administration"
  },
  {
    id: "FAC-2023-003",
    date: "2023-11-25",
    fournisseur: "MédicalSupply",
    montant: 4500.00,
    statut: "Payée",
    echeance: "2023-12-25",
    materiel: "Équipement médical",
    departement: "Médical"
  },
  {
    id: "FAC-2023-004",
    date: "2023-11-30",
    fournisseur: "LogiPro",
    montant: 2350.45,
    statut: "En retard",
    echeance: "2023-12-05",
    materiel: "Matériel logistique",
    departement: "Logistique"
  },
  {
    id: "FAC-2023-005",
    date: "2023-12-01",
    fournisseur: "TechPro Solutions",
    montant: 1875.20,
    statut: "En attente",
    echeance: "2024-01-01",
    materiel: "Serveurs (x2)",
    departement: "IT"
  }
];

const Factures = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statutFilter, setStatutFilter] = useState('all');
  const [departementFilter, setDepartementFilter] = useState('all');

  // Filtrage des factures en fonction des critères
  const filteredFactures = FACTURES.filter(facture => {
    const matchesSearch = 
      facture.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      facture.fournisseur.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facture.materiel.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatut = statutFilter === 'all' || facture.statut === statutFilter;
    const matchesDepartement = departementFilter === 'all' || facture.departement === departementFilter;
    
    return matchesSearch && matchesStatut && matchesDepartement;
  });

  // Fonction pour obtenir la classe CSS selon le statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Payée':
        return 'bg-green-500';
      case 'En attente':
        return 'bg-yellow-500';
      case 'En retard':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader title="Gestion des Factures">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Facture
        </Button>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Factures matériels</CardTitle>
          <CardDescription>
            Gérez toutes les factures liées aux achats de matériels.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Rechercher une facture..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-4 flex-col sm:flex-row">
              <Select value={statutFilter} onValueChange={setStatutFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="Payée">Payée</SelectItem>
                  <SelectItem value="En attente">En attente</SelectItem>
                  <SelectItem value="En retard">En retard</SelectItem>
                </SelectContent>
              </Select>
              <Select value={departementFilter} onValueChange={setDepartementFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tous les départements" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les départements</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="Administration">Administration</SelectItem>
                  <SelectItem value="Médical">Médical</SelectItem>
                  <SelectItem value="Logistique">Logistique</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N° Facture</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Fournisseur</TableHead>
                  <TableHead>Matériel</TableHead>
                  <TableHead>Département</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Échéance</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFactures.map((facture) => (
                  <TableRow key={facture.id}>
                    <TableCell className="font-medium">{facture.id}</TableCell>
                    <TableCell>{new Date(facture.date).toLocaleDateString('fr-FR')}</TableCell>
                    <TableCell>{facture.fournisseur}</TableCell>
                    <TableCell>{facture.materiel}</TableCell>
                    <TableCell>{facture.departement}</TableCell>
                    <TableCell>{facture.montant.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</TableCell>
                    <TableCell>{new Date(facture.echeance).toLocaleDateString('fr-FR')}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(facture.statut)}>
                        {facture.statut}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" />
                            Voir les détails
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Télécharger PDF
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Factures;