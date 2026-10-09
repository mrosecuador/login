@echo off
title MRosecuador - Servidor Local
echo Iniciando servidor MRosecuador...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start_server.ps1"
pause
