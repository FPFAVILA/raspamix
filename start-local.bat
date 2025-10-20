@echo off
echo 🚀 INICIANDO PROJETO RASPADINHA PIXUP
echo =====================================

echo.
echo 📦 Instalando dependencias...
call npm run setup

echo.
echo 🔧 Verificando configuracao...
if not exist .env.local (
    echo ❌ Arquivo .env.local nao encontrado!
    pause
    exit /b 1
)

if not exist backend\.env (
    echo ❌ Arquivo backend\.env nao encontrado!
    pause
    exit /b 1
)

echo ✅ Configuracao OK!

echo.
echo 🚀 Iniciando backend e frontend...
echo Backend: http://localhost:3000
echo Frontend: http://localhost:5173
echo Teste PixUp: http://localhost:5173?test

start cmd /k "cd backend && npm start"
timeout /t 3 /nobreak > nul
start cmd /k "npm run dev"

echo.
echo ✅ Projeto iniciado!
echo 📖 Consulte TESTE_LOCAL.md para mais detalhes
pause