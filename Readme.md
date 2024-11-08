# Marble Shop API

## Descrição

Este é um backend para um mini SAAS de gerenciamento de lojas de mármores, utilizando **Node.js**, **Prisma**, **Fastify** e **PostgreSQL**.

A API é desenvolvida com o objetivo de gerenciar operações relacionadas a lojas de mármores e permite o gerenciamento de usuários, autenticação, e mais.

### Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript no backend.
- **Prisma**: ORM para interagir com o banco de dados PostgreSQL.
- **Fastify**: Framework web rápido e eficiente para Node.js.
- **PostgreSQL**: Banco de dados relacional.
- **Docker**: Para containerização do ambiente de desenvolvimento.

## Como Rodar o Projeto

### 1. Clonar o Repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd marble-shop-backend
```
### 2. Instalar Dependências

Para instalar as dependências do projeto, basta rodar:
```bash
npm install
```

### 3. Configurar o Banco de Dados

O banco de dados é configurado através do Docker usando o docker-compose. O arquivo docker-compose.dev.yml já está configurado para usar o PostgreSQL e o PgAdmin.

Para iniciar os containers do Docker (PostgreSQL e PgAdmin), execute:

```bash
docker-compose -f docker-compose.dev.yml up
```

Isso irá levantar os seguintes serviços:

    PostgreSQL na porta 5433
    PgAdmin na porta 5041
    Backend na porta 8020 e para depuração na porta 9229

### 4. Configurações do Ambiente

Adicione as variáveis de ambiente necessárias em um arquivo .env na raiz do projeto:

```bash
DB_USER=postgres
DB_PASS=admin
DB_NAME=marble-shop
PORT=8020
DATABASE_URL=postgresql://postgres:admin@postgres:5433/marble-shop
JWT_SECRET_KEY=secreta
ENCRYPT_KEYTOKEN_EXPIRATION_TIME=3600
TOKEN_EXPIRATION_TIME=3600
INTERNAL_SERVICES_TOKEN=secreta
```

### 5. Rodar o Projeto
Com Docker

O comando a seguir irá compilar o projeto, executar as migrações do Prisma e rodar o servidor de desenvolvimento com depuração:

```bash
docker compose -f docker-compose.dev.yml up
```

Sem Docker

Caso queira rodar o projeto fora do Docker, você pode usar o comando abaixo para rodar o servidor diretamente no ambiente local:

```bash
npm run dev
```

Ou, se quiser rodar com depuração:

```bash
npm run dev:debug
```

### 6. Rodar as Migrations do Prisma

Para rodar as migrations do Prisma e criar as tabelas no banco de dados:

```bash
npm run migration
```

### 7. Acessar a API

Com os containers em execução, você pode acessar a API na URL:

```bash
http://localhost:8020
```

Você também pode acessar o PgAdmin na URL:

```bash
http://localhost:5041
```

O login padrão do PgAdmin é:

    Email: admin@admin.com
    Senha: admin

A partir do PgAdmin, você pode visualizar o banco de dados PostgreSQL e executar consultas SQL diretamente.

### Scripts

    npm run test: Roda os testes do projeto (ainda não configurado).
    npm run migration: Aplica as migrations do Prisma.
    npm run dev: Roda o servidor de desenvolvimento com o tsx para recarregamento automático.
    npm run dev:debug: Roda o servidor de desenvolvimento com depuração habilitada.

### Estrutura do Projeto
```bash

├── prisma/                # Diretório do Prisma com o schema e migrations
.
├── src/                   # Código-fonte da aplicação
│   ├── config/            # Configurações da aplicação
│   ├── database/          # Lógica de conexão com o banco de dados
│   ├── enums/             # Definições de enums
│   ├── helpers/           # Funções auxiliares
│   │   └── errors/        # Tratamento de erros
│   ├── interfaces/        # Interfaces e tipos de dados
│   ├── middlewares/       # Middlewares da aplicação
│   ├── repositories/      # Repositórios de dados
│   ├── routes/            # Definições de rotas
│   ├── schemas/           # Schemas de validação
│   ├── types/             # Tipos personalizados
│   ├── usecases/          # Casos de uso (lógica de negócios)
│   ├── app.ts             # Arquivo de configuração do app
│   └── server.ts          # Arquivo principal que inicia o servidor
├── .env                   # Arquivo de variáveis de ambiente
├── Dockerfile.dev
├── docker-compose.dev.yml # Arquivo do Docker Compose para desenvolvimento
├── package.json           # Configurações e dependências do projeto
└── README.md              # Este arquivo
```

## Contribuição

Se você gostaria de contribuir para este projeto, sinta-se à vontade para abrir uma pull request ou criar uma issue para discussões de novos recursos ou melhorias!