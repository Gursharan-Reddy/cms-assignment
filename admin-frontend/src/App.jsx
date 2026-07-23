import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, Provider } from 'react-redux';
import { store } from './store';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import './index.css';

const AppRoutes = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  
  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
      <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
    </Routes>
  );
};

const App = () => (
  <Provider store={store}>
    <Router>
      <AppRoutes />
    </Router>
  </Provider>
);

export default App;