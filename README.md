# Contact Manager Pro

Uma aplicacao web elegante e completa para gerenciamento de contatos pessoais, desenvolvida com React 19, Tailwind 4, Express 4 e tRPC 11.

---

## Sobre o Projeto

Contact Manager Pro eh uma solucao moderna para gerenciar seus contatos pessoais de forma segura e intuitiva. Cada usuario autenticado pode visualizar, criar, editar e deletar seus proprios contatos, com isolamento total de dados entre usuarios.

### Funcionalidades Principais

- **Autenticacao Segura**: Login exclusivo via Manus OAuth
- **CRUD Completo**: Criar, ler, atualizar e deletar contatos
- **Busca de CEP Automatica**: Integracao com API ViaCEP para preenchimento automatico de endereco
- **Busca e Filtragem**: Pesquise contatos por nome, email ou telefone em tempo real
- **Interface Elegante**: Design refinado com paleta de cores OKLCH e tipografia Geist
- **Isolamento de Dados**: Cada usuario acessa apenas seus proprios contatos
- **Dashboard Intuitivo**: Sidebar navegavel e interface responsiva

---

## Stack Tecnologico

### Frontend
- **React 19**: Framework UI moderno
- **Tailwind CSS 4**: Estilizacao utilitaria
- **shadcn/ui**: Componentes de UI reutilizaveis
- **tRPC**: Type-safe RPC client
- **Wouter**: Roteamento leve

### Backend
- **Express 4**: Servidor web
- **tRPC 11**: RPC type-safe
- **Drizzle ORM**: Query builder SQL
- **MySQL/TiDB**: Banco de dados

### Autenticacao
- **Manus OAuth**: Autenticacao segura

---

## Estrutura do Projeto

```
contact-manager-app/
├── client/                    # Frontend React
│   ├── src/
│   │   ├── pages/            # Paginas da aplicacao
│   │   ├── components/       # Componentes reutilizaveis
│   │   ├── contexts/         # React contexts
│   │   ├── hooks/            # Custom hooks
│   │   ├── lib/              # Utilitarios
│   │   └── index.css         # Estilos globais
│   └── index.html
├── server/                    # Backend Express
│   ├── routers.ts            # Procedimentos tRPC
│   ├── db.ts                 # Query helpers
│   ├── storage.ts            # Helpers de armazenamento S3
│   └── _core/                # Infraestrutura interna
├── drizzle/                   # Esquema e migracoes
│   └── schema.ts             # Definicao de tabelas
├── shared/                    # Codigo compartilhado
└── package.json
```

---

## Comecando

### Requisitos
- Node.js 22+
- pnpm 10+

### Instalacao

1. Clone o repositorio:
```bash
git clone https://github.com/Pedroboder/contact-manager-app.git
cd contact-manager-app
```

2. Instale as dependencias:
```bash
pnpm install
```

3. Configure as variaveis de ambiente (crie um arquivo `.env`):
```
DATABASE_URL=seu_banco_de_dados
JWT_SECRET=sua_chave_secreta
VITE_APP_ID=seu_app_id
```

4. Execute as migracoes do banco de dados:
```bash
pnpm db:push
```

5. Inicie o servidor de desenvolvimento:
```bash
pnpm dev
```

A aplicacao estara disponivel em `http://localhost:5173`

---

## Uso

### Autenticacao
- Clique em "Fazer Login" para autenticar via Manus OAuth
- Apos autenticar, voce sera redirecionado para o dashboard

### Gerenciar Contatos
1. **Ver Contatos**: Acesse a pagina "Meus Contatos" via sidebar
2. **Criar**: Clique em "Novo Contato" e preencha os dados
3. **Buscar CEP**: Digite o CEP e clique em "Buscar" para preencher endereco automaticamente
4. **Editar**: Clique no icone de editar para modificar um contato
5. **Visualizar**: Clique no icone de visualizar para ver detalhes completos
6. **Deletar**: Clique no icone de deletar e confirme a exclusao

### Buscar Contatos
Use a barra de busca para filtrar contatos por:
- Nome
- Email
- Telefone

---

## Desenvolvimento

### Scripts Disponveis

```bash
# Desenvolvimento
pnpm dev              # Inicia servidor de desenvolvimento

# Build
pnpm build            # Cria build de producao

# Testes
pnpm test             # Executa testes com Vitest

# Verificacoes
pnpm check            # Verifica tipos TypeScript
pnpm format           # Formata codigo com Prettier

# Banco de Dados
pnpm db:push          # Gera e aplica migracoes
```

### Estrutura de Procedimentos tRPC

Os procedimentos sao definidos em `server/routers.ts`:

```typescript
// Exemplo de procedimento protegido
contacts: router({
  list: protectedProcedure.query(({ ctx }) => 
    getContactsByUserId(ctx.user.id)
  ),
  create: protectedProcedure
    .input(contactSchema)
    .mutation(({ ctx, input }) => 
      createContact(ctx.user.id, input)
    ),
})
```

### Adicionar Novos Contatos

1. Atualize o schema em `drizzle/schema.ts`
2. Execute `pnpm db:push` para gerar migracao
3. Adicione helpers de query em `server/db.ts`
4. Crie procedimentos em `server/routers.ts`
5. Implemente UI em `client/src/pages/`

---

## Testes

Execute os testes com:
```bash
pnpm test
```

Os testes sao escritos com Vitest e cobrem:
- Autenticacao (logout)
- Listagem de contatos
- Isolamento de dados por usuario

---

## Seguranca

- **Isolamento de Dados**: Cada usuario acessa apenas seus contatos
- **Autenticacao OAuth**: Apenas Manus OAuth eh suportado
- **Type Safety**: tRPC garante type-safety end-to-end
- **Validacao**: Todos os inputs sao validados com Zod

---

## Performance

- **Queries Otimizadas**: Indices no banco para buscas rapidas
- **Caching**: React Query cache para reducao de requisicoes
- **Lazy Loading**: Componentes carregados sob demanda
- **Code Splitting**: Vite automaticamente faz split de codigo

---

## Deployment

Para fazer deploy em producao:

1. Build a aplicacao:
```bash
pnpm build
```

2. Inicie o servidor:
```bash
pnpm start
```

A aplicacao estara disponivel na porta 3000.

---

## Contribuindo

Contribuicoes sao bem-vindas! Por favor:

1. Faça um fork do repositorio
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudancas (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## Licenca

Este projeto esta licenciado sob a Licenca MIT - veja o arquivo LICENSE para detalhes.

