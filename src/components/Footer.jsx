import { Container } from "react-bootstrap";

function AppFooter() {
  return (
    <footer className="bg-dark text-light py-3 mt-auto w-100">
      <Container className="text-center">
        <p className="mb-1">© {new Date().getFullYear()} CETHAP</p>
        <div className="mb-2">
          <a
            href="https://github.com/seuusuario"
            target="_blank"
            rel="noopener noreferrer"
            className="text-light mx-2"
          >
            <i className="bi bi-github" style={{ fontSize: "1.5rem" }}></i>
          </a>
          <a
            href="https://linkedin.com/in/seuusuario"
            target="_blank"
            rel="noopener noreferrer"
            className="text-light mx-2"
          >
            <i className="bi bi-linkedin" style={{ fontSize: "1.5rem" }}></i>
          </a>
          <a
            href="https://instagram.com/seuusuario"
            target="_blank"
            rel="noopener noreferrer"
            className="text-light mx-2"
          >
            <i className="bi bi-instagram" style={{ fontSize: "1.5rem" }}></i>
          </a>
        </div>
      </Container>
    </footer>
  );
}

export default AppFooter;
