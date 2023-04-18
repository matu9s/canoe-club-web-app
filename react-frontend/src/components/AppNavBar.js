import { useContext } from "react";
import { userContext } from "../UserContext";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

const AppNavBar = () => {
  const { currentUser, setCurrentUser } = useContext(userContext);
  const navigate = useNavigate();
  const logout = () => {
    setCurrentUser({});
    localStorage.removeItem("current_user");
    fetch("/api/logout/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    navigate("/");
  };
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="/">Kayak/Canoe Administration</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {currentUser.username ? (
              <>
                <Nav.Link href="/">Home</Nav.Link>
                <NavDropdown title="Boats" id="basic-nav-dropdown">
                  <NavDropdown.Item href="/boat-list">
                    Boats List
                  </NavDropdown.Item>
                  {
                    <NavDropdown.Item href="/add-boat">
                      Add Boat
                    </NavDropdown.Item>
                  }
                </NavDropdown>
                <Nav.Link href="#">Members</Nav.Link>
                <NavDropdown title="Trainings">
                  <NavDropdown.Item href="#">Trainings List</NavDropdown.Item>
                  <NavDropdown.Item href="#">Add Training</NavDropdown.Item>
                </NavDropdown>
                <Navbar.Text>
                  Signed in as: <b>{currentUser.username}</b>
                </Navbar.Text>
                <Button variant="secondary" onClick={logout}>
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Nav.Link href="/login">Login</Nav.Link>
                <Nav.Link href="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavBar;
