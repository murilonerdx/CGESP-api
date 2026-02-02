# CGESP-api Frontend

This is the web client for the Scrap-Chuva application, built with **Next.js 14**, **TailwindCSS**, and **Framer Motion**. It offers a modern interface for data visualization from CGE and custom monitoring management.

> 🇧🇷 **[Leia em Português](#-versão-em-português)**

## 📋 Prerequisites

- Node.js (v18+)

## 🚀 Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env.local` file in the `frontend` root folder (optional, defaults point to localhost:3000).

## 🏃 Execution

### Development
```bash
npm run dev
```
Access `http://localhost:3001`.

### Production
```bash
npm run build
npm start
```

## 📱 Structure

- **/dashboard**: Main panel with Weather, Alerts, News, and Monitoring.
- **Login/Signup**: Authentication screens fully integrated with animations.
- **Historical Search**: Interface to search past floods with date filters.
- **My Places**: Visual management of monitors places with real-time risk indication.

## 🎨 Design

The project follows a refined "Noir/Dark" aesthetic, using custom components in `/components` and color system in `index.css`.

---

## 🇧🇷 Versão em Português

Este é o cliente web da aplicação **CGESP-api**, construído com **Next.js 14**, **TailwindCSS** e **Framer Motion**. Ele oferece uma interface moderna para visualização de dados do CGE e gerenciamento de monitoramento personalizado.

### 📋 Pré-requisitos

- Node.js (v18+)

### 🚀 Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
Crie um arquivo `.env.local` na raiz da pasta `frontend` (opcional, defaults apontam para localhost:3000).

### 🏃 Execução

#### Desenvolvimento
```bash
npm run dev
```
Acesse `http://localhost:3001`.

#### Produção
```bash
npm run build
npm start
```

### 📱 Estrutura

- **/dashboard**: Painel principal com Clima, Alertas, Notícias e Monitoramento.
- **Login/Signup**: Telas de autenticação totalmente integradas com animações.
- **Busca Histórica**: Interface para pesquisar alagamentos passados com filtros de data.
- **Meus Lugares**: Gerenciamento visual de locais monitorados com indicação de risco em tempo real.

### 🎨 Design

O projeto segue uma estética "Noir/Dark" refinada, utilizando componentes customizados em `/components` e sistema de cores em `index.css`.
