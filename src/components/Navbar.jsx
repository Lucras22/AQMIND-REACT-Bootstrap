import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

function AppNavbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Detecta se o usuário está logado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="shadow-sm py-3">
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="fw-bold text-light d-flex align-items-center"
        >
          🌀 CETHAP
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {!user ? (
              <>
                <Nav.Link as={Link} to="/" className="nav-link-custom">
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/login" className="nav-link-custom">
                  Login
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/" className="nav-link-custom">
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/Dashboard" className="nav-link-custom">
                  Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/AQMIND" className="nav-link-custom">
                  AQMIND
                </Nav.Link>
                <Nav.Link as={Link} to="/profile" className="nav-link-custom">
                  Profile
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>

      <style>
        {`
          .nav-link-custom {
            color: #fff !important;
            font-weight: 500;
            margin-left: 12px;
            transition: color 0.3s ease, transform 0.2s ease;
          }

          .nav-link-custom:hover {
            color: #ffc107 !important; /* Amarelo destaque */
            transform: translateY(-2px);
          }

          .navbar-brand {
            font-size: 1.4rem;
            transition: transform 0.2s ease;
          }

          .navbar-brand:hover {
            transform: scale(1.05);
          }
        `}
      </style>
    </Navbar>
  );
}

export default AppNavbar;
