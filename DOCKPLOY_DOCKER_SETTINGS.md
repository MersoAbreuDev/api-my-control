# ⚙️ Configuração dos Campos Docker no Dockploy

## 📝 Valores para Preencher

### 1. **Docker File** (Path of your docker file)
```
Dockerfile
```
**Ou deixe vazio** se o Dockerfile estiver na raiz do projeto (que é o caso).

**Explicação:** Caminho relativo ao Dockerfile. Como está na raiz, use `Dockerfile` ou deixe vazio.

---

### 2. **Docker Context Path** (Path of your docker context)
```
.
```
**Ou deixe vazio** (o padrão já é `.`).

**Explicação:** O contexto do Docker é o diretório raiz do projeto (`.`). É de onde o Docker vai copiar arquivos durante o build.

---

### 3. **Docker Build Stage** (Multi-stage build target)
```
production
```
**Preencha com:** `production`

**Explicação:** Seu Dockerfile tem dois estágios:
- `builder` (Stage 1): Compila a aplicação
- `production` (Stage 2): Imagem final otimizada

Você quer usar o estágio `production` que é a imagem final otimizada.

---

## ✅ Configuração Completa

Preencha os campos assim:

| Campo | Valor |
|-------|-------|
| **Docker File** | `Dockerfile` |
| **Docker Context Path** | `.` |
| **Docker Build Stage** | `production` |

**Ou mais simples:**
- **Docker File**: `Dockerfile` (ou vazio)
- **Docker Context Path**: `.` (ou vazio, padrão)
- **Docker Build Stage**: `production` ⭐ **IMPORTANTE**

---

## 🔍 Por que `production`?

Seu Dockerfile tem esta estrutura:

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
...

# Stage 2: Production
FROM node:20-alpine AS production  ← Este estágio
...
```

O estágio `production` é a imagem final otimizada que:
- ✅ Tem apenas dependências de produção
- ✅ Não tem código fonte, apenas o build compilado
- ✅ É menor e mais segura
- ✅ Executa com `node dist/main`

---

## 📋 Checklist Final

Antes de fazer o deploy, verifique:

- [ ] **Docker File**: `Dockerfile`
- [ ] **Docker Context Path**: `.`
- [ ] **Docker Build Stage**: `production` ⭐
- [ ] **Port**: `3000`
- [ ] **Variáveis de ambiente** configuradas:
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `PORT=3000`
  - `NODE_ENV=production`

---

## 🚀 Após Configurar

1. **Salve as configurações**
2. **Faça o deploy**
3. **Verifique os logs**
4. **Teste**: `http://api-jhukyy-dcf077-168-231-92-86.traefik.me/api/docs`

---

## 💡 Dica

Se deixar o **Docker Build Stage** vazio, o Docker vai tentar construir todos os estágios e usar o último. Mas é melhor especificar `production` explicitamente para garantir que use o estágio correto.

