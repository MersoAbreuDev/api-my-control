# 🔒 Corrigir: Blocked Mixed Content - Configurar HTTPS

## ❌ Erro: "blocked:mixed-content"

Este erro acontece quando:
- **Frontend:** `https://my-control-phi.vercel.app` (HTTPS) ✅
- **Backend:** `http://api-jhukyy-dcf077-168-231-92-86.traefik.me` (HTTP) ❌

**Browsers bloqueiam requisições HTTPS → HTTP por segurança.**

## ✅ Solução: Usar HTTPS no Backend

### Opção 1: Verificar se Traefik já fornece HTTPS

O Traefik geralmente fornece HTTPS automaticamente. Teste:

1. **Tente acessar com HTTPS:**
   ```
   https://api-jhukyy-dcf077-168-231-92-86.traefik.me/api/docs
   ```

2. **Se funcionar:**
   - ✅ Use `https://` no frontend
   - ✅ Atualize a URL da API no frontend

### Opção 2: Configurar HTTPS no Dockploy

**No painel do Dockploy:**

1. **Vá em "Settings" ou "Domain"**
2. **Procure por opções de SSL/HTTPS:**
   - "Enable HTTPS"
   - "SSL Certificate"
   - "TLS/SSL"
3. **Habilite HTTPS**
4. **O Traefik deve gerar um certificado automaticamente**

### Opção 3: Configurar Domínio Customizado com SSL

Se você tem um domínio:

1. **No Dockploy:**
   - Adicione um domínio customizado
   - Exemplo: `api.seudominio.com`

2. **Configure DNS:**
   - Crie um registro A apontando para o IP da VPS
   - Ou use CNAME conforme instruções do Dockploy

3. **SSL automático:**
   - O Traefik geralmente configura SSL automaticamente
   - Ou use Let's Encrypt

### Opção 4: Usar Cloudflare (Mais Simples)

1. **Adicione seu domínio no Cloudflare**
2. **Configure um proxy reverso:**
   - Aponte para `http://api-jhukyy-dcf077-168-231-92-86.traefik.me`
   - O Cloudflare fornece HTTPS automaticamente

3. **Use a URL do Cloudflare no frontend:**
   ```
   https://api.seudominio.com
   ```

## 🔧 Atualizar Frontend

Após configurar HTTPS, atualize o frontend:

### Antes (HTTP - não funciona):
```typescript
const API_URL = 'http://api-jhukyy-dcf077-168-231-92-86.traefik.me';
```

### Depois (HTTPS - funciona):
```typescript
const API_URL = 'https://api-jhukyy-dcf077-168-231-92-86.traefik.me';
```

## 🧪 Testar HTTPS

### 1. Teste no navegador:
```
https://api-jhukyy-dcf077-168-231-92-86.traefik.me/api/docs
```

### 2. Teste com cURL:
```bash
curl https://api-jhukyy-dcf077-168-231-92-86.traefik.me/api/docs
```

### 3. Se der erro de certificado:
- Pode ser um certificado auto-assinado
- O Traefik geralmente usa Let's Encrypt (válido)
- Se for auto-assinado, você pode precisar configurar um domínio real

## 📋 Checklist

- [ ] Testei acessar com HTTPS: `https://api-jhukyy-dcf077-168-231-92-86.traefik.me`
- [ ] HTTPS está funcionando (sem erro de certificado)
- [ ] Atualizei a URL no frontend para usar `https://`
- [ ] Testei uma requisição do frontend
- [ ] Não aparece mais "blocked:mixed-content"

## 🚀 Solução Rápida

### Passo 1: Testar HTTPS
Abra no navegador:
```
https://api-jhukyy-dcf077-168-231-92-86.traefik.me/api/docs
```

### Passo 2: Se funcionar
Atualize o frontend para usar:
```typescript
const API_URL = 'https://api-jhukyy-dcf077-168-231-92-86.traefik.me';
```

### Passo 3: Se não funcionar
Configure HTTPS no Dockploy ou use Cloudflare.

## 💡 Dica

O Traefik geralmente já fornece HTTPS automaticamente. O problema pode ser apenas que você está usando `http://` ao invés de `https://`.

**Teste primeiro com HTTPS antes de configurar algo novo!**

## 🐛 Troubleshooting

### Erro: "Certificate not trusted"
- Use um domínio real (não IP)
- Configure Let's Encrypt no Traefik
- Ou use Cloudflare

### Erro: "Connection refused"
- Verifique se o Traefik está configurado para HTTPS
- Verifique as configurações do Dockploy

### Ainda aparece "mixed-content"
- Limpe o cache do navegador
- Verifique se realmente está usando `https://` (não `http://`)
- Verifique no DevTools → Network se a requisição está indo para HTTPS

