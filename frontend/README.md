# Scrap-Chuva Frontend

Este é o cliente web da aplicação Scrap-Chuva, construído com **Next.js 14**, **TailwindCSS** e **Framer Motion**. Ele oferece uma interface moderna para visualização de dados do CGE e gerenciamento de monitoramento personalizado.

## 📋 Pré-requisitos

- Node.js (v18+)

## 🚀 Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
Crie um arquivo `.env.local` na raiz da pasta `frontend` (opcional, defaults apontam para localhost:3000).

## 🏃 Execução

### Desenvolvimento
```bash
npm run dev
```
Acesse `http://localhost:3001`.

### Produção
```bash
npm run build
npm start
```

## 📱 Estrutura

- **/dashboard**: Painel principal com Clima, Alertas, Notícias e Monitoramento.
- **Login/Signup**: Telas de autenticação totalmente integradas com animações.
- **Busca Histórica**: Interface para pesquisar alagamentos passados com filtros de data.
- **Meus Lugares**: Gerenciamento visual de locais monitorados com indicação de risco em tempo real.

## 🎨 Design

O projeto segue uma estética "Noir/Dark" refinada, utilizando componentes customizados em `/components` e sistema de cores em `index.css`.
