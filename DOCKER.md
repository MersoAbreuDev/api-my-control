# 🐳 Guia de Deploy com Docker

Este guia explica como fazer o deploy da aplicação MyControl API usando Docker.

## 📋 Pré-requisitos

- Docker instalado
- Docker Compose instalado (opcional, mas recomendado)
- Arquivo `.env` configurado

## 🚀 Build e Execução Local

### Opção 1: Docker Compose (Recomendado)

```bash
# Build e iniciar
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose down
```

### Opção 2: Docker CLI

```bash
# Build da imagem
docker build -t api-my-control .

# Executar container
docker run -d \
  --name api-my-control \
  -p 3000:3000 \
  --env-file .env \
  api-my-control

# Ver logs
docker logs -f api-my-control

# Parar
docker stop api-my-control
docker rm api-my-control
```

## ☁️ Deploy na Nuvem

### Railway

1. Conecte seu repositório GitHub ao Railway
2. Railway detectará automaticamente o Dockerfile
3. Configure as variáveis de ambiente no painel do Railway:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `PORT` (opcional, padrão: 3000)

### Render

1. Conecte seu repositório GitHub ao Render
2. Selecione "Web Service"
3. Configure:
   - **Build Command**: `docker build -t api-my-control .`
   - **Start Command**: `docker run -p $PORT:3000 --env-file .env api-my-control`
   - Ou use o Dockerfile diretamente

### AWS ECS / Fargate

1. Build e push da imagem para ECR:
```bash
# Login no ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Build
docker build -t api-my-control .

# Tag
docker tag api-my-control:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/api-my-control:latest

# Push
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/api-my-control:latest
```

2. Crie uma task definition no ECS com as variáveis de ambiente

### Google Cloud Run

```bash
# Build
gcloud builds submit --tag gcr.io/PROJECT-ID/api-my-control

# Deploy
gcloud run deploy api-my-control \
  --image gcr.io/PROJECT-ID/api-my-control \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars DATABASE_URL=...,JWT_SECRET=...
```

### Azure Container Instances

```bash
# Build e push para Azure Container Registry
az acr build --registry <registry-name> --image api-my-control:latest .

# Criar container
az container create \
  --resource-group <resource-group> \
  --name api-my-control \
  --image <registry-name>.azurecr.io/api-my-control:latest \
  --dns-name-label api-my-control \
  --ports 3000 \
  --environment-variables DATABASE_URL=... JWT_SECRET=...
```

## 🔧 Variáveis de Ambiente

Certifique-se de configurar as seguintes variáveis de ambiente no seu serviço de nuvem:

- `DATABASE_URL`: URL de conexão do MySQL
- `JWT_SECRET`: Chave secreta para JWT
- `PORT`: Porta do servidor (opcional, padrão: 3000)
- `NODE_ENV`: Ambiente (production)

## 📝 Notas Importantes

1. **Segurança**: Nunca commite o arquivo `.env` no Git
2. **Porta**: A aplicação usa a porta 3000 por padrão, mas pode ser configurada via `PORT`
3. **Health Check**: O docker-compose inclui um health check que verifica `/api/docs`
4. **Multi-stage Build**: O Dockerfile usa multi-stage build para otimizar o tamanho da imagem final

## 🐛 Troubleshooting

### Container não inicia
- Verifique os logs: `docker logs api-my-control`
- Verifique se as variáveis de ambiente estão configuradas
- Verifique se a porta está disponível

### Erro de conexão com banco de dados
- Verifique se o `DATABASE_URL` está correto
- Verifique se o banco de dados permite conexões do IP do container
- Verifique configurações de firewall

### Build falha
- Verifique se todas as dependências estão no `package.json`
- Verifique se o `tsconfig.json` está correto
- Limpe o cache: `docker builder prune`

