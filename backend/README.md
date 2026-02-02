# CGESP-api Backend

This is the backend service for the Scrap-Chuva application, built with **NestJS**. It performs web scraping of CGE-SP data, manages authentication, users, and monitored locations.

> 🇧🇷 **[Leia em Português](#-versão-em-português)**

## 📋 Prerequisites

- Node.js (v18+)
- SQLite (or just the driver, already included)

## 🚀 Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env` file in the `backend` root folder with the following content:

```env
JWT_SECRET=your_super_safe_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
FRONTEND_URL=http://localhost:3001
```

## 🏃 Execution

### Development
```bash
npm run start:dev
```
The server will run at `http://localhost:3000`.

### Production
```bash
npm run build
npm run start:prod
```

## 🛠️ Main Endpoints

### Authentication
- `POST /api/auth/signup`: Account registration.
- `POST /api/auth/login`: Login with email/password.
- `GET /api/auth/google`: Login with Google.

### CGE Data
- `GET /api/cge/data`: Current data (Weather, Points, News).
- `GET /api/cge/floods?date=YYYY-MM-DD`: Historical flood search.
- `GET /api/cge/analytics`: Daily statistics.

### User & Places
- `GET /api/auth/me`: User profile.
- `GET /api/auth/places`: List monitored places.
- `POST /api/auth/places`: Add place.
- `PATCH /api/auth/places/:id`: Edit place.
- `PATCH /api/auth/places/remove`: Remove place.

## 🐳 Docker

To create the Docker image for this service:
```bash
docker build -t murilonerdx/cgesp-api .
```

---

## 🇧🇷 Versão em Português

Este é o serviço backend da aplicação **CGESP-api**, construído com **NestJS**. Ele realiza o web scraping dos dados do CGE-SP, gerencia autenticação, usuários e locais monitorados.

### 📋 Pré-requisitos

- Node.js (v18+)
- SQLite (ou apenas o driver, já incluído)

### 🚀 Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz da pasta `backend` com o seguinte conteúdo:

```env
JWT_SECRET=sua_chave_secreta_super_segura
GOOGLE_CLIENT_ID=seu_client_id_google
GOOGLE_CLIENT_SECRET=seu_client_secret_google
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
FRONTEND_URL=http://localhost:3001
```

### 🏃 Execução

#### Desenvolvimento
```bash
npm run start:dev
```
O servidor rodará em `http://localhost:3000`.

#### Produção
```bash
npm run build
npm run start:prod
```

### 🛠️ Endpoints Principais

#### Autenticação
- `POST /api/auth/signup`: Cadastro de conta.
- `POST /api/auth/login`: Login com email/senha.
- `GET /api/auth/google`: Login com Google.

#### Dados CGE
- `GET /api/cge/data`: Dados atuais (Clima, Pontos, Notícias).
- `GET /api/cge/floods?date=YYYY-MM-DD`: Busca histórica de alagamentos.
- `GET /api/cge/analytics`: Estatísticas diárias.

#### Usuário & Locais
- `GET /api/auth/me`: Perfil do usuário.
- `GET /api/auth/places`: Lista de locais monitorados.
- `POST /api/auth/places`: Adicionar local.
- `PATCH /api/auth/places/:id`: Editar local.
- `PATCH /api/auth/places/remove`: Remover local.

### 🐳 Docker

Para criar a imagem Docker deste serviço:
```bash
docker build -t murilonerdx/cgesp-api .
```
