# MyControl API

API backend para o sistema de controle financeiro pessoal.

## 🚀 Tecnologias

- **NestJS** - Framework Node.js
- **TypeScript** - Linguagem de programação
- **Swagger/OpenAPI** - Documentação da API
- **JWT** - Autenticação
- **Passport** - Estratégias de autenticação
- **class-validator** - Validação de DTOs

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

## 📚 Documentação Swagger

Após iniciar o servidor, acesse:
- **Swagger UI**: http://localhost:3000/api/docs

## 📋 Endpoints

### Autenticação (`/auth`)
- `POST /auth/login` - Login do usuário
- `POST /auth/forgot-password` - Recuperação de senha

### Transações (`/transactions`)
- `GET /transactions` - Listar transações (com filtros opcionais)
- `GET /transactions/:id` - Buscar transação por ID
- `POST /transactions` - Criar nova transação
- `PATCH /transactions/:id` - Atualizar transação
- `DELETE /transactions/:id` - Excluir transação
- `PATCH /transactions/:id/mark-as-paid` - Marcar como paga

### Dashboard (`/dashboard`)
- `GET /dashboard/summary` - Resumo financeiro do mês

## 🔒 Rotas Protegidas

Todas as rotas, exceto `/auth/login` e `/auth/forgot-password`, requerem autenticação.

## 📝 Estrutura do Projeto

```
src/
├── auth/              # Módulo de autenticação
│   ├── dto/          # Data Transfer Objects
│   ├── guards/       # Guards de autenticação
│   ├── strategies/   # Estratégias Passport
│   └── decorators/   # Decorators customizados
├── transactions/      # Módulo de transações
│   ├── dto/          # DTOs de transações
│   └── entities/     # Entidades
├── dashboard/        # Módulo de dashboard
│   └── dto/          # DTOs de dashboard
└── main.ts           # Arquivo principal
```

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Cobertura
npm run test:cov
```

## 📄 Licença

UNLICENSED
