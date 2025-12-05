@echo off
echo ========================================
echo   AutoRoulette Starting...
echo ========================================
echo.

REM Check if .env exists
if not exist .env (
    echo [ERROR] .env file not found!
    echo.
    echo Please copy .env.example to .env and configure your settings:
    echo   copy .env.example .env
    echo.
    echo Then edit .env and add your Chzzk authentication tokens.
    echo.
    pause
    exit /b 1
)

echo [INFO] Starting Docker containers...
docker-compose up -d

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Failed to start Docker containers.
    echo Please make sure Docker Desktop is running.
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   AutoRoulette Started Successfully!
echo ========================================
echo.
echo Services are now running:
echo   - Roulette UI:  http://localhost:1235/
echo   - Admin Panel:  http://localhost:3000/admin
echo   - Backend API:  http://localhost:3000
echo.
echo To stop the services, run: docker-compose down
echo To view logs, run: docker-compose logs -f
echo.
pause
