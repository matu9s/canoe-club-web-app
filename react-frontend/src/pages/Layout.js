import { useContext } from "react";
import { Outlet } from "react-router-dom";
import { userContext } from "../UserContext";
import AppNavBar from "../components/AppNavBar";

const Layout = () => {
  const { currentUser, setCurrentUser } = useContext(userContext);
  return (
    <>
      <AppNavBar></AppNavBar>
      <Outlet />
    </>
  );
};
export default Layout;
