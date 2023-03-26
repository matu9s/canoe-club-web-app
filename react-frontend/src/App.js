import React, { useState, useEffect } from "react";

function App() {
  const [data, setData] = useState([{}]);
  useEffect(() => {
    fetch("/api/home")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  }, []);

  return (
    <>
      {typeof data.text === "undefined" ? <p>waiting</p> : <p>{data.text}</p>}
    </>
  );
}

export default App;
