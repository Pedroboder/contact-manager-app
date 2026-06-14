import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Plus, Trash2, Edit, Eye, Search } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import ContactDetail from "@/components/ContactDetail";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function Contacts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);

  // Queries
  const { data: contacts = [], isLoading: isLoadingContacts, refetch: refetchContacts } = trpc.contacts.list.useQuery();
  const { data: searchResults = [] } = trpc.contacts.search.useQuery(
    { query: searchQuery },
    { enabled: searchQuery.length > 0 }
  );

  // Mutations
  const createMutation = trpc.contacts.create.useMutation({
    onSuccess: () => {
      toast.success("Contato criado com sucesso!");
      setIsCreateDialogOpen(false);
      refetchContacts();
    },
    onError: (error) => {
      toast.error(`Erro ao criar contato: ${error.message}`);
    },
  });

  const updateMutation = trpc.contacts.update.useMutation({
    onSuccess: () => {
      toast.success("Contato atualizado com sucesso!");
      setIsEditDialogOpen(false);
      setSelectedContact(null);
      refetchContacts();
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar contato: ${error.message}`);
    },
  });

  const deleteMutation = trpc.contacts.delete.useMutation({
    onSuccess: () => {
      toast.success("Contato deletado com sucesso!");
      setIsDeleteDialogOpen(false);
      setSelectedContact(null);
      refetchContacts();
    },
    onError: (error) => {
      toast.error(`Erro ao deletar contato: ${error.message}`);
    },
  });

  // Filtered contacts based on search
  const displayedContacts = useMemo(() => {
    return searchQuery.length > 0 ? searchResults : contacts;
  }, [searchQuery, searchResults, contacts]);

  const handleCreate = (data: any) => {
    createMutation.mutate(data);
  };

  const handleUpdate = (data: any) => {
    if (!selectedContact) return;
    updateMutation.mutate({ id: selectedContact.id, ...data });
  };

  const handleDelete = () => {
    if (!selectedContact) return;
    deleteMutation.mutate({ id: selectedContact.id });
  };

  const handleViewDetail = (contact: any) => {
    setSelectedContact(contact);
    setIsDetailDialogOpen(true);
  };

  const handleEdit = (contact: any) => {
    setSelectedContact(contact);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (contact: any) => {
    setSelectedContact(contact);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contatos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie seus contatos pessoais de forma segura e organizada
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Contato
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, email ou telefone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
        </div>
      </Card>

      {/* Contacts Table */}
      <Card>
        {isLoadingContacts ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : displayedContacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-2">
            <p className="text-muted-foreground">Nenhum contato encontrado</p>
            {searchQuery && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery("")}
              >
                Limpar busca
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Cidade</TableHead>
                  <TableHead className="text-right">Acoes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedContacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell className="font-medium">{contact.nome}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {contact.email || "-"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {contact.telefone || "-"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {contact.cidade || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetail(contact)}
                          title="Ver detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(contact)}
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(contact)}
                          title="Deletar"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Novo Contato</DialogTitle>
          </DialogHeader>
          <ContactForm
            onSubmit={handleCreate}
            isLoading={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Contato</DialogTitle>
          </DialogHeader>
          {selectedContact && (
            <ContactForm
              initialData={selectedContact}
              onSubmit={handleUpdate}
              isLoading={updateMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do Contato</DialogTitle>
          </DialogHeader>
          {selectedContact && <ContactDetail contact={selectedContact} />}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deletar Contato?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar o contato "{selectedContact?.nome}"? Esta acao nao pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Deletar
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
