# ✅ Verificar Variáveis de Ambiente no Dockploy

## ❌ Erro Persistente

Se o erro `ENOTFOUND mycontrol-mycontrol-brz95x` continua aparecendo, significa que:

1. A variável de ambiente não foi atualizada no Dockploy
2. O container não foi reiniciado após atualizar
3. Há múltiplas variáveis `DATABASE_URL` (uma antiga e uma nova)

## 🔍 Passo a Passo para Corrigir

### 1. Verificar Variáveis de Ambiente no Dockploy

**No painel do Dockploy:**

1. Vá em **"Environment Variables"** ou **"Config"** ou **"Settings"**
2. Procure por `DATABASE_URL`
3. **Verifique o valor atual:**
   - ❌ **ERRADO:** `mysql://control:Parangamir0%40@mycontrol-mycontrol-brz95x:3306/control-db`
   - ✅ **CORRETO:** `mysql://control:Parangamir0%40@168.231.92.86:3306/control-db`

### 2. Atualizar a Variável

**Se estiver errada:**

1. **Clique para editar** a variável `DATABASE_URL`
2. **Altere para:**
   ```
   mysql://control:Parangamir0%40@168.231.92.86:3306/control-db
   ```
3. **Salve** as alterações

### 3. Verificar se há Duplicatas

**Importante:** Verifique se há **múltiplas variáveis** `DATABASE_URL`:
- Se houver mais de uma, **delete a antiga** (com o hostname errado)
- Mantenha apenas a nova (com o IP correto)

### 4. Reiniciar o Container

**Após atualizar a variável:**

1. **Vá em "Deployments"** ou **"Containers"**
2. **Clique em "Restart"** ou **"Redeploy"**
3. **Aguarde o container reiniciar**
4. **Verifique os logs novamente**

### 5. Verificar os Logs

**Após reiniciar, os logs devem mostrar:**

✅ **Sucesso:**
```
[Nest] X - Application is running on: http://localhost:3000
```

❌ **Erro (se ainda aparecer):**
```
Error: getaddrinfo ENOTFOUND mycontrol-mycontrol-brz95x
```

## 📋 Checklist Completo

Execute este checklist no Dockploy:

- [ ] Acessei "Environment Variables"
- [ ] Encontrei a variável `DATABASE_URL`
- [ ] O valor está correto: `mysql://control:Parangamir0%40@168.231.92.86:3306/control-db`
- [ ] Não há variáveis duplicadas `DATABASE_URL`
- [ ] Salvei as alterações
- [ ] Reiniciei o container
- [ ] Verifiquei os logs após reiniciar

## 🔄 Se Ainda Não Funcionar

### Opção 1: Fazer um Novo Deploy

1. **Vá em "Deploy"** ou **"Redeploy"**
2. **Faça um novo deploy completo**
3. Isso garante que todas as variáveis sejam recarregadas

### Opção 2: Verificar via SSH (Se tiver acesso)

Se você tem acesso SSH à VPS:

```bash
# Conectar na VPS
ssh root@168.231.92.86

# Ver variáveis de ambiente do container
docker exec <container-id> env | grep DATABASE_URL

# Deve mostrar:
# DATABASE_URL=mysql://control:Parangamir0%40@168.231.92.86:3306/control-db
```

### Opção 3: Verificar no Código

Verifique se há algum valor hardcoded no código (não deveria ter):

```bash
# Procurar por referências ao hostname antigo
grep -r "mycontrol-mycontrol-brz95x" src/
```

## 💡 Dica Importante

**A variável de ambiente no Dockploy é a fonte da verdade!**

- O arquivo `.env` local não é usado no deploy
- As variáveis devem estar configuradas no painel do Dockploy
- Após atualizar, **sempre reinicie o container**

## ✅ Valor Correto da Variável

**Variável:** `DATABASE_URL`  
**Valor:** `mysql://control:Parangamir0%40@168.231.92.86:3306/control-db`

**Componentes:**
- `control` = usuário do MySQL
- `Parangamir0%40` = senha (o `@` codificado como `%40`)
- `168.231.92.86` = IP do servidor MySQL
- `3306` = porta
- `control-db` = nome do banco

## 🚀 Após Corrigir

1. ✅ Variável atualizada no Dockploy
2. ✅ Container reiniciado
3. ✅ Logs mostram conexão bem-sucedida
4. ✅ API funcionando: `http://api-jhukyy-dcf077-168-231-92-86.traefik.me/api/docs`

