# 🔑 Como Enviar Token JWT no Frontend

## ❌ Problema Atual

Os logs mostram que o token JWT **não está sendo enviado** nas requisições:

```
📋 [JWT Strategy] Authorization header encontrado: NÃO
❌ [JWT Strategy] Token não encontrado ou formato inválido
```

## ✅ Solução: Enviar Token em Todas as Requisições

Após fazer login, você precisa:
1. **Salvar o token** retornado pelo login
2. **Enviar o token** no header `Authorization` em todas as requisições protegidas

## 📋 Endpoints que Precisam de Token

### ✅ Públicos (não precisam de token):
- `POST /auth/login` - Login
- `POST /auth/forgot-password` - Recuperação de senha

### 🔒 Protegidos (precisam de token):
- `GET /transactions` - Listar transações
- `POST /transactions` - Criar transação
- `GET /transactions/:id` - Obter transação
- `PUT /transactions/:id` - Atualizar transação
- `DELETE /transactions/:id` - Deletar transação
- `GET /dashboard` - Obter resumo financeiro

## 🔧 Implementação no Frontend

### 1. Resposta do Login

Quando você faz login, a API retorna:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "user": {
    "id": 1,
    "email": "usuario@email.com",
    "name": "Nome do Usuário"
  }
}
```

**Importante:** O token está em `access_token` (não `token`).

### 2. Salvar o Token Após Login

```typescript
// Exemplo de função de login
async function login(email: string, password: string) {
  const response = await fetch('https://api-jhukyy-dcf077-168-231-92-86.traefik.me/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Erro ao fazer login');
  }

  const data = await response.json();
  
  // ⭐ SALVAR O TOKEN
  localStorage.setItem('token', data.access_token);
  localStorage.setItem('user', JSON.stringify(data.user));
  
  return data;
}
```

### 3. Enviar Token em Todas as Requisições

#### Opção A: Usando Axios (Recomendado)

```typescript
import axios from 'axios';

// Criar instância do Axios
const api = axios.create({
  baseURL: 'https://api-jhukyy-dcf077-168-231-92-86.traefik.me',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// ⭐ Interceptor para adicionar token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido ou expirado
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirecionar para login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Usar a API
export default api;
```

**Exemplo de uso:**

```typescript
// Fazer login (sem token)
const loginResponse = await api.post('/auth/login', { email, password });
localStorage.setItem('token', loginResponse.data.access_token);

// Listar transações (com token automático)
const transactions = await api.get('/transactions');

// Criar transação (com token automático)
const newTransaction = await api.post('/transactions', {
  type: 'expense',
  amount: 100,
  description: 'Compra',
});
```

#### Opção B: Usando Fetch

```typescript
// Função helper para fazer requisições autenticadas
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }), // ⭐ Adiciona token
    ...options.headers,
  };

  const response = await fetch(
    `https://api-jhukyy-dcf077-168-231-92-86.traefik.me${endpoint}`,
    {
      ...options,
      headers,
      credentials: 'include',
    }
  );

  if (response.status === 401) {
    // Token inválido ou expirado
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Não autenticado');
  }

  if (!response.ok) {
    throw new Error(`Erro: ${response.statusText}`);
  }

  return response.json();
}

// Exemplos de uso
async function getTransactions() {
  return apiRequest('/transactions');
}

async function createTransaction(data: any) {
  return apiRequest('/transactions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
```

#### Opção C: Angular HttpClient

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    const token = localStorage.getItem('token');
    
    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`) // ⭐
      });
      return next.handle(cloned);
    }
    
    return next.handle(req);
  }
}

// No app.module.ts
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
})
export class AppModule {}
```

**Uso:**

```typescript
// Login (sem token)
this.http.post('https://api-jhukyy-dcf077-168-231-92-86.traefik.me/auth/login', {
  email,
  password
}).subscribe((data: any) => {
  localStorage.setItem('token', data.access_token);
});

// Transações (com token automático via interceptor)
this.http.get('https://api-jhukyy-dcf077-168-231-92-86.traefik.me/transactions')
  .subscribe(transactions => {
    console.log(transactions);
  });
```

## 🧪 Como Testar

### 1. Teste no Swagger

1. Acesse: `https://api-jhukyy-dcf077-168-231-92-86.traefik.me/api/docs`
2. Clique em `POST /auth/login`
3. Clique em "Try it out"
4. Preencha email e senha
5. Execute e copie o `access_token`
6. Clique no botão "Authorize" no topo
7. Cole o token (sem "Bearer ")
8. Agora teste os endpoints protegidos

### 2. Teste no Console do Navegador

```javascript
// 1. Fazer login
fetch('https://api-jhukyy-dcf077-168-231-92-86.traefik.me/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'seu@email.com', password: 'suasenha' })
})
.then(r => r.json())
.then(data => {
  console.log('Token:', data.access_token);
  localStorage.setItem('token', data.access_token);
  
  // 2. Testar endpoint protegido
  return fetch('https://api-jhukyy-dcf077-168-231-92-86.traefik.me/transactions', {
    headers: {
      'Authorization': `Bearer ${data.access_token}` // ⭐
    }
  });
})
.then(r => r.json())
.then(data => console.log('Transações:', data))
.catch(err => console.error('Erro:', err));
```

### 3. Verificar no DevTools

1. Abra o DevTools (F12)
2. Vá em **Network**
3. Faça uma requisição do frontend
4. Clique na requisição
5. Vá em **Headers**
6. Verifique se há:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## 🐛 Troubleshooting

### Erro: "No auth token"

**Causa:** O token não está sendo enviado

**Solução:**
1. Verifique se o token está sendo salvo após login
2. Verifique se o token está sendo enviado no header `Authorization`
3. Verifique o formato: `Bearer {token}` (com espaço após "Bearer")

### Erro: "Token inválido"

**Causa:** Token expirado ou inválido

**Solução:**
1. Faça login novamente para obter um novo token
2. Tokens expiram em 24 horas
3. Verifique se está usando o token correto

### Erro: "401 Unauthorized"

**Causa:** Token não está sendo enviado ou está inválido

**Solução:**
1. Verifique se o header `Authorization` está presente
2. Verifique se o formato está correto: `Bearer {token}`
3. Verifique se o token não expirou

## 📋 Checklist

- [ ] Token está sendo salvo após login (`localStorage.setItem('token', ...)`)
- [ ] Token está sendo enviado no header `Authorization`
- [ ] Formato correto: `Bearer {token}` (com espaço)
- [ ] Interceptor configurado (se usando Axios/Angular)
- [ ] Testei no Swagger e funcionou
- [ ] Testei no frontend e funcionou
- [ ] Verifiquei no DevTools que o header está sendo enviado

## 💡 Dica

**Sempre use um interceptor** (Axios ou Angular) para adicionar o token automaticamente. Isso evita esquecer de adicionar o token em alguma requisição.

## 📝 Resumo

1. ✅ Fazer login e salvar `access_token`
2. ✅ Adicionar token no header `Authorization: Bearer {token}`
3. ✅ Usar interceptor para automatizar
4. ✅ Tratar erros 401 (token inválido/expirado)
