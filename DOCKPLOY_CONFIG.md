# ⚙️ Configuração do Deploy no Dockploy

## 🐳 Recomendação: Use Docker

Para sua aplicação NestJS, **recomendo usar Docker** ao invés de Nixpacks pelos seguintes motivos:

### ✅ Vantagens do Docker:
- **Mais confiável**: Controle total sobre o ambiente
- **Resolve conflitos de dependências**: Já configurado com `--legacy-peer-deps`
- **Build otimizado**: Multi-stage build para imagem menor
- **Reproduzível**: Mesmo ambiente em desenvolvimento e produção
- **Já configurado**: Dockerfile já está pronto e testado

### ⚠️ Nixpacks pode ter problemas:
- Conflitos de peer dependencies (como vimos antes)
- Menos controle sobre o ambiente
- Pode precisar de configurações adicionais

## 🔧 Como Configurar no Dockploy

### Opção 1: Docker (Recomendado) ✅

1. **No painel do Dockploy:**
   - Vá nas configurações do projeto
   - Em **"Build Method"** ou **"Deploy Method"**
   - Selecione **"Docker"** ou **"Dockerfile"**
   - Deixe **Nixpacks DESMARCADO**

2. **Configurações:**
   - **Dockerfile Path**: `Dockerfile` (ou deixe vazio se estiver na raiz)
   - **Build Context**: `.` (raiz do projeto)
   - **Port**: `3000` (ou a porta que você configurou)

3. **Variáveis de Ambiente:**
   Certifique-se de configurar:
   ```
   DATABASE_URL=mysql://control:Parangamir0%40@168.231.92.86:3306/control-db
   JWT_SECRET=sua-chave-secreta-aqui
   PORT=3000
   NODE_ENV=production
   ```

### Opção 2: Nixpacks (Alternativa)

Se preferir usar Nixpacks:

1. **No painel do Dockploy:**
   - Selecione **"Nixpacks"** ou **"Auto-detect"**
   - Deixe **Docker DESMARCADO**

2. **Certifique-se de ter:**
   - Arquivo `.npmrc` com `legacy-peer-deps=true` ✅ (já temos)
   - `package.json` com `overrides` ✅ (já temos)

## 📋 Checklist de Configuração

### Para Docker:
- [ ] Build Method: **Docker** selecionado
- [ ] Dockerfile Path: `Dockerfile` (ou vazio)
- [ ] Port: `3000`
- [ ] Variáveis de ambiente configuradas
- [ ] `.dockerignore` presente (já temos)

### Para Nixpacks:
- [ ] Build Method: **Nixpacks** selecionado
- [ ] `.npmrc` presente com `legacy-peer-deps=true` ✅
- [ ] `package.json` com `overrides` ✅
- [ ] Variáveis de ambiente configuradas

## 🚀 Recomendação Final

**Use Docker** porque:
1. ✅ Já temos Dockerfile otimizado
2. ✅ Resolve problemas de dependências
3. ✅ Mais previsível e confiável
4. ✅ Melhor para produção

## 🔄 Após Configurar

1. **Salve as configurações**
2. **Faça um novo deploy**
3. **Verifique os logs**
4. **Teste a URL**: `http://api-jhukyy-dcf077-168-231-92-86.traefik.me/api/docs`

## 🐛 Se o Deploy Falhar

### Com Docker:
- Verifique se o Dockerfile está na raiz
- Verifique os logs do build
- Verifique se todas as variáveis de ambiente estão configuradas

### Com Nixpacks:
- Verifique se `.npmrc` está presente
- Verifique se `package.json` tem `overrides`
- Verifique os logs do build

## 📝 Resumo

**Configuração Recomendada:**
```
✅ Docker: MARCADO
❌ Nixpacks: DESMARCADO
Port: 3000
```

Isso garantirá um deploy mais estável e confiável!

