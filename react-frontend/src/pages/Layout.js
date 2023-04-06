import { useContext } from "react";
import { Outlet } from "react-router-dom";
import { userContext } from "../UserContext";

const Layout = () => {
  const { currentUser, setCurrentUser } = useContext(userContext);
  return (
    <>
      <p>
        ToDo:Navbar Hello{" "}
        {currentUser.username ? currentUser.username : "Unknown"}
      </p>
      <Outlet />
    </>
  );
};
export default Layout;
