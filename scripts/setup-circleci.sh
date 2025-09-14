#!/bin/bash

# Script para configurar CircleCI localmente
echo "🔧 Configurando CircleCI para random-weighted-pick..."

# Verificar se o CircleCI CLI está instalado
if ! command -v circleci &> /dev/null; then
    echo "❌ CircleCI CLI não encontrado. Instalando..."
    
    # Instalar CircleCI CLI
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        brew install circleci
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        curl -fLSs https://raw.githubusercontent.com/circleci/circleci-cli/main/install.sh | sudo bash
    else
        echo "❌ Sistema operacional não suportado. Instale manualmente: https://circleci.com/docs/2.0/local-cli/"
        exit 1
    fi
fi

# Validar configuração
echo "✅ Validando configuração do CircleCI..."
circleci config validate .circleci/config.yml

if [ $? -eq 0 ]; then
    echo "✅ Configuração do CircleCI é válida!"
else
    echo "❌ Erro na configuração do CircleCI"
    exit 1
fi

# Testar build localmente (opcional)
read -p "🧪 Deseja testar o build localmente? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Executando build local..."
    circleci local execute build
fi

echo "🎉 Configuração do CircleCI concluída!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure as variáveis de ambiente no CircleCI:"
echo "   - CODECOV_TOKEN (opcional, para cobertura de código)"
echo "   - NPM_TOKEN (para releases automáticos)"
echo ""
echo "2. Ative o projeto no CircleCI:"
echo "   https://circleci.com/gh/phellipeandrade/random-weighted-pick"
