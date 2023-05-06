import { useContext } from "react";
import { Outlet } from "react-router-dom";
import { userContext } from "../UserContext";
import AppNavBar from "../components/AppNavBar";

const Layout = () => {
  const { currentUser, setCurrentUser } = useContext(userContext);
  return (
    <>
      <div id="page-container">
        <div id="content-wrap">
          <AppNavBar></AppNavBar>
          <Outlet />
        </div>
        <footer id="footer">
          <h5>Kayak/Canoe Administration Web App</h5>
          <p>
            Author: Matúš Hluch
          </p>
          <p>Made with React and Flask</p>
          <p><a href="https://github.com/matu9s/canoe-club-web-app">Source code (Github)</a></p>
        </footer>
      </div>
    </>
  );
};
export default Layout;
