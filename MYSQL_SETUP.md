# Setup do MySQL

## 📋 Configuração do Banco de Dados

### 1. Criar o banco de dados

Antes de iniciar a aplicação, você precisa criar o banco de dados `my-control` no MySQL:

```sql
CREATE DATABASE `my-control` 
DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Ou via linha de comando:
```bash
mysql -u root -p -e "CREATE DATABASE \`my-control\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### 2. Variáveis de Ambiente

O arquivo `.env` já foi criado com as seguintes configurações:

```env
DATABASE_URL="mysql://root:root@localhost:3306/my-control"
PORT=3000
JWT_SECRET="your-secret-key-change-in-production"
```

**Importante:** Se suas credenciais do MySQL forem diferentes, edite o arquivo `.env`:

```env
DATABASE_URL="mysql://[username]:[password]@localhost:3306/my-control"
```

### 3. Instalar dependências

```bash
cd api-my-control
npm install
```

### 4. Gerar Prisma Client

```bash
npm run prisma:generate
```

### 5. Iniciar a aplicação

```bash
npm run start:dev
```

A aplicação irá:
- ✅ Conectar ao banco de dados MySQL
- ✅ Criar automaticamente as tabelas `users` e `transactions` se não existirem
- ✅ Iniciar na porta 3000 (ou a porta definida no `.env`)

### 📊 Estrutura das Tabelas

As seguintes tabelas serão criadas automaticamente:

#### Tabela `users`
- `id` (INT, PK, Auto)
- `email` (VARCHAR, Unique)
- `password` (VARCHAR, Hash)
- `name` (VARCHAR)
- `createdAt` (DATETIME)
- `updatedAt` (DATETIME)

#### Tabela `transactions`
- `id` (INT, PK, Auto)
- `userId` (INT, FK -> users.id)
- `description` (VARCHAR)
- `amount` (INT) - Valor em centavos
- `category` (VARCHAR)
- `type` (VARCHAR) - 'income' ou 'expense'
- `status` (VARCHAR) - 'open' ou 'paid'
- `dueDate` (DATETIME)
- `paidDate` (DATETIME, Nullable)
- `recurrence` (VARCHAR) - 'Única', 'Mensal', 'Semanal', 'Anual'
- `createdAt` (DATETIME)
- `updatedAt` (DATETIME)

### 🔍 Verificar conexão

Após iniciar a aplicação, você verá nos logs:

```
✅ Conectado ao banco de dados MySQL
🔄 Verificando e criando tabelas...
✅ Tabelas verificadas/criadas com sucesso
🚀 Application is running on: http://localhost:3000
📚 Swagger documentation: http://localhost:3000/api/docs
```

### ⚠️ Troubleshooting

**Erro: "Unknown database 'my-control'"**
- Solução: Crie o banco de dados primeiro (veja passo 1)

**Erro: "Access denied for user 'root'@'localhost'"**
- Solução: Verifique as credenciais no arquivo `.env`

**Erro: "Can't connect to MySQL server"**
- Solução: Verifique se o MySQL está rodando:
  ```bash
  # Windows (serviço)
  net start MySQL
  
  # Linux/Mac
  sudo systemctl start mysql
  # ou
  sudo service mysql start
  ```

