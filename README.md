# 🌧️ Scrap-Chuva Project

[![Docker Hub](https://img.shields.io/badge/Docker%20Hub-murilonerdx%2Fcgesp--api-blue?logo=docker&logoColor=white)](https://hub.docker.com/r/murilonerdx/cgesp-api)

Aplicação completa para monitoramento, análise e alerta de alagamentos em São Paulo, baseada nos dados do CGE-SP. O sistema oferece monitoramento proativo com alertas personalizados por região e rua.

## 📦 Arquitetura

O projeto é dividido em dois módulos principais:

- **[Backend](./backend/README.md)**: API NestJS responsável por extrair dados do CGE (Scraping), processar regras de negócio e gerenciar usuários.
- **[Frontend](./frontend/README.md)**: Interface Next.js moderna para visualização de dados e gestão de conta.

## 🚀 Como Iniciar (Rápido)

### 1. Clonar e Configurar
Certifique-se de configurar os arquivos `.env` nas pastas `backend` e `frontend` conforme descrito em seus respectivos READMEs.

### 2. Rodar com Docker (Backend)

Você pode rodar o backend isolado via Docker para facilitar o deployment.

#### Build da Imagem
```bash
cd backend
docker build -t scrap-chuva-backend .
```

#### Rodar o Container

### 4. Deploy no Docker Hub

Para subir a imagem do backend para o seu Docker Hub:

1. Faça login:
```bash
docker login
```


2. Crie uma tag com seu usuário:
```bash
docker tag scrap-chuva-backend murilonerdx/cgesp-api
```

3. Suba a imagem:
```bash
docker push murilonerdx/cgesp-api
```

Abra dois terminais:

**Terminal 1 (Backend):**
```bash
cd backend
npm run start:dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

Acesse o sistema em `http://localhost:3001`.

## 🛡️ Funcionalidades Principais

- **Monitoramento Tempo Real**: Atualização a cada 5 minutos.
- **Busca Histórica**: Pesquisa detalhada de pontos de alagamento por data.
- **Alertas Precisos**: Notificações indicando Rua e Região exatas.
- **Meus Lugares**: Cadastro de locais de interesse (Casa, Trabalho) para monitoramento de risco visual.
