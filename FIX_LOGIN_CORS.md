# 🔧 Corrigir: Erro de CORS ou Conexão no Login

## ❌ Problema Identificado

O erro de CORS ou conexão no login pode ocorrer por vários motivos:

### 1. **Mixed Content (HTTPS → HTTP)**
- **Frontend:** `https://my-control-phi.vercel.app` (HTTPS) ✅
- **Backend:** `http://api-jhukyy-dcf077-168-231-92-86.traefik.me` (HTTP) ❌
- **Solução:** Use `https://` na URL da API

### 2. **CORS não configurado corretamente**
- A origem do frontend não está na lista de permitidas
- Headers não estão configurados corretamente

### 3. **URL da API incorreta no frontend**
- Pode estar faltando o protocolo (`https://`)
- Pode estar faltando o caminho correto (`/auth/login`)

## ✅ Soluções Implementadas

### 1. CORS Melhorado

O CORS foi atualizado para:
- ✅ Suportar HTTP e HTTPS da mesma origem
- ✅ Logs detalhados para debug
- ✅ Temporariamente permissivo para identificar problemas
- ✅ Headers adicionais suportados

### 2. URLs Configuradas

As seguintes URLs estão permitidas:
- `http://localhost:4200` (desenvolvimento)
- `http://localhost:3000` (desenvolvimento)
- `https://my-control-phi.vercel.app` (frontend produção)
- `http://api-jhukyy-dcf077-168-231-92-86.traefik.me` (API HTTP)
- `https://api-jhukyy-dcf077-168-231-92-86.traefik.me` (API HTTPS)

## 🔍 Como Diagnosticar

### 1. Verificar os Logs do Backend

Após fazer uma requisição, os logs devem mostrar:
```
🔍 CORS - Requisição recebida de origem: https://my-control-phi.vercel.app
✅ CORS permitido: origem na lista - https://my-control-phi.vercel.app
```

Se aparecer:
```
⚠️ CORS - Origem não está na lista: [origem]
```
Adicione essa origem à lista ou configure via `ALLOWED_ORIGINS`.

### 2. Verificar no Navegador (DevTools)

**Console (F12 → Console):**
- Procure por erros de CORS
- Procure por erros de "Mixed Content"
- Procure por erros de conexão

**Network (F12 → Network):**
1. Tente fazer login
2. Clique na requisição `POST /auth/login`
3. Verifique:
   - **Status:** Deve ser `200` ou `401` (não `CORS error`)
   - **Headers Request:** Deve ter `Origin: https://my-control-phi.vercel.app`
   - **Headers Response:** Deve ter `Access-Control-Allow-Origin: https://my-control-phi.vercel.app`

### 3. Testar a API Diretamente

**Teste com cURL:**
```bash
# Teste 1: Verificar se a API está online
curl -X GET http://api-jhukyy-dcf077-168-231-92-86.traefik.me/

# Teste 2: Testar login (substitua email e senha)
curl -X POST http://api-jhukyy-dcf077-168-231-92-86.traefik.me/auth/login \
  -H "Content-Type: application/json" \
  -H "Origin: https://my-control-phi.vercel.app" \
  -d '{"email":"seu@email.com","password":"suasenha"}'

# Teste 3: Testar com HTTPS (se disponível)
curl -X POST https://api-jhukyy-dcf077-168-231-92-86.traefik.me/auth/login \
  -H "Content-Type: application/json" \
  -H "Origin: https://my-control-phi.vercel.app" \
  -d '{"email":"seu@email.com","password":"suasenha"}'
```

**Teste no Swagger:**
1. Acesse: `http://api-jhukyy-dcf077-168-231-92-86.traefik.me/api/docs`
2. Ou: `https://api-jhukyy-dcf077-168-231-92-86.traefik.me/api/docs`
3. Teste o endpoint `POST /auth/login`

## 🔧 Configurar Frontend

### 1. Use HTTPS na URL da API

