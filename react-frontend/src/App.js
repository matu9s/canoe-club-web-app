import React, { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState([{}])
  useEffect(() => {
    fetch("/home").then(
      res => res.json()
    ).then(
      data => {
        setData(data)
      }
    )
  }, [])

  return (
    <div>
      {(typeof data.text === 'undefined') ? (
        <p>waiting</p>) :
        (<p>{data.text}</p>)}
    </div>
  );

}

export default App;
