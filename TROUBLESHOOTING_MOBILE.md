# 📱 Troubleshooting: Acesso pelo Navegador do Celular

## 🔍 Possíveis Causas

### 1. **Rede Diferente (WiFi vs Dados Móveis)**

O celular pode estar em uma rede diferente:
- **WiFi**: Pode ter firewall ou restrições
- **Dados Móveis (4G/5G)**: Pode ser bloqueado pelo provedor

**Teste:**
- Tente com WiFi
- Tente com dados móveis (4G/5G)
- Compare os resultados

### 2. **Problema de DNS**

O DNS do celular pode não estar resolvendo o domínio.

**Teste:**
- Tente acessar pelo IP diretamente (se possível)
- Ou use um DNS público: 8.8.8.8 (Google) ou 1.1.1.1 (Cloudflare)

### 3. **Firewall da VPS**

O firewall pode estar bloqueando conexões de IPs móveis.

**Verificar na VPS:**
```bash
# Verificar firewall
sudo ufw status

# Se necessário, permitir todas as conexões (cuidado!)
sudo ufw allow from any
```

### 4. **HTTPS/SSL**

Se o celular forçar HTTPS e o backend só tem HTTP, pode bloquear.

**Solução:**
- Configure HTTPS no backend
- Ou teste com `http://` explicitamente

### 5. **CORS no Celular**

Alguns navegadores mobile são mais restritivos com CORS.

**Verificar:**
- Os logs do backend devem mostrar a origem do celular
- Verifique se o CORS está bloqueando

### 6. **Cache do Navegador**

O navegador mobile pode ter cache antigo.

**Solução:**
- Limpe o cache do navegador
- Use modo anônimo/privado
- Ou force refresh (Ctrl+F5 equivalente)

### 7. **Provedor de Internet Móvel**

Alguns provedores bloqueiam certos tipos de conexão.

**Teste:**
- Tente com outro provedor (se possível)
- Tente com VPN

## 🧪 Testes para Diagnosticar

### Teste 1: Acessar a URL no Celular

1. **Abra o navegador no celular**
2. **Digite a URL:**
   ```
   http://api-jhukyy-dcf077-168-231-92-86.traefik.me/api/docs
   ```
3. **Anote o erro que aparece**

### Teste 2: Verificar Conectividade

No celular, teste:
```bash
# Se tiver acesso a terminal/SSH no celular
ping api-jhukyy-dcf077-168-231-92-86.traefik.me
```

### Teste 3: Testar de Rede Diferente

- Tente de WiFi
- Tente de dados móveis
- Compare

### Teste 4: Verificar Logs do Backend

Quando tentar acessar pelo celular, verifique os logs:
- A requisição chega no backend?
- Qual é o IP de origem?
- Há erros de CORS?

## ✅ Soluções

### Solução 1: Verificar Firewall

**Na VPS:**
```bash
# Verificar firewall
sudo ufw status

# Se estiver bloqueando, permitir conexões
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

### Solução 2: Verificar CORS

O CORS já está configurado para aceitar qualquer origem em desenvolvimento, mas verifique:

**No código (`src/main.ts`):**
- Deve permitir qualquer origem se `NODE_ENV !== 'production'`
- Ou adicione a origem específica do celular

### Solução 3: Usar IP Diretamente (Teste)

Para testar se é problema de DNS:
```
http://168.231.92.86:3000/api/docs
```

**Nota:** Isso pode não funcionar se o Traefik estiver no caminho.

### Solução 4: Verificar Logs do Traefik

Se você tiver acesso aos logs do Traefik:
- Verifique se as requisições do celular estão chegando
- Verifique se há erros de proxy

### Solução 5: Testar com App de API (Postman Mobile)

Use o Postman no celular para testar:
- Se funcionar no Postman mas não no navegador = problema de CORS/browser
- Se não funcionar no Postman = problema de rede/firewall

## 🔍 Perguntas para Diagnosticar

Responda estas perguntas:

1. **Qual erro aparece no navegador do celular?**
   - Timeout?
   - "Não foi possível conectar"?
   - "Site não encontrado"?
   - Erro de CORS?
   - Outro erro?

2. **O celular está em WiFi ou dados móveis?**
   - Testou ambos?

3. **Funciona no computador?**
   - Se funciona no PC mas não no celular = problema de rede/firewall
   - Se não funciona em nenhum = problema geral

4. **A requisição chega no backend?**
   - Verifique os logs do backend quando tentar acessar pelo celular
   - Se não chegar = problema de rede/firewall
   - Se chegar mas dar erro = problema de CORS/autenticação

## 📋 Checklist de Verificação

- [ ] Testei com WiFi
- [ ] Testei com dados móveis
- [ ] Verifiquei firewall da VPS
- [ ] Verifiquei logs do backend
- [ ] Testei no navegador do PC (para comparar)
- [ ] Testei com Postman mobile (se disponível)
- [ ] Limpei cache do navegador
- [ ] Tentei modo anônimo/privado

## 🚀 Solução Rápida

### Passo 1: Verificar se Funciona no PC
Se funciona no PC mas não no celular = problema de rede mobile

### Passo 2: Verificar Firewall
```bash
sudo ufw status
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

### Passo 3: Verificar Logs
Quando tentar acessar pelo celular, veja os logs do backend

### Passo 4: Testar de Rede Diferente
Tente de WiFi e de dados móveis

## 💡 Dicas

1. **Use o modo de desenvolvedor do navegador mobile:**
   - Chrome mobile: chrome://inspect
   - Ver logs do console

2. **Teste com Postman/Insomnia mobile:**
   - Se funcionar = problema de browser/CORS
   - Se não funcionar = problema de rede

3. **Verifique o IP do celular:**
   - O firewall pode estar bloqueando IPs específicos
   - Teste permitindo todos os IPs temporariamente

## 🐛 Erros Comuns

### "Não foi possível conectar"
- Problema de rede/firewall
- URL incorreta
- Servidor offline

### "Site não encontrado"
- Problema de DNS
- URL incorreta

### Timeout
- Firewall bloqueando
- Rede muito lenta
- Servidor sobrecarregado

### Erro de CORS
- CORS bloqueando a origem do celular
- Verificar configuração de CORS

