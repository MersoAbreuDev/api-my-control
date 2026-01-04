# 🌐 Como Acessar a Aplicação Após o Deploy

Após o deploy bem-sucedido, você precisa encontrar a URL/host da sua aplicação. O processo varia conforme a plataforma que você está usando.

## 📍 Onde Encontrar a URL

### Railway

1. Acesse o painel do Railway: https://railway.app
2. Clique no seu projeto
3. Clique no serviço da aplicação
4. Na aba **"Settings"** ou **"Deployments"**, você encontrará:
   - **Public Domain**: URL pública (ex: `seu-app.up.railway.app`)
   - Ou você pode gerar um domínio customizado

**URLs da aplicação:**
- API: `https://seu-app.up.railway.app`
- Swagger: `https://seu-app.up.railway.app/api/docs`

### Render

1. Acesse o painel do Render: https://render.com
2. Vá em **"Dashboard"** → Seu serviço
3. Na página do serviço, você verá:
   - **URL**: URL pública (ex: `seu-app.onrender.com`)

**URLs da aplicação:**
- API: `https://seu-app.onrender.com`
- Swagger: `https://seu-app.onrender.com/api/docs`

### Vercel

1. Acesse o painel do Vercel: https://vercel.com
2. Vá em **"Projects"** → Seu projeto
3. Você verá a URL no topo da página

**URLs da aplicação:**
- API: `https://seu-app.vercel.app`
- Swagger: `https://seu-app.vercel.app/api/docs`

### Heroku

1. Acesse o painel do Heroku: https://dashboard.heroku.com
2. Selecione seu app
3. A URL estará no topo: `https://seu-app.herokuapp.com`

**URLs da aplicação:**
- API: `https://seu-app.herokuapp.com`
- Swagger: `https://seu-app.herokuapp.com/api/docs`

### AWS / Google Cloud / Azure

Essas plataformas geralmente fornecem:
- Um Load Balancer URL
- Um Cloud Run URL
- Ou um Container Instance URL

Verifique o painel de cada serviço para encontrar a URL pública.

## 🔧 Configuração Necessária

### 1. Atualizar CORS

Após encontrar a URL, você precisa atualizar o CORS no código para aceitar requisições do frontend em produção.

Edite `src/main.ts` e adicione a URL de produção:

```typescript
app.enableCors({
  origin: [
    'http://localhost:4200', 
    'http://localhost:3000',
    'https://seu-frontend.vercel.app', // Adicione aqui
    'https://seu-frontend.netlify.app', // Adicione aqui
  ],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
});
```

### 2. Variáveis de Ambiente

Certifique-se de que as variáveis de ambiente estão configuradas na plataforma:

- `DATABASE_URL`: URL do banco de dados
- `JWT_SECRET`: Chave secreta para JWT
- `PORT`: Porta (geralmente definida automaticamente pela plataforma)
- `NODE_ENV`: `production`

## 🧪 Testar a Aplicação

### 1. Testar a API

```bash
# Teste básico
curl https://seu-app.up.railway.app

# Teste do Swagger
curl https://seu-app.up.railway.app/api/docs
```

### 2. Acessar o Swagger

Abra no navegador:
```
https://seu-app.up.railway.app/api/docs
```

### 3. Testar Endpoints

Use o Swagger ou ferramentas como Postman/Insomnia para testar os endpoints da API.

## 📝 Diferença: Docker Deploy vs VPS

### Docker Deploy (Plataformas como Railway, Render)
- ✅ **Vantagens**: 
  - Gerenciamento automático
  - Escalabilidade fácil
  - SSL automático
  - Deploy contínuo
- ✅ **Ideal para**: Aplicações que precisam de deploy rápido e gerenciamento simples

### VPS (Servidor Virtual Privado)
- ✅ **Vantagens**:
  - Controle total
  - Custo fixo
  - Personalização completa
- ⚠️ **Desvantagens**:
  - Precisa configurar tudo manualmente
  - Gerenciar SSL, firewall, etc.
  - Mais complexo

**Para sua aplicação atual**: Você está usando Docker Deploy (Railway/Render), que é mais simples e adequado para começar.

## 🚀 Próximos Passos

1. ✅ Encontre a URL no painel da plataforma
2. ✅ Acesse o Swagger: `https://sua-url/api/docs`
3. ✅ Atualize o CORS com a URL do frontend
4. ✅ Configure o frontend para usar a URL da API
5. ✅ Teste todos os endpoints

## 🐛 Troubleshooting

### Não consigo acessar a URL
- Verifique se o deploy foi concluído com sucesso
- Verifique os logs na plataforma
- Verifique se a porta está configurada corretamente

### CORS bloqueando requisições
- Atualize o CORS no `src/main.ts` com a URL do frontend
- Faça um novo deploy após atualizar

### Erro 502 Bad Gateway
- Verifique os logs da aplicação
- Verifique se o banco de dados está acessível
- Verifique as variáveis de ambiente

