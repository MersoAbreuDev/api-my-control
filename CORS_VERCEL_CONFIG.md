# 🌐 Configuração CORS para Vercel

## ✅ Configuração Atual

O CORS foi configurado para aceitar:

1. **Origins específicos:**
   - `http://localhost:4200` (desenvolvimento local)
   - `http://localhost:3000` (desenvolvimento local)
   - `https://my-control-phi.vercel.app` (frontend Vercel)
   - `http://api-jhukyy-dcf077-168-231-92-86.traefik.me` (API)

2. **Todos os subdomínios do Vercel:**
   - Qualquer URL que termine com `.vercel.app`
   - Exemplo: `https://meu-app.vercel.app`, `https://outro-app.vercel.app`

3. **Qualquer origem em desenvolvimento:**
   - Se `NODE_ENV !== 'production'`, permite qualquer origem

4. **Requisições sem origin:**
   - Mobile apps, Postman, etc.

## 📋 Características da Configuração

### Headers Permitidos:
- `Content-Type`
- `Authorization`

### Headers Expostos:
- `Authorization`

### Métodos Permitidos:
- `GET`
- `POST`
- `PUT`
- `PATCH`
- `DELETE`
- `OPTIONS`

### Credenciais:
- `credentials: true` - Permite cookies e headers de autenticação

## 🔧 Configuração Adicional via Variáveis de Ambiente

Você pode adicionar mais origens via variável de ambiente no Dockploy:

**Variável:** `ALLOWED_ORIGINS`  
**Valor:** `https://outra-url.com,https://mais-uma-url.com`

As URLs serão adicionadas às origens padrão.

## 🧪 Como Testar

### No navegador do celular (DevTools):

1. **Abra o navegador no celular**
2. **Acesse:** `chrome://inspect` (Chrome) ou ferramentas de desenvolvedor
3. **Vá na aba Network**
4. **Tente fazer uma requisição do frontend**
5. **Verifique:**
   - Status da requisição (200 = sucesso)
   - Headers da resposta (deve ter `Access-Control-Allow-Origin`)
   - Erros no console (se houver)

### Verificar Headers da Resposta:

A resposta deve incluir:
```
Access-Control-Allow-Origin: https://my-control-phi.vercel.app
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

## 🐛 Troubleshooting

### Erro: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Causa:** A origem não está na lista de permitidas

**Solução:**
- Verifique os logs do backend - deve mostrar a origem que tentou acessar
- Adicione a origem em `defaultOrigins` ou via `ALLOWED_ORIGINS`
- Se for um subdomínio do Vercel, deve funcionar automaticamente

### Erro: "CORS policy: Credentials flag is true"

**Causa:** Problema com `credentials: true`

**Solução:**
- Verifique se o frontend está enviando `credentials: 'include'`
- Verifique se o `Access-Control-Allow-Origin` não é `*` (deve ser a origem específica)

### Frontend Vercel não consegue acessar

**Verificar:**
1. A URL do frontend está na lista? (`https://my-control-phi.vercel.app`)
2. É um subdomínio do Vercel? (deve funcionar automaticamente)
3. Os logs do backend mostram a origem correta?
4. O deploy foi feito após atualizar o código?

## 📝 Logs do Backend

Quando uma requisição chega, os logs devem mostrar:

**Sucesso:**
```
✅ CORS permitido para subdomínio Vercel: https://meu-app.vercel.app
```

**Bloqueado:**
```
⚠️ CORS bloqueado para origem: https://origem-nao-permitida.com
```

## 🔄 Após Atualizar

1. **Faça commit e push:**
   ```bash
   git add src/main.ts
   git commit -m "Update CORS to allow all Vercel subdomains"
   git push
   ```

2. **No Dockploy:**
   - Faça um novo deploy
   - Ou aguarde o deploy automático

3. **Teste novamente:**
   - Tente acessar pelo celular
   - Verifique os logs do backend
   - Verifique se o erro de CORS desapareceu

## ✅ Resumo

- ✅ CORS configurado para aceitar subdomínios do Vercel (`*.vercel.app`)
- ✅ CORS configurado para aceitar origens específicas
- ✅ CORS permite qualquer origem em desenvolvimento
- ✅ Credenciais habilitadas
- ✅ Headers e métodos configurados corretamente

