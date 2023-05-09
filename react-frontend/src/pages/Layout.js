import { useContext } from "react";
import { Outlet } from "react-router-dom";
import { userContext } from "../UserContext";
import AppNavBar from "../components/AppNavBar";
import { useSpring, animated } from 'react-spring';

const Layout = () => {
  const props = useSpring({
    from: { color: '#FF0000' },
    to: { color: '#00FF00' },
    loop: true,
  });
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
          <p><animated.a style={props} href="https://github.com/matu9s/canoe-club-web-app">Source code (Github)</animated.a></p>
        </footer>
      </div>
    </>
  );
};
export default Layout;
