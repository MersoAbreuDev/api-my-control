# 🔧 Corrigir: Mixed Content e Token JWT

## ❌ Problemas Identificados

### 1. **Blocked-Mixed Content**
O frontend está em **HTTPS** (`https://my-control-phi.vercel.app`) tentando acessar o backend em **HTTP** (`http://api-jhukyy-dcf077-168-231-92-86.traefik.me`).

**Browsers bloqueiam conteúdo misto (HTTPS → HTTP) por segurança.**

### 2. **Token JWT não está sendo enviado**
Os logs mostram:
```
📋 [JWT Strategy] Authorization header encontrado: NÃO
❌ [JWT Strategy] Token não encontrado ou formato inválido
```

## ✅ Soluções

### Solução 1: Configurar HTTPS no Backend (Recomendado)

O Traefik no Dockploy deve suportar HTTPS. Verifique:

1. **No painel do Dockploy:**
   - Vá em **"Settings"** ou **"Domain"**
   - Verifique se há opção para habilitar HTTPS/SSL
   - O Traefik geralmente fornece HTTPS automaticamente

2. **URL com HTTPS:**
   - A URL deve ser: `https://api-jhukyy-dcf077-168-231-92-86.traefik.me`
   - Não `http://`

3. **Se não tiver HTTPS automático:**
   - Configure um domínio customizado com SSL
   - Ou use um serviço como Cloudflare para adicionar HTTPS

### Solução 2: Configurar Frontend para Enviar Token

O frontend precisa enviar o token JWT no header `Authorization`.

#### No Frontend (Angular/React/Vue):

**Exemplo com Axios:**
```typescript
import axios from 'axios';

// Interceptor para adicionar token em todas as requisições
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // ou sessionStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Configurar base URL
const api = axios.create({
  baseURL: 'https://api-jhukyy-dcf077-168-231-92-86.traefik.me',
  headers: {
    'Content-Type': 'application/json',
  },
});
```

**Exemplo com Fetch:**
```typescript
const token = localStorage.getItem('token');

fetch('https://api-jhukyy-dcf077-168-231-92-86.traefik.me/api/endpoint', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`, // ⭐ IMPORTANTE
  },
  credentials: 'include', // Para cookies, se necessário
});
```

**Exemplo com Angular HttpClient:**
```typescript
import { HttpClient, HttpHeaders } from '@angular/common/http';

const token = localStorage.getItem('token');
const headers = new HttpHeaders({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`, // ⭐ IMPORTANTE
});

this.http.get('https://api-jhukyy-dcf077-168-231-92-86.traefik.me/api/endpoint', { headers })
  .subscribe(response => {
    // ...
  });
```

## 🔍 Verificar no Frontend

### 1. Após fazer login:

O frontend deve:
1. **Receber o token** da resposta do login
2. **Armazenar o token** (localStorage ou sessionStorage)
3. **Enviar o token** em todas as requisições subsequentes

**Exemplo de fluxo:**
```typescript
// 1. Login
const response = await fetch('https://api-jhukyy-dcf077-168-231-92-86.traefik.me/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});

const data = await response.json();

// 2. Armazenar token
localStorage.setItem('token', data.token); // ou data.access_token

// 3. Usar token nas próximas requisições
const token = localStorage.getItem('token');
fetch('https://api-jhukyy-dcf077-168-231-92-86.traefik.me/transactions', {
  headers: {
    'Authorization': `Bearer ${token}`, // ⭐
  },
});
```

### 2. Verificar no DevTools:

**No navegador (F12 → Network):**
1. Faça uma requisição do frontend
2. Clique na requisição
3. Vá em **"Headers"**
4. Verifique se há:
   ```
   Authorization: Bearer seu-token-aqui
   ```

## 📋 Checklist do Frontend

- [ ] Frontend está usando **HTTPS** para acessar a API
- [ ] Token está sendo **armazenado** após login
- [ ] Token está sendo **enviado** no header `Authorization`
- [ ] Formato correto: `Bearer {token}`
- [ ] Token não está expirado

## 🔧 Configuração no Backend (Já está OK)

O backend já está configurado para:
- ✅ Aceitar token no header `Authorization`
- ✅ Formato: `Bearer {token}`
- ✅ CORS configurado para o frontend

## 🚀 Solução Rápida

### Para o Frontend:

1. **Use HTTPS na URL da API:**
   ```typescript
   const API_URL = 'https://api-jhukyy-dcf077-168-231-92-86.traefik.me';
   ```

2. **Adicione interceptor para token:**
   ```typescript
   // Adicionar token em todas as requisições
   axios.interceptors.request.use((config) => {
     const token = localStorage.getItem('token');
     if (token) {
       config.headers.Authorization = `Bearer ${token}`;
     }
     return config;
   });
   ```

3. **Verifique se o token está sendo salvo após login**

### Para o Backend:

1. **Verifique se HTTPS está habilitado no Dockploy**
2. **Use a URL com HTTPS** nas configurações

## 🐛 Troubleshooting

### Erro: "Blocked-Mixed Content"

**Solução:**
- Use HTTPS na URL da API
- Ou configure HTTPS no backend

### Erro: "No auth token"

**Solução:**
- Verifique se o token está sendo enviado no header
- Verifique o formato: `Bearer {token}`
- Verifique se o token não está expirado

### Token não está sendo salvo

**Solução:**
- Verifique a resposta do login
- O token pode estar em `data.token` ou `data.access_token`
- Verifique o nome da propriedade na resposta

## 📝 Resumo

1. ✅ **Backend**: Já configurado corretamente
2. ⏳ **HTTPS**: Configure no Dockploy ou use URL com HTTPS
3. ⏳ **Frontend**: Adicione interceptor para enviar token automaticamente
4. ⏳ **Frontend**: Use HTTPS na URL da API

