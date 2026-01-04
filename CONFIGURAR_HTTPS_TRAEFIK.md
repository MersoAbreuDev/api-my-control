# 🔒 Configurar HTTPS no Traefik/Dockploy

## ❌ Situação Atual

A API está acessível apenas via HTTP:
- ✅ `http://api-jhukyy-dcf077-168-231-92-86.traefik.me` (funciona)
- ❌ `https://api-jhukyy-dcf077-168-231-92-86.traefik.me` (não funciona)

## ✅ Soluções

### Solução 1: Habilitar HTTPS no Dockploy/Traefik

**No painel do Dockploy:**

1. **Vá em "Settings" ou "Domain" ou "SSL"**
2. **Procure por:**
   - "Enable HTTPS"
   - "SSL/TLS"
   - "Certificate"
   - "Let's Encrypt"
3. **Habilite HTTPS/SSL**
4. **O Traefik deve gerar um certificado automaticamente**

**Nota:** O Traefik geralmente usa Let's Encrypt para certificados SSL gratuitos.

### Solução 2: Configurar via Labels Docker (Avançado)

Se o Dockploy permitir configurar labels do Docker, adicione:

```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.api.rule=Host(`api-jhukyy-dcf077-168-231-92-86.traefik.me`)"
  - "traefik.http.routers.api.entrypoints=websecure"
  - "traefik.http.routers.api.tls.certresolver=letsencrypt"
  - "traefik.http.services.api.loadbalancer.server.port=3000"
```

### Solução 3: Usar Cloudflare (Mais Simples e Recomendado)

O Cloudflare pode adicionar HTTPS mesmo para URLs HTTP.

#### Passo a Passo:

1. **Criar conta no Cloudflare** (gratuito): https://cloudflare.com

2. **Adicionar site:**
   - Adicione um domínio (pode ser um subdomínio)
   - Ou use o serviço de proxy do Cloudflare

3. **Configurar Proxy:**
   - Crie um registro DNS tipo A ou CNAME
   - Ative o proxy (ícone laranja)
   - Aponte para o IP: `168.231.92.86`

4. **SSL Automático:**
   - Cloudflare fornece HTTPS automaticamente
   - Use a URL do Cloudflare no frontend

### Solução 4: Configurar Domínio Customizado

Se você tem um domínio:

1. **No Dockploy:**
   - Adicione domínio customizado
   - Exemplo: `api.seudominio.com`

2. **Configure DNS:**
   - Registro A: `api.seudominio.com` → `168.231.92.86`
   - Ou CNAME conforme instruções do Dockploy

3. **SSL Automático:**
   - Traefik geralmente configura SSL automaticamente com Let's Encrypt
   - Pode levar alguns minutos para o certificado ser gerado

### Solução 5: Usar Nginx como Proxy Reverso (Na VPS)

Se você tem acesso SSH à VPS:

1. **Instalar Nginx:**
   ```bash
   sudo apt update
   sudo apt install nginx certbot python3-certbot-nginx
   ```

2. **Configurar Nginx:**
   ```bash
   sudo nano /etc/nginx/sites-available/api
   ```

3. **Adicionar configuração:**
   ```nginx
   server {
       listen 80;
       server_name api.seudominio.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **Habilitar site:**
   ```bash
   sudo ln -s /etc/nginx/sites-available/api /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

5. **Configurar SSL:**
   ```bash
   sudo certbot --nginx -d api.seudominio.com
   ```

## 🚀 Solução Mais Rápida: Cloudflare

Para resolver rapidamente:

1. **Crie conta no Cloudflare** (gratuito)
2. **Adicione um domínio** (pode ser um subdomínio)
3. **Configure proxy reverso** apontando para `http://api-jhukyy-dcf077-168-231-92-86.traefik.me`
4. **Cloudflare fornece HTTPS automaticamente**
5. **Use a URL do Cloudflare no frontend**

## 📋 Verificar Configuração do Traefik

Se você tem acesso à configuração do Traefik:

1. **Verifique se o entrypoint `websecure` está configurado:**
   ```yaml
   entryPoints:
     websecure:
       address: ":443"
   ```

2. **Verifique se o certificado resolver está configurado:**
   ```yaml
   certificatesResolvers:
     letsencrypt:
       acme:
         email: seu@email.com
         storage: /letsencrypt/acme.json
         httpChallenge:
           entryPoint: web
   ```

## 🧪 Testar Após Configurar

1. **Teste HTTPS:**
   ```
   https://api-jhukyy-dcf077-168-231-92-86.traefik.me/api/docs
   ```

2. **Verifique certificado:**
   - Clique no cadeado no navegador
   - Deve mostrar "Certificado válido"

3. **Atualize frontend:**
   ```typescript
   const API_URL = 'https://api-jhukyy-dcf077-168-231-92-86.traefik.me';
   ```

## 💡 Recomendação

**Use Cloudflare** - É a solução mais rápida e simples:
- ✅ Gratuito
- ✅ HTTPS automático
- ✅ Proteção DDoS
- ✅ CDN incluído
- ✅ Fácil de configurar

## 🐛 Troubleshooting

### Certificado não é gerado
- Verifique se o domínio está acessível publicamente
- Verifique se a porta 80 está aberta (para validação Let's Encrypt)
- Aguarde alguns minutos (pode levar tempo)

### Ainda não funciona com HTTPS
- Use Cloudflare como solução temporária
- Ou configure Nginx na VPS

### Erro de certificado auto-assinado
- Configure um domínio real (não IP)
- Use Let's Encrypt ou Cloudflare

