import React, { useState } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState({
    ip: "",
    json: "",
  });
  const handleChange = (e) => {
    setData({ ip: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(process.env.REACT_APP_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ip: data.ip }),
    });
    const json = await res.json();
    console.log(json);
    setData({ json });
  };
  return (
    <div className="App">
      <header className="App-header">
        <p>IP to Location</p>
      </header>

      <div className="App-body">
        <form onSubmit={handleSubmit}>
          <label>
            <input
              className="App-input"
              type="text"
              id="ip"
              name="ip"
              placeholder="Enter IP Address"
              value={data.ip || ""}
              onChange={handleChange}
            />
          </label>
          <button className="App-button" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
