# 🔍 Troubleshooting: Não Consigo Ver Minhas Transações

## ❌ Problema

Você cadastrou um usuário e lançou transações, mas não consegue ver as transações ao listar.

## 🔍 Possíveis Causas

### 1. **Token JWT não está sendo enviado**

**Sintoma:**
- Erro 401 (Não autenticado)
- Logs mostram "Token não encontrado"

**Solução:**
- Verifique se o token está sendo enviado no header `Authorization`
- Formato: `Authorization: Bearer {token}`

### 2. **Token de usuário diferente**

**Sintoma:**
- Você está logado com um usuário
- Mas as transações foram criadas com outro usuário

**Solução:**
- Faça login novamente
- Verifique se está usando o mesmo usuário que criou as transações

### 3. **userId no token não corresponde**

**Sintoma:**
- Token válido, mas não retorna transações
- Logs mostram userId diferente

**Solução:**
- Verifique o userId no token (decode o JWT)
- Verifique o userId das transações no banco

### 4. **Transações criadas sem autenticação**

**Sintoma:**
- Transações foram criadas antes de fazer login
- Ou foram criadas sem token JWT

**Solução:**
- Crie novas transações após fazer login
- Verifique se o endpoint de criação requer autenticação

## 🧪 Como Diagnosticar

### Teste 1: Verificar Token

**No frontend, após fazer login:**

```typescript
// Verificar se o token foi salvo
const token = localStorage.getItem('token');
console.log('Token:', token);

// Decodificar o token (apenas para debug)
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('User ID no token:', payload.sub);
console.log('Email no token:', payload.email);
```

### Teste 2: Verificar Requisição

**No DevTools (F12) → Network:**

1. Faça uma requisição para listar transações
2. Verifique:
   - **Headers:** Deve ter `Authorization: Bearer {token}`
   - **Status:** Deve ser 200 (não 401)
   - **Response:** Deve retornar array de transações

### Teste 3: Verificar Logs do Backend

**Quando listar transações, os logs devem mostrar:**

```
✅ Usuário autenticado: seu@email.com (ID: 1)
🔍 Validando payload JWT...
📋 Payload recebido: {"email":"seu@email.com","sub":1}
✅ Token válido para usuário ID: 1, Email: seu@email.com
```

### Teste 4: Verificar no Banco de Dados

**Conecte no MySQL:**

```sql
-- Ver usuários
SELECT id, email, name FROM users;

-- Ver transações com userId
SELECT id, userId, description, amount, type, status 
FROM transactions 
ORDER BY createdAt DESC;

-- Ver transações de um usuário específico
SELECT id, userId, description, amount, type, status 
FROM transactions 
WHERE userId = 1; -- Substitua 1 pelo ID do seu usuário
```

## ✅ Soluções

### Solução 1: Verificar Autenticação

**Certifique-se de que:**

1. **Você fez login:**
   ```bash
   POST /auth/login
   {
     "email": "seu@email.com",
     "password": "suasenha"
   }
   ```

2. **Token foi salvo:**
   - Verifique se o token está em `localStorage` ou `sessionStorage`
   - Nome da chave: `token` ou `access_token`

3. **Token está sendo enviado:**
   - Verifique no DevTools → Network
   - Header `Authorization` deve estar presente

### Solução 2: Verificar userId

**Após fazer login, verifique:**

1. **O userId no token:**
   ```javascript
   // Decodificar token
   const token = localStorage.getItem('token');
   const payload = JSON.parse(atob(token.split('.')[1]));
   console.log('Meu User ID:', payload.sub);
   ```

2. **O userId das transações:**
   ```sql
   SELECT userId, COUNT(*) as total 
   FROM transactions 
   GROUP BY userId;
   ```

3. **Compare:**
   - Se forem diferentes, você está logado com usuário diferente
   - Faça login com o usuário correto

### Solução 3: Criar Transações Novas

**Se as transações antigas foram criadas sem autenticação:**

1. **Faça login novamente**
2. **Crie novas transações:**
   ```bash
   POST /transactions
   Authorization: Bearer {seu-token}
   {
     "description": "Teste",
     "amount": 10000,
     "category": "Teste",
     "type": "expense",
     "dueDate": "2026-01-15",
     "recurrence": "Única"
   }
   ```

3. **Liste as transações:**
   ```bash
   GET /transactions
   Authorization: Bearer {seu-token}
   ```

### Solução 4: Verificar Frontend

**No frontend, certifique-se de:**

1. **Token está sendo enviado:**
   ```typescript
   // Interceptor ou configuração
   headers: {
     'Authorization': `Bearer ${token}`
   }
   ```

2. **URL está correta:**
   ```typescript
   const API_URL = 'http://api-jhukyy-dcf077-168-231-92-86.traefik.me';
   ```

3. **Endpoint está correto:**
   ```typescript
   GET ${API_URL}/transactions
   ```

## 📋 Checklist de Verificação

- [ ] Fiz login e recebi o token
- [ ] Token está salvo (localStorage/sessionStorage)
- [ ] Token está sendo enviado no header `Authorization`
- [ ] Formato correto: `Bearer {token}`
- [ ] Requisição retorna status 200 (não 401)
- [ ] Verifiquei o userId no token
- [ ] Verifiquei o userId das transações no banco
- [ ] Os userIds correspondem

## 🧪 Teste Rápido

### 1. Fazer Login

```bash
POST http://api-jhukyy-dcf077-168-231-92-86.traefik.me/auth/login
Content-Type: application/json

{
  "email": "seu@email.com",
  "password": "suasenha"
}
```

**Resposta esperada:**
```json
{
  "access_token": "seu-token-aqui",
  "token_type": "Bearer",
  "user": {
    "id": 1,
    "email": "seu@email.com",
    "name": "Seu Nome"
  }
}
```

### 2. Listar Transações

```bash
GET http://api-jhukyy-dcf077-168-231-92-86.traefik.me/transactions
Authorization: Bearer {seu-token}
```

**Resposta esperada:**
```json
[
  {
    "id": 1,
    "userId": 1,
    "description": "Transação 1",
    "amount": 10000,
    ...
  }
]
```

### 3. Se Retornar Array Vazio

**Possíveis causas:**
- Transações foram criadas com outro userId
- Transações foram criadas sem autenticação
- Filtros estão muito restritivos

**Solução:**
- Crie uma nova transação após fazer login
- Verifique se aparece na lista

## 🐛 Problemas Comuns

### Problema: "Token não encontrado"

**Solução:**
- Verifique se o token está sendo enviado
- Verifique o formato: `Bearer {token}` (com espaço)

### Problema: "Token inválido"

**Solução:**
- Faça login novamente para obter novo token
- Verifique se o token não expirou (24h)

### Problema: Array vazio retornado

**Solução:**
- Verifique se há transações no banco para seu userId
- Crie uma nova transação após fazer login
- Verifique se os filtros não estão muito restritivos

## 📝 Resumo

1. ✅ **Faça login** e salve o token
2. ✅ **Envie o token** em todas as requisições
3. ✅ **Verifique o userId** no token e nas transações
4. ✅ **Crie novas transações** após fazer login
5. ✅ **Verifique os logs** do backend

