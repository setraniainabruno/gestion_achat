import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

const formSchema = z.object({
  natureDemande: z
    .string()
    .min(2, { message: "La nature de la demande est requise" }),
  departement: z.string().min(1, { message: "Le département est requis" }),
  description: z.string().min(5, {
    message: "La description doit contenir au moins 5 caractères",
  }),
  quantite: z.coerce.number().min(1, {
    message: "La quantité doit être d'au moins 1",
  }),
  urgence: z.enum(["faible", "moyenne", "elevee", "critique"], {
    required_error: "Le niveau d'urgence est requis",
  }),
  impactStrategique: z.enum(["faible", "moyen", "important", "critique"], {
    required_error: "L'impact stratégique est requis",
  }),
  justification: z.string().min(5, {
    message: "La justification doit contenir au moins 5 caractères",
  }),
  siConfidentiel: z.boolean().default(false),
});

export function DemandeForm() {
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nature: "",
      description: "",
      quantite: 1,
      urgence: "3",
      impact: "3",
      confidentiel: false,
      departement: "",
      justification: "",
    },
  });

  // Fonction pour soumettre le formulaire
  interface FormData {
    natureDemande: string;
    departement: string;
    description: string;
    quantite: number;
    urgence: string;
    impactStrategique: string;
    justification: string;
    siConfidentiel: boolean;
  }

  async function onSubmit(
    formValues: FormData,
    selectedFiles: File[],
    setIsSaving: (value: boolean) => void,
    form: { reset: () => void },
    setSelectedFiles: (files: File[]) => void
  ) {
    setIsSaving(true);
    const demandeur_id = uuidv4();

    try {
      // 1. Création du FormData
      const formData = new FormData();

      // 2. Ajout des champs obligatoires
      formData.append("demandeur_id", demandeur_id);
      formData.append("status", "en_attente"); // Statut par défaut
      formData.append("dateDemande", new Date().toISOString());

      // 3. Ajout des champs du formulaire
      (Object.keys(formValues) as Array<keyof FormData>).forEach((key) => {
        const value = formValues[key];
        formData.append(
          key,
          typeof value === "boolean" ? value.toString() : String(value)
        );
      });

      // 4. Ajout des fichiers avec métadonnées
      selectedFiles.forEach((file, index) => {
        formData.append(`pieceJustificative_${index}`, file, file.name);
        formData.append(
          `pieceJustificative_${index}_metadata`,
          JSON.stringify({
            name: file.name,
            type: file.type,
            size: file.size,
            lastModified: file.lastModified,
          })
        );
      });

      // 5. Envoi à l'API
      const response = await axios.post(
        "http://localhost:8000/demandeAchat/creer/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            "X-Request-ID": uuidv4(), // ID unique pour la requête
          },
          timeout: 10000, // 10 secondes timeout
        }
      );

      // 6. Gestion de la réponse
      if (response.status >= 200 && response.status < 300) {
        toast.success("Demande créée avec succès", {
          description: `Référence: ${response.data.reference || demandeur_id}`,
        });
        form.reset();
        setSelectedFiles([]);
      } else {
        throw new Error(`Réponse inattendue: ${response.status}`);
      }
    } catch (error) {
      // 7. Gestion fine des erreurs
      if (axios.isAxiosError(error)) {
        console.error("Erreur Axios:", {
          config: error.config,
          response: error.response?.data,
          status: error.response?.status,
        });

        toast.error("Erreur lors de la soumission", {
          description:
            error.response?.data?.message ||
            error.response?.data?.detail ||
            error.message,
        });
      } else {
        console.error("Erreur inattendue:", error);
        toast.error("Une erreur inconnue est survenue");
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 animate-fade-in"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="natureDemande"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nature de la demande</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner la nature" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="materiel">Matériel</SelectItem>
                    <SelectItem value="logiciel">Logiciel</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="fourniture">
                      Fourniture de bureau
                    </SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="departement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Département</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un département" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="informatique">Informatique</SelectItem>
                    <SelectItem value="finance">
                      Finance et comptable
                    </SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="operations">Logistique</SelectItem>
                    <SelectItem value="direction">Direction</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description détaillée</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Décrivez en détail votre demande..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="quantite"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantité</FormLabel>
                <FormControl>
                  <Input type="number" min={1} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="urgence"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Niveau d'urgence</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner l'urgence" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="faible">Faible</SelectItem>
                      <SelectItem value="moyenne">Moyenne</SelectItem>
                      <SelectItem value="elevee">Élevée</SelectItem>
                      <SelectItem value="critique">Critique</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="impactStrategique"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Impact stratégique</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner l'impact" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="faible">Faible</SelectItem>
                      <SelectItem value="moyen">Moyen</SelectItem>
                      <SelectItem value="important">Important</SelectItem>
                      <SelectItem value="critique">Critique</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="justification"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Justification</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Pourquoi cet achat est-il nécessaire?"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="siConfidentiel"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Demande confidentielle</FormLabel>
                <FormDescription>
                  Cochez cette case si la demande contient des informations
                  sensibles
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <Separator />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset();
              setSelectedFiles([]);
            }}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">↻</span>
                Soumission en cours...
              </span>
            ) : (
              "Soumettre la demande"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
