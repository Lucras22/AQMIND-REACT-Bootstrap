import { Container, Row, Col, Image, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function Sobre() {
  return (
    <Container className="mt-5">
      <Row className="mb-5 align-items-center">
        <Col md={6}>
          <Image
            src="https://via.placeholder.com/500x300"
            alt="Sobre"
            fluid
            rounded
          />
        </Col>
        <Col md={6}>
          <h1>Sobre o Nosso App</h1>
          <p>
            Nosso aplicativo foi criado para fornecer uma experiência completa
            aos usuários, combinando funcionalidades de login, perfil, novidades
            e suporte. É simples, intuitivo e seguro, permitindo que você
            gerencie suas informações e aproveite todas as funcionalidades de
            forma prática.
          </p>
          <p>
            Desenvolvemos este projeto utilizando as tecnologias mais modernas,
            incluindo <b>React</b>, <b>Firebase</b> e <b>Bootstrap</b>, garantindo
            alta performance e segurança dos dados.
          </p>
          <Button as={Link} to="/" variant="primary">
            Voltar para Home
          </Button>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col>
          <h2>Nossa Missão</h2>
          <p>
            Nossa missão é oferecer uma plataforma amigável e eficiente para
            que os usuários possam acessar suas informações rapidamente,
            mantendo tudo seguro e organizado.
          </p>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col>
          <h2>Nosso Time</h2>
          <p>
            Somos uma equipe apaixonada por tecnologia e inovação, sempre
            buscando entregar soluções de qualidade que facilitem a vida dos
            usuários.
          </p>
        </Col>
      </Row>
    </Container>
  );
}

export default Sobre;
