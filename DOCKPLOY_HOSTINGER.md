# 🚀 Guia: Deploy com Dockploy na Hostinger VPS

Este guia explica como acessar e gerenciar sua aplicação deployada via Dockploy na Hostinger VPS.

## 📍 Como Acessar a Aplicação

### 1. Acessar via Dockploy

1. **Acesse o painel do Dockploy:**
   - URL: https://dockploy.com (ou a URL que você configurou)
   - Faça login na sua conta

2. **Encontre seu projeto:**
   - No dashboard, você verá todos os seus projetos
   - Clique no projeto `api-my-control` (ou o nome que você deu)

3. **Ver a URL pública:**
   - Na página do projeto, procure por:
     - **Public URL** ou **Domain**
     - **Access URL** ou **Endpoint**
   - Geralmente aparece algo como: `http://seu-ip:porta` ou `http://dominio.com`

### 2. Acessar via IP da VPS

Se o Dockploy não forneceu uma URL customizada, você pode acessar diretamente pelo IP:

1. **Encontrar o IP da VPS:**
   - Acesse o painel da Hostinger
   - Vá em **VPS** → Seu servidor
   - O IP público estará visível no painel

2. **Acessar a aplicação:**
   ```
   http://SEU-IP:PORTA
   ```
   - A porta geralmente é `3000` (ou a que você configurou no `.env`)

### 3. Configurar Domínio (Opcional)

Se você tem um domínio na Hostinger:

1. **No painel da Hostinger:**
   - Vá em **Domínios**
   - Configure um subdomínio (ex: `api.seudominio.com`)
   - Aponte para o IP da VPS

2. **No Dockploy:**
   - Configure o domínio no projeto
   - Ou configure um proxy reverso (Nginx) na VPS

## 🔧 Configurações Importantes

### Portas e Firewall

Certifique-se de que a porta está aberta no firewall da Hostinger:

1. **No painel da Hostinger:**
   - Vá em **Firewall** ou **Security**
   - Abra a porta `3000` (ou a porta que você está usando)
   - Permita conexões TCP na porta

2. **Ou via SSH:**
   ```bash
   # Ubuntu/Debian
   sudo ufw allow 3000/tcp
   sudo ufw reload
   ```

### Variáveis de Ambiente no Dockploy

No painel do Dockploy, verifique se as variáveis de ambiente estão configuradas:

- `DATABASE_URL=mysql://root:Parangamir0@168.231.92.86:3306/my-control-db`
- `JWT_SECRET=sua-chave-secreta`
- `PORT=3000`
- `NODE_ENV=production`

## 🌐 URLs da Aplicação

Após encontrar o IP ou domínio, suas URLs serão:

- **API Base:** `http://SEU-IP:3000` ou `https://api.seudominio.com`
- **Swagger:** `http://SEU-IP:3000/api/docs` ou `https://api.seudominio.com/api/docs`
- **Health Check:** `http://SEU-IP:3000/` (raiz)

## 🔒 Configurar HTTPS (Recomendado)

Para usar HTTPS, você precisa configurar um proxy reverso:

### Opção 1: Nginx (Recomendado)

1. **Instalar Nginx na VPS:**
   ```bash
   sudo apt update
   sudo apt install nginx
   ```

2. **Configurar Nginx:**
   ```bash
   sudo nano /etc/nginx/sites-available/api-my-control
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
   sudo ln -s /etc/nginx/sites-available/api-my-control /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

5. **Instalar SSL com Certbot:**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d api.seudominio.com
   ```

### Opção 2: Cloudflare (Mais Simples)

1. Adicione seu domínio no Cloudflare
2. Configure um proxy reverso
3. O Cloudflare fornece SSL automático

## 📊 Verificar Status da Aplicação

### Via Dockploy

- No painel do Dockploy, você verá:
  - Status do container (Running/Stopped)
  - Logs em tempo real
  - Uso de recursos (CPU, RAM)

### Via SSH na VPS

```bash
# Conectar na VPS
ssh root@SEU-IP

# Ver containers Docker
docker ps

# Ver logs do container
docker logs api-my-control

# Ver status
docker stats api-my-control
```

## 🐛 Troubleshooting

### Não consigo acessar a aplicação

1. **Verifique se o container está rodando:**
   - No Dockploy: Status deve ser "Running"
   - Via SSH: `docker ps` deve mostrar o container

2. **Verifique o firewall:**
   - Porta `3000` deve estar aberta
   - Teste: `telnet SEU-IP 3000`

3. **Verifique os logs:**
   - No Dockploy: Aba "Logs"
   - Via SSH: `docker logs api-my-control`

### Erro de conexão com banco de dados

1. **Verifique se o banco está acessível:**
   ```bash
   mysql -h 168.231.92.86 -u root -p
   ```

2. **Verifique o firewall do banco:**
   - O IP da VPS deve estar permitido no firewall do MySQL

3. **Verifique as variáveis de ambiente:**
   - `DATABASE_URL` deve estar correto no Dockploy

### Container para de funcionar

1. **Reinicie o container:**
   - No Dockploy: Botão "Restart"
   - Via SSH: `docker restart api-my-control`

2. **Verifique recursos:**
   - A VPS pode estar sem memória/CPU
   - No Dockploy: Verifique uso de recursos

## 📝 Próximos Passos

1. ✅ Encontre o IP da VPS no painel da Hostinger
2. ✅ Acesse `http://SEU-IP:3000/api/docs` no navegador
3. ✅ Configure um domínio (opcional, mas recomendado)
4. ✅ Configure HTTPS com Nginx + Certbot
5. ✅ Atualize o CORS no código com o domínio do frontend

## 🔗 Links Úteis

- **Dockploy:** https://dockploy.com
- **Hostinger VPS:** https://www.hostinger.com.br/vps
- **Documentação Nginx:** https://nginx.org/en/docs/

