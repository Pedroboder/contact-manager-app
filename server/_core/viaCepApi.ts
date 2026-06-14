/**
 * Helper para integração com API ViaCEP
 * Busca automaticamente o endereço baseado no CEP fornecido
 */

export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

export interface AddressData {
  rua: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

/**
 * Busca endereço na API ViaCEP baseado no CEP
 * @param cep - CEP no formato com ou sem hífen (ex: "01310100" ou "01310-100")
 * @returns Dados do endereço ou null se não encontrado
 */
export async function fetchAddressByCep(cep: string): Promise<AddressData | null> {
  try {
    // Remove caracteres especiais do CEP
    const cleanCep = cep.replace(/\D/g, "");

    if (cleanCep.length !== 8) {
      throw new Error("CEP deve conter 8 dígitos");
    }

    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.statusText}`);
    }

    const data: ViaCepResponse = await response.json();

    if (data.erro) {
      return null; // CEP não encontrado
    }

    return {
      rua: data.logradouro || "",
      bairro: data.bairro || "",
      cidade: data.localidade || "",
      estado: data.uf || "",
      cep: data.cep || cleanCep,
    };
  } catch (error) {
    console.error("[ViaCEP] Erro ao buscar endereço:", error);
    throw new Error("Falha ao buscar endereço pelo CEP");
  }
}
