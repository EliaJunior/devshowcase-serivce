# 🎬 Roteiro de Gravação: Apresentação da API DevShowcase (10 Minutos)

> **Duração estimada**: 10 minutos  
> **Objetivo**: Apresentar de forma didática, técnica e fluida o funcionamento completo da API RESTful **DevShowcase Service**, cobrindo arquitetura, modelagem relacional, validações, testes e demonstração prática de ponta a ponta no Postman.  
> **Público-alvo**: Avaliadores técnicos, recrutadores, desenvolvedores ou bancas acadêmicas.

---

## 📋 Checklist Pré-Gravação (Prepare antes do REC)

- [ ] **Resolução & Zoom**: Aumente o zoom do VS Code (`Ctrl + +`) e do Postman para que o texto fique bem legível no vídeo (120% a 130%).
- [ ] **Janelas abertas e posicionadas**:
  1. **VS Code**: Com as abas principais já abertas (`prisma/schema.prisma`, `src/routes/index.ts`, `src/dtos/`, `src/middlewares/errorHandler.ts`).
  2. **Terminal dividido**: Uma aba rodando `npm run dev` (com o banner estilizado visível) e outra pronta para rodar `npm test`.
  3. **Postman**: Coleção `DevShowcase Service API` importada, com variáveis limpas e pastas organizadas.
- [ ] **Banco limpo ou preparado**: Se preferir começar do zero, execute `npx prisma migrate reset --force` ou limpe os registros de teste.
- [ ] **Áudio e Silêncio**: Microfone testado e notificações do sistema pausadas.

---

## ⏱️ Cronograma e Divisão de Tempo

| Bloco | Minutagem | Tema | O que exibir na tela |
|:---:|:---:|:---|:---|
| **1** | `00:00 - 01:00` (1 min) | Abertura & Proposta do Projeto | Câmera / README.md / Banner do Terminal |
| **2** | `01:00 - 02:30` (1m30s) | Stack & Arquitetura em Camadas | VS Code (`src/` e estrutura de diretórios) |
| **3** | `02:30 - 04:00` (1m30s) | Modelagem de Dados & Relacionamentos | `prisma/schema.prisma` e Diagrama ER |
| **4** | `04:00 - 07:00` (3 min) | Demonstração Prática Ponta a Ponta | Postman (Fluxo completo 1 ao 4) |
| **5** | `07:00 - 08:30` (1m30s) | Validações com Zod & Tratamento de Erros | Postman (Erros 400/404/409) + VS Code (DTOs) |
| **6** | `08:30 - 09:30` (1 min) | Testes Automatizados & Confiabilidade | Terminal executando `npm test` (Vitest) |
| **7** | `09:30 - 10:00` (30 seg) | Conclusão & Encerramento | GitHub / Terminal com status ativo |

---

## 🎙️ Roteiro Detalhado Passo a Passo

---

### ⏱️ Bloco 1: Abertura e Proposta do Projeto (00:00 - 01:00)
**Foco**: Causar uma excelente primeira impressão, apresentar seu nome e o problema que a API soluciona.

* **O que mostrar na tela**:
  - Mostre o arquivo `README.md` no VS Code ou o terminal inicializado exibindo o banner do servidor.
* **Falas sugeridas**:
  > *"Olá, pessoal! Sejam muito bem-vindos. Meu nome é Elias Cunha e hoje vou apresentar a vocês a **DevShowcase API**, um backend RESTful completo desenvolvido em Node.js e TypeScript.*  
  > *A ideia do DevShowcase é servir como uma plataforma central para vitrine de desenvolvedores. Nela, devs podem cadastrar seus perfis, associar seus projetos de portfólio, vincular as tecnologias utilizadas e receber feedbacks técnicos e avaliações de outros profissionais ou recrutadores.*  
  > *Neste vídeo de 10 minutos, vou mostrar a arquitetura que utilizei, a modelagem de dados no Prisma, as validações de entrada, testes automatizados e faremos uma demonstração completa de todas as rotas no Postman. Vamos lá!"*

---

### ⏱️ Bloco 2: Stack Tecnológica e Arquitetura em Camadas (01:00 - 02:30)
**Foco**: Demonstrar maturidade de código, organização limpa e justificativa das escolhas técnicas.

* **O que mostrar na tela**:
  - Navegue pela árvore de diretórios do `src/` no VS Code: `config`, `controllers`, `dtos`, `errors`, `middlewares`, `repositories`, `routes`, `services`.
