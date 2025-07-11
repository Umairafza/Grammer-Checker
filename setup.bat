@echo off
echo ========================================
echo Grammar Checker App Setup
echo ========================================

echo.
echo Setting up Backend...
cd backend
echo Installing backend dependencies...
call npm install
echo.
echo Creating .env file for backend...
echo PORT=3500 > .env
echo JWT_SECRET=your-super-secret-jwt-key-change-this-in-production >> .env
echo NODE_ENV=development >> .env
echo.
echo Backend setup complete!
echo.
echo Setting up Frontend...
cd ..\frontend
echo Installing frontend dependencies...
call npm install
echo.
echo Frontend setup complete!
echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the application:
echo 1. Open a new terminal and run: cd backend && npm start
echo 2. Open another terminal and run: cd frontend && npm start
echo.
echo The app will be available at:
echo - Frontend: http://localhost:3000
echo - Backend: http://localhost:3500
echo.
echo Demo credentials:
echo - Username: test
echo - Password: password123
echo.
pause 