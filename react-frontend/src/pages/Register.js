import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { userContext } from "../UserContext";
import { useContext, useEffect } from "react";

const Register = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(userContext);
  useEffect(() => {
    if (currentUser.username !== undefined) navigate("/");
  }, [currentUser]);
  const [noRoleSelected, setNoRoleSelected] = useState(false);
  const [memberSelected, setMemberSelected] = useState(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const formatedData = { roles: [] };
    data.forEach((value, key) => {
      if (key === "role") {
        formatedData["roles"].push(value);
      } else formatedData[key] = value;
    });
    if (formatedData["roles"].length === 0) {
      setNoRoleSelected(true);
      return;
    } else {
      setNoRoleSelected(false);
    }
    const json = JSON.stringify(formatedData);
    fetch("/api/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: json,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) navigate("/login");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <Form className="mb-3" onSubmit={handleSubmit}>
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
              onChange={() => {
                if (type == "member") {
                  setMemberSelected(
                    (prevMemberSelected) => !prevMemberSelected
                  );
                }
              }}
            />
          </div>
        ))}
        {noRoleSelected && (
          <p style={{ color: "red" }}>Please select at least one role.</p>
        )}
      </Form.Group>
      {memberSelected && (
        <>
          <Form.Group controlId="formAge">
            <Form.Label>Age:</Form.Label>
            <Form.Control type="number" name="age" required />
          </Form.Group>
          <Form.Group controlId="formHeight">
            <Form.Label>Height in cm:</Form.Label>
            <Form.Control type="number" name="height" required />
          </Form.Group>
          <Form.Group controlId="formWeight">
            <Form.Label>Weight in kg:</Form.Label>
            <Form.Control type="number" name="weight" required />
          </Form.Group>
          <Form.Group controlId="formGender">
            <Form.Label>Gender:</Form.Label>
            <Form.Control as="select" name="gender" required>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formCategory">
            <Form.Label>Age Category:</Form.Label>
            <Form.Control as="select" name="category" required>
              {["children", "juniors", "cadets", "seniors", "veterans"].map(
                (category) => {
                  return (
                    <option value={category.toUpperCase()}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  );
                }
              )}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formKayakCanoe">
            <Form.Label>Are you primarily kayaker or canoeist?</Form.Label>
            <Form.Control as="select" name="kayak_canoe" required>
              <option value="KAYAK">Kayaker</option>
              <option value="CANOE">Canoeist</option>
            </Form.Control>
          </Form.Group>
        </>
      )}
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