* **Falas sugeridas**:
  > *"Começando pelas escolhas tecnológicas: utilizamos o **Node.js** com **TypeScript** para garantir tipagem estática e segurança em tempo de compilação. Como framework HTTP, escolhemos o **Express**, associado ao **Prisma ORM** e banco **PostgreSQL** orquestrado via **Docker Compose**, garantindo persistência robusta, isolada e padrão de mercado.*  
  > *Para a organização do código, adotei uma **Arquitetura em Camadas** com forte separação de responsabilidades:*  
  > - *Nas **Routes**, definimos os endpoints e aplicamos middlewares.*  
  > - *Nos **Controllers**, recebemos a requisição HTTP, acionamos as regras e respondemos no padrão REST.*  
  > - *Os **Services** isolam todas as regras de negócio: validações se um email já existe, se a tecnologia é válida ou se o projeto pertence ao perfil indicado.*  
  > - *Os **Repositories** abstraem o acesso ao banco de dados com Prisma, desacoplando o ORM da regra de negócio.*  
  > - *E os **DTOs** com **Zod** garantem que nenhum dado malformatado entre na nossa aplicação."*

---

### ⏱️ Bloco 3: Modelagem de Dados e Relacionamentos no Prisma (02:30 - 04:00)
**Foco**: Explicar como as entidades conversam entre si e como as restrições relacionais foram implementadas.

* **O que mostrar na tela**:
  - Abra o arquivo `prisma/schema.prisma` e destaque os modelos: `Profile`, `Project`, `Technology`, `Feedback`.
* **Falas sugeridas**:
  > *"Vamos dar uma olhada na modelagem de dados no `schema.prisma`. O sistema precisava atender a três relacionamentos fundamentais:*  
  > *1. **Profile para Project (1 : N)**: Um desenvolvedor pode ter múltiplos projetos em seu portfólio, com integridade referencial e deleção em cascata configurada.*  
  > *2. **Project para Technology (N : N)**: Um projeto pode usar várias tecnologias como TypeScript, React, Docker; e uma tecnologia pode estar presente em vários projetos. O Prisma gerencia a tabela pivô implicitamente de forma limpa.*  
  > *3. **Project para Feedback (1 : N)**: Cada projeto pode receber comentários técnicos e notas de 1 a 5 de avaliadores.*  
  > *Todos os IDs são UUIDs autogerados, com índices únicos em emails de perfis e nomes de tecnologia, garantindo consistência desde o banco de dados."*

---

### ⏱️ Bloco 4: Demonstração Prática Ponta a Ponta no Postman (04:00 - 07:00)
**Foco**: Provar que o sistema funciona ao vivo com um fluxo linear e profissional.

* **O que mostrar na tela**:
  - Vá para o **Postman** na coleção `DevShowcase Service API`.
  - Mostre as requisições sendo disparadas e a resposta `200` / `201` com o payload retornado.

* **Ações e Falas sugeridas**:

  1. **Health Check (`GET /health`)** `[04:00 - 04:20]`  
     > *"Primeiro, vamos testar o health check da API: recebemos `200 OK`, uptime e timestamp indicando que o serviço está no ar."*

  2. **Criar Perfil (`POST /api/profiles`)** `[04:20 - 04:50]`  
     - Envie o body com `name`, `email` e `bio`.  
     > *"Agora cadastramos o perfil do desenvolvedor. Observem que a API responde com status `201 Created` e retorna o ID recém-criado. No Postman, configuramos um script de teste que salva automaticamente esse `profileId` em variável de ambiente."*

  3. **Cadastrar Tecnologias (`POST /api/technologies`)** `[04:50 - 05:25]`  
     - Cadastre `TypeScript` e depois `Express`.  
     > *"Em seguida, populamos o catálogo de tecnologias: criamos 'TypeScript' e depois 'Express'. Os IDs também são capturados dinamicamente."*

  4. **Cadastrar Projeto (`POST /api/projects`)** `[05:25 - 06:10]`  
     - Mostre o JSON com `title`, `description`, `repositoryUrl`, `profileId` e array `technologyIds`.  
     > *"Agora criamos o projeto vinculando o perfil criado e as duas tecnologias. Ao enviar: recebemos `201 Created`, e vejam que retorno rico! A API já traz os dados aninhados do desenvolvedor e o catálogo das tecnologias associadas via relacionamentos do Prisma."*

  5. **Cadastrar Feedback (`POST /api/projects/:id/feedbacks`)** `[06:10 - 06:40]`  
     - Envie uma avaliação: `authorName: "Carlos Tech Lead"`, `comment: "Excelente código"`, `rating: 5`.  
     > *"Com o projeto no ar, qualquer usuário pode avaliá-lo. Enviamos um feedback com autor, comentário e nota 5. O registro é salvo e atrelado diretamente ao projeto."*

  6. **Consultar Perfil & Projetos (`GET /api/profiles/:id` e `GET /api/projects`)** `[06:40 - 07:00]`  
     - Execute a listagem geral e a consulta do perfil por ID.  
     > *"Agora, ao consultar o desenvolvedor ou listar todos os projetos, vemos a agregação completa: o perfil contém o projeto, e o projeto contém as tecnologias e as avaliações recebidas."*

