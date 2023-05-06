import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function Members() {
  const [members, setMembers] = useState([]);
  const [limit, setLimit] = useState(Infinity);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    fetch("/api/members/", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success !== false) {
          setMembers(data.members);
          setAuthorized(true);
        }
      });
  }, []);

  return authorized ? (
    <>
      <Form
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.target);
          if (data.get("limit") == 0) {
            data.set("limit", Infinity);
          }
          setLimit(data.get("limit"));
        }}
      >
        <Form.Control
          type="number"
          name="limit"
          placeholder="Filter out members, who paid less than value set here"
        />
        <Button type="submit">Filter</Button>
      </Form>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Username</th>
            <th>Name</th>
            <th>Surname</th>
            <th>Roles</th>
            <th>Age</th>
            <th>Height</th>
            <th>Weight</th>
            <th>Gender</th>
            <th>Category</th>
            <th>Kayak/Canoe</th>
            <th>Completed Trainings</th>
            <th>
              Membership Fee
              <Button
                variant="danger"
                onClick={() => {
                  members.map((member) => {
                    fetch(`/api/members/set-fee/${member.id}`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ membership_fee: 0 }),
                    });
                  });
                  setMembers(
                    members.map((member) => ({
                      ...member,
                      membership_fee: 0,
                    }))
                  );
                }}
              >
                Reset
              </Button>
            </th>
          </tr>
        </thead>
        <tbody>
          {members.map(
            (member) =>
              member.membership_fee < limit && (
                <tr key={member.id}>
                  <td>{member.username}</td>
                  <td>{member.name}</td>
                  <td>{member.surname}</td>
                  <td>{member.roles.join(", ")}</td>
                  <td>{member.age}</td>
                  <td>{member.height} cm</td>
                  <td>{member.weight} kg</td>
                  <td>{member.gender}</td>
                  <td>{member.category}</td>
                  <td>{member.kayak_canoe}</td>
                  <td>
                    <ul>
                      <li>Gym: {member.completed_trainings["GYM"]}</li>
                      <li>
                        Kayak/Canoe: {member.completed_trainings["WATER"]}
                      </li>
                      <li>Outdoors: {member.completed_trainings["OUTSIDE"]}</li>
                      <li>
                        Swimming: {member.completed_trainings["SWIMMING"]}
                      </li>
                      <li>
                        Ergometers: {member.completed_trainings["ERGOMETERS"]}
                      </li>
                    </ul>
                  </td>
                  <td>
                    <Form
                      onSubmit={(event) => {
                        event.preventDefault();
                        const data = new FormData(event.target);
                        const formatedData = {
                          membership_fee:
                            member.membership_fee +
                            parseInt(data.get(member.id)),
                        };
                        const json = JSON.stringify(formatedData);
                        fetch(`/api/members/set-fee/${member.id}`, {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: json,
                        });
                        setMembers(
                          members.map((setMember) =>
                            setMember.id === member.id
                              ? {
                                  ...setMember,
                                  membership_fee:
                                    parseInt(data.get(member.id)) +
                                    member.membership_fee,
                                }
                              : setMember
                          )
                        );
                      }}
                    >
                      <Form.Control
                        required
                        type="number"
                        placeholder="Add value"
                        name={member.id}
                      />
                    </Form>
                    <tr>
                      <p>paid: {member.membership_fee}€</p>
                    </tr>
                  </td>
                </tr>
              )
          )}
        </tbody>
      </Table>
    </>
  ) : (
    "Unauthorized"
  );
}

export default Members;
