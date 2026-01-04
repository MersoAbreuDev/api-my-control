# 🌐 Configurar CORS para Frontend

## ✅ URL do Frontend Configurada

A URL do frontend já foi adicionada ao código:
```
https://my-control-phi.vercel.app
```

## 📝 Configuração Atual

O código já está configurado para permitir:
- ✅ `http://localhost:4200` (desenvolvimento local)
- ✅ `http://localhost:3000` (desenvolvimento local)
- ✅ `https://my-control-phi.vercel.app` (frontend em produção)
- ✅ `http://api-jhukyy-dcf077-168-231-92-86.traefik.me` (API)

## 🔧 Variável de Ambiente (Opcional)

Se precisar adicionar mais URLs, configure no Dockploy:

**Variável:** `ALLOWED_ORIGINS`  
**Valor:** `https://outra-url.com,https://mais-uma-url.com`

As URLs serão adicionadas às origens padrão.

## 🚀 Após Atualizar

1. **Faça commit e push das mudanças:**
   ```bash
   git add src/main.ts
   git commit -m "Add frontend URL to CORS"
   git push
   ```

2. **No Dockploy:**
   - Faça um novo deploy
   - Ou aguarde o deploy automático (se configurado)

3. **Teste o frontend:**
   - Acesse: `https://my-control-phi.vercel.app`
   - O frontend deve conseguir fazer requisições para a API

## 🧪 Como Testar

### No navegador (Console do DevTools):

```javascript
// Teste de CORS
fetch('http://api-jhukyy-dcf077-168-231-92-86.traefik.me/api/docs', {
  method: 'GET',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => console.log('CORS OK:', response))
.catch(error => console.error('CORS Error:', error));
```

### Verificar no Backend:

Os logs devem mostrar:
```
🌐 CORS - Origens permitidas: [
  'http://localhost:4200',
  'http://localhost:3000',
  'https://my-control-phi.vercel.app',
  'http://api-jhukyy-dcf077-168-231-92-86.traefik.me'
]
```

## 📋 URLs Configuradas

| Ambiente | URL | Status |
|----------|-----|--------|
| Frontend Produção | `https://my-control-phi.vercel.app` | ✅ Configurado |
| Backend API | `http://api-jhukyy-dcf077-168-231-92-86.traefik.me` | ✅ Configurado |
| Frontend Local | `http://localhost:4200` | ✅ Configurado |
| Backend Local | `http://localhost:3000` | ✅ Configurado |

## 🔒 Segurança

O CORS está configurado para:
- ✅ Permitir credenciais (`credentials: true`)
- ✅ Permitir headers necessários (`Content-Type`, `Authorization`)
- ✅ Permitir métodos HTTP necessários
- ✅ Bloquear origens não autorizadas em produção

## 🐛 Troubleshooting

### Erro de CORS no frontend

1. **Verifique se o deploy foi feito:**
   - O código atualizado precisa estar no servidor

2. **Verifique os logs do backend:**
   - Deve mostrar as origens permitidas
   - Se aparecer `⚠️ CORS bloqueado`, a URL não está na lista

3. **Verifique a URL exata:**
   - Deve ser exatamente: `https://my-control-phi.vercel.app`
   - Sem barra no final
   - Com `https://` (não `http://`)

### Adicionar mais URLs

Se precisar adicionar mais URLs do frontend:

1. **Opção 1: Atualizar o código**
   - Adicione na lista `defaultOrigins` em `src/main.ts`

2. **Opção 2: Usar variável de ambiente**
   - Configure `ALLOWED_ORIGINS` no Dockploy
   - Formato: `https://url1.com,https://url2.com`

## ✅ Próximos Passos

1. ✅ Código atualizado com a URL do frontend
2. ⏳ Fazer commit e push
3. ⏳ Fazer deploy no Dockploy
4. ⏳ Testar o frontend

