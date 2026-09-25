# DevShowcase Service 🚀

> API RESTful para vitrine de desenvolvedores, gerenciamento de projetos de portfólio, catálogo de tecnologias e avaliações/feedbacks técnicos.

---

## 🛠️ Tecnologias Utilizadas

- **Runtime & Linguagem**: [Node.js](https://nodejs.org/) (v24) com [TypeScript](https://www.typescriptlang.org/)
- **Framework Web**: [Express](https://expressjs.com/)
- **ORM & Banco de Dados**: [Prisma ORM](https://www.prisma.io/) com [PostgreSQL](https://www.postgresql.org/) (Docker Compose localmente / [Supabase](https://supabase.com/) em produção)
- **Validação de Dados & DTOs**: [Zod](https://zod.dev/)
- **Testes Automatizados**: [Vitest](https://vitest.dev/) e [Supertest](https://github.com/ladjs/supertest)

---

## 🏛️ Arquitetura em Camadas

O projeto adota uma arquitetura em camadas com separação clara de responsabilidades:

```
src/
├── config/             # Configurações de ambiente e instância única do Prisma Client
├── controllers/        # Controladores HTTP (tratam requisições e respostas)
├── dtos/               # Data Transfer Objects com Schemas de validação Zod
├── errors/             # Classes de erro customizadas (AppError)
├── middlewares/        # Middlewares de validação, erro global e rota 404
├── repositories/       # Camada de acesso a dados (abstração de persistência)
├── routes/             # Definição e agrupamento de rotas REST
├── services/           # Regras de negócio e casos de uso
├── app.ts              # Configuração do Express e encadeamento de middlewares
└── server.ts           # Inicialização do servidor HTTP na porta configurada
```

---

## 📊 Modelagem Entidade-Relacionamento

A modelagem de dados mapeia rigorosamente os relacionamentos solicitados:

- **`Profile 1 : N Project`**: Um perfil de desenvolvedor pode ter múltiplos projetos vinculados.
- **`Project N : N Technology`**: Um projeto utiliza várias tecnologias, e uma tecnologia pode estar presente em vários projetos (tabela de junção implícita com integridade referencial).
- **`Project 1 : N Feedback`**: Um projeto pode receber múltiplas avaliações e opiniões.

```mermaid
erDiagram
    PROFILE ||--o{ PROJECT : "possui (1:N)"
    PROJECT }o--o{ TECHNOLOGY : "utiliza (N:N)"
    PROJECT ||--o{ FEEDBACK : "recebe (1:N)"

    PROFILE {
        string id PK "UUID"
        string name "Nome completo"
        string email UK "Email único"
        string bio "Biografia opcional"
        datetime createdAt
        datetime updatedAt
    }

    PROJECT {
        string id PK "UUID"
        string title "Título do projeto"
        string description "Descrição"
        string repositoryUrl "URL válida do repositório"
        string profileId FK "UUID do Perfil"
        datetime createdAt
        datetime updatedAt
    }

    TECHNOLOGY {
        string id PK "UUID"
        string name UK "Nome da tecnologia"
        datetime createdAt
    }

    FEEDBACK {
        string id PK "UUID"
        string projectId FK "UUID do Projeto"
        string authorName "Nome do avaliador"
        string comment "Comentário/Opinião"
        int rating "Nota de 1 a 5"
        datetime createdAt
    }
```

---

## ⚙️ Pré-requisitos e Execução Local

- **Node.js** (v18+)
- **Docker** e **Docker Compose**

### 1. Clonar o repositório
```bash
git clone git@github.com:EliaJunior/devshowcase-serivce.git
cd devshowcase-serivce
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar variáveis de ambiente
Copie o arquivo de exemplo `.env.example` para `.env`:
```bash
cp .env.example .env
```
Conteúdo padrão do `.env`:
```env
PORT=3000
NODE_ENV=development

# PostgreSQL Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=devshowcase
POSTGRES_PORT=5432

# Prisma Database URL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/devshowcase?schema=public"
```

### 4. Subir o banco de dados PostgreSQL com Docker Compose
```bash
# Iniciar o container em background
npm run docker:up
# ou diretamente: docker compose up -d
```

### 5. Executar migrações do banco de dados
```bash
npx prisma migrate dev
```

### 6. Popular o banco com dados de exemplo (Seed opcional)
```bash
npm run seed
```

### 7. Iniciar o servidor em desenvolvimento
```bash
npm run dev
```
O servidor estará rodando em: `http://localhost:3000`

### 8. Executar a suite de testes automatizados
```bash
npm test
```

### 9. Parar o container do banco de dados (quando finalizar)
```bash
npm run docker:down
# ou diretamente: docker compose down
```

### 10. Gerar build de produção
```bash
npm run build
npm start
```

---

## 🚀 Como Fazer Deploy (Render + Supabase)

Nesta arquitetura de produção, a API Node.js é hospedada no **[Render](https://render.com/)** e o banco de dados PostgreSQL gerenciado é fornecido pelo **[Supabase](https://supabase.com/)**.

---

### Passo 1: Obter a Connection String do PostgreSQL no Supabase

1. Acesse o [Dashboard do Supabase](https://supabase.com/dashboard) e selecione o seu projeto.
2. Acesse **Project Settings** > **Database** (ou clique no botão **Connect** no topo).
3. Na seção **Connection string**, selecione a aba **URI** e escolha o modo **Connection Pooler** (recomendado para plataformas como o Render que utilizam IPv4):
   - Modo: **Session** (porta `5432`)
   - O formato será:
     ```
     postgresql://postgres.[SEU-PROJECT-REF]:[SUA-SENHA]@aws-0-[REGIAO].pooler.supabase.com:5432/postgres
     ```
4. **Importante sobre caracteres especiais na senha**:
   - Se a sua senha contiver caracteres especiais como `@`, eles **devem ser codificados em formato URL (URL encoded)**.
   - Por exemplo, o caractere `@` deve ser substituído por `%40` (ex: `danD@1785__` vira `danD%401785__`).

---

### Passo 2: Criar o Web Service da API no Render

1. No [Dashboard do Render](https://dashboard.render.com/), clique em **New +** > **Web Service**.
2. Conecte sua conta do GitHub e selecione o repositório **`devshowcase-service`**.
3. Configure os detalhes do serviço:
   - **Name**: `devshowcase-service`
   - **Region**: Selecione uma região próxima à do seu banco no Supabase
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**:
     ```bash
     npm install --include=dev && npm run prisma:generate && npm run prisma:deploy && npm run build
     ```
   - **Start Command**:
     ```bash
     npm start
     ```
   - **Plan**: **Free**

---

### Passo 3: Configurar Variáveis de Ambiente no Render

Na aba **Environment** do serviço no Render, adicione as variáveis:

| Chave | Valor | Descrição |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Modo de execução otimizado para produção |
| `DATABASE_URL` | *`postgresql://postgres.[REF]:[SENHA-ENCODED]@aws-0-[REGIAO].pooler.supabase.com:5432/postgres`* | Connection String do Supabase (Connection Pooler) |

> **Dica**: Se a senha tiver `@`, lembre-se de usar `%40` no lugar do `@` na senha da `DATABASE_URL`.
> 
> **Nota**: A variável `PORT` é injetada automaticamente pelo Render (geralmente `10000`). A aplicação já está preparada para escutar a porta definida por `process.env.PORT` nativamente.

---

### Passo 4: Concluir o Deploy e Validar

1. Clique em **Create Web Service**.
2. O Render executará o pipeline completo de inicialização:
   - 📦 Instalação dos pacotes (`npm install`)
   - ⚙️ Geração do Prisma Client (`npm run prisma:generate`)
   - 🗄️ Aplicação das migrações diretamente no Supabase (`npm run prisma:deploy`)
   - 🔨 Compilação do TypeScript para JavaScript (`npm run build`)
   - 🚀 Inicialização da API (`npm start`)
3. Após a conclusão, teste o endpoint de Health Check no navegador ou via cURL:
   ```bash
   curl -X GET https://seu-app.onrender.com/health
   ```
   **Resposta esperada (`200 OK`)**:
   ```json
   {
     "status": "ok",
     "timestamp": "2026-09-25T..."
   }
   ```
4. Acesse o **Table Editor** no painel do Supabase para visualizar todas as tabelas (`profiles`, `projects`, `technologies`, `feedbacks`) criadas e sincronizadas.

---

### Passo 5 (Opcional): Popular Dados Iniciais (Seed)

Para carregar dados demonstrativos de perfis, tecnologias e projetos no ambiente de produção:
1. No Dashboard do Web Service no Render, acesse a aba **Shell**.
2. Execute o comando:
   ```bash
   npm run seed
   ```

---

## 📬 Guia de Teste com o Postman

Para facilitar a validação de todos os fluxos da API, incluímos na raiz do projeto o arquivo **`DevShowcase.postman_collection.json`**.

### Como Importar:
1. Abra o **Postman**.
2. Clique no botão **Import** (canto superior esquerdo).
3. Selecione ou arraste o arquivo `DevShowcase.postman_collection.json` localizado na raiz deste repositório.
4. A coleção `DevShowcase Service API` será carregada com todas as rotas organizadas em pastas.

### Propagação Automática de Variáveis:
As requisições contêm scripts de teste embutidos que **capturam automaticamente os IDs gerados** e os salvam nas variáveis da coleção:
- Ao executar **1.1 Criar Perfil**, o `profileId` é salvo automaticamente.
- Ao executar **2.1 e 2.2 Cadastrar Tecnologias**, `techId1` e `techId2` são salvos automaticamente.
- Ao executar **3.1 Cadastrar Projeto**, ele utiliza as variáveis `{{profileId}}`, `{{techId1}}` e `{{techId2}}`, e salva o `projectId`.
- Ao executar **4.1 Cadastrar Feedback**, ele associa o feedback diretamente ao projeto salvo.

### Ordem Recomendada de Execução:
1. `0. Health Check` -> Retorna `200 OK`.
2. `1.1 Criar Perfil` -> Cria o perfil e salva `profileId`.
3. `2.1 Cadastrar Tecnologia 1` -> Salva `techId1`.
4. `2.2 Cadastrar Tecnologia 2` -> Salva `techId2`.
5. `3.1 Cadastrar Projeto` -> Associa o perfil e tecnologias criadas.
6. `4.1 Cadastrar Feedback no Projeto` -> Envia uma avaliação para o projeto.
7. `1.2 Buscar Perfil por ID` -> Verifica que o perfil agora lista o projeto criado.
8. `3.2 Listar Todos os Projetos` -> Lista o projeto com perfil, tecnologias e feedbacks.
9. Teste as requisições de erro (`[400 Erro]`) para checar a validação Zod.

---

## 📖 Especificação dos Endpoints REST

### 1. Perfis (`/api/profiles`)

#### `POST /api/profiles`
Cadastra um novo perfil de desenvolvedor.
- **Status de Sucesso**: `201 Created`
- **Validações**: `name` obrigatório e não vazio; `email` obrigatório e formato válido; email deve ser único (`409 Conflict`).
- **Payload**:
```json
{
  "name": "Ana Developer",
  "email": "ana.dev@example.com",
  "bio": "Senior Backend Developer especializada em TypeScript e arquiteturas escaláveis."
}
```
- **Resposta**:
```json
{
  "id": "7f7bf4eb-ddad-48b4-9271-64d123456789",
  "name": "Ana Developer",
  "email": "ana.dev@example.com",
  "bio": "Senior Backend Developer especializada em TypeScript e arquiteturas escaláveis.",
  "createdAt": "2026-09-24T20:38:40.000Z",
  "updatedAt": "2026-09-24T20:38:40.000Z",
  "projects": []
}
```

#### `GET /api/profiles/:id`
Busca um perfil por ID incluindo todos os seus projetos associados.
- **Status de Sucesso**: `200 OK`
- **Status de Erro**: `404 Not Found` caso o ID não exista.

#### `GET /api/profiles`
Retorna a listagem de todos os perfis cadastrados.
- **Status de Sucesso**: `200 OK`

---

### 2. Tecnologias (`/api/technologies`)

#### `POST /api/technologies`
Cadastra uma nova tecnologia no catálogo.
- **Status de Sucesso**: `201 Created`
- **Validações**: `name` obrigatório, não vazio e único (`409 Conflict` se duplicado).
- **Payload**:
```json
{
  "name": "TypeScript"
}
```

#### `GET /api/technologies`
Lista todas as tecnologias cadastradas em ordem alfabética.
- **Status de Sucesso**: `200 OK`

---

### 3. Projetos (`/api/projects`)

#### `POST /api/projects`
Cadastra um novo projeto vinculando-o ao desenvolvedor (`profileId`) e opcionalmente a uma lista de tecnologias (`technologyIds`).
- **Status de Sucesso**: `201 Created`
- **Validações**:
  - `title`: obrigatório e não vazio (máx 150 caracteres).
  - `repositoryUrl`: obrigatória e formato de URL válido.
  - `profileId`: obrigatório e UUID válido (retorna `404` se o perfil não existir).
  - `technologyIds`: array opcional de UUIDs (retorna `404` se alguma tecnologia não existir).
- **Payload**:
```json
{
  "title": "DevShowcase API",
  "description": "API RESTful para vitrine de desenvolvedores.",
  "repositoryUrl": "https://github.com/EliaJunior/devshowcase-serivce",
  "profileId": "7f7bf4eb-ddad-48b4-9271-64d123456789",
  "technologyIds": [
    "c8a14b51-5c83-4a11-8ecb-1234567890ab",
    "b2d95e83-7d92-4f22-9dfa-0987654321cd"
  ]
}
```
- **Resposta**:
```json
{
  "id": "e93ad3b1-8b01-49b5-a6a3-000000000001",
  "title": "DevShowcase API",
  "description": "API RESTful para vitrine de desenvolvedores.",
  "repositoryUrl": "https://github.com/EliaJunior/devshowcase-serivce",
  "profileId": "7f7bf4eb-ddad-48b4-9271-64d123456789",
  "createdAt": "2026-09-24T20:38:40.000Z",
  "updatedAt": "2026-09-24T20:38:40.000Z",
  "profile": {
    "id": "7f7bf4eb-ddad-48b4-9271-64d123456789",
    "name": "Ana Developer",
    "email": "ana.dev@example.com"
  },
  "technologies": [
    { "id": "c8a14b51-5c83-4a11-8ecb-1234567890ab", "name": "TypeScript" },
    { "id": "b2d95e83-7d92-4f22-9dfa-0987654321cd", "name": "Express" }
  ],
  "feedbacks": []
}
```

#### `GET /api/projects`
Lista todos os projetos cadastrados trazendo os dados completos de desenvolvedor (`profile`), tecnologias (`technologies`) e avaliações (`feedbacks`).
- **Status de Sucesso**: `200 OK`

#### `GET /api/projects/:id`
Busca os detalhes de um projeto específico por ID.
- **Status de Sucesso**: `200 OK`
- **Status de Erro**: `404 Not Found`

---

### 4. Feedbacks (`/api/projects/:id/feedbacks`)

#### `POST /api/projects/:id/feedbacks`
Cadastra uma avaliação/opinião técnica sobre um projeto.
- **Status de Sucesso**: `201 Created`
- **Validações**:
  - `authorName`: obrigatório e não vazio.
  - `comment`: obrigatório e não vazio.
  - `rating`: número inteiro obrigatório entre **1** e **5**.
- **Payload**:
```json
{
  "authorName": "Carlos Tech Lead",
  "comment": "Excelente organização de camadas e validações consistentes!",
  "rating": 5
}
```

#### `GET /api/projects/:id/feedbacks`
Lista todas as avaliações recebidas pelo projeto especificado.
- **Status de Sucesso**: `200 OK`
- **Status de Erro**: `404 Not Found` se o projeto não existir.

---

## ⚡ Exemplos com cURL

```bash
# 1. Health check
curl -X GET http://localhost:3000/health

# 2. Criar Perfil
curl -X POST http://localhost:3000/api/profiles \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Elias Cunha",
    "email": "elias@devshowcase.com",
    "bio": "Engenheiro de Software"
  }'

# 3. Criar Tecnologia
curl -X POST http://localhost:3000/api/technologies \
  -H "Content-Type: application/json" \
  -d '{"name": "TypeScript"}'

# 4. Listar Tecnologias
curl -X GET http://localhost:3000/api/technologies

# 5. Criar Projeto (substitua os UUIDs pelos retornados acima)
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "DevShowcase API",
    "description": "API RESTful em Node.js e TypeScript",
    "repositoryUrl": "https://github.com/EliaJunior/devshowcase-serivce",
    "profileId": "SEU_PROFILE_ID_AQUI",
    "technologyIds": ["SEU_TECH_ID_AQUI"]
  }'

# 6. Listar Projetos
curl -X GET http://localhost:3000/api/projects

# 7. Criar Feedback
curl -X POST http://localhost:3000/api/projects/SEU_PROJECT_ID_AQUI/feedbacks \
  -H "Content-Type: application/json" \
  -d '{
    "authorName": "Avaliador Sênior",
    "comment": "Projeto muito bem estruturado!",
    "rating": 5
  }'
```

---

## 📄 Licença
Distribuído sob a licença MIT. Consulte `LICENSE` para mais informações.
