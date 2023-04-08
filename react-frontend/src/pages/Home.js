import { useContext } from "react";
import { userContext } from "../UserContext";

const Home = () => {
  const { currentUser, setCurrentUser } = useContext(userContext);
  return <p>Home {currentUser ? currentUser.username : "Unknown"}</p>;
};

export default Home;
