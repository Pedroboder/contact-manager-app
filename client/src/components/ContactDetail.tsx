import { Mail, Phone, MapPin } from "lucide-react";

interface ContactDetailProps {
  contact: any;
}

export default function ContactDetail({ contact }: ContactDetailProps) {
  return (
    <div className="space-y-6">
      {/* Nome */}
      <div>
        <h2 className="text-2xl font-bold">{contact.nome}</h2>
      </div>

      {/* Contato */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase">Contato</h3>
        {contact.email && (
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
              {contact.email}
            </a>
          </div>
        )}
        {contact.telefone && (
          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <a href={`tel:${contact.telefone}`} className="text-blue-600 hover:underline">
              {contact.telefone}
            </a>
          </div>
        )}
      </div>

      {/* Endereco */}
      {(contact.rua || contact.cidade) && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase">Endereco</h3>
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
            <div className="text-sm">
              {contact.rua && <div>{contact.rua}</div>}
              {contact.numero && <div>{contact.numero}</div>}
              {contact.complemento && <div>{contact.complemento}</div>}
              {contact.bairro && <div>{contact.bairro}</div>}
              {contact.cidade && (
                <div>
                  {contact.cidade}
                  {contact.estado && `, ${contact.estado}`}
                </div>
              )}
              {contact.cep && <div>{contact.cep}</div>}
            </div>
          </div>
        </div>
      )}

      {/* Data de Criacao */}
      {contact.createdAt && (
        <div className="text-xs text-muted-foreground pt-4 border-t">
          Criado em {new Date(contact.createdAt).toLocaleDateString("pt-BR")}
        </div>
      )}
    </div>
  );
}
