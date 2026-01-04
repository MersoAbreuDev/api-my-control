# 🔧 Troubleshooting: Erro de Conexão com Banco de Dados

## ❌ Erro: `ECONNREFUSED 168.231.92.86:3306`

Este erro significa que a conexão ao MySQL está sendo **recusada**. Isso pode ter várias causas:

## 🔍 Possíveis Causas e Soluções

### 1. MySQL não está rodando no servidor

**Verificar:**
```bash
# Conecte na VPS via SSH
ssh root@168.231.92.86

# Verificar se o MySQL está rodando
sudo systemctl status mysql
# ou
sudo systemctl status mysqld
```

**Solução:**
```bash
# Iniciar o MySQL
sudo systemctl start mysql
# ou
sudo systemctl start mysqld

# Habilitar para iniciar automaticamente
sudo systemctl enable mysql
```

### 2. Firewall bloqueando a porta 3306

**Verificar:**
```bash
# Verificar se a porta está aberta
sudo ufw status
# ou
sudo iptables -L -n | grep 3306
```

**Solução:**
```bash
# Abrir porta 3306 no firewall
sudo ufw allow 3306/tcp
sudo ufw reload

# Ou no iptables
sudo iptables -A INPUT -p tcp --dport 3306 -j ACCEPT
sudo iptables-save
```

**No painel da Hostinger:**
- Vá em **Firewall** ou **Security**
- Adicione regra: Porta `3306`, Protocolo `TCP`, Ação `Allow`

### 3. MySQL não aceita conexões remotas

Por padrão, o MySQL só aceita conexões de `localhost`. Você precisa configurar para aceitar conexões remotas.

**Solução:**

1. **Editar configuração do MySQL:**
```bash
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
```

2. **Encontrar e comentar/alterar a linha:**
```ini
# bind-address = 127.0.0.1
bind-address = 0.0.0.0
```

3. **Reiniciar o MySQL:**
```bash
sudo systemctl restart mysql
```

### 4. Usuário não tem permissão para conectar remotamente

**Verificar e corrigir:**

1. **Conectar no MySQL localmente:**
```bash
mysql -u root -p
```

2. **Verificar usuários:**
```sql
SELECT user, host FROM mysql.user WHERE user='control';
```

3. **Criar/atualizar usuário com permissão remota:**
```sql
-- Criar usuário se não existir
CREATE USER IF NOT EXISTS 'control'@'%' IDENTIFIED BY 'Parangamir0@';

-- Ou atualizar host existente
UPDATE mysql.user SET host='%' WHERE user='control' AND host='localhost';

-- Dar permissões
GRANT ALL PRIVILEGES ON `control-db`.* TO 'control'@'%';

-- Aplicar mudanças
FLUSH PRIVILEGES;

-- Verificar
SELECT user, host FROM mysql.user WHERE user='control';
```

4. **Sair do MySQL:**
```sql
EXIT;
```

### 5. Banco de dados não existe

**Criar o banco de dados:**
```sql
CREATE DATABASE IF NOT EXISTS `control-db` 
DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## 🧪 Testar Conexão

### Teste 1: Do seu computador local

```bash
# Testar conexão TCP
telnet 168.231.92.86 3306

# Ou com nc (netcat)
nc -zv 168.231.92.86 3306

# Testar conexão MySQL
mysql -h 168.231.92.86 -u control -p control-db
```

### Teste 2: Da VPS (se aplicação estiver na mesma VPS)

```bash
# Conectar localmente
mysql -u control -p control-db
```

### Teste 3: Verificar logs do MySQL

```bash
# Ver logs do MySQL
sudo tail -f /var/log/mysql/error.log
```

## 📋 Checklist de Verificação

- [ ] MySQL está rodando (`systemctl status mysql`)
- [ ] Porta 3306 está aberta no firewall
- [ ] MySQL aceita conexões remotas (`bind-address = 0.0.0.0`)
- [ ] Usuário `control` existe e tem permissão remota (`'control'@'%'`)
- [ ] Banco de dados `control-db` existe
- [ ] Senha está correta
- [ ] Firewall da Hostinger permite porta 3306

## 🔐 Configuração Completa do MySQL

Execute estes comandos na VPS:

```bash
# 1. Conectar no MySQL
mysql -u root -p

# 2. Criar banco de dados
CREATE DATABASE IF NOT EXISTS `control-db` 
DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 3. Criar usuário com acesso remoto
CREATE USER IF NOT EXISTS 'control'@'%' IDENTIFIED BY 'Parangamir0@';

# 4. Dar permissões
GRANT ALL PRIVILEGES ON `control-db`.* TO 'control'@'%';

# 5. Aplicar mudanças
FLUSH PRIVILEGES;

# 6. Verificar
SHOW DATABASES;
SELECT user, host FROM mysql.user WHERE user='control';

# 7. Sair
EXIT;
```

```bash
# 8. Editar configuração
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
# Alterar: bind-address = 0.0.0.0

# 9. Reiniciar MySQL
sudo systemctl restart mysql

# 10. Abrir firewall
sudo ufw allow 3306/tcp
sudo ufw reload
```

## 🚨 Aviso sobre `acquireTimeout`

O aviso sobre `acquireTimeout` foi corrigido no código. Esta opção não é válida para TypeORM com MySQL2 e foi removida.

## 📞 Próximos Passos

1. Execute o checklist acima
2. Teste a conexão com `mysql -h 168.231.92.86 -u control -p`
3. Se funcionar, reinicie a aplicação NestJS
4. Verifique os logs da aplicação

## 💡 Dica de Segurança

Para maior segurança, em vez de usar `%` (qualquer IP), você pode restringir para o IP específico da sua aplicação:

```sql
CREATE USER 'control'@'IP-DA-APLICACAO' IDENTIFIED BY 'Parangamir0@';
GRANT ALL PRIVILEGES ON `control-db`.* TO 'control'@'IP-DA-APLICACAO';
FLUSH PRIVILEGES;
```

