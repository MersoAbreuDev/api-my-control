# 🔧 Corrigir: Bad Gateway

## ❌ Erro: "Bad Gateway"

Este erro significa que o Traefik (proxy reverso) está funcionando, mas não consegue se conectar ao container da sua aplicação.

## 🔍 Diagnóstico

### 1. Verificar se o container está rodando

**No painel do Dockploy:**
1. Acesse o painel do Dockploy
2. Vá no seu projeto
3. Verifique o status do container:
   - Deve estar **"Running"** (Verde)
   - Se estiver **"Stopped"** ou **"Error"**, há um problema

### 2. Verificar logs do container

**No painel do Dockploy:**
1. Clique em **"Logs"** ou **"View Logs"**
2. Procure por erros como:
   - Erro de conexão com banco de dados
   - Erro ao iniciar a aplicação
   - Porta não disponível

### 3. Verificar variáveis de ambiente

**No painel do Dockploy:**
1. Vá em **"Environment Variables"** ou **"Config"**
2. Verifique se estão configuradas:
   - `DATABASE_URL=mysql://control:Parangamir0%40@168.231.92.86:3306/control-db`
   - `JWT_SECRET=sua-chave-secreta`
   - `PORT=3000` (ou a porta que você configurou)
   - `NODE_ENV=production`

### 4. Verificar porta da aplicação

A aplicação NestJS deve estar escutando na porta configurada (padrão: 3000).

**Verifique no código:**
- `src/main.ts` usa `process.env.PORT || 3000`
- O Dockerfile expõe a porta 3000

## ✅ Soluções

### Solução 1: Reiniciar o container

**No painel do Dockploy:**
1. Clique em **"Restart"** ou **"Redeploy"**
2. Aguarde o container reiniciar
3. Verifique os logs novamente

### Solução 2: Verificar conexão com banco de dados

Se os logs mostram erro de conexão com MySQL:

1. **Verifique se o MySQL está acessível:**
   ```bash
   # Na VPS
   mysql -h 168.231.92.86 -u control -p control-db
   ```

2. **Se não conectar, siga o guia de troubleshooting do MySQL**

### Solução 3: Verificar configuração do Dockploy

**No painel do Dockploy, verifique:**

1. **Porta interna do container:**
   - Deve ser `3000` (ou a porta que você configurou)
   - Verifique em **"Settings"** ou **"Ports"**

2. **Health check:**
   - Verifique se há um health check configurado
   - Deve apontar para `/api/docs` ou `/`

3. **Rede:**
   - Verifique se o container está na mesma rede do Traefik

### Solução 4: Verificar logs detalhados

**No painel do Dockploy:**
1. Acesse **"Logs"**
2. Procure por:
   - `🚀 Application is running on: http://localhost:3000`
   - `📚 Swagger documentation: http://localhost:3000/api/docs`
   - Erros de conexão
   - Erros de inicialização

### Solução 5: Rebuild do container

**No painel do Dockploy:**
1. Vá em **"Settings"** ou **"Deploy"**
2. Clique em **"Rebuild"** ou **"Redeploy"**
3. Aguarde o build completar
4. Verifique os logs

## 🧪 Testar Localmente (Se possível)

Se você tem acesso SSH à VPS:

```bash
# Conectar na VPS
ssh root@168.231.92.86

# Ver containers Docker
docker ps

# Ver logs do container
docker logs <container-id>

# Verificar se a aplicação está respondendo
curl http://localhost:3000/api/docs
```

## 📋 Checklist de Verificação

Execute este checklist no painel do Dockploy:

- [ ] Container está com status "Running"
- [ ] Logs mostram "Application is running"
- [ ] Não há erros de conexão com banco de dados
- [ ] Variáveis de ambiente estão configuradas
- [ ] Porta está configurada corretamente (3000)
- [ ] Health check está funcionando
- [ ] Último deploy foi bem-sucedido

## 🚀 Passos para Resolver

1. **Acesse o painel do Dockploy**
2. **Verifique os logs do container**
3. **Identifique o erro específico:**
   - Erro de banco de dados?
   - Erro ao iniciar aplicação?
   - Porta não disponível?
4. **Corrija o problema identificado**
5. **Reinicie o container**
6. **Teste novamente a URL**

## 💡 Problemas Comuns

### Problema: Erro de conexão com MySQL

**Solução:**
- Verifique se o MySQL está rodando na VPS
- Verifique se a porta 3306 está aberta
- Verifique se o usuário `control` existe e tem permissão
- Verifique se o `DATABASE_URL` está correto

### Problema: Aplicação não inicia

**Solução:**
- Verifique os logs para ver o erro específico
- Verifique se todas as dependências estão instaladas
- Verifique se o `package.json` está correto

### Problema: Porta não disponível

**Solução:**
- Verifique se a porta 3000 está configurada no Dockploy
- Verifique se não há outro processo usando a porta
- Verifique a configuração do Traefik

## 📞 Próximos Passos

1. ✅ Acesse o painel do Dockploy
2. ✅ Verifique os logs do container
3. ✅ Identifique o erro específico
4. ✅ Aplique a solução correspondente
5. ✅ Reinicie o container
6. ✅ Teste novamente: `http://api-jhukyy-dcf077-168-231-92-86.traefik.me/api/docs`

