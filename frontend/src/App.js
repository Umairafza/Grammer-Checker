import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login';
import GrammarChecker from './components/GrammarChecker';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/grammar-check" element={<ProtectedRoute component={GrammarChecker} />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>  
  );
}

function ProtectedRoute({ component: Component }) {
  const token = localStorage.getItem('token');
  return token ? <Component /> : <Navigate to="/login" />;
}

export default App;