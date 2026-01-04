# 🔧 Corrigir: Erro "getaddrinfo ENOTFOUND mycontrol-mycontrol-brz95x"

## ❌ Erro
```
Error: getaddrinfo ENOTFOUND mycontrol-mycontrol-brz95x
```

## 🔍 Causa

A variável de ambiente `DATABASE_URL` no Dockploy ainda está com o hostname antigo `mycontrol-mycontrol-brz95x`, mas deveria usar o IP `168.231.92.86`.

## ✅ Solução

### No painel do Dockploy:

1. **Vá em "Environment Variables" ou "Config"**
2. **Encontre a variável `DATABASE_URL`**
3. **Altere para:**
   ```
   mysql://control:Parangamir0%40@168.231.92.86:3306/control-db
   ```

### Configuração Correta:

**Variável:** `DATABASE_URL`  
**Valor:** `mysql://control:Parangamir0%40@168.231.92.86:3306/control-db`

**Explicação:**
- `control` = usuário
- `Parangamir0%40` = senha (o `@` é codificado como `%40`)
- `168.231.92.86` = IP do servidor MySQL
- `3306` = porta
- `control-db` = nome do banco

## 📋 Variáveis de Ambiente Necessárias

Certifique-se de ter todas estas variáveis no Dockploy:

| Variável | Valor |
|----------|-------|
| `DATABASE_URL` | `mysql://control:Parangamir0%40@168.231.92.86:3306/control-db` |
| `JWT_SECRET` | `sua-chave-secreta-aqui` |
| `PORT` | `3000` |
| `NODE_ENV` | `production` |

## 🔄 Após Corrigir

1. **Salve as variáveis de ambiente**
2. **Reinicie o container** (ou faça um novo deploy)
3. **Verifique os logs** - não deve mais aparecer o erro
4. **Teste a API**: `http://api-jhukyy-dcf077-168-231-92-86.traefik.me/api/docs`

## 🐛 Verificação

Após atualizar, os logs devem mostrar:
- ✅ Conexão com banco de dados bem-sucedida
- ✅ `🚀 Application is running on: http://localhost:3000`
- ❌ NÃO deve mais aparecer `ENOTFOUND mycontrol-mycontrol-brz95x`

## 💡 Dica

Se você tiver múltiplas variáveis `DATABASE_URL`, certifique-se de:
- Remover a antiga com o hostname errado
- Manter apenas a nova com o IP correto

## 📝 Resumo

**O problema:** Variável de ambiente com hostname antigo  
**A solução:** Atualizar `DATABASE_URL` no Dockploy com o IP correto

