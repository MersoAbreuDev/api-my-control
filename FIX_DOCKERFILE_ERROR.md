# 🔧 Corrigir: Erro "no such file or directory .dockerfile"

## ❌ Erro
```
ERROR: failed to build: failed to solve: failed to read dockerfile: open .dockerfile: no such file or directory
```

## 🔍 Causa

O Docker está procurando por `.dockerfile` (com ponto no início), mas o arquivo correto é `Dockerfile` (sem ponto).

## ✅ Solução

### No painel do Dockploy:

1. **Vá em "Settings" ou "Deploy Settings"**
2. **Encontre o campo "Docker File"**
3. **Altere para:**
   ```
   Dockerfile
   ```
   **IMPORTANTE:** 
   - ✅ Use `Dockerfile` (sem ponto no início)
   - ❌ NÃO use `.dockerfile`
   - ❌ NÃO use `Dockerfile.` 
   - ❌ NÃO deixe com ponto extra

### Configuração Correta:

| Campo | Valor Correto | Valor Errado |
|-------|---------------|--------------|
| **Docker File** | `Dockerfile` | `.dockerfile` ❌ |
| **Docker Context Path** | `.` | `.` ✅ |
| **Docker Build Stage** | `production` | `production` ✅ |

## 🔄 Após Corrigir

1. **Salve as configurações**
2. **Faça um novo deploy**
3. **O build deve funcionar agora**

## 📝 Verificação

Certifique-se de que:
- ✅ O arquivo `Dockerfile` existe na raiz do projeto
- ✅ O campo "Docker File" está preenchido com `Dockerfile` (sem ponto)
- ✅ Não há espaços extras ou caracteres especiais

## 🐛 Se Ainda Não Funcionar

### Opção 1: Deixar vazio
Se o Dockerfile estiver na raiz (que é o caso), você pode:
- Deixar o campo **"Docker File"** vazio
- O Docker vai procurar automaticamente por `Dockerfile`

### Opção 2: Verificar nome do arquivo
```bash
# Verificar se o arquivo existe
ls -la | grep -i dockerfile

# Deve mostrar:
# Dockerfile
```

Se mostrar `.dockerfile` ou outro nome, renomeie:
```bash
mv .dockerfile Dockerfile
```

## ✅ Resumo

**Campo "Docker File" deve conter:**
```
Dockerfile
```

**Nada mais, nada menos!**

