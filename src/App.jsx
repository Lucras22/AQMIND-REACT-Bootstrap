import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppNavbar from "./components/Navbar";
import AppFooter from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Sobre from "./pages/Sobre";
import Dashboard from "./pages/Dashboard";
import Reservatorios from "./pages/Reservatorios";


function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <AppNavbar />
        <div className="container mt-4 flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/sobre" element={<Sobre />} /> 
            <Route path="/dashboard" element={<Dashboard />} /> 
            <Route path="/reservatorios" element={<Reservatorios />} /> 
          </Routes>
        </div>
        <AppFooter />
      </div>
    </Router>
  );
}

export default App;
