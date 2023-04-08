import { userContext } from "../UserContext";
import { useContext, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState } from "react";
const AddBoat = () => {
  const { currentUser, setCurrentUser } = useContext(userContext);
  const [authorized, setAuthorized] = useState(true);
  useEffect(() => {
    const authorizedRoles = ["ADMIN", "MECHANIC"];
    if (currentUser.username === undefined) {
      setAuthorized(false);
      return;
    }
    let varAuthorized = false;
    for (const role of currentUser.roles) {
      if (authorizedRoles.includes(role)) {
        varAuthorized = true;
      }
    }
    if (!varAuthorized) {
      setAuthorized(false);
      return;
    }
    setAuthorized(true);
  }, [currentUser]);
  const [yearOfProduction, setYearOfProduction] = useState("");
  const [size, setSize] = useState("S");
  const [mini, setMini] = useState(false);
  const [defect, setDefect] = useState(null);
  const [kayakCanoe, setKayakCanoe] = useState("KAYAK");
  const [model, setModel] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch("/api/boats/add/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        year_of_production: yearOfProduction,
        size: size,
        mini: mini,
        defect: defect,
        kayak_canoe: kayakCanoe,
        account_id: null,
        model: model,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  };
  return (
    <Form className="ms-3 mr-3" onSubmit={handleSubmit}>
      <Form.Group controlId="yearOfProduction">
        <Form.Label>Year of Production</Form.Label>
        <Form.Control
          type="number"
          name="year_of_production"
          onChange={(event) => setYearOfProduction(event.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="model">
        <Form.Label>Model</Form.Label>
        <Form.Control
          type="text"
          name="model"
          onChange={(event) => setModel(event.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="size" name="size">
        <Form.Label>Size</Form.Label>
        <Form.Select
          aria-label="Size"
          onChange={(event) => setSize(event.target.value)}
        >
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
        </Form.Select>
      </Form.Group>

      <Form.Group controlId="mini">
        <Form.Check
          type="checkbox"
          label="Mini"
          checked={mini}
          onChange={(event) => setMini(event.target.checked)}
        />
      </Form.Group>

      <Form.Group controlId="defect">
        <Form.Label>Defect</Form.Label>
        <Form.Control
          type="text"
          value={defect}
          onChange={(event) => setDefect(event.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="kayakCanoe">
        <Form.Label>Kayak/Canoe</Form.Label>
        <Form.Select
          aria-label="Type"
          onChange={(event) => setKayakCanoe(event.target.value)}
        >
          <option value="KAYAK">Kayak</option>
          <option value="CANOE">Canoe</option>
        </Form.Select>
      </Form.Group>
      <Button variant="primary" type="submit" disabled={!authorized}>
        {authorized
          ? "Add boat"
          : "Not authorized, please login with right permissions"}
      </Button>
    </Form>
  );
};

export default AddBoat;
