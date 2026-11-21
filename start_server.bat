@echo off
chcp 65001 > nul
echo ============================================================
echo   다정다감 로컬 웹서버 시작 (PowerShell 기반)
echo   주소: http://localhost:8080/
echo ============================================================
powershell -ExecutionPolicy Bypass -File "%~dp0start_server.ps1"
pause
