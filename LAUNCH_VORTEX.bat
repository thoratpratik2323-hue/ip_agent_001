@echo off
TITLE IP Codemaker | Neural Vortex - System Launcher
COLOR 0B

echo.
echo  [SYSTEM] Initializing Neural Interface...
echo  -----------------------------------------

:: 1. Start Python Backend
echo  [CORE] Starting Python Backend on Port 5000...
start /B python server.py

:: 2. Wait for Backend
timeout /t 3 /nobreak > nul

:: 3. Ready Frontend
echo  [GUI] Starting Neural Vortex (V2) Dashboard...
cd gui
npm run dev
