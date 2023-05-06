import { React, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddBoat from "./pages/AddBoat";
import BoatsList from "./pages/BoatsList";
import Members from "./pages/Members";
import AddTraining from "./pages/AddTraining";
import { userContext } from "./UserContext";
import background from "./background.jpg";
import TrainingsList from "./pages/TrainingsList";
import "./App.css";
function App() {
  const [currentUser, setCurrentUser] = useState({});
  const value = { currentUser, setCurrentUser };
  useEffect(() => {
    const user = localStorage.getItem("current_user");
    if (user) {
      fetch("/api/authenticated/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => {
        if (response.status != 200) {
          setCurrentUser({});
          localStorage.removeItem("current_user");
        } else {
          setCurrentUser(JSON.parse(user));
        }
      });
    }
  }, []);
  const appStyle = {
    backgroundImage: `url(${background})`,
    height: "100vh",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  };
  return (
    <div style={appStyle}>
      <userContext.Provider value={value}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="add-boat" element={<AddBoat />} />
              <Route path="boat-list" element={<BoatsList />} />
              <Route path="member-list" element={<Members />} />
              <Route path="add-training" element={<AddTraining />} />
              <Route path="training-list" element={<TrainingsList />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </userContext.Provider>
    </div>
  );
}

export default App;
