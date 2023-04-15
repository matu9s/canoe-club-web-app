import { useContext } from "react";
import { userContext } from "../UserContext";

const Home = () => {
  const { currentUser, setCurrentUser } = useContext(userContext);
  return (
  <h1 className="text-center mt-2">Welcome home {currentUser ? currentUser.username : "Unknown"}</h1>
  );
};

export default Home;
