# 🌐 Como Acessar sua API

## 🔗 URL da API

Sua API está disponível em:
```
http://api-jhukyy-dcf077-168-231-92-86.traefik.me
```

## 📍 Endpoints Disponíveis

### 1. **API Base (Raiz)**
```
http://api-jhukyy-dcf077-168-231-92-86.traefik.me/
```

### 2. **Swagger Documentation (Recomendado para testar)**
```
http://api-jhukyy-dcf077-168-231-92-86.traefik.me/api/docs
```

### 3. **Endpoints da API**

#### Autenticação
- `POST /auth/login` - Fazer login
- `POST /auth/register` - Registrar novo usuário
- `POST /auth/reset-password` - Redefinir senha

#### Transações
- `GET /transactions` - Listar transações
- `POST /transactions` - Criar transação
- `GET /transactions/:id` - Obter transação específica
- `PUT /transactions/:id` - Atualizar transação
- `DELETE /transactions/:id` - Deletar transação

#### Dashboard
- `GET /dashboard` - Obter resumo financeiro

## 🧪 Como Testar

### Opção 1: Swagger UI (Mais Fácil)

1. Abra no navegador:
   ```
   http://api-jhukyy-dcf077-168-231-92-86.traefik.me/api/docs
   ```

2. Você verá a documentação interativa do Swagger
3. Clique em cada endpoint para testar
4. Use o botão "Try it out" para fazer requisições

### Opção 2: cURL (Linha de Comando)

```bash
# Testar se a API está online
curl http://api-jhukyy-dcf077-168-231-92-86.traefik.me/

# Acessar Swagger
curl http://api-jhukyy-dcf077-168-231-92-86.traefik.me/api/docs

# Fazer login (exemplo)
curl -X POST http://api-jhukyy-dcf077-168-231-92-86.traefik.me/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@email.com","password":"senha123"}'
```

### Opção 3: Postman / Insomnia

1. Importe a coleção do Swagger:
   ```
   http://api-jhukyy-dcf077-168-231-92-86.traefik.me/api/docs-json
   ```

2. Ou crie requisições manualmente usando a URL base

### Opção 4: Navegador

Simplesmente acesse:
```
http://api-jhukyy-dcf077-168-231-92-86.traefik.me/api/docs
```

## 🔒 Autenticação

A maioria dos endpoints requer autenticação JWT:

1. **Faça login primeiro:**
   ```bash
   POST /auth/login
   {
     "email": "seu@email.com",
     "password": "suasenha"
   }
   ```

2. **Copie o token retornado**

3. **Use o token nas requisições:**
   ```bash
   Authorization: Bearer SEU_TOKEN_AQUI
   ```

## ⚙️ Configurar no Frontend

Se você tem um frontend, configure a URL base:

### Angular / React / Vue

```typescript
// environment.ts ou .env
export const environment = {
  apiUrl: 'http://api-jhukyy-dcf077-168-231-92-86.traefik.me'
};
```

### Axios / Fetch

```javascript
const api = axios.create({
  baseURL: 'http://api-jhukyy-dcf077-168-231-92-86.traefik.me',
  headers: {
    'Content-Type': 'application/json'
  }
});
```

## 🔧 Atualizar CORS (Se necessário)

Se o frontend estiver em outro domínio, atualize o CORS no código:

1. Edite `src/main.ts`
2. Adicione a URL do frontend em `allowedOrigins`
3. Ou configure a variável de ambiente `ALLOWED_ORIGINS`

## 🌍 Configurar Domínio Personalizado (Opcional)

Se você tem um domínio próprio:

1. **No Dockploy:**
   - Vá nas configurações do projeto
   - Adicione seu domínio customizado
   - Exemplo: `api.seudominio.com`

2. **Configure DNS:**
   - Crie um registro A apontando para o IP da VPS
   - Ou configure CNAME conforme instruções do Dockploy

## ✅ Verificar se está funcionando

### Teste rápido:

```bash
# Teste 1: Verificar se responde
curl http://api-jhukyy-dcf077-168-231-92-86.traefik.me/

# Teste 2: Acessar Swagger
curl http://api-jhukyy-dcf077-168-231-92-86.traefik.me/api/docs

# Teste 3: Health check (se implementado)
curl http://api-jhukyy-dcf077-168-231-92-86.traefik.me/health
```

### No navegador:

1. Abra: `http://api-jhukyy-dcf077-168-231-92-86.traefik.me/api/docs`
2. Você deve ver a interface do Swagger
3. Se aparecer, a API está funcionando! ✅

## 🐛 Problemas Comuns

### Erro 502 Bad Gateway
- Verifique se o container está rodando no Dockploy
- Verifique os logs no painel do Dockploy

### Erro CORS
- Atualize o CORS no `src/main.ts` com a URL do frontend
- Faça um novo deploy

### Erro de conexão com banco
- Verifique se o MySQL está configurado corretamente
- Verifique as variáveis de ambiente no Dockploy

## 📝 Próximos Passos

1. ✅ Acesse o Swagger: `http://api-jhukyy-dcf077-168-231-92-86.traefik.me/api/docs`
2. ✅ Teste os endpoints
3. ✅ Configure o frontend para usar esta URL
4. ✅ (Opcional) Configure um domínio personalizado

