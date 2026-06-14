import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ContactFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export default function ContactForm({ initialData, onSubmit, isLoading = false }: ContactFormProps) {
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    email: "",
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
  });

  const [isSearchingCep, setIsSearchingCep] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearchCep = async () => {
    if (!formData.cep || formData.cep.length < 8) {
      toast.error("CEP deve conter pelo menos 8 digitos");
      return;
    }

    setIsSearchingCep(true);
    try {
      const cleanCep = formData.cep.replace(/\D/g, "");
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();

      if (data.erro) {
        toast.error("CEP nao encontrado");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        rua: data.logradouro || "",
        bairro: data.bairro || "",
        cidade: data.localidade || "",
        estado: data.uf || "",
      }));
      toast.success("Endereco encontrado!");
    } catch (error) {
      toast.error("Erro ao buscar CEP");
    } finally {
      setIsSearchingCep(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome.trim()) {
      toast.error("Nome eh obrigatorio");
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nome */}
      <div className="space-y-2">
        <Label htmlFor="nome">Nome *</Label>
        <Input
          id="nome"
          name="nome"
          value={formData.nome}
          onChange={handleInputChange}
          placeholder="Digite o nome completo"
          required
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="exemplo@email.com"
        />
      </div>

      {/* Telefone */}
      <div className="space-y-2">
        <Label htmlFor="telefone">Telefone</Label>
        <Input
          id="telefone"
          name="telefone"
          value={formData.telefone}
          onChange={handleInputChange}
          placeholder="(11) 99999-9999"
        />
      </div>

      {/* CEP */}
      <div className="space-y-2">
        <Label htmlFor="cep">CEP</Label>
        <div className="flex gap-2">
          <Input
            id="cep"
            name="cep"
            value={formData.cep}
            onChange={handleInputChange}
            placeholder="00000-000"
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleSearchCep}
            disabled={isSearchingCep || !formData.cep}
          >
            {isSearchingCep && <Loader2 className="w-4 h-4 animate-spin" />}
            {!isSearchingCep && "Buscar"}
          </Button>
        </div>
      </div>

      {/* Rua */}
      <div className="space-y-2">
        <Label htmlFor="rua">Rua</Label>
        <Input
          id="rua"
          name="rua"
          value={formData.rua}
          onChange={handleInputChange}
          placeholder="Nome da rua"
        />
      </div>

      {/* Numero */}
      <div className="space-y-2">
        <Label htmlFor="numero">Numero</Label>
        <Input
          id="numero"
          name="numero"
          value={formData.numero}
          onChange={handleInputChange}
          placeholder="123"
        />
      </div>

      {/* Complemento */}
      <div className="space-y-2">
        <Label htmlFor="complemento">Complemento</Label>
        <Input
          id="complemento"
          name="complemento"
          value={formData.complemento}
          onChange={handleInputChange}
          placeholder="Apto 101, Bloco A"
        />
      </div>

      {/* Bairro */}
      <div className="space-y-2">
        <Label htmlFor="bairro">Bairro</Label>
        <Input
          id="bairro"
          name="bairro"
          value={formData.bairro}
          onChange={handleInputChange}
          placeholder="Nome do bairro"
        />
      </div>

      {/* Cidade */}
      <div className="space-y-2">
        <Label htmlFor="cidade">Cidade</Label>
        <Input
          id="cidade"
          name="cidade"
          value={formData.cidade}
          onChange={handleInputChange}
          placeholder="Nome da cidade"
        />
      </div>

      {/* Estado */}
      <div className="space-y-2">
        <Label htmlFor="estado">Estado</Label>
        <Input
          id="estado"
          name="estado"
          value={formData.estado}
          onChange={handleInputChange}
          placeholder="SP"
          maxLength={2}
        />
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {initialData ? "Atualizar Contato" : "Criar Contato"}
      </Button>
    </form>
  );
}
