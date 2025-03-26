
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import PageHeader from '@/components/layout/PageHeader';

const Parametres = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader title="Paramètres" />
      
      <Tabs defaultValue="general">
        <TabsList className="mb-6">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="integrations">Intégrations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres Généraux</CardTitle>
              <CardDescription>
                Configurez les paramètres de base de l'application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Informations de l'entreprise</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Nom de l'entreprise</Label>
                    <Input id="company-name" defaultValue="OptimAchats SAS" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vat">Numéro de TVA</Label>
                    <Input id="vat" defaultValue="FR87654321098" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse</Label>
                    <Input id="address" defaultValue="123 Avenue des Achats" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Ville</Label>
                    <Input id="city" defaultValue="Paris" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postal-code">Code Postal</Label>
                    <Input id="postal-code" defaultValue="75001" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Pays</Label>
                    <Select defaultValue="france">
                      <SelectTrigger id="country">
                        <SelectValue placeholder="Sélectionner un pays" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="france">France</SelectItem>
                        <SelectItem value="belgium">Belgique</SelectItem>
                        <SelectItem value="switzerland">Suisse</SelectItem>
                        <SelectItem value="canada">Canada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Préférences d'affichage</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="themeMode">Thème</Label>
                      <p className="text-sm text-muted-foreground">
                        Choisissez le thème de l'interface.
                      </p>
                    </div>
                    <RadioGroup defaultValue="system" className="flex space-x-2">
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="light" id="light" />
                        <Label htmlFor="light">Clair</Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="dark" id="dark" />
                        <Label htmlFor="dark">Sombre</Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="system" id="system" />
                        <Label htmlFor="system">Système</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Format de date</Label>
                      <p className="text-sm text-muted-foreground">
                        Choisissez le format pour les dates.
                      </p>
                    </div>
                    <Select defaultValue="dd/mm/yyyy">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Format de date" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="language">Langue</Label>
                      <p className="text-sm text-muted-foreground">
                        Sélectionnez la langue de l'interface.
                      </p>
                    </div>
                    <Select defaultValue="fr">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Langue" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline">Annuler</Button>
              <Button>Enregistrer</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="workflow" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration du Workflow</CardTitle>
              <CardDescription>
                Configurez les étapes de validation et d'approbation des demandes d'achat.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Validation hiérarchique</Label>
                    <p className="text-sm text-muted-foreground">
                      Activer la validation des demandes par les responsables hiérarchiques.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Validation financière</Label>
                    <p className="text-sm text-muted-foreground">
                      Exiger une validation du département financier pour toutes les demandes.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Seuil de double validation</Label>
                    <p className="text-sm text-muted-foreground">
                      Montant à partir duquel une double validation est requise.
                    </p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Input 
                      type="number" 
                      defaultValue="5000" 
                      className="w-24 text-right"
                    />
                    <span>€</span>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Automatisation</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Demande de devis automatique</Label>
                    <p className="text-sm text-muted-foreground">
                      Envoyer automatiquement des demandes de devis aux fournisseurs référencés.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Alerte de seuil de stock</Label>
                    <p className="text-sm text-muted-foreground">
                      Créer automatiquement des demandes d'achat lorsque le stock atteint le seuil critique.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Approbation automatique</Label>
                    <p className="text-sm text-muted-foreground">
                      Approuver automatiquement les demandes inférieures à un montant défini.
                    </p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Seuil d'approbation automatique</Label>
                    <p className="text-sm text-muted-foreground">
                      Montant en dessous duquel les demandes sont automatiquement approuvées.
                    </p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Input 
                      type="number" 
                      defaultValue="200" 
                      className="w-24 text-right"
                      disabled
                    />
                    <span>€</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline">Annuler</Button>
              <Button>Enregistrer</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de Notifications</CardTitle>
              <CardDescription>
                Configurez vos préférences de notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notifications Email</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Nouvelles demandes</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir un email lors de la création d'une nouvelle demande.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Demandes à approuver</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir un email lorsqu'une demande nécessite votre validation.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Statut des demandes</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir un email lors des changements de statut de vos demandes.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Rappels</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir des rappels pour les demandes en attente de validation.
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notifications dans l'application</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Toutes les notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Activer toutes les notifications dans l'application.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sons de notification</Label>
                    <p className="text-sm text-muted-foreground">
                      Jouer un son lors de la réception d'une notification.
                    </p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Alertes de stock</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir des notifications pour les niveaux de stock bas.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Alertes budgétaires</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir des notifications pour les dépassements budgétaires.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline">Annuler</Button>
              <Button>Enregistrer</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de Sécurité</CardTitle>
              <CardDescription>
                Configurez les options de sécurité et de confidentialité.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Authentification</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Authentification à deux facteurs (2FA)</Label>
                    <p className="text-sm text-muted-foreground">
                      Exiger l'authentification à deux facteurs pour tous les utilisateurs.
                    </p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Durée de session</Label>
                    <p className="text-sm text-muted-foreground">
                      Durée avant déconnexion automatique (en minutes).
                    </p>
                  </div>
                  <Select defaultValue="60">
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Durée" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15</SelectItem>
                      <SelectItem value="30">30</SelectItem>
                      <SelectItem value="60">60</SelectItem>
                      <SelectItem value="120">120</SelectItem>
                      <SelectItem value="240">240</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Complexité du mot de passe</Label>
                    <p className="text-sm text-muted-foreground">
                      Niveau de complexité requis pour les mots de passe.
                    </p>
                  </div>
                  <Select defaultValue="high">
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Niveau" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Basique</SelectItem>
                      <SelectItem value="medium">Moyen</SelectItem>
                      <SelectItem value="high">Élevé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Rotation du mot de passe</Label>
                    <p className="text-sm text-muted-foreground">
                      Exiger un changement de mot de passe tous les X jours.
                    </p>
                  </div>
                  <Select defaultValue="90">
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Jours" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Jamais</SelectItem>
                      <SelectItem value="30">30 jours</SelectItem>
                      <SelectItem value="60">60 jours</SelectItem>
                      <SelectItem value="90">90 jours</SelectItem>
                      <SelectItem value="180">180 jours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Confidentialité</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Chiffrement des données</Label>
                    <p className="text-sm text-muted-foreground">
                      Chiffrer toutes les données sensibles dans la base de données.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Journaux d'audit</Label>
                    <p className="text-sm text-muted-foreground">
                      Enregistrer toutes les actions des utilisateurs dans des journaux d'audit.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Conservation des journaux</Label>
                    <p className="text-sm text-muted-foreground">
                      Durée de conservation des journaux d'audit.
                    </p>
                  </div>
                  <Select defaultValue="365">
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Jours" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="90">90 jours</SelectItem>
                      <SelectItem value="180">180 jours</SelectItem>
                      <SelectItem value="365">1 an</SelectItem>
                      <SelectItem value="730">2 ans</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline">Annuler</Button>
              <Button>Enregistrer</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Intégrations</CardTitle>
              <CardDescription>
                Gérez les intégrations avec d'autres systèmes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>ERP</Label>
                    <p className="text-sm text-muted-foreground">
                      Synchroniser les données avec le système ERP de l'entreprise.
                    </p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>CRM</Label>
                    <p className="text-sm text-muted-foreground">
                      Intégrer les données clients du CRM.
                    </p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Comptabilité</Label>
                    <p className="text-sm text-muted-foreground">
                      Connecter au logiciel de comptabilité.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Fournisseurs</Label>
                    <p className="text-sm text-muted-foreground">
                      Connecter aux portails fournisseurs pour les commandes automatisées.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">API</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Accès API</Label>
                    <p className="text-sm text-muted-foreground">
                      Autoriser l'accès via l'API pour les systèmes externes.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <Label>Clé API</Label>
                  <div className="flex gap-2">
                    <Input 
                      defaultValue="sk_live_51NzbLKBrbhC4Fa4xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" 
                      type="password"
                      readOnly
                      className="font-mono"
                    />
                    <Button variant="outline" size="icon">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Utilisez cette clé pour l'authentification à l'API. Ne la partagez jamais.
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Rotation automatique des clés</Label>
                    <p className="text-sm text-muted-foreground">
                      Faire tourner automatiquement les clés API tous les 90 jours.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline">Annuler</Button>
              <Button>Enregistrer</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Parametres;
