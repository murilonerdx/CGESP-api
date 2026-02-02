# Scrap-Chuva Backend (API)

Este é o serviço backend da aplicação Scrap-Chuva, construído com **NestJS**. Ele realiza o web scraping dos dados do CGE-SP, gerencia autenticação, usuários e locais monitorados.

## 📋 Pré-requisitos

- Node.js (v18+)
- SQLite (ou apenas o driver, já incluído)

## 🚀 Instalação

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

## 🏃 Execução

### Desenvolvimento
```bash
npm run start:dev
```
O servidor rodará em `http://localhost:3000`.

### Produção
```bash
npm run build
npm run start:prod
```

## 🛠️ Endpoints Principais

### Autenticação
- `POST /api/auth/signup`: Cadastro de conta.
- `POST /api/auth/login`: Login com email/senha.
- `GET /api/auth/google`: Login com Google.

### Dados CGE
- `GET /api/cge/data`: Dados atuais (Clima, Pontos, Notícias).
- `GET /api/cge/floods?date=YYYY-MM-DD`: Busca histórica de alagamentos.
- `GET /api/cge/analytics`: Estatísticas diárias.

### Usuário & Locais
- `GET /api/auth/me`: Perfil do usuário.
- `GET /api/auth/places`: Lista de locais monitorados.
- `POST /api/auth/places`: Adicionar local.
- `PATCH /api/auth/places/:id`: Editar local.
- `PATCH /api/auth/places/remove`: Remover local.

## 🐳 Docker

Para criar a imagem Docker deste serviço:
```bash
docker build -t scrap-chuva-backend .
```
