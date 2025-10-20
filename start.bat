@echo off
echo 🚀 RASPADINHA PIXUP - INICIO RAPIDO
echo ===================================

echo 📦 Instalando dependencias...
call npm run setup

if %errorlevel% neq 0 (
    echo ❌ Erro na instalacao!
    pause
    exit /b 1
)

echo ✅ Instalacao concluida!
echo.
echo 🚀 Iniciando projeto...
echo Backend: http://localhost:3000
echo Frontend: http://localhost:5173
echo.

call npm start

pause