# 🔑 Problema: Token JWT Não Está Sendo Enviado

## ❌ Situação Atual

Os logs mostram que:

1. ✅ **CORS está funcionando** - A requisição chegou ao servidor
2. ❌ **Token JWT não está sendo enviado** - O header `Authorization` está ausente
3. ⚠️ **Requisição sem Origin** - O header `Origin` não está presente

## 📋 Logs do Backend

```
🔍 CORS - Requisição recebida de origem: sem origem (mobile/Postman)
✅ CORS permitido: requisição sem origin

📋 Authorization header: NÃO ENCONTRADO
📋 Headers disponíveis: host, user-agent, accept, baggage, range, traceparent, ...
```

## 🔍 Análise

### Por que "sem origem"?

A requisição está chegando sem o header `Origin`, o que pode acontecer quando:

1. **Requisição Server-Side (SSR)**: O Vercel pode estar fazendo requisições server-side (no servidor, não no navegador)
2. **Proxy Reverso**: O Traefik pode estar removendo o header `Origin`
3. **Requisição Direta**: Não é uma requisição do navegador (CORS não se aplica)

### Por que o token não está sendo enviado?

O frontend **não está enviando** o token JWT no header `Authorization`. Isso acontece quando:

1. O token não foi salvo após o login
2. O interceptor não está configurado
3. O token está sendo enviado com nome errado
4. O frontend está fazendo requisições server-side (SSR) sem passar o token

## ✅ Soluções

### Solução 1: Verificar se o Token Está Sendo Salvo

**No frontend, após fazer login:**

```typescript
// Fazer login
const response = await fetch('https://api-jhukyy-dcf077-168-231-92-86.traefik.me/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});

const data = await response.json();

// ⭐ VERIFICAR: O token está em 'access_token'
console.log('Token recebido:', data.access_token);

// ⭐ SALVAR o token
localStorage.setItem('token', data.access_token);

// ⭐ VERIFICAR: Token foi salvo?
console.log('Token salvo?', localStorage.getItem('token'));
```

### Solução 2: Configurar Interceptor (Axios)

**Se estiver usando Axios:**

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api-jhukyy-dcf077-168-231-92-86.traefik.me',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ⭐ INTERCEPTOR para adicionar token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  
  console.log('🔑 Token no interceptor:', token ? 'SIM' : 'NÃO');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('✅ Token adicionado ao header');
  } else {
    console.warn('⚠️ Token não encontrado no localStorage');
  }
  
  return config;
});

export default api;
```

### Solução 3: Configurar Interceptor (Angular)

**Se estiver usando Angular:**

```typescript
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = localStorage.getItem('token');
    
    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
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
```

### Solução 4: Se Estiver Usando SSR (Server-Side Rendering)

**Se o Vercel estiver fazendo SSR, você precisa:**

1. **Passar o token do cliente para o servidor:**
   ```typescript
   // No componente/serviço
   getToken(): string | null {
     // Em SSR, localStorage não existe no servidor
     if (typeof window !== 'undefined') {
       return localStorage.getItem('token');
     }
     return null;
   }
   ```

2. **Ou fazer requisições apenas no cliente:**
   ```typescript
   // Fazer requisições apenas no cliente (não no servidor)
   if (typeof window !== 'undefined') {
     const token = localStorage.getItem('token');
     // Fazer requisição...
   }
   ```

## 🧪 Como Testar

### 1. Verificar no Console do Navegador

Abra o DevTools (F12) e no Console:

```javascript
// Verificar se o token está salvo
console.log('Token:', localStorage.getItem('token'));

// Se não tiver token, fazer login novamente
```

### 2. Verificar no Network (DevTools)

1. Abra DevTools (F12)
2. Vá em **Network**
3. Faça uma requisição do frontend
4. Clique na requisição
5. Vá em **Headers**
6. Procure por `Authorization: Bearer ...`

**Se não aparecer:**
- O token não está sendo enviado
- Verifique o interceptor
- Verifique se o token está salvo

### 3. Testar Diretamente no Backend

**No Swagger:**
1. Acesse: `https://api-jhukyy-dcf077-168-231-92-86.traefik.me/api/docs`
2. Faça login: `POST /auth/login`
3. Copie o `access_token`
4. Clique em "Authorize" (topo da página)
5. Cole o token
6. Teste: `GET /transactions`

**Se funcionar no Swagger:**
- O backend está OK
- O problema é no frontend

## 📋 Checklist

- [ ] Token está sendo salvo após login?
- [ ] Interceptor está configurado?
- [ ] Token está sendo enviado no header `Authorization`?
- [ ] Formato correto: `Bearer {token}`?
- [ ] Testei no Swagger e funcionou?
- [ ] Verifiquei no DevTools → Network → Headers?

## 🔧 Debug Rápido

**Adicione logs no frontend:**

```typescript
// Antes de fazer requisição
const token = localStorage.getItem('token');
console.log('🔑 Token antes da requisição:', token ? 'SIM' : 'NÃO');

if (token) {
  console.log('🔑 Token completo:', token.substring(0, 50) + '...');
}

// Fazer requisição
fetch('https://api-jhukyy-dcf077-168-231-92-86.traefik.me/transactions', {
  headers: {
    'Authorization': `Bearer ${token}`, // ⭐
  },
})
.then(response => {
  console.log('✅ Resposta:', response.status);
})
.catch(error => {
  console.error('❌ Erro:', error);
});
```

## 💡 Dica

**O problema mais comum é:**
1. Token não está sendo salvo após login
2. Interceptor não está configurado
3. Token está sendo enviado com nome errado (`token` ao invés de `access_token`)

**Verifique primeiro se o token está sendo salvo!**
