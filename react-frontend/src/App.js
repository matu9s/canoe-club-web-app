import { React, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddBoat from "./pages/AddBoat";
import BoatsList from "./pages/BoatsList";
import { userContext } from "./UserContext";
function App() {
  const [currentUser, setCurrentUser] = useState({});
  const value = { currentUser, setCurrentUser };
  useEffect(() => {
    const user = localStorage.getItem("current_user");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);
  return (
    <userContext.Provider value={value}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="add-boat" element={<AddBoat />} />
            <Route path="boat-list" element={<BoatsList />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </userContext.Provider>
  );
}

export default App;
