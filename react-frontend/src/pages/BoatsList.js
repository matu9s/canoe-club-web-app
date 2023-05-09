import { useContext, useEffect, useState } from "react";
import { userContext } from "../UserContext";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const BoatsList = () => {
  const { currentUser, setCurrentUser } = useContext(userContext);
  const [authorized, setAuthorized] = useState(true);
  const [boats, setBoats] = useState([]);
  const [canOwn, setCanOwn] = useState(false);
  const [canEditDefect, setCanEditDefect] = useState(false);

  useEffect(() => {
    fetch("/api/boats/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (response.status != 200) {
        setAuthorized(false);
      } else {
        response.json().then((data) => {
          setBoats(data["boats"]);
        });
      }
    });
  }, []);

  useEffect(() => {
    if (currentUser && currentUser.roles) {
      setCanOwn(currentUser.roles.includes("MEMBER"));
      setCanEditDefect(
        currentUser.roles.includes("MECHANIC") ||
          currentUser.roles.includes("ADMIN")
      );
    } else {
      setBoats({});
    }
  }, [currentUser]);

  const handleDefectEdit = (event, boat) => {
    event.preventDefault();
    fetch(`/api/boats/set-defect/${boat.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        defect: boat.defect,
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data));
  };

  const handleBorrow = (event, boat) => {
    event.preventDefault();
    fetch(`/api/boats/set-owner/${boat.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        defect: boat.defect,
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data));
    setBoats(
      boats.map((mapBoat) =>
        mapBoat.id === boat.id
          ? {
              ...mapBoat,
              owner: { ...mapBoat.owner, username: currentUser.username },
            }
          : mapBoat
      )
    );
  };

  const handleUnborrow = (event, boat) => {
    event.preventDefault();
    fetch(`/api/boats/unset-owner/${boat.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        defect: boat.defect,
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data));
    setBoats(
      boats.map((mapBoat) =>
        mapBoat.id === boat.id
          ? {
              ...mapBoat,
              owner: null,
            }
          : mapBoat
      )
    );
  };

  let boatsValues = Object.keys(boats).map(function (key) {
    return boats[key];
  });
  const boatsList = boatsValues.map((boat) => (
    <ListGroupItem key={boat.id}>
      <h3 class="text-center">{boat.kayak_canoe}</h3>
      <ul>
        <li>Year of production: {boat.year_of_production}</li>
        <li>Model: {boat.model}</li>
        <li>Size: {boat.size}</li>
        <li>Mini: {boat.mini ? "Yes" : "No"}</li>
        <li>
          Defect: <p>{boat.defect}</p>
        </li>
      </ul>
      {canOwn && boat.owner === null && (
        <Button
          class="text-center"
          className="ms-2 me-2 mb-3"
          variant="primary"
          type="submit"
          onClick={(event) => handleBorrow(event, boat)}
        >
          Borrow
        </Button>
      )}
      {boat.owner !== null && (
        <Button
          class="text-center"
          className="ms-2 me-2 mb-3"
          variant={
            boat.owner.username === currentUser.username ? "danger" : "primary"
          }
          onClick={(event) => handleUnborrow(event, boat)}
          type="submit"
          disabled={!(boat.owner.username === currentUser.username)}
        >
          {boat.owner.username === currentUser.username
            ? "Stop borrowing"
            : `Borrowed by ${boat.owner.username}`}
        </Button>
      )}

      {canEditDefect && (
        <div className="text-center">
          <Form onSubmit={(event) => handleDefectEdit(event, boat)}>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Add or edit defect description:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={boat.defect}
                onChange={(event) =>
                  setBoats(
                    boats.map((mapBoat) =>
                      mapBoat.id === boat.id
                        ? { ...mapBoat, defect: event.target.value }
                        : mapBoat
                    )
                  )
                }
              />
            </Form.Group>
            <Button
              class="text-center"
              className="ms-2 me-2 mb-3"
              variant="primary"
              type="submit"
            >
              Save defect descripiton
            </Button>
          </Form>
        </div>
      )}
    </ListGroupItem>
  ));
  return (
    <>
      {!authorized && <p>Unauthorized</p>}
      <ListGroup>
        {boatsList}
        <ListGroup.Item></ListGroup.Item>
      </ListGroup>
    </>
  );
};

export default BoatsList;
