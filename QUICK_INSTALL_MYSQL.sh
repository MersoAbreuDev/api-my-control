#!/bin/bash

# Script de instalação rápida do MySQL na VPS
# Execute: bash QUICK_INSTALL_MYSQL.sh

echo "🚀 Iniciando instalação do MySQL..."

# Atualizar pacotes
echo "📦 Atualizando pacotes..."
sudo apt update

# Instalar MySQL Server
echo "📦 Instalando MySQL Server..."
sudo apt install mysql-server -y

# Iniciar MySQL
echo "▶️ Iniciando MySQL..."
sudo systemctl start mysql
sudo systemctl enable mysql

# Verificar status
echo "✅ Verificando status..."
sudo systemctl status mysql --no-pager

echo ""
echo "✅ MySQL instalado com sucesso!"
echo ""
echo "📝 Próximos passos:"
echo "1. Configure para aceitar conexões remotas:"
echo "   sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf"
echo "   (Altere: bind-address = 0.0.0.0)"
echo ""
echo "2. Reinicie o MySQL:"
echo "   sudo systemctl restart mysql"
echo ""
echo "3. Conecte e configure o banco:"
echo "   sudo mysql -u root -p"
echo ""
echo "4. Execute os comandos SQL do arquivo INSTALL_MYSQL.md"

