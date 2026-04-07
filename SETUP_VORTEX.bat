@echo off
TITLE IP Codemaker | Neural Setup Utility
COLOR 0D

echo.
echo  [SETUP] Initializing Repository Sync...
echo  -----------------------------------------

:: 1. Backend Install
echo  [CORE] Installing Python Dependencies (FastAPI, Uvicorn)...
pip install fastapi uvicorn pydantic

:: 2. Frontend Install
echo  [GUI] Installing Node Modules for Neural Vortex...
cd gui
npm install

echo.
echo  [SYNC_COMPLETE] Vortex Neural Link Ready.
echo  -----------------------------------------
echo  Run LAUNCH_VORTEX.bat to start the system.
pause
