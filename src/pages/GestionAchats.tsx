import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { CheckCircle2, Plus, Trash2, XCircle, Download, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useReactToPrint } from 'react-to-print';

// Données statiques
const departments = ['Informatique', 'Finance', 'Marketing', 'Direction Générale', 'Logistique'];

// Budget annuel par département (en MGA)
const budgetAnnuel: Record<string, number> = {
  Marketing: 200000000,
  Informatique: 480000000,
  RH: 120000000,
  Finance: 160000000,
  Commercial: 240000000,
  'R&D': 320000000,
  Direction: 400000000,
};

interface Materiel {
  nom: string;
  quantite: number;
  prixUnitaire: number;
  prixTotal: number;
}

interface Devis {
  id: string;
  date: string;
  demandeur: {
    nom: string;
    departement: string;
  };
  fournisseur: string;
  materiels: Materiel[];
  total: number;
  statut: 'en attente' | 'approuvé' | 'rejeté';
  motifRejet?: string;
}

const GestionAchats = () => {
  const [formData, setFormData] = useState({
    fournisseur: '',
    departement: '',
    demandeur: 'Jean Dupont',
  });

  const [materiels, setMateriels] = useState<Materiel[]>([
    { nom: '', quantite: 1, prixUnitaire: 0, prixTotal: 0 },
  ]);

  const [devisList, setDevisList] = useState<Devis[]>([]);
  const [lastDevis, setLastDevis] = useState<Devis | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const detailsRef = useRef<HTMLDivElement>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'MGA',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMaterielChange = (index: number, field: keyof Materiel, value: string | number) => {
    const newMateriels = [...materiels];
    newMateriels[index] = {
      ...newMateriels[index],
      [field]: value,
    };

    if (field === 'quantite' || field === 'prixUnitaire') {
      newMateriels[index].prixTotal = 
        Number(newMateriels[index].quantite) * Number(newMateriels[index].prixUnitaire);
    }

    setMateriels(newMateriels);
  };

  const addMateriel = () => {
    setMateriels([...materiels, { nom: '', quantite: 1, prixUnitaire: 0, prixTotal: 0 }]);
  };

  const removeMateriel = (index: number) => {
    if (materiels.length > 1) {
      const newMateriels = [...materiels];
      newMateriels.splice(index, 1);
      setMateriels(newMateriels);
    }
  };

  const calculateTotal = () => {
    return materiels.reduce((sum, item) => sum + item.prixTotal, 0);
  };

  const handleGeneratePDF = useReactToPrint({
    content: () => detailsRef.current,
    pageStyle: `
      @page { size: A4; margin: 1cm; }
      @media print {
        body { -webkit-print-color-adjust: exact; }
        .no-print { display: none !important; }
      }
    `,
    documentTitle: `Devis_${lastDevis?.id || ''}`,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fournisseur || !formData.departement) {
      toast.error('Veuillez saisir un fournisseur et sélectionner un département');
      return;
    }

    for (const materiel of materiels) {
      if (!materiel.nom || materiel.prixUnitaire <= 0) {
        toast.error('Veuillez remplir tous les champs des matériels');
        return;
      }
    }

    const total = calculateTotal();
    const budgetDisponible = budgetAnnuel[formData.departement] || 0;
    const statut = total <= budgetDisponible ? 'approuvé' : 'rejeté';

    const newDevis: Devis = {
      id: `DEV-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().split('T')[0],
      demandeur: {
        nom: formData.demandeur,
        departement: formData.departement,
      },
      fournisseur: formData.fournisseur,
      materiels: [...materiels],
      total,
      statut,
      motifRejet: statut === 'rejeté' ? `Dépassement du budget annuel (${formatCurrency(budgetDisponible)})` : undefined,
    };

    setDevisList([newDevis, ...devisList]);
    setLastDevis(newDevis);
    setFormData({ fournisseur: '', departement: '', demandeur: 'Jean Dupont' });
    setMateriels([{ nom: '', quantite: 1, prixUnitaire: 0, prixTotal: 0 }]);

    if (statut === 'approuvé') {
      setShowSuccessModal(true);
    }

    toast[statut === 'approuvé' ? 'success' : 'warning'](
      statut === 'approuvé' ? 'Devis approuvé !' : 'Devis rejeté (dépassement budget)',
      { description: statut === 'rejeté' ? `Budget disponible: ${formatCurrency(budgetDisponible)}` : undefined }
    );
  };

  const handleSendToFinance = () => {
    setShowSuccessModal(false);
    toast.success('Devis envoyé au département finance', {
      description: 'Votre devis a été transmis pour validation finale',
      action: {
        label: 'Voir',
        onClick: () => {
          detailsRef.current?.scrollIntoView({ behavior: 'smooth' });
        },
      },
    });
  };

  const devisColumns: ColumnDef<Devis>[] = [
    { accessorKey: 'id', header: 'Référence' },
    { accessorKey: 'date', header: 'Date' },
    { accessorKey: 'demandeur.departement', header: 'Département' },
    { accessorKey: 'fournisseur', header: 'Fournisseur' },
    { 
      accessorKey: 'total', 
      header: 'Montant total',
      cell: ({ row }) => formatCurrency(row.original.total)
    },
    { 
      accessorKey: 'statut', 
      header: 'Statut',
      cell: ({ row }) => {
        const statut = row.original.statut;
        return (
          <Badge variant={statut === 'approuvé' ? 'default' : 'destructive'}>
            {statut === 'approuvé' ? (
              <CheckCircle2 className="h-4 w-4 mr-1" />
            ) : (
              <XCircle className="h-4 w-4 mr-1" />
            )}
            {statut}
          </Badge>
        );
      }
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Button 
          variant="outline"
          size="sm"
          onClick={() => {
            const devis = row.original;
            toast.info(`Détails du devis ${devis.id}`, {
              description: (
                <div className="space-y-2 mt-2">
                  <p><strong>Département:</strong> {devis.demandeur.departement}</p>
                  <p><strong>Demandeur:</strong> {devis.demandeur.nom}</p>
                  <p><strong>Fournisseur:</strong> {devis.fournisseur}</p>
                  <div className="mt-3">
                    <p className="font-medium">Matériels:</p>
                    <ul className="list-disc pl-5">
                      {devis.materiels.map((m, i) => (
                        <li key={i}>
                          {m.nom} - {m.quantite}x {formatCurrency(m.prixUnitaire)} = {formatCurrency(m.prixTotal)}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="font-medium">
                    Total: {formatCurrency(devis.total)}
                  </p>
                  {devis.statut === 'rejeté' && (
                    <p className="text-red-600">
                      <strong>Motif:</strong> {devis.motifRejet}
                    </p>
                  )}
                </div>
              ),
            });
          }}
        >
          Détails
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Gestion des achats</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Nouveau devis</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="departement">Département</Label>
                  <Select
                    value={formData.departement}
                    onValueChange={(value) => handleSelectChange('departement', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un département" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fournisseur">Fournisseur</Label>
                  <Input
                    id="fournisseur"
                    name="fournisseur"
                    value={formData.fournisseur}
                    onChange={handleInputChange}
                    placeholder="Nom du fournisseur"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Matériels</Label>
                <div className="space-y-4">
                  {materiels.map((materiel, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-end">
                      <div className="col-span-5 space-y-1">
                        <Label htmlFor={`materiel-${index}`}>Achat</Label>
                        <Input
                          id={`materiel-${index}`}
                          placeholder="Nom du matériel"
                          value={materiel.nom}
                          onChange={(e) => handleMaterielChange(index, 'nom', e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-span-2 space-y-1">
                        <Label htmlFor={`quantite-${index}`}>Quantité</Label>
                        <Input
                          id={`quantite-${index}`}
                          type="number"
                          min="1"
                          value={materiel.quantite}
                          onChange={(e) => handleMaterielChange(index, 'quantite', parseInt(e.target.value) || 0)}
                          required
                        />
                      </div>
                      <div className="col-span-2 space-y-1">
                        <Label htmlFor={`prix-${index}`}>P.U (MGA)</Label>
                        <Input
                          id={`prix-${index}`}
                          type="number"
                          min="0"
                          step="1000"
                          value={materiel.prixUnitaire}
                          onChange={(e) => handleMaterielChange(index, 'prixUnitaire', parseFloat(e.target.value) || 0)}
                          required
                        />
                      </div>
                      <div className="col-span-2 space-y-1">
                        <Label>Total</Label>
                        <div className="h-10 flex items-center px-3 border rounded-md text-sm">
                          {formatCurrency(materiel.prixTotal)}
                        </div>
                      </div>
                      <div className="col-span-1">
                        {materiels.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeMateriel(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={addMateriel}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un matériel
                </Button>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-lg font-medium">
                  Total: {formatCurrency(calculateTotal())}
                </div>
                <Button type="submit">Enregistrer</Button>
              </div>

              {formData.departement && (
                <div className="text-sm text-muted-foreground">
                  Budget annuel: {formatCurrency(budgetAnnuel[formData.departement] || 0)}
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Historique des devis</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={devisColumns}
              data={devisList}
              searchPlaceholder="Rechercher un devis..."
              emptyMessage="Aucun devis enregistré"
            />
          </CardContent>
        </Card>
      </div>

      {lastDevis && (
        <div ref={detailsRef} className="mt-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Détails du devis {lastDevis.id}</CardTitle>
              <div className="flex gap-2 no-print">
                <Button variant="outline" onClick={handleGeneratePDF}>
                  <Download className="h-4 w-4 mr-2" />
                  Exporter en PDF
                </Button>
                {lastDevis.statut === 'approuvé' && (
                  <Button onClick={() => setShowSuccessModal(true)}>
                    Envoyer au finance <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p>{lastDevis.date}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Département</p>
                  <p>{lastDevis.demandeur.departement}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Demandeur</p>
                  <p>{lastDevis.demandeur.nom}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fournisseur</p>
                  <p>{lastDevis.fournisseur}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Statut</p>
                  <Badge variant={lastDevis.statut === 'approuvé' ? 'default' : 'destructive'}>
                    {lastDevis.statut === 'approuvé' ? (
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                    ) : (
                      <XCircle className="h-4 w-4 mr-1" />
                    )}
                    {lastDevis.statut}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Budget département</p>
                  <p>{formatCurrency(budgetAnnuel[lastDevis.demandeur.departement] || 0)}</p>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Achat</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix unitaire (MGA)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total (MGA)</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {lastDevis.materiels.map((materiel, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">{materiel.nom}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{materiel.quantite}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {formatCurrency(materiel.prixUnitaire)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {formatCurrency(materiel.prixTotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-right font-medium">Total</td>
                      <td className="px-6 py-4 whitespace-nowrap font-bold">
                        {formatCurrency(lastDevis.total)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {lastDevis.statut === 'rejeté' && (
                <div className="mt-4 p-4 bg-red-50 rounded-lg">
                  <p className="text-red-600 font-medium">Motif de rejet:</p>
                  <p>{lastDevis.motifRejet}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent>
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
            <DialogTitle className="text-center">Devis approuvé avec succès!</DialogTitle>
            <DialogDescription className="text-center">
              Votre devis a été enregistré et est prêt à être envoyé au département finance pour validation finale.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex justify-center gap-4">
            <Button variant="outline" onClick={() => setShowSuccessModal(false)}>
              Modifier
            </Button>
            <Button onClick={handleSendToFinance}>
              Envoyer au finance <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GestionAchats;