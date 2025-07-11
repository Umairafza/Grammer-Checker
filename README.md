✨ Grammar Checker Web App
A smart grammar correction web app built with React.js and powered by OpenAI API for accurate and context-aware grammar checking. The app features secure user authentication using JWT (JSON Web Tokens) and provides a clean, responsive interface (light mode only).

<img width="637" height="509" alt="image" src="https://github.com/user-attachments/assets/36a0751b-670e-4120-b7be-e8e4bcd36f01" />
<img width="1065" height="767" alt="image" src="https://github.com/user-attachments/assets/8a89d404-96ab-46c4-8ec2-91ad2f4e8707" />


🚀 Features
✅ Grammar, spelling, and punctuation correction

🔐 JWT-based authentication (Signup/Login)

💬 OpenAI-powered smart suggestions

📄 Real-time grammar feedback

⚡ Responsive, lightweight UI

🧼 Clean, light-themed user interface (no dark mode)

🛠️ Tech Stack
Frontend: React.js (JavaScript)

Authentication: JWT (JSON Web Tokens)

Grammar Engine: OpenAI GPT API (via fetch/axios)

UI Styling: CSS / Tailwind / Bootstrap (customizable)

State Management: Context API or local state

API Integration: OpenAI's GPT model for language correction

📦 Installation
bash
Copy
Edit
# 1. Clone the repository
git clone https://github.com/your-username/grammar-checker.git

# 2. Navigate into the project folder
cd grammar-checker

# 3. Install frontend dependencies
npm install

# 4. Start the development server
npm start
🔐 Authentication Flow (JWT)
User signs up or logs in using credentials.

Backend issues a JWT token upon successful login.

Token is stored securely in the browser.

Protected routes and requests include the JWT for validation.

🔑 OpenAI API Integration
Uses OpenAI's API to analyze and correct input text.

The input is sent to the GPT model, and grammar-corrected output is returned and displayed.
