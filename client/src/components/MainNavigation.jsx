import "./MainNavigation.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "../util/http";

function MainNavigation() {
  const navigate = useNavigate();

  return (
    <>
      {" "}
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand as={Link} to="/">
            The National League
          </Navbar.Brand>
          {/* <Navbar.Toggle aria-controls="basic-navbar-nav" /> */}
          {/* <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <NavDropdown title="Leaderboards" id="basic-nav-dropdown">
                <NavDropdown.Item
                  as={Link}
                  to="/leaderboard/treasuretrailpoints"
                >
                  Treasure Trail Points
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/leaderboard/overall">
                  Broadcasts (Overall)
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/leaderboard/detailed">
                  Broadcasts (Detailed)
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="#action/3.4">
                  Separated link
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse> */}
        </Container>
      </Navbar>
    </>
  );
}

export default MainNavigation;
