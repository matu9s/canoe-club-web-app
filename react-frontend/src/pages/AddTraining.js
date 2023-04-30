import { Form, Button } from "react-bootstrap";
import { userContext } from "../UserContext";
import { useContext, useEffect } from "react";
import { useState } from "react";
import Toast from "react-bootstrap/Toast";

const AddTraining = () => {
  const { currentUser, setCurrentUser } = useContext(userContext);
  const [authorized, setAuthorized] = useState(true);
  const [trainingType, setTrainingType] = useState("WATER");
  const [toastError, setToastError] = useState("");
  const [show, setShow] = useState(false);
  useEffect(() => {
    const authorizedRoles = ["ADMIN", "TRAINER"];
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
  return (
    <>
      <Form
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.target);
          let dataObject = {};
          data.forEach((value, key) => {
            dataObject[key] = value;
          });
          dataObject["type"] = trainingType;
          const date = new Date(dataObject["date_time"]);
          dataObject["date_time"] = date.toJSON();
          fetch("/api/trainings/add/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dataObject),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.success == false) {
                setToastError(data.error);
                setShow(true);
              } else {
                window.location.reload();
              }
            });
        }}
      >
        <Form.Group controlId="place">
          <Form.Label>Place</Form.Label>
          <Form.Control
            name="place"
            type="text"
            placeholder="Enter place"
            required={true}
          />
        </Form.Group>

        <Form.Group controlId="date_time">
          <Form.Label>Date and time of training</Form.Label>
          <Form.Control
            name="date_time"
            type="datetime-local"
            placeholder="Enter date and time"
            required={true}
          />
        </Form.Group>

        <Form.Group controlId="type">
          <Form.Label>Type</Form.Label>
          <Form.Control
            as="select"
            onChange={(event) => setTrainingType(event.target.value)}
            required={true}
          >
            <option value="WATER">Kayak/canoe</option>
            <option value="GYM">Gym</option>
            <option value="SWIMMING">Swimming pool</option>
            <option value="ERGOMETERS">Ergometers</option>
            <option value="OUTSIDE">Outdoors</option>
          </Form.Control>
        </Form.Group>

        <Button variant="primary" type="submit" disabled={!authorized}>
          {authorized
            ? "Add training"
            : "Not authorized, please, log in with right permissions"}
        </Button>
      </Form>
      {toastError !== "" && (
        <Toast
          onClose={() => setShow(false)}
          show={show}
          delay={2000}
          autohide
          bg="danger"
        >
          <Toast.Header>
            <strong className="me-auto">Error</strong>
          </Toast.Header>
          <Toast.Body className="Danger">{toastError}</Toast.Body>
        </Toast>
      )}
    </>
  );
};
export default AddTraining;
