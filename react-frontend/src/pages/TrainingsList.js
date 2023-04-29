import { useContext, useEffect, useState } from "react";
import { userContext } from "../UserContext";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const TrainingsList = () => {
  const { currentUser, setCurrentUser } = useContext(userContext);
  const [trainings, setTrainings] = useState([]);
  const [authorized, setAuthorized] = useState(false);
  const [canJoin, setCanJoin] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  useEffect(() => {
    if (currentUser && currentUser.roles) {
      setCanJoin(currentUser.roles.includes("MEMBER"));
      setCanDelete(
        currentUser.roles.includes("TRAINER") ||
          currentUser.roles.includes("ADMIN")
      );
    }
  }, [currentUser]);
  useEffect(() => {
    fetch("/api/trainings/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (response.status != 200) {
        setAuthorized(false);
      } else {
        response.json().then((data) => {
          console.log(data);
          setTrainings(data["trainings"]);
        });
      }
    });
  }, []);
  const translateTrainingType = {
    WATER: "Training on a lake",
    GYM: "Training in a gym",
    SWIMMING: "Training in a swimming pool",
    ERGOMETERS: "Training on ergometers",
    OUTSIDE: "Outdoors training",
  };
  const handleJoin = (event, training) => {
    event.preventDefault();
    console.log(
      training.members.includes(currentUser.username),
      currentUser.username
    );
    if (!training.members.includes(currentUser.username)) {
      fetch(`/api/trainings/join/${training.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => console.log(data));
      setTrainings(
        trainings.map((mapTraining) =>
          mapTraining.id == training.id
            ? {
                ...mapTraining,
                members: [...mapTraining.members, currentUser.username],
              }
            : mapTraining
        )
      );
    } else {
      fetch(`/api/trainings/cancel-join/${training.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => console.log(data));
      setTrainings(
        trainings.map((mapTraining) =>
          mapTraining.id == training.id
            ? {
                ...mapTraining,
                members: mapTraining.members.filter(
                  (member) => member != currentUser.username
                ),
              }
            : mapTraining
        )
      );
    }
  };
  const handleDelete = (event, training) => {
    event.preventDefault();
    fetch(`/api/trainings/delete/${training.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => console.log(data));
    setTrainings(trainings.filter((fTraining) => fTraining.id != training.id));
  };
  let trainingsList = "error";
  if (trainings != undefined) {
    trainingsList = trainings.map((training) => (
      <ListGroupItem key={training.id}>
        {" "}
        <h3 class="text-center">{translateTrainingType[training.type]}</h3>
        <ul>
          <li>Place: {training.place}</li>
          <li>Date: {new Date(training.date_time).toLocaleString()}</li>
          <li>
            Members ({training.members.length}): {training.members.join(", ")}
          </li>
        </ul>
        {canJoin ? (
          <Button
            className="me-3"
            onClick={(event) => handleJoin(event, training)}
            variant={
              training.members.includes(currentUser.username)
                ? "danger"
                : "primary"
            }
          >
            {training.members.includes(currentUser.username)
              ? "Cancel join training"
              : "Join training"}
          </Button>
        ) : (
          ""
        )}
        {canDelete ? (
          <Button
            variant="danger"
            onClick={(event) => handleDelete(event, training)}
          >
            Delete training
          </Button>
        ) : (
          ""
        )}
      </ListGroupItem>
    ));
  }

  return <ListGroup>{trainingsList}</ListGroup>;
};

export default TrainingsList;
