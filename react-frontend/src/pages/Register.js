import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Register = () => {
  const navigate = useNavigate();
  const [noRoleSelected, setNoRoleSelected] = useState(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const object = { roles: [] };
    console.log(data);
    data.forEach((value, key) => {
      if (key === "role") {
        object["roles"].push(value);
      } else object[key] = value;
    });
    if (object["roles"].length === 0) {
      setNoRoleSelected(true);
      return;
    } else {
      setNoRoleSelected(false);
    }
    const json = JSON.stringify(object);
    fetch("/api/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: json,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.success) navigate("/login");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <Form class="mb-3" onSubmit={handleSubmit}>
      <Form.Group className="ms-2 me-2 mb-3" controlId="formUsername">
        <Form.Label>Username:</Form.Label>
        <Form.Control
          required
          type="username"
          placeholder="Your username"
          name="username"
        />
      </Form.Group>
      <Form.Group className="ms-2 me-2 mb-3" controlId="formPassword">
        <Form.Label>Password:</Form.Label>
        <Form.Control
          required
          type="password"
          placeholder="Your password"
          name="password"
        />
      </Form.Group>
      <Form.Group className="ms-2 me-2 mb-3" controlId="formName">
        <Form.Label>Name:</Form.Label>
        <Form.Control
          required
          type="name"
          placeholder="Your name"
          name="name"
        />
      </Form.Group>
      <Form.Group className="ms-2 me-2 mb-3" controlId="formSurname">
        <Form.Label>Surname:</Form.Label>
        <Form.Control
          required
          type="surname"
          placeholder="Your surname"
          name="surname"
          small="As"
        />
      </Form.Group>
      <Form.Group>
        {["trainer", "member", "mechanic", "admin"].map((type) => (
          <div key={`${type}`} className="ms-2 me-2 mb-3">
            <Form.Check
              name={`role`}
              type="checkbox"
              id={`Role ${type}`}
              label={`Role ${type}`}
              value={`${type.toUpperCase()}`}
            />
          </div>
        ))}
        {noRoleSelected && (
          <p style={{ color: "red" }}>Please select at least one role.</p>
        )}
      </Form.Group>
      <Button
        class="text-center"
        className="ms-2 me-2 mb-3"
        variant="primary"
        type="submit"
      >
        Register
      </Button>
    </Form>
  );
};
export default Register;