**Antes (não funciona):**
```typescript
const API_URL = 'http://api-jhukyy-dcf077-168-231-92-86.traefik.me';
```

**Depois (funciona):**
```typescript
const API_URL = 'https://api-jhukyy-dcf077-168-231-92-86.traefik.me';
```

**Ou teste ambas:**
```typescript
// Tenta HTTPS primeiro, depois HTTP
const API_URL = 'https://api-jhukyy-dcf077-168-231-92-86.traefik.me' 
  || 'http://api-jhukyy-dcf077-168-231-92-86.traefik.me';
```

### 2. Configurar Requisições

**Exemplo com Fetch:**
```typescript
const response = await fetch('https://api-jhukyy-dcf077-168-231-92-86.traefik.me/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // Importante para CORS com credenciais
  body: JSON.stringify({ email, password }),
});
```

**Exemplo com Axios:**
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api-jhukyy-dcf077-168-231-92-86.traefik.me',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Importante para CORS
});

// Fazer login
const response = await api.post('/auth/login', { email, password });
```

### 3. Tratar Erros

```typescript
try {
  const response = await fetch('https://api-jhukyy-dcf077-168-231-92-86.traefik.me/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erro ao fazer login');
  }

  const data = await response.json();
  // Salvar token
  localStorage.setItem('token', data.access_token);
} catch (error) {
  if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
    console.error('Erro de CORS ou conexão. Verifique:');
    console.error('1. A URL da API está correta?');
    console.error('2. A API está online?');
    console.error('3. Está usando HTTPS?');
  }
  throw error;
}
```

## 🚀 Próximos Passos

### 1. Fazer Deploy

Após as alterações:
```bash
git add src/main.ts
git commit -m "Fix: Melhorar configuração de CORS para login"
git push
```

### 2. No Dockploy

- Faça um novo deploy
- Ou aguarde o deploy automático

### 3. Testar

1. Acesse o frontend: `https://my-control-phi.vercel.app`
2. Tente fazer login
3. Verifique os logs do backend
4. Verifique o console do navegador

## 🐛 Troubleshooting

### Erro: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Causa:** A origem não está sendo permitida

**Solução:**
1. Verifique os logs do backend - deve mostrar a origem
2. Adicione a origem à lista em `src/main.ts`
3. Ou configure via `ALLOWED_ORIGINS` no Dockploy

### Erro: "Blocked-Mixed Content"

**Causa:** Frontend HTTPS tentando acessar API HTTP

**Solução:**
1. Use `https://` na URL da API
2. Ou configure HTTPS no backend

### Erro: "Failed to fetch" ou "Network Error"

**Causa:** Problema de conexão

**Solução:**
1. Verifique se a API está online
2. Verifique se a URL está correta
3. Verifique se não há firewall bloqueando
4. Teste no Swagger primeiro

### Erro: "401 Unauthorized"

**Causa:** Credenciais incorretas (não é problema de CORS)

**Solução:**
1. Verifique email e senha
2. Verifique se o usuário existe no banco

## 📋 Checklist

- [ ] CORS atualizado no backend
- [ ] Deploy feito
- [ ] Frontend usando HTTPS na URL da API
- [ ] Testei no Swagger
- [ ] Verifiquei os logs do backend
- [ ] Verifiquei o console do navegador
- [ ] Login funcionando

## 💡 Dica

Se ainda não funcionar após todas as correções:

1. **Verifique os logs do backend em tempo real:**
   - No Dockploy, vá em "Logs"
   - Tente fazer login
   - Veja o que aparece nos logs

2. **Teste diretamente no Swagger:**
   - Se funcionar no Swagger, o problema é no frontend
   - Se não funcionar no Swagger, o problema é no backend

3. **Use o modo de desenvolvimento temporariamente:**
   - O CORS está configurado para permitir qualquer origem em desenvolvimento
   - Isso ajuda a identificar se o problema é CORS ou outra coisa
