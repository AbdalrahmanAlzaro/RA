import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <h1 className="text-5xl text-red-700">Welcome to Vite + React!</h1>
      </div>
    </>
  );
}

export default App;
