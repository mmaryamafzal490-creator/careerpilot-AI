import "./App.css";
import { useState } from "react";

function App() {
  const [interest, setInterest] = useState("");
  const [subject, setSubject] = useState("");
  const [skills, setSkills] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!interest.trim() || !subject.trim() || !skills.trim()) {
      setResult("Please fill in all three fields first.");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const response = await fetch("/api/career", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `
You are CareerPilot AI, a friendly career guidance assistant.

Student interests: ${interest}
Favourite subject: ${subject}
Current skills: ${skills}

Suggest 3 suitable career paths.

For each career:
1. Give the career name.
2. Explain why it matches the student.
3. Mention 3 useful skills to learn.

Keep the answer clear, encouraging, and suitable for a student.
          `,
        }),
      });

      const data = await response.json();

      if (data.reply) {
        setResult(data.reply);
      } else {
        setResult("Sorry, no career suggestion was received.");
      }
    } catch (error) {
      console.error(error);
      setResult("Could not connect to CareerPilot AI server.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setInterest("");
    setSubject("");
    setSkills("");
    setResult("");
  };

  return (
    <main className="app">
      <nav className="navbar">
        <div className="logo">🚀 CareerPilot AI</div>
        <div className="nav-tag">Smart Career Guidance</div>
      </nav>

      <section className="hero">
        <div className="badge">✨ AI-Powered Career Guidance</div>

        <h1>
          Find Your <span>Perfect Career</span> Path
        </h1>

        <p className="subtitle">
          Tell CareerPilot AI about your interests, favourite subject, and
          skills — and discover career paths made for you.
        </p>

        <div className="career-card">
          <div className="card-header">
            <h2>🚀 Start Your Career Journey</h2>
            <p>Answer three simple questions.</p>
          </div>

          <div className="form-group">
            <label>💡 Your Interests</label>
            <input
              type="text"
              placeholder="e.g. Technology, design, business..."
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>📚 Favourite Subject</label>
            <input
              type="text"
              placeholder="e.g. Computer Science, Biology, Maths..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>🛠️ Your Skills</label>
            <input
              type="text"
              placeholder="e.g. Communication, coding, creativity..."
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </div>

          <button
            className="career-button"
            onClick={handleClick}
            disabled={loading}
          >
            {loading ? "🤖 Analyzing Your Profile..." : "✨ Find My Career"}
          </button>
        </div>

        {result && (
          <div className="result-card">
            <div className="result-header">
              <span className="result-icon">🎯</span>

              <div>
                <h2>Your AI Career Recommendations</h2>
                <p>Personalized suggestions based on your profile</p>
              </div>
            </div>

            <div className="result-content">{result}</div>

            <div className="result-tip">
              💡 Tip: Explore these career paths and start building the skills
              that interest you most.
            </div>

            <button className="reset-button" onClick={handleReset}>
              🔄 Start Again
            </button>
          </div>
        )}
      </section>

      <footer className="footer">
        <p>CareerPilot AI • Helping students discover their future.</p>
      </footer>
    </main>
  );
}

export default App;
