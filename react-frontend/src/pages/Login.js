import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = () => {
  const navigate = useNavigate();
  const [wrongPassword, setWrongPassword] = useState(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const object = {};
    data.forEach(function (value, key) {
      object[key] = value;
    });
    const json = JSON.stringify(object);
    fetch("/api/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: json,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) navigate("/");
        else setWrongPassword(true);
      })
      .catch((error) => {
        console.log(error);
        setWrongPassword(true);
      });
  };
  return (
    <Form
      className="text-center"
      class="row justify-content-center col-md-6"
      onSubmit={handleSubmit}
    >
      <Form.Group className="mb-3" controlId="formUsername">
        <Form.Label>Username:</Form.Label>
        <Form.Control
          type="username"
          placeholder="Your username"
          name="username"
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formPassword">
        <Form.Label>Password:</Form.Label>
        <Form.Control
          type="password"
          placeholder="Your password"
          name="password"
          onChange={() => setWrongPassword(false)}
        />
        {wrongPassword && (
          <p style={{ color: "red" }}>Wrong password or username.</p>
        )}
      </Form.Group>
      <Button variant="primary" type="submit">
        Log in
      </Button>
    </Form>
  );
};
export default Login;
