Write-Host "========================================" -ForegroundColor Green
Write-Host "Grammar Checker App Setup" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Write-Host ""
Write-Host "Setting up Backend..." -ForegroundColor Yellow
Set-Location backend
Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
npm install

Write-Host ""
Write-Host "Creating .env file for backend..." -ForegroundColor Cyan
@"
PORT=3500
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
"@ | Out-File -FilePath ".env" -Encoding UTF8

Write-Host "Backend setup complete!" -ForegroundColor Green

Write-Host ""
Write-Host "Setting up Frontend..." -ForegroundColor Yellow
Set-Location ../frontend
Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
npm install

Write-Host ""
Write-Host "Frontend setup complete!" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "To start the application:" -ForegroundColor White
Write-Host "1. Open a new terminal and run: cd backend && npm start" -ForegroundColor Cyan
Write-Host "2. Open another terminal and run: cd frontend && npm start" -ForegroundColor Cyan
Write-Host ""
Write-Host "The app will be available at:" -ForegroundColor White
Write-Host "- Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "- Backend: http://localhost:3500" -ForegroundColor Cyan
Write-Host ""
Write-Host "Demo credentials:" -ForegroundColor White
Write-Host "- Username: test" -ForegroundColor Cyan
Write-Host "- Password: password123" -ForegroundColor Cyan
Write-Host ""

Read-Host "Press Enter to continue" 