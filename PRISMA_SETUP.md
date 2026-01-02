# Setup do Prisma

## 📋 Passos para configurar o banco de dados

### 1. Instalar dependências
```bash
cd api-my-control
npm install
```

### 2. Gerar o Prisma Client
```bash
npm run prisma:generate
```

### 3. Executar migrations (criar tabelas no banco)
```bash
npm run prisma:migrate
```

Isso irá:
- Criar as tabelas `users` e `transactions` no banco de dados
- Aplicar o schema definido em `prisma/schema.prisma`

### 4. (Opcional) Abrir Prisma Studio para visualizar dados
```bash
npm run prisma:studio
```

## 🔧 Variáveis de Ambiente

As variáveis de ambiente já estão configuradas no arquivo `.env`:
- `DATABASE_URL` - URL de conexão principal
- `POSTGRES_URL` - URL alternativa
- `PRISMA_DATABASE_URL` - URL do Prisma Accelerate

## 📊 Estrutura do Banco

### Tabela `users`
- `id` (Int, PK, Auto)
- `email` (String, Unique)
- `password` (String, Hash)
- `name` (String)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Tabela `transactions`
- `id` (Int, PK, Auto)
- `userId` (Int, FK -> users.id)
- `description` (String)
- `amount` (Int) - Valor em centavos
- `category` (String)
- `type` (String) - 'income' ou 'expense'
- `status` (String) - 'open' ou 'paid'
- `dueDate` (DateTime)
- `paidDate` (DateTime, Nullable)
- `recurrence` (String) - 'Única', 'Mensal', 'Semanal', 'Anual'
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

## ✅ Após o setup

1. O usuário padrão será criado automaticamente:
   - Email: `mersoabreu@gmail.com`
   - Senha: `123456`

2. Inicie o servidor:
```bash
npm run start:dev
```

3. Acesse a documentação:
   - Swagger: http://localhost:3000/api/docs

