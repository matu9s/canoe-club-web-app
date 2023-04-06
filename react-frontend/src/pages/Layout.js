import { useContext } from "react";
import { Outlet } from "react-router-dom";
import { userContext } from "../UserContext";
import Button from "react-bootstrap/Button";

const Layout = () => {
  const { currentUser, setCurrentUser } = useContext(userContext);
  const logout = () => {
    setCurrentUser({});
    localStorage.removeItem("current_user");
    fetch("/api/logout/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };
  return (
    <>
      <p>
        {currentUser.username ? (
          <Button variant="secondary" onClick={logout}>
            Log out
          </Button>
        ) : (
          ""
        )}
        ToDo:Navbar Hello{" "}
        {currentUser.username ? currentUser.username : "Unknown"}
      </p>
      <Outlet />
    </>
  );
};
export default Layout;
