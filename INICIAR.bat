@echo off
chcp 65001 >nul
title Dones y Talentos - Servidor
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo   Falta instalar Node.js. Descargalo gratis en https://nodejs.org ^(version LTS^) y vuelve a abrir este archivo.
  echo.
  pause
  exit /b 1
)
start "" cmd /c "timeout /t 2 >nul & start http://localhost:3000"
node servidor.js 3000
echo.
pause
