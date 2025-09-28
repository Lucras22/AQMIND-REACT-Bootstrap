import { Container } from "react-bootstrap";

function AppFooter() {
  return (
    <footer className="bg-primary text-light py-4 mt-auto w-100 shadow-sm">
      <Container className="text-center">
        <p className="mb-2 fw-bold">© {new Date().getFullYear()} CETHAP</p>
        <div>
          <a
            href="https://github.com/seuusuario"
            target="_blank"
            rel="noopener noreferrer"
            className="text-light mx-3 footer-icon"
          >
            <i className="bi bi-github" style={{ fontSize: "1.6rem" }}></i>
          </a>
          <a
            href="https://linkedin.com/in/seuusuario"
            target="_blank"
            rel="noopener noreferrer"
            className="text-light mx-3 footer-icon"
          >
            <i className="bi bi-linkedin" style={{ fontSize: "1.6rem" }}></i>
          </a>
          <a
            href="https://instagram.com/seuusuario"
            target="_blank"
            rel="noopener noreferrer"
            className="text-light mx-3 footer-icon"
          >
            <i className="bi bi-instagram" style={{ fontSize: "1.6rem" }}></i>
          </a>
        </div>
      </Container>

      <style>
        {`
          .footer-icon {
            transition: color 0.3s ease, transform 0.2s ease;
          }
          .footer-icon:hover {
            color: #ffc107; /* Amarelo destaque no hover */
            transform: scale(1.2);
          }
        `}
      </style>
    </footer>
  );
}

export default AppFooter;
