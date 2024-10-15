import "./MainNavigation.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "../util/helpers/http";

function MainNavigation() {
  const navigate = useNavigate();

  return (
    <>
      {" "}
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <div className="nav-row">
            <Navbar.Brand as={Link} to="/">
              The National League
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
          </div>

          <div className="pages">
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav as={Link} to="/standings">
                Standings
              </Nav>
              <Nav as={Link} to="/weeklyrecap">
                Weekly Recap
              </Nav>
              {/* <Nav className="me-auto">
              <NavDropdown title="Weekly Recap" id="basic-nav-dropdown">
                <NavDropdown.Item
                  as={Link}
                  to="/weeklyrecap"
                ></NavDropdown.Item>
              </NavDropdown>
            </Nav> */}
            </Navbar.Collapse>
          </div>
        </Container>
      </Navbar>
    </>
  );
}

export default MainNavigation;
