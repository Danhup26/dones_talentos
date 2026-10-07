@echo off
chcp 65001 >nul
title Publicar Dones y Talentos en Vercel
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo   Falta instalar Node.js. Descargalo gratis en https://nodejs.org ^(version LTS^) y vuelve a abrir este archivo.
  echo.
  pause
  exit /b 1
)
echo.
echo   PASO 1 de 3: iniciar sesion en Vercel
call npx --yes vercel whoami >nul 2>nul
if errorlevel 1 (
  echo   Se abrira el navegador: inicia sesion con tu cuenta de Vercel y vuelve a esta ventana.
  call npx --yes vercel login
)
echo.
echo   PASO 2 de 3: enlazar con el proyecto "dones-y-talentos"
call npx --yes vercel link --yes --project dones-y-talentos
echo.
echo   PASO 3 de 3: publicar
call npx --yes vercel deploy --prod --yes
echo.
echo   Si todo salio bien, arriba aparece el enlace "Production". Esa es la direccion publica.
echo   Abrela en una ventana de incognito para confirmar que se ve sin iniciar sesion.
echo.
pause
