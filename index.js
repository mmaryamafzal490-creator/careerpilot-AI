import { useState } from "react";
import "./App.css";

function App() {
  const [interest, setInterest] = useState("");
  const [result, setResult] = useState("");

  const handleClick = () => {
    if (!interest.trim()) {
      setResult("Please enter your interests first.");
      return;
    }

    setResult(`Suggested Career: ${interest}`);
  };

  return (
    <div>
      <h1>CareerPilot AI</h1>
      <p>Find your perfect career with AI.</p>

      <input
        type="text"
        placeholder="Enter your interests"
        value={interest}
        onChange={(e) => setInterest(e.target.value)}
      />

      <br />
      <br />

      <button onClick={handleClick}>
        Get Career Suggestions
      </button>

      <h2>{result}</h2>
    </div>
  );
}

export default App;