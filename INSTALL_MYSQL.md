# 🗄️ Instalação e Configuração do MySQL na VPS

## 🔍 Verificar se MySQL está instalado

```bash
# Verificar se MySQL está instalado
which mysql
mysql --version

# Verificar serviços MySQL
sudo systemctl status mysql
sudo systemctl status mysqld
sudo systemctl status mariadb

# Verificar se está rodando
ps aux | grep mysql
```

## 📦 Instalar MySQL

### Ubuntu/Debian

```bash
# Atualizar pacotes
sudo apt update

# Instalar MySQL Server
sudo apt install mysql-server -y

# Iniciar MySQL
sudo systemctl start mysql
sudo systemctl enable mysql

# Verificar status
sudo systemctl status mysql
```

### CentOS/RHEL

```bash
# Instalar MySQL
sudo yum install mysql-server -y

# Iniciar MySQL
sudo systemctl start mysqld
sudo systemctl enable mysqld

# Verificar status
sudo systemctl status mysqld
```

## 🔐 Configuração Inicial

### 1. Configurar segurança do MySQL

```bash
sudo mysql_secure_installation
```

Siga as instruções:
- Definir senha do root
- Remover usuários anônimos
- Desabilitar login remoto do root
- Remover banco de dados de teste
- Recarregar tabelas de privilégios

### 2. Configurar para aceitar conexões remotas

```bash
# Editar configuração
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
```

Encontrar e alterar:
```ini
# bind-address = 127.0.0.1
bind-address = 0.0.0.0
```

Salvar e reiniciar:
```bash
sudo systemctl restart mysql
```

### 3. Criar banco de dados e usuário

```bash
# Conectar no MySQL
sudo mysql -u root -p
```

Execute os comandos SQL:

```sql
-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS `control-db` 
DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Criar usuário com acesso remoto
CREATE USER IF NOT EXISTS 'control'@'%' IDENTIFIED BY 'Parangamir0@';

-- Dar permissões completas
GRANT ALL PRIVILEGES ON `control-db`.* TO 'control'@'%';

-- Aplicar mudanças
FLUSH PRIVILEGES;

-- Verificar
SHOW DATABASES;
SELECT user, host FROM mysql.user WHERE user='control';

-- Sair
EXIT;
```

## 🔥 Configurar Firewall

```bash
# Abrir porta 3306
sudo ufw allow 3306/tcp
sudo ufw reload

# Verificar
sudo ufw status
```

## ✅ Testar Conexão

### Teste local:
```bash
mysql -u control -p control-db
```

### Teste remoto (do seu computador):
```bash
mysql -h 168.231.92.86 -u control -p control-db
```

## 🐛 Troubleshooting

### MySQL não inicia

```bash
# Ver logs de erro
sudo tail -f /var/log/mysql/error.log

# Verificar permissões
sudo chown -R mysql:mysql /var/lib/mysql
sudo chmod -R 755 /var/lib/mysql

# Reiniciar
sudo systemctl restart mysql
```

### Erro de acesso negado

```bash
# Resetar senha do root
sudo mysql
```

```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'NovaSenhaSegura';
FLUSH PRIVILEGES;
EXIT;
```

### Porta 3306 não responde

```bash
# Verificar se MySQL está escutando
sudo netstat -tlnp | grep 3306
# ou
sudo ss -tlnp | grep 3306

# Verificar firewall
sudo ufw status
sudo iptables -L -n | grep 3306
```

## 📝 Comandos Úteis

```bash
# Parar MySQL
sudo systemctl stop mysql

# Iniciar MySQL
sudo systemctl start mysql

# Reiniciar MySQL
sudo systemctl restart mysql

# Ver status
sudo systemctl status mysql

# Ver logs
sudo tail -f /var/log/mysql/error.log
sudo journalctl -u mysql -f
```