---

### ⏱️ Bloco 5: Validação Robusta com Zod e Tratamento de Erros (07:00 - 08:30)
**Foco**: Demonstrar resiliência da API, validação preventiva e tratamento de exceções.

* **O que mostrar na tela**:
  - Postman nas requisições da pasta de erros `[400 Erro]` ou enviando dados inválidos propositalmente.
  - No VS Code, mostre rapidamente um arquivo da pasta `src/dtos/` (ex: `project.dto.ts`) e o middleware `errorHandler.ts`.

* **Falas sugeridas**:
  > *"Uma boa API se destaca pelo comportamento diante de dados incorretos. Aqui, utilizamos o **Zod** para validar rigorosamente todo payload antes mesmo de chegar à regra de negócio.*  
  > *Por exemplo, se eu tentar cadastrar um perfil com email inválido ou nome em branco, a API intercepta e retorna **400 Bad Request** com uma lista detalhada e amigável de cada campo que falhou.*  
  > *Se eu tentar cadastrar o mesmo email novamente, nosso service identifica a colisão e retorna **409 Conflict**.*  
  > *E se alguém passar uma URL malformada de repositório ou um rating de feedback maior que 5 ou menor que 1, o schema bloqueia imediatamente.*  
  > *Além disso, criamos uma classe customizada `AppError` e um middleware global de tratamento de exceções, garantindo que a aplicação nunca caia por erro não tratado e não vaze stack traces para o cliente em ambiente de produção."*

---

### ⏱️ Bloco 6: Testes Automatizados e Confiabilidade (08:30 - 09:30)
**Foco**: Provar qualidade de engenharia de software com suite de testes automatizados verde.

* **O que mostrar na tela**:
  - Abra o terminal do VS Code e execute:
    ```bash
    npm test
    ```
  - Mostre os testes do **Vitest** rodando e passando com checks verdes (Health check, Perfis, Tecnologias, Projetos e Feedbacks).

* **Falas sugeridas**:
  > *"Para garantir que tudo isso funcione de ponta a ponta sem regressões, desenvolvemos uma suíte de testes de integração automatizados utilizando **Vitest** e **Supertest**.*  
  > *Vejam só: ao rodar `npm test`, ele limpa o banco de testes, sobe a aplicação em memória e executa todos os cenários: criação de entidades, vínculos relacionais, validação de regras de unicidade e todos os status codes de erro (400, 404, 409).*  
  > *Com isso, temos uma cobertura completa e a segurança de que qualquer refatoração futura manterá o contrato da API íntegro."*

---

### ⏱️ Bloco 7: Conclusão e Encerramento (09:30 - 10:00)
**Foco**: Fechamento objetivo, convite para ver o código e agradecimentos.

* **O que mostrar na tela**:
  - Mostre a página do repositório no GitHub ou o terminal com o banner da aplicação rodando.

* **Falas sugeridas**:
  > *"Para concluir: o **DevShowcase Service** entrega uma solução moderna, tipada de ponta a ponta com TypeScript, arquitetura desacoplada em camadas, persistência relacional com Prisma e PostgreSQL em Docker, validação de schema rigorosa e cobertura de testes automatizados.*  
  > *Todo o código-fonte, a documentação detalhada e a coleção do Postman pronta para importação estão disponíveis no repositório GitHub.*  
  > *Muito obrigado pelo tempo e pela atenção de vocês. Fico à disposição para dúvidas e feedbacks. Até a próxima!"*

---

## 💡 Dicas de Ouro para a Apresentação

1. **Ritmo de Fala**: Fale com entusiasmo e clareza, sem pressa. As pausas entre as requisições no Postman dão tempo para o espectador assimilar a resposta.
2. **Cursor do Mouse**: Ao falar de um trecho de código ou campo no JSON, use o mouse como guia para orientar os olhos de quem assiste.
3. **Resolução**: Se estiver usando monitor ultrawide, grave apenas uma janela Full HD (1920x1080) para o vídeo ficar nítido no YouTube ou LinkedIn.
4. **Se errar uma fala**: Não precisa reiniciar do zero! Faça uma pausa de 3 segundos em silêncio e repita a frase. Na edição fica facílimo cortar.
